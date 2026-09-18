import { BanknoteX, BadgeDollarSign, ShieldAlert, Megaphone, Handshake, PiggyBank, Rocket, MapPlus } from 'lucide-react';

export function renderIcon(category: string){
        if (category == "churn_risk") {
            return (
                <div className='flex flex-row gap-1 font-medium text-[#4585CD]/90  text-[0.75rem] items-center mb-3'>
                    <div className="bg-[#4585CD]/10 text-[#1b78e2] rounded-full px-1.5 py-1 flex items-center justify-center"><BanknoteX size={15}/></div>
                    <p>Risco de Churn</p>
                </div>
            )
        } else if (category == "upsell_opportunity") {
            return (
                <div className='flex flex-row gap-1 font-medium text-[#4585CD]/90 text-[0.75rem] items-center mb-3'>
                  <div className="bg-[#4585CD]/10 text-[#1b78e2] rounded-full px-1.5 py-1 flex items-center justify-center"><BadgeDollarSign size={15}/></div>
                  <p>Oportunidade de Upsell</p>
                </div>
            )
        } else if (category == "competitor_threat") {
            return(
                    <div className='flex flex-row gap-1 font-medium text-[#4585CD]/90 text-[0.75rem] items-center mb-3'>
                        <div className="bg-[#4585CD]/10 text-[#1b78e2] rounded-full px-1.5 py-1 flex items-center justify-center"><ShieldAlert size={15}/></div>
                        <p>Ameaça do Competidor</p>
                    </div>
            )
        } else if (category == "product_feedback") {
            return(
                <div className='flex flex-row gap-1 font-medium text-[#4585CD]/90 text-[0.75rem] items-center mb-3'>
                    <div className="bg-[#4585CD]/10 text-[#1b78e2] rounded-full px-1.5 py-1 flex items-center justify-center"><Megaphone size={15}/></div>
                    <p>Feedback do Produto</p>
                </div>
            )
        } else if (category == "relationship_health") {
            return(
                    <div className='flex flex-row gap-1 font-medium text-[#4585CD]/90 text-[0.75rem] items-center mb-3'>
                        <div className="bg-[#4585CD]/10 text-[#1b78e2] rounded-full px-1.5 py-1 flex items-center justify-center"><Handshake size={15}/></div>
                        <p>Saúde da Relação</p>
                    </div>
            )
        } else if (category == "financial_signal") {
            return(
                <div className='flex flex-row gap-1 font-medium text-[#4585CD]/90 text-[0.75rem] items-center mb-3'>
                    <div className="bg-[#4585CD]/10 text-[#1b78e2] rounded-full px-1.5 py-1 flex items-center justify-center"><PiggyBank size={15}/></div>
                    <p>Alerta Financeiro</p>
                </div>
            )
        } else if (category == "growth") {
            return(
                <div className='flex flex-row gap-1 font-medium text-[#4585CD]/90 text-[0.75rem] items-center mb-3'>
                    <div className="bg-[#4585CD]/10 text-[#1b78e2] rounded-full px-1.5 py-1 flex items-center justify-center"><Rocket size={15}/></div>
                    <p>Crescimento</p>
                </div>
            )
        } else if (category == "strategic_alert") {
            return(
                <div className='flex flex-row gap-1 font-medium text-[#4585CD]/90 text-[0.75rem] items-center mb-3'>
                    <div className="bg-[#4585CD]/10 text-[#1b78e2] rounded-full px-1.5 py-1 flex items-center justify-center"><MapPlus size={15}/></div>
                    <p>Alerta Estratégico</p>
                </div>
            )
        }
    }