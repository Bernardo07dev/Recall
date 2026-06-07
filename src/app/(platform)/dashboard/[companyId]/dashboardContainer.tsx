import { InsightOutput } from '@/src/lib/langchain/utils'
import Image from "next/image";
import { Sparkles, MessageCircleCode, ArrowLeft} from "lucide-react";
import InsightsContainer from '@/src/app/(platform)/dashboard/[companyId]/insightsContainer';
import TotvsContainer from '../totvsContainer';
import Loading from '@/src/app/(platform)/dashboard/[companyId]/LoadingContainer';
import IndicatorsContainer from './_components/indicatorsContainer';
import Logo from "@/public/Logo-totvs.svg";
import Link from 'next/link';

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
    status: string;
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
    
    if (!empresa?.json || empresa?.status === "processing") {
        return (
            <Loading empresa={empresa}/>
        )
    }

    return(
        <main className="p-16 pt-20 animate-fade-in">
            <Link href="/empresas" className="flex flex-row text-[#1565C0] font-semibold gap-1 items-center mb-8">
                <ArrowLeft size={14} />
                <p className="text-xs">Voltar para Empresas</p>
            </Link>
            <div className='flex flex-row justify-between items-start mb-6'>
                <div>
                    <Image src="/RECALL-logo.svg" className='w-16' alt="Logo" width={150} height={40}/>
                    <div className='flex flex-row items-baseline gap-1'>
                        <h1 className='text-4xl font-bold mb-2'>Overview</h1>
                        <h1 className='font-semibold text-gray-500'>{empresa && empresa.nome}</h1>
                    </div>
                    <p className='text-sm text-gray-400 mr-[5%] mb-2'>Métricas de conversação em tempo real e oportunidades estratégicas de IA em todo o ecossistema da sua empresa.</p>
                    <Link href={`../chat/context/${empresa.id}`} className='text-xs cursor-pointer gap-1 items-center flex bg-[#1565C0] w-fit text-white/95 py-2 px-3 font-semibold rounded-lg'>
                        <p>Ir para chat</p>
                        <MessageCircleCode size={14}/>
                    </Link>
                </div>
                <div className='w-full'>
                    {/* <div className='bg-white p-6 border border-gray-100 rounded-xl'>
                        <div className='flex flex-row gap-1 mb-1 text-gray-500 items-center'>
                            <Metronome size={12}/>
                            <h1 className='text-[11px]'>Sentimnto</h1>
                        </div>
                        <p className='text-[#1565C0] font-bold text-3xl'>{dados && dados.conversation_metrics.sentiment_score}</p>
                        <p className='text-xs text-gray-500 font-semibold'>{dados && getStatus(dados.conversation_metrics.sentiment_score)}</p>
                    </div> */}
                    {dados?.indicators && <IndicatorsContainer indicators={dados.indicators} />}
                </div>
            </div>

            

            <div className='flex flex-row gap-1 items-baseline mb-1'>
                <h1 className='text-xl font-semibold text-gray-700'>Insights</h1>
                <Sparkles className='mb-1 text-[#1565C0]' size={13}/>
            </div>
            {dados && <InsightsContainer insights={dados}/>}

            {/* <div className='flex gap-1 items-baseline mb-3'>
                <h1 className='text-xl font-semibold text-gray-700'>Oportunidades</h1>
                <Image src={Logo} alt="Logo Totvs" width={50}></Image>
            </div> */}

            {/* {dados && <TotvsContainer empresa={dados} />} */}
            
        </main>
    )
}