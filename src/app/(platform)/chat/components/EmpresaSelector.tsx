'use client'
import { useState } from 'react'
import { ChevronDown, X, Building2 } from 'lucide-react'
import { sectorConfig, DefaultIconConfig } from '@/src/lib/sectorConfig'

interface Empresa {
    id: string
    nome: string
    industry: string
}

interface Props {
    empresas: Empresa[]
    onChange: (id: string | null) => void
    disabled?: boolean
    defaultCompanyId?: string | null
}

export default function EmpresaSelector({ empresas, onChange, disabled, defaultCompanyId }: Props) {
    const defaultEmpresa = empresas.find(e => e.id === defaultCompanyId) ?? null
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState<Empresa | null>(defaultEmpresa)

    function handleSelect(empresa: Empresa | null) {
        setSelected(empresa)
        onChange(empresa?.id ?? null)
        setOpen(false)
    }

    const selectedConfig = selected ? (sectorConfig[selected.industry.toLowerCase()] || DefaultIconConfig) : null;
    const SelectedIcon = selectedConfig ? selectedConfig.Icon : X;
    const selectedTextClass = selectedConfig ? selectedConfig.textClass : "text-gray-400";

    return (
        <div className="relative w-fit">
            <button
                onClick={() => !disabled && setOpen(!open)}
                className={`flex items-center gap-2 bg-white px-4 py-2 rounded-full text-[0.75rem] font-semibold transition-colors
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50/70 cursor-pointer'}`}
            >
                <SelectedIcon size={13} className={selectedTextClass} />
                <span className="text-gray-600 max-w-[120px] truncate">
                    {selected ? selected.nome : 'Sem contexto'}
                </span>
                {selected && !disabled && (
                    <X 
                        size={12} 
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        onClick={(e) => { e.stopPropagation(); handleSelect(null) }}
                    />
                )}
                {!selected && <ChevronDown size={12} className="text-gray-400" />}
            </button>

            {open && (
                <div className="absolute bottom-10 left-0 z-20 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden w-56">
                    <div
                        onClick={() => handleSelect(null)}
                        className={`flex items-center gap-2 px-4 py-3 text-[0.75rem] cursor-pointer hover:bg-gray-50 transition-colors ${!selected ? 'text-blue-500 font-semibold' : 'text-gray-500'}`}
                    >
                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                            <X size={10} className="text-gray-400" />
                        </div>
                        Sem contexto
                    </div>

                    {empresas.map(empresa => {
                        const config = sectorConfig[empresa.industry.toLowerCase()] || DefaultIconConfig;
                        const { Icon, textClass, bgClass } = config;
                        return (
                            <div
                                key={empresa.id}
                                onClick={() => handleSelect(empresa)}
                                className={`flex items-center gap-2 px-4 py-3 text-[0.75rem] cursor-pointer hover:bg-blue-50/40 transition-colors font-semibold ${selected?.id === empresa.id ? 'text-blue-500 bg-blue-50' : 'text-gray-700'}`}
                            >
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${bgClass}`}>
                                    <Icon size={13} className={textClass} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="truncate max-w-[140px]">{empresa.nome}</span>
                                    <span className="text-[0.65rem] text-gray-400 font-normal">{empresa.industry}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}