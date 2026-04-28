import { initChatModel } from "langchain/chat_models/universal"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"

export const llmLeve = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0,
})

// const llmForte = await initChatModel("gemini-2.5-pro", {
//     modelProvider: "google-genai",
//     temperature: 0,
// })