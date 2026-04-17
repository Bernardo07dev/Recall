import Image from "next/image"
import Logo from "../../../public/RECALL-logo.svg";
import { SupportButton } from "./_components/SuporteButton";
import  FormSign from "./_components/FormSign";
import { Rocket } from 'lucide-react';
import Link from "next/link";

export default function SigIn(){
    return(
        <div className="min-h-screen flex flex-col">
            <nav className="fixed z-4 bg-white w-full p-4 px-10 flex flex-row justify-between items-center shadow-md">
                <Image src={Logo} alt="Logo Recall" width={70}></Image>
                <SupportButton />
            </nav>

            <main className="flex-1 flex flex-row">
                <section className="px-[13%] w-[58%] flex flex-col justify-center py-8 pt-26">
                    <h1 className="text-[22px] font-bold">Crie Sua Conta Empresarial</h1>
                    <p className="text-gray-500 font-medium text-sm">Junte-se à próxima geração de gerenciamento de negócios com IA.</p>
                    <FormSign/>
                    <p className='text-[13px] text-gray-500 text-center inter'>Já tem uma conta? <Link href="/log-in" className='font-semibold text-[#004D99]'>Clique aqui e faça seu Login</Link></p>
                </section>

                <section className="relative flex-1 flex flex-col justify-center items-center w-[42%] overflow-hidden bg-radial-[at_50%_75%] from-[#152b5e] via-[#141641] to-[#131B2F] to-90%">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
                        <div className="w-[500px] h-[500px] rounded-full bg-[#1E3A8A] opacity-20 blur-[120px]" />
                    </div>

                    <div className="bg-white/4 shadow-lg shadow-black/20 flex flex-col text-white w-[80%] p-10 gap-2 border-[0.5px] border-white/8 rounded-2xl backdrop-blur-lg">
                        <Rocket size={42} className="text-blue-500 bg-[#004D99]/30 mb-2 p-2 rounded-2xl"></Rocket>
                        <h1 className="text-2xl font-bold leading-7.5">Escale sua produtividade com Recall</h1>
                        <p className="text-gray-400 font-medium text-sm">Capacite suas equipes com IA de nível empresarial integrada diretamente ao seu ecossistema TOTVS existente. Segura, escalável e
                            construída para desempenho.</p>
                        <div className="h-[0.2px] w-full bg-white/10 my-4 rounded-full"></div>
                        <div className="flex flex-row gap-2 text-xs font-semibold items-center justify-between">
                            <div className="flex flex-row items-center gap-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <p className="text-[#94A3B8]">Segurança</p>
                            </div>
                            <div className="flex flex-row items-center gap-2 justify-baseline">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <p className="text-[#94A3B8]">Chat com contexto</p>
                            </div>

                            <div className="flex flex-row items-center gap-2 justify-center">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <p className="text-[#94A3B8]">AI first</p>
                            </div>

                            <div className="flex flex-row items-center gap-2 justify-center">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <p className="text-[#94A3B8]">Integração</p>
                            </div>
                        </div>
                    </div>

                </section>
            </main>
        </div>
    )
}