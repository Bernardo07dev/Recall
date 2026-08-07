import { tool } from "@langchain/core/tools"
import { z } from "zod"
import { tavily } from "@tavily/core"

export const webSearchTool = tool(
    async ({ query }) => {    
        const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY })
        const response = await tvly.search(query)
        
        // console.log("========== BUSCA CONCLUÍDA ==========");
        return JSON.stringify(response.results)
    },
    {
        name: "web_search_tool",
        description: "Use this tool to search the internet for current events, real-time data, news, or any information that requires up-to-date knowledge. Always use this tool when asked about recent events, exchange rates, prices, or things you don't know.",
        schema: z.object({
            query: z.string().describe("The search query"),
        }),
    }
)