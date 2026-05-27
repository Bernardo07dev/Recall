import { prisma } from "@/src/lib/prisma"
import { Plus, Trash } from "lucide-react"
import Link from "next/link"
import { sectorConfig, DefaultIconConfig } from '@/src/lib/sectorConfig'
import { deleteBusiness } from "@/src/app/actions/user-actions"
import RemoveBusiness from "./removeBusiness"

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
                <RemoveBusiness businessId={ empresa.id } />
            </div>
        )
    }

    const IndustryText = ({ industria }: { industria: string }) => {
        const config = sectorConfig[industria.toLowerCase()] || DefaultIconConfig;
        const { Icon, textClass, bgClass } = config;

        return (
            <div className={`flex flex-row inter w-full justify-between mb-4 ${textClass}`}>
                <p className={`h-fit text-xs font-medium p-2 px-3 rounded-xl ${bgClass}`}>
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
                {business.map((empresa) => (
                    <Link href={`/dashboard/${empresa.id}`} key={empresa.id} className="bg-white cursor-pointer p-4 w-full rounded-2xl shadow-sm border border-transparent hover:border-[#1178df] hover:shadow-sm transition-all duration-300">
                        {empresa.logo ? (
                            <div className="flex flex-row text-gray-700 inter w-full justify-between mb-4">
                                <img src={empresa.logo} alt="Logo" className="w-10 h-10 object-contain rounded-xl border border-gray-100" />
                                <p className="bg-gray-100 h-fit text-xs font-semibold p-1 px-2 rounded-2xl">{empresa.industry}</p>
                            </div>
                        ) : (
                            <IndustryIcon empresa={empresa} />
                        )}
                        <div className="flex flex-row justify-between items-center">
                            <h2 className="font-semibold mb-1 text-lg">{empresa.nome}</h2>
                            <div className="inter"><IndustryText industria={empresa.industry} /></div>
                        </div>
                    </Link>
                ))}

                <Link href="/context" className="cursor-pointer text-[#424752a5] py-6 border-dashed border-2 h-fit border-gray-300 text-center hover:border-[#1178df] transition-all p-4 w-full flex flex-col items-center justify-center rounded-2xl">
                    <Plus className="bg-[#F2F3FB] p-2 rounded-full mb-2" size={34}/>
                    <h1 className="font-bold text-sm">Adicionar novo contexto</h1>
                    <p className="text-[11px] mx-2 text-gray-400">Clique aqui para criar um novo contexto</p>
                </Link>
            </section>
        </main>
    )
}