"use client"
import { Brain, Sparkle } from 'lucide-react';
import Image from 'next/image';
import Logo from "../../../public/RECALL-logo.svg";
import Link from 'next/link';
import { loginUser } from "../actions/user-actions";
import { useActionState } from "react";

export default function LoginPage() {
    const [state, action, pending] = useActionState(loginUser, null);

    return (
        <main className="flex flex-row min-h-screen">
            <section className="flex justify-center text-white items-center w-[45%] bg-radial-[at_50%_75%] from-[#193578] via-[#1c1f5f] to-[#16213c] to-90%">
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
                <nav><Image src={Logo} alt="Logo Recall" width={120}></Image></nav>
                <div className='flex flex-col justify-center items-left w-full mx-[13%] mt-6'>
                    <h1 className='text-[28px] font-black'>Bem vindo de volta</h1>
                    <p className='text-gray-500 font-semibold align-left mb-6'>Faça login para ultilizar o Recall.</p>
                    <form action={action} className='flex flex-col inter'>
                        <p className='text-xs font-semibold mb-2 text-gray-700'>E-MAIL</p>
                        <input 
                        className={`mb-4 border-[1.6px] border-[#C2C6D4]/30 rounded-lg placeholder:text-gray-400 shadow-lg shadow-gray-100 transition-all focus:outline-none w-full py-[11px] px-3 text-[13px] ${state?.error 
                                ? 'border-red-400 focus:outline-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.15)]' 
                                : 'border-[#C2C6D4]/30 focus:outline-sky-500 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.15)]'}`}
                        type='text'
                        name='email'
                        placeholder='nome@empresa.com.br'
                        />
                        <p className='text-xs font-semibold mb-2 text-gray-700'>SENHA</p>
                        <input className={`mb-6 border-[1.6px] border-[#C2C6D4]/30 rounded-lg shadow-lg shadow-gray-200 transition-all  placeholder:text-gray-400 w-full py-[11px] px-3 text-[13px] ${state?.error 
                                ? 'border-red-400 focus:outline-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.15)]' 
                                : 'border-[#C2C6D4]/30 focus:outline-sky-500 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.15)]'}`}
                            type='text' placeholder='Insira sua senha' name='password'>
                        </input>

                        <button disabled={pending} type='submit' className={`mb-2 w-full text-white rounded-lg font-semibold p-3 text-sm align-middle cursor-pointer ${pending ? `bg-gray-300` : `bg-[#004D99]`}`}>{pending ? "Entrando..." : "Entrar"}</button>
                        {state?.error && (<p className="text-red-500 pl-1 text-[13px] py-2 font-semibold animate-fade-in">{state.error}</p>)}
                    </form>
                    <p className='text-[13px] mt-2 text-gray-500 text-center inter'>Não tem uma conta? <Link href="/sign-in" className='font-semibold text-[#004D99]'>Clique aqui e cadastre-se agora</Link></p>
                </div>
            </section>
        </main>
    );
}