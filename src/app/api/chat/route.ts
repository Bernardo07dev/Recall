import { fetchCompany, fetchMessages } from "@/src/app/actions/fetchThings";
import { openRouterModel } from "@/src/lib/langchain/llm";
import { webSearchTool, createBuscarJsonEmpresaTool, createGerarOportunidadesTool, createGerarRetencaoTool, createGerarMapeamentoTool, createPlanExecutionTool } from "@/src/lib/langchain/tools";
import { createAgent } from "langchain";
import { BASE_PROMPT } from "@/src/lib/langchain/utils";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { saveMessages } from "@/src/app/actions/chat-action";
import { SILENT_TOOLS } from "@/src/app/(platform)/chat/[id]/silentTools";

export async function POST(req: Request) {
  const body = await req.json();
  const { mensagem, id, chatId } = body;

  const res = id ? await fetchCompany(id) : null;
  console.log("API/CHAT RECEIVED ID:", id);
  console.log("FETCHED COMPANY:", res ? res.nome : "NULL", "HAS CONTEXT:", !!res?.context);
  const history = chatId ? await fetchMessages(chatId) : [];

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const combinedSystemPrompt = `
    ${BASE_PROMPT}

    [INFORMAÇÕES DE CONTEXTO]
    A data de hoje é: ${today}.

    USE BASTANTE MARKDOWN E DEIXE BONITO

    [CONTEXTO DA EMPRESA]
    ${res?.context || "Sem contexto disponível"}

    [DADOS DA EMPRESA (JSON)]
    ${res?.json ? JSON.stringify(res.json) : "Sem dados disponíveis"}

    [REGRA OBRIGATÓRIA DE ERRO E CONTEXTO]
    Se o [CONTEXTO DA EMPRESA] for "Sem contexto disponível" ou estiver ausente, e a pergunta/solicitação for sobre a empresa ou dependa de seus dados, NÃO TENTE RESPONDER NEM ESPECULAR. Apenas responda informando que está sem o contexto da empresa e que houve algum erro ao carregar os dados.

    [REGRA OBRIGATÓRIA DE TOOLS]
    Mesmo que você já tenha os dados da empresa no contexto acima, SEMPRE use a ferramenta "buscar_dados_empresa" quando o usuário pedir overview, visão geral, dados ou informações da empresa. A ferramenta aciona uma renderização visual especial no frontend que não pode ser replicada via texto. Não responda com os dados diretamente — chame a tool.

    [REGRA OBRIGATÓRIA DE IDIOMA E RACIOCÍNIO]
    O usuário fala português. Portanto, TODOS os seus pensamentos internos, passos lógicos e conteúdo da tag <think> DEVEM ser escritos estritamente em Português do Brasil.
  `;

  const SYSTEM = new SystemMessage(combinedSystemPrompt);
  // const userMessage = new HumanMessage(mensagem);

  let messages = [SYSTEM, ...history];

  const lastHistoryMsg = history.length > 0 ? history[history.length - 1] : null;
  if (!lastHistoryMsg || lastHistoryMsg.content !== mensagem) {
      messages.push(new HumanMessage(mensagem));
  }

  const buscarJsonEmpresaTool = createBuscarJsonEmpresaTool(id);
  const gerarOportunidadesTool = createGerarOportunidadesTool(id);
  const gerarRetencaoTool = createGerarRetencaoTool(id);
  const gerarMapeamentoTool = createGerarMapeamentoTool(id);
  const planExecutionTool = createPlanExecutionTool(id);

  const agentDynamic = createAgent({
    model: openRouterModel,
    tools: [webSearchTool, buscarJsonEmpresaTool, gerarOportunidadesTool, gerarRetencaoTool, gerarMapeamentoTool, planExecutionTool],
  });

  const stream = await agentDynamic.streamEvents(
    { messages },
    { version: "v2" }
  );

  const encoder = new TextEncoder();
  let fullResponse = "";
  let isReasoning = false;
  let activeSilentTool: string | null = null;

  const readableStream = new ReadableStream({

    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.event === "on_chat_model_stream") {
            const chunk = event.data?.chunk;
            console.log("ADDITIONAL KWARGS DEBUG:", chunk?.additional_kwargs);
            const reasoning = (chunk?.additional_kwargs?.reasoning ?? chunk?.additional_kwargs?.reasoning_content ?? "") as string;
            if (reasoning) console.log("REASONING EXTRACTED:", reasoning);

            if (reasoning) {
              if (!isReasoning) {
                console.log("\n--- [REASONING] ---");
                isReasoning = true;
              }
              process.stdout.write(reasoning);
            }

            if (chunk?.content) {
              if (isReasoning) {
                console.log("\n--- [FIM REASONING] ---\n");
                isReasoning = false;
              }

              // Suppress text emitted by LLMs running *inside* a silent tool
              if (activeSilentTool) continue;

              const text = chunk.content;
              if (typeof text === "string") {
                fullResponse += text;
                
                const jsonChunk = JSON.stringify({ type: "text", content: text }) + "\n";
                controller.enqueue(encoder.encode(jsonChunk));
              }
            }
          } else if (event.event === "on_tool_start") {
            if (isReasoning) {
              console.log("\n--- [FIM REASONING] ---\n");
              isReasoning = false;
            }
            const toolName = event.name;
            if (SILENT_TOOLS.has(toolName)) activeSilentTool = toolName;
            const toolInput = event.data?.input;
            const jsonChunk = JSON.stringify({ type: "tool_start", toolName, input: toolInput }) + "\n";
            controller.enqueue(encoder.encode(jsonChunk));
          } else if (event.event === "on_tool_end") {
            const toolName = event.name;
            if (activeSilentTool === toolName) activeSilentTool = null;

            const toolOutput = event.data?.output;
            
            const toolJson = {
              name: toolName,
              output: toolOutput,
              status: "success",
              timestamp: new Date().toISOString(),
            };

            const jsonChunk = JSON.stringify({ type: "tool_end", toolName, toolMetadata: toolJson }) + "\n";
            controller.enqueue(encoder.encode(jsonChunk));

            if (chatId) {
              await saveMessages(`Resultado da ferramenta: ${toolName}`, chatId, "Tool", toolJson);
            }
          }
        }

        if (isReasoning) {
          console.log("\n--- [FIM REASONING] ---\n");
          isReasoning = false;
        }

        if (chatId && fullResponse.trim() !== "") {
          await saveMessages(fullResponse, chatId, "AI");
        }

        controller.close();
      } catch (error) {
        console.error("Stream error:", error);
        controller.error(error);
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
