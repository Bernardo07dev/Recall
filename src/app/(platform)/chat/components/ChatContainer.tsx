'use client'
import { useState } from "react"
import { ChevronDown, SendHorizontal } from 'lucide-react';
import EmpresaSelector from "@/src/app/(platform)/chat/components/EmpresaSelector";

interface Props {
    onEnviar: (input: string, companyId: string | null, role: "human" | "AI") => void;
    enableCompany?: boolean;
    empresas: { id: string, nome: string, industry: string }[];
    defaultCompanyId?: string | null;
    isStreaming?: boolean;
    onCompanyChange?: (companyId: string | null) => void;
}

export default function ChatContainer({ onEnviar, enableCompany, empresas, defaultCompanyId, isStreaming, onCompanyChange }: Props) {
    const [input, setInput] = useState("")
    const [companyId, setCompanyId] = useState<string | null>(defaultCompanyId ?? null)
    const [unavailable, setUnavailable] = useState<boolean>(false)

    const handleEnviar = () => {
        if (!input || isStreaming){ return }
        onEnviar(input, companyId, "human")
        setInput("")
    }

    const isInputEmpty = input.trim() === "";

    return (
        <div className="relative w-full z-20">
            <style>{`
                @keyframes container-gradient-shadow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-container-gradient-shadow {
                    background: linear-gradient(90deg, #1565C0, #599be7, #9b59b6, #1565C0);
                    background-size: 300% 300%;
                    animation: container-gradient-shadow 4s ease infinite;
                    filter: blur(8px);
                }
            `}</style>

            <div className={`absolute -inset-[2px] animate-container-gradient-shadow rounded-3xl transition-opacity duration-500 pointer-events-none ${isStreaming ? 'opacity-20' : 'opacity-0'}`}></div>
            
            <div className={`w-full relative flex flex-col text-sm bg-white rounded-3xl p-3 border transition-colors duration-300 ${isStreaming ? 'border-transparent shadow-sm' : 'border-[#ebebeb]'}`}>
                <div className="w-full pb-3 flex flex-row items-center">
                    <input 
                        onKeyDown={(e) => e.key === 'Enter' && handleEnviar()} 
                        className="p-2 w-full font-medium focus:outline-none text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent" 
                        value={input} 
                        placeholder={isStreaming ? "Aguarde a resposta..." : "Pergunte Algo..."} 
                        onChange={(e) => setInput(e.target.value)} 
                        disabled={isStreaming}
                    />

                    <button 
                        className={`p-3 rounded-full transition-all duration-300 ${isInputEmpty ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#004D99] text-white cursor-pointer hover:bg-[#003d7a]'} ${isStreaming ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleEnviar}
                        disabled={isStreaming || isInputEmpty}
                    >
                        <SendHorizontal size={15} className=""/>
                    </button>
                </div>

            {/* <div 
                className="relative w-fit text-[#1E40AF] mt-2" 
                onMouseEnter={() => setUnavailable(true)} 
                onMouseLeave={() => setUnavailable(false)}
            >
                <select 
                    className="appearance-none w-full focus:outline-none bg-[#F2F3FB] px-6 py-2 rounded-full text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed" 
                    onChange={(e) => setCompanyId(e.target.value)}
                    disabled={enableCompany}
                    value={companyId ?? undefined}
                >
                    <option value={undefined}>Sem contexto</option>
                    {empresas.map((empresa) => (
                       <option key={empresa.id} value={empresa.id}>{empresa.nome}</option> 
                    ))}
                </select>

                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <ChevronDown size={14} className="" />
                </div>
            </div> */}

            <EmpresaSelector
                empresas={empresas}
                onChange={(id) => {
                    setCompanyId(id);
                    if (onCompanyChange) onCompanyChange(id);
                }}
                disabled={enableCompany}
                defaultCompanyId={companyId}
            />

        </div>
        </div>
    )
}