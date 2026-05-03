import { InsightOutput } from "@/src/lib/langchain/utils";
import { Smile, Frown, Meh, Minus } from "lucide-react";

interface Props {
    empresa: InsightOutput;
}

export default function totvsContainer({ empresa } : Props){
    const dados = empresa?.totvs_products_mapped

    const statusProduct = (status: string) => {
        switch (status) {
            case "active":
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">Ativo</span>;
            case "opportunity":
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">Oportunidade</span>;
            case "at_risk":
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">Em Risco</span>;
            case "churned":
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-200">Cancelado</span>;
            default:
                return null;
        }
    }

    const satisfaction = (satisfactionValue?: string) => {
        switch (satisfactionValue) {
            case "positive":
                return <div className="p-1.5 rounded-full bg-emerald-100 text-emerald-600" title="Positivo"><Smile size={16} /></div>;
            case "negative":
                return <div className="p-1.5 rounded-full bg-rose-100 text-rose-600" title="Negativo"><Frown size={16} /></div>;
            case "mixed":
                return <div className="p-1.5 rounded-full bg-amber-100 text-amber-600" title="Misto"><Meh size={16} /></div>;
            case "neutral":
                return <div className="p-1.5 rounded-full bg-slate-100 text-slate-600" title="Neutro"><Minus size={16} /></div>;
            default:
                return null;
        }
    }

    return(
        <main className="flex flex-row gap-4">
            {dados?.map((items) => (
                <div className="w-[25%] p-4 flex flex-col items-start border border-[#167df3]/10 rounded-xl text-sm shadow-sm shadow-[#398ded]/10" key={items.product}>
                    <div className="flex w-full items-center justify-between">
                        <h1 className="font-bold text-zinc-800 text-[15px]">{items.product}</h1>
                        {satisfaction(items.satisfaction)}
                    </div>
                    <p className="text-gray-400 text-xs mb-3 font-medium">{items.satisfaction?.toUpperCase()}</p>
                    {statusProduct(items.status)}
                </div>
            ))}
        </main>
    )
}