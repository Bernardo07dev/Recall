"use client"
import Select from "./SelectSign";
import { useState } from "react";
import {Check, X} from "lucide-react";
import { createUser } from "../../actions/user-actions";
import { useRouter } from "next/navigation";

interface FormData {
  nome: string;
  email: string;
  area: string;
  cargo: string;
  password: string;
  confirmPassword: string;
}


const PassParmetrs = ({ password }: { password: string }) => {
    const hasMinLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[@ # $ % & * ® © ñ _]/.test(password);

    return (
        <div className="text-xs font-medium mb-6 flex flex-col gap-2 text-gray-500 animate-fade-in">
            <div className="flex flex-row gap-1 items-center">
                {hasMinLength ? <Check size={15} className="text-green-500"/> : <X size={15} className="text-red-500"/>}
                <p>Mais de 8 caracteres</p>
            </div>
            <div className="flex flex-row gap-1 items-center">
                {hasUpper ? <Check size={15} className="text-green-500"/> : <X size={15} className="text-red-500"/>}
                <p>Alguma letra maiúscula</p>
            </div>
            <div className="flex flex-row gap-1 items-center">
                {hasSpecial ? <Check size={15} className="text-green-500"/> : <X size={15} className="text-red-500"/>}
                <p>Pelo menos uma caracter especial (@, #, !, %, &, *, ®, ©, ñ, _)</p>
            </div>
        </div>
    )
} 


const ConfirmPasswordCheck = ({confirm, password } : { confirm: string, password: string}) => {
    const isEqual = confirm == password;
    return(
        <div className="text-xs font-medium mb-6 flex flex-col gap-2 text-gray-500 animate-fade-in">
            <div className="flex flex-row gap-1 items-center">
                {isEqual ? (
                    <Check size={15} className="text-green-500"/>
                ) : (
                    <X size={15} className="text-red-500"/>
                )}
                <p>{isEqual ? "Senhas coincidem" : "As senhas não são iguais"}</p>
            </div>
        </div>
    )
}

export default function FormSign() {

    const [selectPr, setSelectPr] = useState(false);
    const [selectConfirm, setSelectConfirm] = useState(false)
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = new FormData(e.currentTarget);
        const result = await createUser(data)

        if (result.success) {
            alert("Sucesso! Usuário criado no Recall.")
        } else {
            alert("Erro ao salvar: " + result.error)
        }

    };

    const [formData, setFormData] = useState<FormData>({
        nome: "",
        email: "",
        area: "",
        cargo: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> ) => {
        const { name, value } = e.target;
        
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const isPasswordStrong = formData.password.length >= 8 && /[A-Z]/.test(formData.password) && /[@#$%&*®©ñ_]/.test(formData.password);
    const passwordsMatch = formData.password === formData.confirmPassword && formData.password !== "";
    const isFormValid = formData.nome.trim().length > 3 && formData.email.includes("@") && formData.cargo !== "" && formData.area !== "" && isPasswordStrong && passwordsMatch;

    return (
        <form onSubmit={handleSubmit} className='flex flex-col inter mt-8'>
            <p className='text-xs font-semibold mb-2 text-gray-700'>Nome Completo</p>
            <input
                className='mb-4 border-[1.6px] border-[#C2C6D4]/30 rounded-lg placeholder:text-gray-400 shadow-lg shadow-gray-100 focus:outline-none w-full py-[11px] px-3 text-[13px]'
                type='text' placeholder='Insira seu nome completo' name="nome" value={formData.nome} onChange={handleChange}>
            </input>
            <p className='text-xs font-semibold mb-2 text-gray-700'>Email Corporativo</p>
            <input className='mb-6 border-[1.6px] border-[#C2C6D4]/30 rounded-lg shadow-lg shadow-gray-200 focus:outline-none placeholder:text-gray-400 w-full py-[11px] px-3 text-[13px]'
                type='email' placeholder='nome@totvs.com' name="email" value={formData.email} onChange={handleChange}>
            </input>
            <Select value={formData.cargo} onChange={handleChange} name="cargo"/>
            <p className='text-xs font-semibold mb-2 text-gray-700'>Área</p>
            <input className='mb-6 border-[1.6px] border-[#C2C6D4]/30 rounded-lg shadow-lg shadow-gray-200 focus:outline-none placeholder:text-gray-400 w-full py-[11px] px-3 text-[13px]'
                type='text' placeholder='Qual sua área de atuação' name="area" value={formData.area} onChange={handleChange}>
            </input>
            <p className='text-xs font-semibold mb-2 text-gray-700'>Crie sua Senha</p>
            <input className='mb-6 border-[1.6px] border-[#C2C6D4]/30 rounded-lg shadow-lg shadow-gray-200 focus:outline-none placeholder:text-gray-400 w-full py-[11px] px-3 text-[13px]'
                type='text' name="password" value={formData.password || ''} onChange={handleChange} placeholder='Digite sua senha' onFocus={() => setSelectPr(true)}>
            </input>

            {selectPr && <PassParmetrs password={formData.password}/>}
            
            <p className='text-xs font-semibold mb-2 text-gray-700'>Confirme sua Senha</p>
            <input className='mb-4 border-[1.6px] border-[#C2C6D4]/30 rounded-lg shadow-lg shadow-gray-200 focus:outline-none placeholder:text-gray-400 w-full py-[11px] px-3 text-[13px]'
                type='text' placeholder='Confirme sua Senha' name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} onFocus={() => setSelectConfirm(true)}>
            </input>

            {selectConfirm && (<ConfirmPasswordCheck confirm={formData.confirmPassword} password={formData.password}/>)}

            <button type='submit' disabled={!isFormValid}
            className={`mb-4 w-full text-white rounded-lg font-semibold p-3 text-sm transition-all duration-300
                ${isFormValid 
                ? 'bg-[#004D99] cursor-pointer hover:bg-[#003D7A] shadow-md' 
                : 'bg-gray-300 cursor-not-allowed opacity-80'}`}
            >
            Criar Conta
            </button>
        </form>
    )
}