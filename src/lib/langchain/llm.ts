import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatOpenAI } from "@langchain/openai"

export const llmLeve = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0,
})

export const llmBruta = new ChatGoogleGenerativeAI({
    model: "gemini-3-flash-preview",
    temperature: 0,
})

// export const llmOpenRouter = new ChatOpenAI({
//     model: "anthropic/claude-sonnet-4",
//     temperature: 0,
//     apiKey: process.env.OPENROUTER_API_KEY,
//     configuration: {
//         baseURL: "https://openrouter.ai/api/v1",
//         defaultHeaders: {
//             "HTTP-Referer": "https://recall.totvs.com",
//             "X-Title": "Recall",
//         },
//     },
// })