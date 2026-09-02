import { fetchCompany, fetchMessages } from "@/src/app/actions/fetchThings";
import { agentOpenRouter } from "@/src/lib/langchain/llm";
import { BASE_PROMPT } from "@/src/lib/langchain/utils";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { saveMessages } from "@/src/app/actions/chat-action";

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
  `;

  const SYSTEM = new SystemMessage(combinedSystemPrompt);
  const userMessage = new HumanMessage(mensagem);

  let messages = [SYSTEM, ...history];

  const lastHistoryMsg = history.length > 0 ? history[history.length - 1] : null;
  if (!lastHistoryMsg || lastHistoryMsg.content !== mensagem) {
      messages.push(new HumanMessage(mensagem));
  }

  const stream = await agentOpenRouter.streamEvents(
    { messages },
    { version: "v2" }
  );

  const encoder = new TextEncoder();
  let fullResponse = "";

  const readableStream = new ReadableStream({


    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.event === "on_chat_model_stream" && event.data?.chunk?.content) {
            const text = event.data.chunk.content;
            if (typeof text === "string") {
              fullResponse += text;
              
              const jsonChunk = JSON.stringify({ type: "text", content: text }) + "\n";
              controller.enqueue(encoder.encode(jsonChunk));
            }
          } else if (event.event === "on_tool_start") {
            const toolName = event.name;
            const toolInput = event.data?.input;
            // console.log(`[Tool Start] ${toolName} | Input:`, toolInput);  
            const jsonChunk = JSON.stringify({ type: "tool_start", toolName, input: toolInput }) + "\n";
            controller.enqueue(encoder.encode(jsonChunk));
          } else if (event.event === "on_tool_end") {
            const toolName = event.name;
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

        if (chatId) {
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
