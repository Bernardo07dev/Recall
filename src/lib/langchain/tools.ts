import { tool } from "@langchain/core/tools"
import { z } from "zod"
import { tavily } from "@tavily/core"
import { DynamicTool, DynamicStructuredTool } from "@langchain/core/tools";
import { prisma } from "@/src/lib/prisma";
import { openRouterModel } from "@/src/lib/langchain/llm";

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

export const createBuscarJsonEmpresaTool = (id: string | null) => new DynamicStructuredTool({
    name: "buscar_dados_empresa",
    description: "Use esta ferramenta sempre que o usuário pedir informações sobre a empresa. IMPORTANTE: Após invocar esta ferramenta, responda APENAS com uma frase curta (ex: 'Exibindo dados na tela'), pois a interface já renderizará o relatório visualmente. Não resuma os dados.",
    schema: z.object({}),
    returnDirect: true,
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

export const createGerarOportunidadesTool = (id: string | null) => new DynamicStructuredTool({
    name: "gerar_oportunidades",
    description: "Use esta ferramenta quando o usuario digitar exatamente isso: Analise o contexto desta empresa e me mostre todas as oportunidades de upsell e cross-sell identificadas, com nível de prioridade e ação recomendada. IMPORTANTE: Após invocar esta ferramenta, responda APENAS com uma frase curta confirmando a geração, pois a interface já renderizará as oportunidades visualmente. Não resuma ou mostre os dados brutos ou o JSON retornado.",
    schema: z.object({}),
    returnDirect: true,
    func: async () => {
        if (!id) return JSON.stringify({ avisoSistema: "Nenhuma empresa selecionada.", oportunidades: [] });

        const company = await prisma.empresas.findUnique({
            where: { id: id }
        });

        if (!company) return JSON.stringify({ avisoSistema: "Empresa não encontrada.", oportunidades: [] });

        const schema = z.object({
            oportunidades: z.array(z.object({
                titulo: z.string().describe("Título claro e direto da oportunidade comercial"),
                descricao: z.string().describe("Descrição detalhada da abordagem e do problema que a oportunidade resolve"),
                setor: z.string().describe("Setor ou área da empresa afetada"),
                nivel_prioridade: z.enum(["Alta", "Média", "Baixa"]).describe("Nível de prioridade da oportunidade")
            })).describe("Lista de oportunidades comerciais identificadas para a empresa")
        });

        const llmWithStructuredOutput = openRouterModel.withStructuredOutput(schema);

        const prompt = `Analise os seguintes dados e contexto da empresa e gere uma lista de 3 a 5 oportunidades comerciais estratégicas.\n\nDados da Empresa:\n${JSON.stringify({
            nome: company.nome,
            industry: company.industry,
            resume: company.resume,
            context: company.context,
            relation: company.relation,
            ...(company.json as Record<string, any> || {})
        })}`;

        try {
            const result = await llmWithStructuredOutput.invoke(prompt);
            return JSON.stringify({
                avisoSistema: "A UI do usuário já renderizou as oportunidades na tela. Por favor, encerre sua resposta com uma frase curta confirmando a exibição das oportunidades. NÃO IMPRIMA O JSON.",
                oportunidades: result.oportunidades
            });
        } catch (error) {
            console.error("Erro ao gerar oportunidades:", error);
            return JSON.stringify({ avisoSistema: "Erro ao tentar gerar oportunidades com a IA.", oportunidades: [] });
        }
    },
});