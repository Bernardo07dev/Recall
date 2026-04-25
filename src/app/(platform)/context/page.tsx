import { ArrowLeft, BriefcaseBusiness } from "lucide-react";
import Link from "next/link";
import SelectIndustry from "@/src/app/(platform)/context/SelectIndustry";

export default function ContextPage(){
    return(
        <main className="pt-22 px-[5%]">
            <Link href="/dashboard" className="flex flex-row text-[#1565C0] font-semibold gap-1 items-center mb-4">
                <ArrowLeft size={14}/>
                <p className="text-xs">Voltar para o Dashboard</p>
            </Link>
            <h1 className="text-3xl font-bold mb-1">Crie um novo contexto de empresa</h1>
            <p className="text-gray-500 font-medium text-sm mb-4">Configure o contexto desta empresa para que o Recall possa extrair inteligência real das suas conversas e transformá-las em decisões.</p>
        
            <section className="bg-white p-8 rounded-xl shadow-sm shadow-gray-100 border border-gray-200">
                <div className="flex flex-row gap-4 items-center mb-6">
                    <BriefcaseBusiness size={42} className="bg-[#EFF6FF] text-[#1565C0] p-2 rounded-lg" />
                    <div>
                        <h1 className="font-bold text-lg">Informações da Empresa</h1>
                        <p className="text-sm text-gray-400">Os detalhes principais para a criação da contexto Recall da empresa</p>
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
                </form>
            </section>
        </main>
    )
}