import { BanknoteX, BadgeDollarSign, ShieldAlert, Megaphone, Handshake, PiggyBank, Rocket, MapPlus } from 'lucide-react';

export function renderIcon(category: string){
        if (category == "churn_risk") {
            return (
                <div className='flex flex-row gap-1 text-gray-500  text-[0.8rem] items-center mb-3'>
                    <BanknoteX className='text-[#4585CD]' size={18}/>
                    <p>Risco de Churn</p>
                </div>
            )
        } else if (category == "upsell_opportunity") {
            return (
                <div className='flex flex-row gap-1 text-gray-500  text-[0.8rem] items-center mb-3'>
                    <BadgeDollarSign className='text-[#4585CD]' size={18}/>
                    <p>Oportunidade de Upsell</p>
                </div>
            )
        } else if (category == "competitor_threat") {
            return(
                <div className='flex flex-row gap-1 text-gray-500  text-[0.8rem] items-center mb-3'>
                    <ShieldAlert className='text-[#4585CD]' size={18}/>
                    <p>Ameaça do Competidor</p>
                </div>
            )
        } else if (category == "product_feedback") {
            return(
                <div className='flex flex-row gap-1 text-gray-500  text-[0.8rem] items-center mb-3'>
                    <Megaphone className='text-[#4585CD]' size={18}/>
                    <p>Feedback do Produto</p>
                </div>
            )
        } else if (category == "relationship_health") {
            return(
                <div className='flex flex-row gap-1 text-gray-500  text-[0.8rem] items-center mb-3'>
                    <Handshake className='text-[#4585CD]' size={18}/>
                    <p>Saúde da Relação</p>
                </div>
            )
        } else if (category == "financial_signal") {
            return(
                <div className='flex flex-row gap-1 text-gray-500  text-[0.8rem] items-center mb-3'>
                    <PiggyBank className='text-[#4585CD]' size={18}/>
                    <p>Alerta Financeiro</p>
                </div>
            )
        } else if (category == "growth") {
            return(
                <div className='flex flex-row gap-1 text-gray-500  text-[0.8rem] items-center mb-3'>
                    <Rocket className='text-[#4585CD]' size={18}/>
                    <p>Crescimento</p>
                </div>
            )
        } else if (category == "strategic_alert") {
            return(
                <div className='flex flex-row gap-1 text-gray-500  text-[0.8rem] items-center mb-3'>
                    <MapPlus className='text-[#4585CD]' size={18}/>
                    <p>Alerta Estratégico</p>
                </div>
            )
        }
    }