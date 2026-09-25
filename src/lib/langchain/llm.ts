import { webSearchTool } from "@/src/lib/langchain/tools"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatOpenAI } from "@langchain/openai"
import { ChatOpenRouter } from "@langchain/openrouter"
import { createAgent } from "langchain"


export const llmLeve = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0,
})

export const llmBruta = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0,
})

export const openRouterModel = new ChatOpenRouter({
    model: "openai/gpt-5-mini",
    temperature: 0.1,
    apiKey: process.env.OPENROUTER_API_KEY,
    siteUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
    siteName: "Recall",
})

export const agentOpenRouter = createAgent({
    model: openRouterModel as any,
    tools: [webSearchTool as any],
})

export const llmJson = new ChatOpenAI({
    model: "openai/gpt-4o-mini",
    temperature: 0,
    apiKey: process.env.OPENROUTER_API_KEY,
    configuration: {
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
            "HTTP-Referer": "https://recall.totvs.com",
            "X-Title": "Recall",
        },
    },
})