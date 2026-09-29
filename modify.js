const fs = require('fs');
let code = fs.readFileSync('src/lib/langchain/tools.ts', 'utf-8');

const helper = 
async function saveToolHistory(chatId, title, type) {
    if (!chatId) return null;
    try {
        const savedTool = await prisma.conversationTool.create({
            data: { title, type, conversationId: chatId }
        });
        return savedTool.id;
    } catch (e) {
        console.error('Erro ao salvar tool history:', e);
        return null;
    }
}
;
code = code.replace('import { openRouterModel } from "@/src/lib/langchain/llm";', 'import { openRouterModel } from "@/src/lib/langchain/llm";\n' + helper);

code = code.replace(/createBuscarJsonEmpresaTool = \(id: string \| null\)/g, 'createBuscarJsonEmpresaTool = (id: string | null, chatId: string | null)');
code = code.replace(/createGerarOportunidadesTool = \(id: string \| null\)/g, 'createGerarOportunidadesTool = (id: string | null, chatId: string | null)');
code = code.replace(/createGerarRetencaoTool = \(id: string \| null\)/g, 'createGerarRetencaoTool = (id: string | null, chatId: string | null)');
code = code.replace(/createGerarMapeamentoTool = \(id: string \| null\)/g, 'createGerarMapeamentoTool = (id: string | null, chatId: string | null)');
code = code.replace(/createPlanExecutionTool = \(id: string \| null\)/g, 'createPlanExecutionTool = (id: string | null, chatId: string | null)');

code = code.replace(/const respostaParaLLM = \{([^]+?)\};/m, 'const htmlId = await saveToolHistory(chatId, "Dados da Empresa", "buscar_dados_empresa");\n\n        const respostaParaLLM = {, htmlId };');

code = code.replace(/return JSON\.stringify\(\{\n\s+_INSTRUCAO_CRITICA_PARA_A_IA_: "As oportunidades foram geradas e estão na tela",\n\s+oportunidades: result.oportunidades\n\s+\}\);/m, 'const htmlId = await saveToolHistory(chatId, "Oportunidades Comerciais", "gerar_oportunidades");\n            return JSON.stringify({\n                _INSTRUCAO_CRITICA_PARA_A_IA_: "As oportunidades foram geradas e estão na tela",\n                oportunidades: result.oportunidades,\n                htmlId\n            });');

code = code.replace(/return JSON\.stringify\(\{\n\s+_INSTRUCAO_CRITICA_PARA_A_IA_: "O frontend já desenhou esses dados na tela em formato de cards! Os alertas de retenção foram gerados e estão na tela",\n\s+alertas: result.alertas,\n\s+retencao: result.alertas\n\s+\}\);/m, 'const htmlId = await saveToolHistory(chatId, "Alertas de Retenção", "gerar_retencao");\n            return JSON.stringify({\n                _INSTRUCAO_CRITICA_PARA_A_IA_: "O frontend já desenhou esses dados na tela em formato de cards! Os alertas de retenção foram gerados e estão na tela",\n                alertas: result.alertas,\n                retencao: result.alertas,\n                htmlId\n            });');

code = code.replace(/return JSON\.stringify\(\{\n\s+_INSTRUCAO_CRITICA_PARA_A_IA_: "PARE! NÃO REPITA, NÃO RESUMA E NÃO IMPRIMA O JSON ABAIXO. O frontend já desenhou esses dados na tela em formato de cards! Apenas responda com: 'O mapeamento de produtos foi gerado e está na tela.'",\n\s+produtos: result.produtos,\n\s+mapeamento: result.produtos\n\s+\}\);/m, 'const htmlId = await saveToolHistory(chatId, "Mapeamento de Produtos TOTVS", "gerar_mapeamento");\n            return JSON.stringify({\n                _INSTRUCAO_CRITICA_PARA_A_IA_: "PARE! NÃO REPITA, NÃO RESUMA E NÃO IMPRIMA O JSON ABAIXO. O frontend já desenhou esses dados na tela em formato de cards! Apenas responda com: \\'O mapeamento de produtos foi gerado e está na tela.\\'",\n                produtos: result.produtos,\n                mapeamento: result.produtos,\n                htmlId\n            });');

code = code.replace(/return JSON\.stringify\(\{\n\s+_INSTRUCAO_CRITICA_PARA_A_IA_: "PARE! NÃO REPITA, NÃO RESUMA E NÃO IMPRIMA O JSON ABAIXO. O frontend já desenhou esses dados na tela em formato de cards! Apenas responda com: 'O plano de execução foi gerado e está na tela.'",\n\s+plano: planoFormatado,\n\s+planExecution: planoFormatado,\n\s+steps: planoFormatado\n\s+\}\);/m, 'const htmlId = await saveToolHistory(chatId, "Plano de Execução", "plan_execution");\n            return JSON.stringify({\n                _INSTRUCAO_CRITICA_PARA_A_IA_: "PARE! NÃO REPITA, NÃO RESUMA E NÃO IMPRIMA O JSON ABAIXO. O frontend já desenhou esses dados na tela em formato de cards! Apenas responda com: \\'O plano de execução foi gerado e está na tela.\\'",\n                plano: planoFormatado,\n                planExecution: planoFormatado,\n                steps: planoFormatado,\n                htmlId\n            });');

fs.writeFileSync('src/lib/langchain/tools.ts', code);
console.log('Modifications written');
