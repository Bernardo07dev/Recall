import { InsightOutput } from '@/src/lib/langchain/utils'
import Image from "next/image";
import { Metronome } from "lucide-react";

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

    const getStatus = (level: number) => {
        if (level > 80) {
            return "excelente"
        } else if (level > 70) {
            return "bom"
        } else if (level > 50) {
            return "regular"
        } else if (level > 30) {
            return "ruim"
        } else {
            return "crítico"
        }
    }
    
    return(
        <main className="p-22">
            <div className='flex flex-row justify-between items-end mb-6'>
                <div>
                    <Image src="/RECALL-logo.svg" className='w-16' alt="Logo" width={150} height={40}/>
                    <h1 className='text-4xl font-bold mb-2'>Overview</h1>
                    <p className='text-sm text-gray-400 mr-[30%]'>Métricas de conversação em tempo real e oportunidades estratégicas de IA em todo o ecossistema da sua empresa.</p>
                </div>
                <div className='pr-12'>
                    <div className='bg-white p-6 border border-gray-100 rounded-xl'>
                        <div className='flex flex-row gap-1 mb-1 text-gray-500 items-center'>
                            <Metronome size={12}/>
                            <h1 className='text-[11px]'>Sentimnto</h1>
                        </div>
                        <p className='text-[#1565C0] font-bold text-3xl'>{dados && dados.conversation_metrics.sentiment_score}</p>
                        <p className='text-xs text-gray-500 font-semibold'>{dados && getStatus(dados.conversation_metrics.sentiment_score)}</p>
                    </div>
                </div>
            </div>
            <section className='grid grid-cols-3 gap-4'>
                {dados && (
                    dados.insights.prioritized.map((insights) => (
                        <div className='bg-white inter p-6 border border-gray-100 rounded-xl text-sm'>
                            <h1 className='text-gray-700 font-medium'>{insights.title}</h1>
                        </div>
                    ))
                )}
            </section>
        </main>
    )
}