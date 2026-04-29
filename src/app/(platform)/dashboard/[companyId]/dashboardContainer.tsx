import { InsightOutput } from '@/src/lib/langchain/utils'

interface Empresa {
    id: string
    nome: string
    content: string
    json: any
    context: string | null
    resume: string | null
    industry: string
    files: string[]
    logo: string | null
    relation: string | null
    createdAt: Date
}

interface Props {
    empresa: Empresa | null
}

export default function Container({ empresa } : Props ){
    const dados = empresa?.json as InsightOutput | null
    
    return(
        <main className="p-22">
            {dados && JSON.stringify(dados.insights)}
        </main>
    )
}