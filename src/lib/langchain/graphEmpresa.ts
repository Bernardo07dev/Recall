import { prisma } from "@/src/lib/prisma";
import { END, START, StateGraph } from "@langchain/langgraph"
import { Annotation } from "@langchain/langgraph"
import { llmLeve } from './llm'
import { BASE_PROMPT, INPUTIZATION_PROMPT } from '@/src/lib/langchain/utils'
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const EmpresaStateAnnotation = Annotation.Root({
  companyId: Annotation<string>,
  arquivos: Annotation<string[]>,
  contextoExtra: Annotation<string>,
  summarization: Annotation<string>,
  jsonOutput: Annotation<any>,
})

export type EmpresaState = typeof EmpresaStateAnnotation.State;

const nodeInputization = async (empresa: EmpresaState) => {
    const dados = await prisma.empresas.findUnique({
        where: { id: empresa.companyId }
    })

    const context = new SystemMessage(BASE_PROMPT)
    let finalContent = ""

    if (dados) {
        const promptFinal = new SystemMessage(INPUTIZATION_PROMPT(dados.content))
        const response = await llmLeve.invoke([context, promptFinal])
        finalContent = response.content as string
    } else {
        const response = await llmLeve.invoke([context])
        finalContent = response.content as string
    }

    try {
        await prisma.empresas.update({
            where: { id: empresa.companyId },
            data: {
                context: finalContent
            }
        })
        return { summarization: finalContent }
    } catch (error) {
        console.log(error)
    }
}

const builder = new StateGraph(EmpresaStateAnnotation)
  .addNode("nodeInputization", nodeInputization)
  .addEdge(START, "nodeInputization")
  .addEdge("nodeInputization", END);

export const graphEmpresa = builder.compile();