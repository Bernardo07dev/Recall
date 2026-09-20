import { prisma } from "@/src/lib/prisma"
import { Plus, Loader2, Sparkles, ShieldAlert, Globe, Lock } from "lucide-react"
import Link from "next/link"
import { sectorConfig, DefaultIconConfig } from '@/src/lib/sectorConfig'

function getInsightCount(json: any): number {
    if (!json) return 0;
    try {
        const parsed = typeof json === 'string' ? JSON.parse(json) : json;
        return parsed?.insights?.prioritized?.length || 0;
    } catch {
        return 0;
    }
}

function getChurnRisk(json: any) {
    if (!json) return null;
    try {
        const parsed = typeof json === 'string' ? JSON.parse(json) : json;
        const risk = parsed?.indicators?.churn_risk;
        if (typeof risk !== 'number') return null;
        
        if (risk >= 70) {
            return {
                value: risk,
                label: 'Crítico',
                classes: 'text-red-700 '
            };
        } else if (risk >= 40) {
            return {
                value: risk,
                label: 'Médio',
                classes: 'text-amber-700 bg-amber-50 border-amber-200/20'
            };
        } else {
            return {
                value: risk,
                label: 'Bom',
                classes: 'text-emerald-700 bg-emerald-50 border-emerald-200/20'
            };
        }
    } catch {
        return null;
    }
}

interface empresa {
    id: string;
    nome: string;
    content: string;
    json?: any;
    context?: string | null;
    resume?: string | null;
    industry: string;
    files: string[];
    logo?: string | null;
    relation?: string | null;
    createdAt: Date;
    status: string;
    isPublic: boolean;
    ownerId: string;
    owner?: any;
    shares?: any[];
    conversations?: any[];
}

export default async function Empresas(){
    const business = await prisma.empresas.findMany({
        orderBy: { createdAt: 'desc' }
    })

    const IndustryIcon = ({ empresa }: { empresa: empresa }) => {
        const config = sectorConfig[empresa.industry.toLowerCase()] || DefaultIconConfig;
        const { Icon, textClass, bgClass } = config;
        
        return (
            <Icon size={30} className={`p-1.5 rounded-xl w-fit ${bgClass} ${textClass}`} />
        )
    }

    return(
        <main className="pt-22 pb-12 px-[5%]">
            <h1 className="text-2xl font-bold mb-1">Empresas</h1>
            <p className="text-gray-500 font-medium text-sm mb-4">Veja os contextos de empresas criados disponíveis no recall</p>
            <section className="grid grid-cols-4 gap-4">
                {business.map((empresa) => {
                    const churn = getChurnRisk(empresa.json);
                    return (
                        <Link href={`/dashboard/${empresa.id}`} key={empresa.id} className={`relative overflow-hidden bg-white cursor-pointer p-4 h-full w-full rounded-2xl border transition-all duration-300 ${churn?.label === 'Crítico' ? 'shadow-red border border-rose-200 hover:border-rose-300' : 'shadow-rainbow border-transparent hover:border-[#1178df]'} hover:shadow-sm`}>
                            <div className="flex flex-row justify-between">
                                <div className="flex flex-row items-center gap-2 mb-5">
                                    {empresa.logo ? (
                                        <div className="flex flex-row text-gray-700 inter w-full justify-between mb-4">
                                            <img src={empresa.logo} alt="Logo" className="w-10 h-10 object-contain rounded-xl border border-gray-100" />
                                            <p className="bg-gray-100 h-fit text-xs font-semibold p-1 px-2 rounded-2xl">{empresa.industry}</p>
                                        </div>
                                    ) : (
                                        <IndustryIcon empresa={empresa} />
                                    )}

                                    <div className="flex flex-row justify-baseline items-center gap-2">
                                        <h2 className="font-bold text-[1rem]">{empresa.nome}</h2>
                                        {empresa.json && churn && churn.label === 'Crítico' && (
                                            <div className={`relative group flex items-center gap-1.5 font-semibold text-[10px] w-fit py-1 rounded-lg ${churn.classes}`}>
                                                <ShieldAlert size={15} className="opacity-70" />
                                                <span className="absolute left-0 top-full mt-1 hidden whitespace-nowrap rounded bg-gray-800 text-white text-xs px-2 py-1 group-hover:block group-hover:visible group-hover:opacity-100 transition-opacity" >
                                                    {churn.label}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {empresa.isPublic ? (
                                    <div className="relative group bg-[#EFF6FF] p-1.5 rounded-full h-fit">
                                        <Globe size={15} className="text-[#1565C0]" />
                                        <span className="absolute font-semibold right-0 top-full mt-1 hidden whitespace-nowrap rounded bg-gray-800 text-white text-xs px-2 py-1 group-hover:block group-hover:visible group-hover:opacity-100 transition-opacity z-10">
                                            Público
                                        </span>
                                    </div>
                                ) : (
                                    <div className="relative group bg-gray-100 p-1.5 rounded-full h-fit">
                                        <Lock size={14} className="text-gray-500" />
                                            <span className="absolute right-0 font-semibold top-full mt-1 hidden whitespace-nowrap rounded bg-gray-800 text-white text-xs px-2 py-1 group-hover:block group-hover:visible group-hover:opacity-100 transition-opacity z-10">
                                            Privado
                                        </span>
                                    </div>
                                )}


                            </div>
                            
                            {empresa.json ? (
                                <div className="flex flex-wrap w-full gap-2">
                                    <div className="flex items-center gap-1.5 text-[10px] font-semibold bg-blue-50 text-blue-700 w-fit px-2.5 py-1 rounded-lg -mt-2">
                                        <Sparkles className="text-blue-400" size={11} />
                                        <p>Insights: <span className="">{getInsightCount(empresa.json)}</span></p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-700 w-fit rounded-md -mt-2">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    <span>Carregando...</span>
                                </div>
                            )}
                        </Link>
                    );
                })}

                <Link href="/context" className="cursor-pointer text-[#424752a5] py-4 border-dashed border-2 h-fill border-gray-300 text-center hover:border-[#1178df] transition-all p-4 w-full flex flex-col items-center justify-center rounded-2xl">
                    <Plus className="bg-[#F2F3FB] p-2 rounded-full mb-2" size={30}/>
                    <h1 className="font-bold text-sm">Adicionar novo contexto</h1>
                </Link>
            </section>
        </main>
    )
}