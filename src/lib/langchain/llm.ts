import { initChatModel } from "langchain/chat_models/universal"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"

export const llmLeve = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0,
})

export const llmBruta = new ChatGoogleGenerativeAI({
    model: "gemini-3-flash-preview",
    temperature: 0,
})