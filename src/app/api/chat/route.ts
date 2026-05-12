import { fetchCompany, fetchMessages } from "@/src/app/actions/fetchThings";
import { llmLeve } from "@/src/lib/langchain/llm";
import { BASE_PROMPT } from "@/src/lib/langchain/utils";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { saveMessages } from "@/src/app/actions/chat-action";

export async function POST(req: Request) {
  const body = await req.json();
  const { mensagem, id, chatId } = body;

  const res = id ? await fetchCompany(id) : null;
  const history = chatId ? await fetchMessages(chatId) : [];

  const combinedSystemPrompt = `
    ${BASE_PROMPT}

    [CONTEXTO DA EMPRESA]
    ${res?.context || "Sem contexto disponível"}

    [DADOS DA EMPRESA (JSON)]
    ${res?.json ? JSON.stringify(res.json) : "Sem dados disponíveis"}
  `;

  const SYSTEM = new SystemMessage(combinedSystemPrompt);
  const userMessage = new HumanMessage(mensagem);

  // Build message array: system + history + new user message
  const messages = [SYSTEM, ...history, userMessage];

  // Stream the LLM response
  const stream = await llmLeve.stream(messages);

  const encoder = new TextEncoder();
  let fullResponse = "";

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = typeof chunk.content === "string" 
            ? chunk.content 
            : "";
          fullResponse += text;
          controller.enqueue(encoder.encode(text));
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
