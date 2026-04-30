"use client"
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
    empresa: any;
}

export default function Loading({ empresa }: Props){
    const router = useRouter()

    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh()
        }, 5000)

        return () => clearInterval(interval)
    }, [router])
    return(
        <main className="w-full p-22 flex flex-col items-center animate-fade-in">
            <div className="w-full mt-6">
                <Image src="/RECALL-logo.svg" className='w-16' alt="Logo" width={150} height={40}/>
                <div className='flex flex-row items-baseline gap-1'>
                    <h1 className='text-4xl font-bold mb-2'>Overview</h1>
                    <h1 className='font-semibold text-gray-500'>{empresa && empresa.nome}</h1>
                </div>
                <p className='text-sm text-gray-400 mr-[50%]'>Métricas de conversação em tempo real e oportunidades estratégicas de IA em todo o ecossistema da sua empresa.</p>
            </div>

            <div className="w-full mt-16 flex flex-col items-center justify-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1565C0]/70 mb-4"></div>
                <p className="text-gray-400 text-[13px] inter mt-1">Nossa IA está processando as transcrições e arquivos para gerar os insights.</p>
            </div>

            <section className='grid grid-cols-3 gap-4 w-full mt-8'>
                {[1, 2, 3].map((item) => (
                    <div key={item} className='bg-white p-6 border border-gray-100 rounded-xl h-44 shadow-sm animate-pulse flex flex-col'>
                        <div className='h-4 bg-gray-200/60 rounded w-1/3 mb-4'></div>
                        <div className='h-6 bg-gray-200/60 rounded w-4/5 mb-4'></div>
                        <div className='h-3 bg-gray-200/60 rounded w-full mb-2'></div>
                        <div className='h-3 bg-gray-200/60 rounded w-5/6 mb-auto'></div>
                        
                        <div className='mt-4 pt-4 border-t border-gray-50 flex flex-row gap-2 items-center'>
                            <div className='h-6 w-6 rounded bg-gray-200/60'></div>
                            <div className='h-3 bg-gray-200/60 rounded w-1/2'></div>
                        </div>
                    </div>
                ))}
            </section>

        </main>
    )
}