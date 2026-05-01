import { BanknoteX, BadgeDollarSign, ShieldAlert, Megaphone, Handshake, PiggyBank, Rocket, MapPlus } from 'lucide-react';

export function renderIcon(category: string){
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