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
    description: "Use esta ferramenta sempre que o usuário pedir informações ou um overview sobre a empresa. IMPORTANTE: Após invocar esta ferramenta, responda APENAS com uma frase curta (ex: 'Exibindo dados na tela'), pois a interface já renderizará o relatório visualmente. Não resuma os dados.",
    schema: z.object({}),
    returnDirect: true,
    func: async () => {
        if (!id) return "Nenhuma empresa selecionada.";

        const company = await prisma.empresas.findUnique({
            where: { id: id }
        });

        if (!company) return JSON.stringify({ avisoSistema: "Empresa não encontrada.", dados_empresa: null });

        const respostaParaLLM = {
            _INSTRUCAO_CRITICA_PARA_A_IA_: "PARE! NÃO REPITA, NÃO RESUMA E NÃO IMPRIMA O JSON ABAIXO. O frontend já desenhou esses dados na tela para o usuário! Apenas responda com uma frase muito curta confirmando que os dados estão na tela.",
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
                _INSTRUCAO_CRITICA_PARA_A_IA_: "PARE! NÃO REPITA, NÃO RESUMA E NÃO IMPRIMA O JSON ABAIXO. O frontend já desenhou esses dados na tela em formato de cards! Apenas responda com: 'As oportunidades foram geradas e estão na tela.'",
                oportunidades: result.oportunidades
            });
        } catch (error) {
            console.error("Erro ao gerar oportunidades:", error);
            return JSON.stringify({ avisoSistema: "Erro ao tentar gerar oportunidades com a IA.", oportunidades: [] });
        }
    },
});

export const createGerarRetencaoTool = (id: string | null) => new DynamicStructuredTool({
    name: "gerar_retencao",
    description: "Use esta ferramenta quando o usuario digitar exatamente isso: Existe algum sinal de insatisfação ou risco de churn nesta empresa? Me mostre os alertas encontrados e o que deve ser feito para reter esse cliente.",
    schema: z.object({}),
    returnDirect: true,
    func: async () => {
        if (!id) return JSON.stringify({ avisoSistema: "Nenhuma empresa selecionada.", alertas: [], retencao: [] });

        const company = await prisma.empresas.findUnique({
            where: { id: id }
        });

        if (!company) return JSON.stringify({ avisoSistema: "Empresa não encontrada.", alertas: [], retencao: [] });

        const schema = z.object({
            alertas: z.array(z.object({
                titulo: z.string().describe("Título claro e direto do sinal de insatisfação ou risco de churn"),
                descricao: z.string().describe("Descrição detalhada do motivo do risco e da ação recomendada para reter o cliente"),
                setor: z.string().describe("Setor ou área da empresa afetada"),
                nivel_prioridade: z.enum(["Alta", "Média", "Baixa"]).describe("Nível de prioridade ou gravidade do alerta de retenção")
            })).describe("Lista de sinais de insatisfação e alertas de risco de churn identificados para retenção do cliente")
        });

        const llmWithStructuredOutput = openRouterModel.withStructuredOutput(schema);

        const prompt = `Analise os seguintes dados e contexto da empresa e identifique de 3 a 5 sinais de insatisfação, alertas críticos ou riscos de churn, indicando o motivo e o que deve ser feito para reter o cliente.\n\nDados da Empresa:\n${JSON.stringify({
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
                _INSTRUCAO_CRITICA_PARA_A_IA_: "PARE! NÃO REPITA, NÃO RESUMA E NÃO IMPRIMA O JSON ABAIXO. O frontend já desenhou esses dados na tela em formato de cards! Apenas responda com: 'Os alertas de retenção foram gerados e estão na tela.'",
                alertas: result.alertas,
                retencao: result.alertas
            });
        } catch (error) {
            console.error("Erro ao gerar alertas de retenção:", error);
            return JSON.stringify({ avisoSistema: "Erro ao tentar gerar alertas de retenção com a IA.", alertas: [], retencao: [] });
        }
    },
});

export const createGerarMapeamentoTool = (id: string | null) => new DynamicStructuredTool({
    name: "gerar_mapeamento",
    description: "Use esta ferramenta quando o usuario digitar exatamente isso: Quais produtos da TOTVS estão sendo mencionados nas conversas desta empresa? Faça um mapeamento total dos produtos. IMPORTANTE: Após invocar esta ferramenta, responda APENAS com uma frase curta confirmando a geração, pois a interface já renderizará o mapeamento visualmente. Não resuma ou mostre os dados brutos ou o JSON retornado.",
    schema: z.object({}),
    returnDirect: true,
    func: async () => {
        if (!id) return JSON.stringify({ avisoSistema: "Nenhuma empresa selecionada.", produtos: [] });

        const company = await prisma.empresas.findUnique({
            where: { id: id }
        });

        if (!company) return JSON.stringify({ avisoSistema: "Empresa não encontrada.", produtos: [] });

        const schema = z.object({
            produtos: z.array(z.object({
                produto: z.string().describe("Nome do produto ou módulo TOTVS identificado (ex: Protheus, Fluig, RM, Datasul, Logix, CRM, etc.)"),
                status: z.enum(["Ativo", "Oportunidade", "Em Risco", "Cancelado"]).describe("Status do produto na empresa"),
                detalhes: z.string().describe("Como o produto foi mencionado, contexto nas reuniões ou proposta de oferta"),
                satisfacao: z.enum(["Positivo", "Neutro", "Misto", "Negativo"]).describe("Nível de satisfação ou percepção do cliente")
            })).describe("Mapeamento de produtos TOTVS identificados nas conversas e contexto da empresa")
        });

        const llmWithStructuredOutput = openRouterModel.withStructuredOutput(schema);

        const prompt = `Analise os seguintes dados e contexto da empresa e identifique todos os produtos e soluções TOTVS mencionados, utilizados ou que representam oportunidades comerciais de oferta, indicando status, nível de satisfação e detalhes contextuais.\n\nDados da Empresa:\n${JSON.stringify({
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
                _INSTRUCAO_CRITICA_PARA_A_IA_: "PARE! NÃO REPITA, NÃO RESUMA E NÃO IMPRIMA O JSON ABAIXO. O frontend já desenhou esses dados na tela em formato de cards! Apenas responda com: 'O mapeamento de produtos foi gerado e está na tela.'",
                produtos: result.produtos,
                mapeamento: result.produtos
            });
        } catch (error) {
            console.error("Erro ao gerar mapeamento de produtos:", error);
            return JSON.stringify({ avisoSistema: "Erro ao tentar gerar mapeamento com a IA.", produtos: [] });
        }
    },
});