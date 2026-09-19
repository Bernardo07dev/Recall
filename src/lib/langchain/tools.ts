import { tool } from "@langchain/core/tools"
import { z } from "zod"
import { tavily } from "@tavily/core"
import { DynamicTool } from "@langchain/core/tools";
import { prisma } from "@/src/lib/prisma";

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

export const createBuscarJsonEmpresaTool = (id: string | null) => new DynamicTool({
    name: "buscar_dados_empresa",
    description: "Use esta ferramenta sempre que o usuário pedir informações sobre a empresa. IMPORTANTE: Após invocar esta ferramenta, responda APENAS com uma frase curta (ex: 'Exibindo dados na tela'), pois a interface já renderizará o relatório visualmente. Não resuma os dados.",
    func: async () => {
        if (!id) return "Nenhuma empresa selecionada.";

        const company = await prisma.empresas.findUnique({
            where: { id: id }
        });

        if (!company) return JSON.stringify({ avisoSistema: "Empresa não encontrada.", dados_empresa: null });

        const respostaParaLLM = {
            avisoSistema: "A UI do usuário já renderizou os dados ou deu um erro em um elemento visual na tela. Por favor, encerre sua resposta com uma frase curta confirmando a exibição ou se deu erro falando que deu erro na exibição",
            dados_empresa: {
                id: company.id,
                nome: company.nome,
                industry: company.industry,
                resume: company.resume,
                context: company.context,
                relation: company.relation,
                logo: company.logo,
                status: company.status,
                createdAt: company.createdAt,
                ...(company.json as Record<string, any> || {}),
            }
        };

        return JSON.stringify(respostaParaLLM);
    },
});