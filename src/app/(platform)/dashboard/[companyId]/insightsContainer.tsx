import { InsightOutput } from '@/src/lib/langchain/utils'
import { BanknoteX, BadgeDollarSign, ShieldAlert, Megaphone, Handshake, PiggyBank, Rocket, MapPlus } from 'lucide-react';

interface Props {
    insights: InsightOutput;
}

export default function InsightsContainer({ insights }: Props) {
    const rederIcon = (category: String) => {
        if (category == "churn_risk") {
            return (
                <div className='flex flex-row gap-1 text-gray-400 font-medium text-[13px] items-center mb-3'>
                    <BanknoteX className='text-red-400/60' size={22}/>
                    <p>Risco de Churn</p>
                </div>
            )
        } else if (category == "upsell_opportunity") {
            return (
                <div className='flex flex-row gap-1 text-gray-500 text-[13px] items-center mb-3'>
                    <BadgeDollarSign className='text-emerald-400/80' size={20}/>
                    <p>Oportunidade de Upsell</p>
                </div>
            )
        } else if (category == "competitor_threat") {
            return(
                <div className='flex flex-row gap-1 text-gray-500 text-[13px] items-center mb-3'>
                    <ShieldAlert className='text-red-400/80' size={20}/>
                    <p>Ameaça do Competidor</p>
                </div>
            )
        } else if (category == "product_feedback") {
            return(
                <div className='flex flex-row gap-1 text-gray-500 text-[13px] items-center mb-3'>
                    <Megaphone className='text-violet-400/80' size={20}/>
                    <p>Feedback do Produto</p>
                </div>
            )
        } else if (category == "relationship_health") {
            return(
                <div className='flex flex-row gap-1 text-gray-500 text-[13px] items-center mb-3'>
                    <Handshake className='text-cyan-400/80' size={20}/>
                    <p>Saúde da Relação</p>
                </div>
            )
        } else if (category == "financial_signal") {
            return(
                <div className='flex flex-row gap-1 text-gray-500 text-[13px] items-center mb-3'>
                    <PiggyBank className='text-amber-400/80' size={20}/>
                    <p>Alerta Financeiro</p>
                </div>
            )
        } else if (category == "growth") {
            return(
                <div className='flex flex-row gap-1 text-gray-500 text-[13px] items-center mb-3'>
                    <Rocket className='text-teal-400/80' size={20}/>
                    <p>Crescimento</p>
                </div>
            )
        } else if (category == "strategic_alert") {
            return(
                <div className='flex flex-row gap-1 text-gray-500 text-[13px] items-center mb-3'>
                    <MapPlus className='text-indigo-400/80' size={20}/>
                    <p>Alerta Estratégico</p>
                </div>
            )
        }
    }

    // const jiraTask = (jira: any) => {
    //     <h1></h1>
    // }

    const critico = (critic: string) => {
        if (critic == "high"){
            return(
                <p className='bg-orange-500/10 mb-3 p-1 px-2 w-fit text-[11px] text-orange-600 font-medium montserrat rounded-full'>
                    URGENTE
                </p>
            )
        } else if (critic == "medium"){
            return(
                <p className='bg-amber-500/10 mb-3 p-1 px-2 w-fit text-[11px] text-amber-600 font-medium montserrat rounded-full'>
                    MODERADO
                </p>
            )
        } else if (critic == "low"){
            return(
                <p className='bg-green-500/10 mb-3 p-1 px-2 w-fit text-[11px] text-green-600 font-medium montserrat rounded-full'>
                    OPCIONAL
                </p>
            )
        }
    }

    return (
        <section className='grid grid-cols-3 gap-4'>
            {insights.insights.prioritized.map((ins, index) => (
                <div key={index} className='bg-white inter p-6 border border-gray-100 rounded-xl text-sm'>
                    {critico(ins.criticality)}
                    <h1 className='text-gray-700 text-lg font-semibold mb-2 leading-tight'>{ins.title}</h1>
                    {rederIcon(ins.category)}
                    <p className='text-gray-400 text-xs'>{ins.description}</p>
                </div>
            ))}
        </section>


    )
}

// - churn_risk
// - upsell_opportunity  
// - competitor_threat
// - product_feedback
// - relationship_health
// - financial_signal
// - growth
// - strategic_alert