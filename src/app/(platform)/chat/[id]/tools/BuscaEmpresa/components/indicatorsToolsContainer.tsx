import { InsightOutput } from '@/src/lib/langchain/utils'
import { ShieldAlert, TrendingUp, Swords, Heart } from 'lucide-react'

interface Props {
    indicators: InsightOutput['indicators']
}

export default function IndicatorsContainer({ indicators }: Props) {

    const getChurnColor = (value: number) => {
        if (value >= 70) return { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', label: 'Crítico' }
        if (value >= 40) return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', label: 'Moderado' }
        return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', label: 'Baixo' }
    }

    const getUpsellColor = (value: number) => {
        if (value >= 70) return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', label: 'Alto' }
        if (value >= 40) return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', label: 'Moderado' }
        return { text: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-100', label: 'Baixo' }
    }

    const getThreatColor = (value: string) => {
        const map: Record<string, { text: string; bg: string; border: string }> = {
            'CRÍTICO': { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
            'ALTO': { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
            'MÉDIO': { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
            'BAIXO': { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        }
        return map[value] || map['BAIXO']
    }

    const churn = getChurnColor(indicators.churn_risk)
    const upsell = getUpsellColor(indicators.upsell_score)
    const threat = getThreatColor(indicators.competitor_threat)

    return (
        <div className="grid grid-cols-3 gap-4">
            {/* Churn Risk */}
            <div className={`bg-white shadow-rainbow ${churn.border}  rounded-2xl p-3 px-5 inter`}>
                <span className="text-[0.60rem] font-semibold uppercase text-gray-400">
                    Churn Risk
                </span>
                <div className='flex flex-row items-center mt-1 gap-2'>
                    <div className="flex items-center gap-2 mb-1">
                        <div className={`${churn.bg} p-1.5 rounded-lg`}>
                            <ShieldAlert size={14} className={churn.text} />
                        </div>
                    </div>
                    <div className='flex flex-row gap-2 items-end'>
                        <p className={`text-2xl font-bold ${churn.text} tracking-tight`}>{indicators.churn_risk}</p>
                        <p className={`text-[11px] font-medium mb-1 ${churn.text} opacity-60`}>{churn.label}</p>
                    </div>
                </div>
            </div>

            {/* Upsell Score */}
            <div className={`bg-white shadow-rainbow ${upsell.border}  rounded-2xl p-3 px-5 inter`}>
                <span className="text-[0.60rem] font-semibold uppercase text-gray-400">
                    Upsell Score
                </span>
                <div className='flex flex-row items-center mt-1 gap-2'>
                    <div className="flex items-center gap-2 mb-1">
                        <div className={`${upsell.bg} p-1.5 rounded-lg`}>
                            <TrendingUp size={14} className={upsell.text} />
                        </div>
                    </div>
                    <div className='flex flex-row gap-2 items-end'>
                        <p className={`text-2xl font-bold ${upsell.text} tracking-tight`}>{indicators.upsell_score}</p>
                        <p className={`text-[11px] font-medium mb-1 ${upsell.text} opacity-60`}>{upsell.label}</p>
                    </div>
                </div>
            </div>

            {/* Competitor Threat */}
            <div className={`bg-white shadow-rainbow ${threat.border}  rounded-2xl p-3 px-5 inter`}>
                <span className="text-[0.60rem] font-semibold uppercase text-gray-400">
                    Competidores
                </span>
                <div className='flex flex-row items-center mt-1 gap-2'>
                    <div className="flex items-center gap-2 mb-1">
                        <div className={`${threat.bg} p-1.5 rounded-lg`}>
                            <Swords size={14} className={threat.text} />
                        </div>
                    </div>
                    <div className='flex flex-row gap-2 items-end'>
                        <p className={`text-lg font-bold ${threat.text} tracking-tight`}>{indicators.competitor_threat}</p>
                    </div>
                </div>
            </div>

            {/* Sentiment Overall
            <div className="bg-[#EFF6FF] border border-[#1565C0]/10 rounded-2xl p-6 inter">
                <div className="flex items-center mb-3">
                    <div className="bg-[#EFF6FF] pr-2 rounded-xl">
                        <Heart size={16} className="text-[#1565C0]" />
                    </div>
                    <span className="text-[11px] uppercase text-gray-400">
                        Sentimento Geral
                    </span>
                </div>
                <p className="font-semibold text-sm text-[#1565C0] leading-tight">{indicators.sentiment_overall}</p>
            </div> */}
        </div>
    )
}
