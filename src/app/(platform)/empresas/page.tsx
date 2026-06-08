import { prisma } from "@/src/lib/prisma"
import { Plus, Loader2, Sparkles, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { sectorConfig, DefaultIconConfig } from '@/src/lib/sectorConfig'
import RemoveBusiness from "./removeBusiness"

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
                classes: 'text-red-700 bg-red-50 border-red-200/60'
            };
        } else if (risk >= 40) {
            return {
                value: risk,
                label: 'Médio',
                classes: 'text-amber-700 bg-amber-50 border-amber-200/60'
            };
        } else {
            return {
                value: risk,
                label: 'Bom',
                classes: 'text-emerald-700 bg-emerald-50 border-emerald-200/60'
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
}

export default async function Empresas(){
    const business = await prisma.empresas.findMany({
        orderBy: { createdAt: 'desc' }
    })

    const IndustryIcon = ({ empresa }: { empresa: empresa }) => {
        const config = sectorConfig[empresa.industry.toLowerCase()] || DefaultIconConfig;
        const { Icon, textClass, bgClass } = config;
        
        return (
            <div className={`flex flex-row inter w-full justify-between items-center mb-4 ${textClass}`}>
                <Icon size={40} className={`p-2 rounded-xl w-fit ${bgClass}`} />
                <RemoveBusiness businessId={empresa.id} />
            </div>
        )
    }

    const IndustryText = ({ industria }: { industria: string }) => {
        const config = sectorConfig[industria.toLowerCase()] || DefaultIconConfig;
        const { textClass } = config;

        return (
            <div className={`flex flex-row inter w-full justify-between ${textClass}`}>
                <p className={`h-fit text-[11px] font-light italic`}>
                    {industria.charAt(0).toUpperCase() + industria.slice(1)}
                </p>
            </div>
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
                        <Link href={`/dashboard/${empresa.id}`} key={empresa.id} className="bg-white cursor-pointer p-4 h-fit w-full rounded-2xl shadow-sm border border-transparent hover:border-[#1178df] hover:shadow-sm transition-all duration-300">
                            {empresa.logo ? (
                                <div className="flex flex-row text-gray-700 inter w-full justify-between mb-4">
                                    <img src={empresa.logo} alt="Logo" className="w-10 h-10 object-contain rounded-xl border border-gray-100" />
                                    <p className="bg-gray-100 h-fit text-xs font-semibold p-1 px-2 rounded-2xl">{empresa.industry}</p>
                                </div>
                            ) : (
                                <IndustryIcon empresa={empresa} />
                            )}

                            <div className="flex flex-row gap-2 justify-baseline items-end mb-5">
                                <h2 className="font-bold text-[1.2rem]">{empresa.nome}</h2>
                                <div className="inter"><IndustryText industria={empresa.industry} /></div>
                            </div>
                            
                            {empresa.json ? (
                                <div className="flex flex-wrap w-full gap-2">
                                    <div className="flex items-center gap-1.5 text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60 w-fit px-2.5 py-0.5 rounded-md -mt-2">
                                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                                        <span>Ativo</span>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200/60 w-fit px-2.5 py-0.5 rounded-md -mt-2">
                                        <Sparkles className="text-blue-400 animate-pulse" size={9}/>
                                        <p>Insights: <span className="font-semibold">{getInsightCount(empresa.json)}</span></p>
                                    </div>

                                    {churn && (
                                        <div className={`flex items-center gap-1.5 text-[10px] font-medium border w-fit px-2.5 py-0.5 rounded-md -mt-2 ${churn.classes}`}>
                                            <ShieldAlert size={10} className="opacity-70" />
                                            <p className="font-semibold">{churn.label}</p>
                                        </div>
                                    )}
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

                <Link href="/context" className="cursor-pointer text-[#424752a5] py-6 border-dashed border-2 h-fill border-gray-300 text-center hover:border-[#1178df] transition-all p-4 w-full flex flex-col items-center justify-center rounded-2xl">
                    <Plus className="bg-[#F2F3FB] p-2 rounded-full mb-2" size={34}/>
                    <h1 className="font-bold text-sm">Adicionar novo contexto</h1>
                    <p className="text-[11px] mx-2 text-gray-400">Clique aqui para criar um novo contexto</p>
                </Link>
            </section>
        </main>
    )
}