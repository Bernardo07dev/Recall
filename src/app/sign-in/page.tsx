import Image from "next/image"
import Logo from "../../../public/RECALL-logo.svg";
import { SupportButton } from "./SuporteButton";
import Select from "./SelectSign";
import { Rocket } from 'lucide-react';

export default function SigIn(){
    return(
        <div className="min-h-screen flex flex-col">
            <nav className="w-full p-8 px-10 flex flex-row justify-between items-center">
                <Image src={Logo} alt="Logo Recall" width={80}></Image>
                <SupportButton />
            </nav>

            <main className="flex-1 flex flex-row">
                <section className="px-[5%] w-[50%] flex flex-col justify-center py-4">
                    <h1 className="text-[22px] font-bold">Crie Sua Conta Empresarial</h1>
                    <p className="text-gray-500 font-medium text-sm">Junte-se à próxima geração de gerenciamento de negócios com IA.</p>

                    <form className='flex flex-col inter mt-8'>
                        <p className='text-xs font-semibold mb-2 text-gray-700'>Nome Completo</p>
                        <input 
                            className='mb-4 border-[1.6px] border-[#C2C6D4]/30 rounded-lg placeholder:text-gray-400 shadow-lg shadow-gray-100 focus:outline-none w-full py-[11px] px-3 text-[13px]'
                            type='text' placeholder='Insira seu nome completo'>
                        </input>
                        <p className='text-xs font-semibold mb-2 text-gray-700'>Email Corporativo</p>
                        <input className='mb-6 border-[1.6px] border-[#C2C6D4]/30 rounded-lg shadow-lg shadow-gray-200 focus:outline-none placeholder:text-gray-400 w-full py-[11px] px-3 text-[13px]'
                            type='text' placeholder='nome@totvs.com'>
                        </input>
                        <Select />
                        <p className='text-xs font-semibold mb-2 text-gray-700'>Área</p>
                        <input className='mb-6 border-[1.6px] border-[#C2C6D4]/30 rounded-lg shadow-lg shadow-gray-200 focus:outline-none placeholder:text-gray-400 w-full py-[11px] px-3 text-[13px]'
                            type='text' placeholder='Qual sua área de atuação'>
                        </input>
                        <p className='text-xs font-semibold mb-2 text-gray-700'>Crie sua Senha</p>
                        <input className='mb-6 border-[1.6px] border-[#C2C6D4]/30 rounded-lg shadow-lg shadow-gray-200 focus:outline-none placeholder:text-gray-400 w-full py-[11px] px-3 text-[13px]'
                            type='text' placeholder='Digite sua senha'>
                        </input>
                        
                        <button type='submit' className='mb-4 w-full text-white rounded-lg font-semibold p-3 text-sm align-middle cursor-pointer bg-[#004D99]'>Cria Conta</button>
                    </form>
                </section>

                <section className="relative flex-1 flex flex-col justify-center items-center w-[50%] overflow-hidden bg-radial-[at_50%_75%] from-[#1f418f] via-[#141641] to-[#131B2F] to-90%">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
                        <div className="w-[500px] h-[500px] rounded-full bg-[#1E3A8A] opacity-20 blur-[120px]" />
                    </div>

                    <div className="bg-white/10 flex flex-col text-white w-[55%] p-8 gap-2 rounded-2xl">
                        <Rocket size={42} className="text-blue-500 bg-[#004D99]/30 mb-2 p-2 rounded-2xl"></Rocket>
                        <h1 className="text-2xl font-bold leading-5.5">Escale sua produtividade com Recall</h1>
                        <p className="text-gray-400 text-sm font-medium">Capacite suas equipes com IA de nível empresarial integrada diretamente ao seu ecossistema TOTVS existente. Segura, escalável e
                            construída para desempenho.</p>
                    </div>

                </section>
            </main>
        </div>
    )
}