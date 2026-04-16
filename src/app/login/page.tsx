import { Brain, Sparkle } from 'lucide-react';
import Image from 'next/image';
import Logo from "../../../public/RECALL-logo.svg";

export default function LoginPage() {
    return (
        <main className="flex flex-row min-h-screen">
            <section className="flex justify-center text-white items-center w-[45%] bg-[radial-gradient(ellipse_at_center,#1a56db_0%,#1e3a8a_50%,#1e2e6e_100%)]">
                <div className="w-[60%]">
                    <div className="bg-gray-200 w-12 h-[4px] mb-4 rounded-full opacity-50"></div>
                    <h1 className="leading-tight mb-4 aling-left text-white text-[38px] font-bold">Transforme suas soluções com IA </h1>
                    <p>A próxima evolução do ecossistema TOTVS está aqui. Acesse seu workspace e libere o poder da nossa IA <strong>RECALL.</strong></p>
                    <div className='mt-4 flex flex-row gap-4'>    
                        <div className='p-2 border-2 border-amber-50/20 w-fit flex justify-center items-center rounded-full'><Brain className="w-5 h-5 text-amber-50/90 " /></div>
                        <div className='p-2 border-2 border-amber-50/20 w-fit flex justify-center items-center rounded-full'><Sparkle className="w-5 h-5 text-amber-50/90 " /></div>
                    </div>
                </div>
            </section>

            <section className='flex p-8 w-[50%]'>
                <nav><Image src={Logo} alt="Logo Recall" width={80}></Image></nav>
                <div className='flex flex-col justify-center items-left w-[60%]'>
                    <h1 className='text-3xl font-bold'>Bem vindo de volta</h1>
                    <p className='text-gray-500 font-semibold align-left mb-6'>Faça login para ultilizar o Recall.</p>
                    <form className='flex flex-col'>
                        <p className='text-xs font-bold mb-2 text-gray-400'>E-MAIL</p>
                        <input 
                            className='mb-4 border-[1.6px] border-[#C2C6D4]/30 rounded-lg placeholder:text-gray-400 focus:outline-none w-full py-[11px] px-3 text-sm'
                            type='text' placeholder='nome@empresa.com.br'>
                        </input>
                        <p className='text-xs font-bold mb-2 text-gray-400'>E-MAIL</p>
                        <input className='border-[1.6px] border-[#C2C6D4]/30 rounded-lg focus:outline-none w-full py-[9.5px] px-2 text-sm' type='text'></input>
                    </form>

                </div>
            </section>
        </main>
    );
}