"use client"
import { ArrowLeft, BriefcaseBusiness, Workflow } from "lucide-react";
import Link from "next/link";
import SelectIndustry from "@/src/app/(platform)/context/_components/SelectIndustry";
import UploadDocumentos from "@/src/app/(platform)/context/_components/UploadDocuments";
import { SiJira } from '@icons-pack/react-simple-icons';
import Toggle from "@/src/app/(platform)/context/_components/Toggle";

export default function ContextPage(){

    return(
        <main className="pt-22 pb-12 px-[5%]">
            <Link href="/dashboard" className="flex flex-row text-[#1565C0] font-semibold gap-1 items-center mb-4">
                <ArrowLeft size={14}/>
                <p className="text-xs">Voltar para o Dashboard</p>
            </Link>
            <h1 className="text-2xl font-bold mb-1">Crie um novo contexto de empresa</h1>
            <p className="text-gray-500 font-medium text-sm mb-4">Configure o contexto desta empresa para que o Recall possa extrair inteligência real das suas conversas e transformá-las em decisões.</p>
        
            <section className="bg-white/90 p-8 mb-6 rounded-xl shadow-sm shadow-gray-100 border border-gray-200">
                <div className="flex flex-row gap-4 items-center mb-6">
                    <BriefcaseBusiness size={42} className="bg-[#EFF6FF] text-[#1565C0] p-2 rounded-lg" />
                    <div>
                        <h1 className="font-bold text-lg">Informações da Empresa</h1>
                        <p className="text-[13px] font-medium text-gray-400">Os detalhes principais para a criação da contexto Recall da empresa</p>
                    </div>
                </div>
                <form>
                    <div className="flex flex-row w-full gap-4">
                        <div className="w-full">
                            <h1 className='text-xs font-semibold mb-2 text-gray-400'>NOME DA EMPRESA</h1>
                            <input className={`mb-6 border-[1.6px] border-[#C2C6D4]/30 rounded-lg transition-all placeholder:text-gray-400 font-medium w-full py-[11px] px-3 text-[13px] 
                                                'border-[#C2C6D4]/30 focus:outline-sky-500 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.15)]`}
                                type='text' placeholder='ex: Totvs' name='password'>
                            </input>
                        </div>
                        
                        <div className="w-full">
                            <h1 className='text-xs font-semibold mb-2 text-gray-400'>CARGO</h1>
                            <SelectIndustry />
                        </div>
                    </div>
                    <h1 className='text-xs font-semibold mb-2 text-gray-400'>DESCRIÇÃO</h1>
                    <input className={`mb-6 border-[1.6px] border-[#C2C6D4]/30 rounded-lg transition-all placeholder:text-gray-400 font-medium w-full py-[11px] px-3 text-[13px] 
                                            'border-[#C2C6D4]/30 focus:outline-sky-500 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.15)]`}
                        type='text' placeholder='Descreva o momento atual desse cliente, dores conhecidas, histórico relevante e o que o Recall precisa saber para gerar insights precisos.' name='password'>
                    </input>
                </form>

                <UploadDocumentos />
            </section>

            <section className="bg-white/90 p-8 rounded-xl shadow-sm shadow-gray-100 border border-gray-200">
                <div className="flex flex-row gap-4 items-center mb-8">
                    <Workflow size={42} className="bg-[#EFF6FF] text-[#1565C0] p-2 rounded-lg" />
                    <div>
                        <div className="flex flex-row items-center gap-1 mb-[0.5px]">
                            <h1 className="font-bold text-lg">Integrações</h1>
                            <p className="text-[11px] font-bold text-gray-600 bg-gray-100 p-1 rounded-md px-2">EM BREVE</p>
                        </div>
                        <p className="text-[13px] font-medium text-gray-400">Faça integrações com recall</p>
                    </div>
                </div>

                <div className="flex flex-row gap-8">
                    <div className="bg-[#F2F3FB]/10 shadow-lg shadow-gray-100 w-[25%] flex flex-col items-baseline gap-2 p-6 rounded-lg hover:border-[#5A5EB9]/30 transition-all cursor-pointer">
                        <div className="flex flex-row mb-2 justify-between w-full items-center">
                            <svg  xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#5A5EB9" viewBox="0 0 16 16">
                                <path d="M9.186 4.797a2.42 2.42 0 1 0-2.86-2.448h1.178c.929 0 1.682.753 1.682 1.682zm-4.295 7.738h2.613c.929 0 1.682-.753 1.682-1.682V5.58h2.783a.7.7 0 0 1 .682.716v4.294a4.197 4.197 0 0 1-4.093 4.293c-1.618-.04-3-.99-3.667-2.35Zm10.737-9.372a1.674 1.674 0 1 1-3.349 0 1.674 1.674 0 0 1 3.349 0m-2.238 9.488-.12-.002a5.2 5.2 0 0 0 .381-2.07V6.306a1.7 1.7 0 0 0-.15-.725h1.792c.39 0 .707.317.707.707v3.765a2.6 2.6 0 0 1-2.598 2.598z"/>
                                <path d="M.682 3.349h6.822c.377 0 .682.305.682.682v6.822a.68.68 0 0 1-.682.682H.682A.68.68 0 0 1 0 10.853V4.03c0-.377.305-.682.682-.682Zm5.206 2.596v-.72h-3.59v.72h1.357V9.66h.87V5.945z"/>
                            </svg>
                            <Toggle />
                        </div>
                        <h1 className="font-bold text-[15px] -mb-1.5 text-gray-800">Microsoft Teams</h1>
                        <p className="text-xs text-gray-500 font-medium">Acesse todas suas reuniões do teams</p>
                    </div>

                    <div className="bg-[#F2F3FB]/10 w-[25%] shadow-lg shadow-gray-100 flex flex-col items-baseline gap-2 p-6 rounded-lg hover:border-[#5A5EB9]/30 transition-all cursor-pointer">
                        <div className="flex flex-row mb-2 justify-between w-full items-center">
                            <SiJira color="#2D88FF"/>
                            <Toggle />
                        </div>
                        <h1 className="font-bold text-[15px] -mb-1.5 text-gray-800">Jira</h1>
                        <p className="text-xs text-gray-500 font-medium">Acesse suas tasks e tarefas do Jira</p>
                    </div>
                </div>
            </section>

            <div>
                <button></button>
            </div>
        </main>
    )
}