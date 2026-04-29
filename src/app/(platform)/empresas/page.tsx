import { prisma } from "@/src/lib/prisma"
import { Landmark, GraduationCap, Factory, Truck, Plus } from "lucide-react"
import Link from "next/link"

export default async function Empresas(){
    const business = await prisma.empresas.findMany({
        orderBy: { createdAt: 'desc' }
    })

    const FinanceiroIcon = ({ industria }: { industria: string }) => {
        return(
            <div className="flex flex-row text-[#004D99] inter w-full justify-between mb-4">
                <Landmark size={40} className="bg-[#EFF6FF] p-2 rounded-xl w-fit"/>
                <p className="bg-[#EFF6FF] h-fit text-xs font-semibold p-1 px-2 rounded-2xl">{industria}</p>
            </div>
        )
    }

    const EducacaoIcon = ({ industria }: { industria: string }) => {
        return(
            <div className="flex flex-row text-[#E2264F] inter w-full justify-between mb-4">
                <GraduationCap size={40} className="bg-[#FFF1F2] p-2 rounded-xl w-fit"/>
                <p className="bg-[#FFF1F2] h-fit text-xs font-semibold p-1 px-2 rounded-2xl">{industria}</p>
            </div>
        )
    }

    const ManufaturaIcon = ({ industria }: { industria: string }) => {
        return(
            <div className="flex flex-row text-[#16A34A] inter w-full justify-between mb-4">
                <Factory size={40} className="bg-[#F0FDF4] p-2 rounded-xl w-fit"/>
                <p className="bg-[#F0FDF4] h-fit text-xs font-semibold p-1 px-2 rounded-2xl">{industria}</p>
            </div>
        )
    }

    const LogisticaIcon = ({ industria }: { industria: string }) => {
        return(
            <div className="flex flex-row text-[#334155] inter w-full justify-between mb-4">
                <Truck size={40} className="bg-[#F1F5F9] p-2 rounded-xl w-fit"/>
                <p className="bg-gray-100 h-fit text-xs font-semibold p-1 px-2 rounded-2xl">{industria}</p>
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
                            <>
                                {empresa.industry === "financeiros" && <FinanceiroIcon industria={empresa.industry}/>}
                                {empresa.industry === "educação" && <EducacaoIcon industria={empresa.industry}/>}
                                {empresa.industry === "manufatura" && <ManufaturaIcon industria={empresa.industry}/>}
                                {empresa.industry === "logística" && <LogisticaIcon industria={empresa.industry}/>}
                            </>
                        )}
                        <p className="font-bold">{empresa.nome}</p>
                        <p className="text-xs text-gray-400">{empresa.industry}</p>
                    </Link>
                ))}

                <Link href="/context" className="cursor-pointer text-[#424752a5] py-6 border-dashed border h-fit border-gray-300 text-center hover:border-[#1178df] transition-all p-4 w-full flex flex-col items-center justify-center rounded-2xl">
                    <Plus className="bg-[#F2F3FB] p-2 rounded-full mb-2" size={34}/>
                    <h1 className="font-bold text-sm">Adicionar novo contexto</h1>
                    <p className="text-[11px] mx-2 text-gray-400">Clique aqui para criar um novo contexto</p>
                </Link>
            </section>
        </main>
    )
}