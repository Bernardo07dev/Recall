import { prisma } from "@/src/lib/prisma";
import { END, START, StateGraph } from "@langchain/langgraph"
import { Annotation } from "@langchain/langgraph"
import { llmLeve, llmBruta } from './llm'
import { BASE_PROMPT, INPUTIZATION_PROMPT, JSON_PROMPT, InsightSchema } from '@/src/lib/langchain/utils'
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import example from './example.json';


export const EmpresaStateAnnotation = Annotation.Root({
  companyId: Annotation<string>,
  arquivos: Annotation<string[]>,
  rawContent: Annotation<string>,
  summarization: Annotation<string>,
  jsonOutput: Annotation<any>,
})

export type EmpresaState = typeof EmpresaStateAnnotation.State;

const nodeDataingestion = async (empresa: EmpresaState) => {
    console.log("Iniciando ingestão de dados...");
    let conteudoExtraido = "";

    const arquivosParaProcessar = empresa.arquivos || [];

    for (const url of arquivosParaProcessar) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.warn(`Erro ao baixar arquivo: ${url}`);
                continue;
            }

            const urlLower = url.toLowerCase();

            if (urlLower.endsWith(".txt")) {
                const texto = await response.text();
                conteudoExtraido += `\n--- Arquivo TXT: ${url} ---\n${texto}\n`;
            } else if (urlLower.endsWith(".pdf")) {
                const blob = await response.blob(); 
                        
                const loader = new WebPDFLoader(blob);
                const docs = await loader.load();
                
                const textoPdf = docs.map(doc => doc.pageContent).join("\n");
                conteudoExtraido += `\n--- [PDF] ${url} ---\n${textoPdf}\n`;
            } else if{
                
            }
        } catch (error) {
            console.error(`Falha ao processar ${url}:`, error);
        }

    }

    return { rawContent: conteudoExtraido };
}

const nodeInputization = async (empresa: EmpresaState) => {
    const dados = await prisma.empresas.findUnique({
        where: { id: empresa.companyId }
    })

    console.log(`Arquivos Chegaram: ${empresa.rawContent}`)

    const context = new SystemMessage(BASE_PROMPT)
    let finalContent = ""

    if (dados) {
        const promptFinal = new HumanMessage(INPUTIZATION_PROMPT(dados.content, empresa.rawContent))
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

const nodeGeneratejson = async (empresa: EmpresaState) => {
    console.log("... Começando JSON ...")
    const instructions = new SystemMessage(JSON_PROMPT(example))
    const content = new HumanMessage(empresa.summarization)

    const structuredLlm = llmBruta.withStructuredOutput(InsightSchema)
    const parsed = await structuredLlm.invoke([instructions, content])
    console.log(parsed)

    try {
        await prisma.empresas.update({
            where: { id: empresa.companyId },
            data: { json: parsed }
        })
        return { jsonOutput: parsed }
    } catch (error) {
        console.error("Erro ao salvar JSON gerado:", error)
    }
}

const builder = new StateGraph(EmpresaStateAnnotation)
  .addNode("nodeDataingestion", nodeDataingestion)
  .addNode("nodeInputization", nodeInputization)
  .addNode("nodeGeneratejson", nodeGeneratejson)
  .addEdge(START, "nodeDataingestion")
  .addEdge("nodeDataingestion", "nodeInputization")
  .addEdge("nodeInputization", "nodeGeneratejson")
  .addEdge("nodeGeneratejson", END);

export const graphEmpresa = builder.compile();
