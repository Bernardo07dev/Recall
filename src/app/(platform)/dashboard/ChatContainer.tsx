'use client'
import { useState } from "react"
import { ChevronDown, SendHorizontal } from 'lucide-react';

interface Props {
    onEnviar: (input: string, companyId: string | null) => void;
}

export default function ChatDashboard({ onEnviar }: Props) {
    const [input, setInput] = useState("")
    const [companyId, setCompanyId] = useState<string | null>(null)

    return (
        <div className="w-full flex flex-col text-sm bg-white shadow-sm rounded-2xl p-4">
            <div className="w-full flex fex-row items-center">
                <input className="p-4 w-full focus:outline-none text-gray-500" placeholder="Pergunte Algo..." onChange={(e) => setInput(e.target.value)} />

                <button className="cursor-pointer bg-[#004D99] text-white p-3 rounded-full" onClick={() => onEnviar(input, companyId)}>
                    <SendHorizontal size={15} className=""/>
                </button>
            </div>

            <div className="relative w-fit text-[#1E40AF]">
                <select className="appearance-none bg-gray/10 w-fit focus:outline-none bg-[#F2F3FB] px-3 py-2 rounded-full text-xs font-semibold" onChange={(e) => setCompanyId(e.target.value)}>
                    <option value={undefined}>Sem contexto</option>
                    <option value="acme">Acme Corp</option>
                    <option value="acme">Biohealth solution</option>
                </select>

                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <ChevronDown size={14} className="" />
                </div>
            </div>
        </div>
    )
}