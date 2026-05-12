import { fetchCompany, fetchMessages } from "@/src/app/actions/fetchThings";
import { llmLeve } from "@/src/lib/langchain/llm";
import { BASE_PROMPT } from "@/src/lib/langchain/utils";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

export async function POST(req: Request) {
  const body = await req.json();
  console.log(body)
  
  const { mensagem, id, chatId } = body;

  const res = await fetchCompany(body.id)
  const mes = await fetchMessages(body.chatId)

  // const combinedSystemPrompt = `
  //   ${BASE_PROMPT}

  //   [CONTEXTO DA EMPRESA]
  //   ${res?.context || "Sem contexto"}

  //   [DADOS DA EMPRESA (JSON)]
  //   ${res?.json ? JSON.stringify(res.json) : "Sem contexto"}
  // `;

  // const SYSTEM = new SystemMessage(combinedSystemPrompt);
  // const userMessage = new HumanMessage(body.mensagem);

  // const output = await llmLeve.invoke([SYSTEM, userMessage]);

  return Response.json({
    message: "LLM respondeu",
    data: mes
  });
}
