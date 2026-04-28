import { BASE_PROMPT, TITLE_PROMPT } from '@/src/lib/langchain/utils'
import { llmLeve } from './llm'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'

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