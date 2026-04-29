import { BASE_PROMPT, TITLE_PROMPT } from '@/src/lib/langchain/utils'
import { llmLeve } from './llm'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { graphEmpresa } from '@/src/lib/langchain/graphEmpresa'

const tiitlePrompt = new SystemMessage(TITLE_PROMPT)

export async function generateTitle(mensagem: string){
    const humanMsg = new HumanMessage(mensagem)
    try{
        const response  = await llmLeve.invoke([tiitlePrompt, humanMsg])
        console.log("DEU BOM")
        return response.content as string
    } catch(error){
        console.log(error)
        return "Nova Conversa"
    }
}

export async function executeGraph(companyId: string, arquivos: string[] = []){
    try{
        const result = await graphEmpresa.invoke({
            companyId: companyId,
            arquivos: arquivos,
            rawContent: "",
            summarization: "",
            jsonOutput: {},
        });
        console.log(result)
    }catch(error){
        console.log(error)
    }
}