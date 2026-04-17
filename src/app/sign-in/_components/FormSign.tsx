"use client"
import Select from "./SelectSign";
import { useState } from "react";
import {Check, X} from "lucide-react";


const PassParmetrs = ({ password }: { password: string }) => {
    const hasMinLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[@ # $ % & * ® © ñ]/.test(password);

    return (
        <div className="text-xs font-medium mb-6 flex flex-col gap-2 text-gray-500 animate-fade-in">
            <div className="flex flex-row gap-1 items-center">
                {hasMinLength ? <Check size={15} className="text-green-500"/> : <X size={15} className="text-red-500"/>}
                <p>Mais de 8 caracteres</p>
            </div>
            <div className="flex flex-row gap-1 items-center">
                {hasUpper ? <Check size={15} className="text-green-500"/> : <X size={15} className="text-red-500"/>}
                <p>Primeira letra maiúscula</p>
            </div>
            <div className="flex flex-row gap-1 items-center">
                {hasSpecial ? <Check size={15} className="text-green-500"/> : <X size={15} className="text-red-500"/>}
                <p>Pelo menos uma caracter especial (@, #, !)</p>
            </div>
        </div>
    )
}

export default function FormSign() {
    const [selectPr, setSelectPr] = useState(false);
    const [password, setPassword] = useState("");

    return (
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
                type='text' onChange={(e) => {
                    const newValue = e.target.value;
                    setPassword(newValue);
                }} placeholder='Digite sua senha' onFocus={() => setSelectPr(true)}>
            </input>


            {selectPr && <PassParmetrs password={password}/>}
            
            <p className='text-xs font-semibold mb-2 text-gray-700'>Confirme sua Senha</p>
            <input className='mb-6 border-[1.6px] border-[#C2C6D4]/30 rounded-lg shadow-lg shadow-gray-200 focus:outline-none placeholder:text-gray-400 w-full py-[11px] px-3 text-[13px]'
                type='text' placeholder='Confirme sua Senha'>
            </input>

            <button type='submit' className='mb-4 w-full text-white rounded-lg font-semibold p-3 text-sm align-middle cursor-pointer bg-[#004D99]'>Cria Conta</button>
        </form>
    )
}