'use client'
import { useState } from "react"
import { ChevronDown, SendHorizontal } from 'lucide-react';

interface Props {
    onEnviar: (input: string, companyId: string | null, role: "human" | "AI") => void;
    enableCompany?: boolean;
    empresas: { id: string, nome: string }[];
}

export default function ChatContainer({ onEnviar, enableCompany, empresas }: Props) {
    const [input, setInput] = useState("")
    const [companyId, setCompanyId] = useState<string | null>(null)
    const [unavailable, setUnavailable] = useState<boolean>(false)

    const handleEnviar = () => {
        if (!input){ return }
        onEnviar(input, companyId, "human")
        setInput("")
    }

    return (
        <div className="w-full relative flex flex-col text-sm bg-white shadow-sm rounded-2xl z-20 p-4 border border-gray-100">
            <div className="w-full flex fex-row items-center">
                <input onKeyDown={(e) => e.key === 'Enter' && handleEnviar()} className="p-2 w-full font-medium focus:outline-none text-gray-500" value={input} placeholder="Pergunte Algo..." onChange={(e) => setInput(e.target.value)} />

                <button className="cursor-pointer bg-[#004D99] text-white p-3 rounded-full" onClick={handleEnviar}>
                    <SendHorizontal size={15} className=""/>
                </button>
            </div>

            <div 
                className="relative w-fit text-[#1E40AF] mt-2" 
                onMouseEnter={() => setUnavailable(true)} 
                onMouseLeave={() => setUnavailable(false)}
            >
                <select 
                    className="appearance-none w-full focus:outline-none bg-[#F2F3FB] px-6 py-2 rounded-full text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed" 
                    onChange={(e) => setCompanyId(e.target.value)}
                    disabled={enableCompany}
                >
                    <option value={undefined}>Sem contexto</option>
                    {empresas.map((empresa) => (
                       <option key={empresa.id} value={empresa.id}>{empresa.nome}</option> 
                    ))}
                </select>

                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <ChevronDown size={14} className="" />
                </div>
            </div>

            {unavailable && enableCompany && (
                <div className="text-[11px] text-gray-500 absolute bottom-14 bg-white px-2 py-1 shadow-sm rounded-lg">
                    <p>Você já definiu o contexto desse chat. Para escolher outro <strong>crie um novo chat</strong></p>
                </div>
            )}

        </div>
    )
}