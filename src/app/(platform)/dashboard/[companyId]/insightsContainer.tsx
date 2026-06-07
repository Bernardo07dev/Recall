"use client" 
import { InsightOutput } from '@/src/lib/langchain/utils'
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { renderIcon } from './_components/renderIcon'
import { renderCriticality } from './_components/renderCriticality'
import { JiraTaskSuggestion } from './_components/jiraTaskSuggestion'
import { useState } from 'react';
import { DetailedInsightModal } from './_components/detailedInsightModal';

interface Props {
    insights: InsightOutput;
}

export default function InsightsContainer({ insights }: Props) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ 
        loop: false,
        align: 'start'
    })
    const [activeInsight, setActiveInsight] = useState<any>(null);

    const totalInsights = insights.insights.prioritized.length;

    return (
        <div className="flex flex-col gap-2 mb-6">
            <div className="flex items-center gap-1">
                <h2 className="text-gray-400 text-[10px] font-semibold uppercase tracking-wide inter">
                    Insights Prioritizados
                </h2>
                <span className="bg-[#1565C0]/10 flex items-center justify-center text-[#1565C0] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {totalInsights}
                </span>
            </div>

            {totalInsights <= 3 ? (
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className='flex gap-4 py-2'>
                        {insights.insights.prioritized.map((ins, index) => (
                            <div 
                                key={index} 
                                onClick={() => setActiveInsight(ins)}
                                className={`bg-white inter flex-none w-[calc(33.33%-11px)] p-6 border border-[#167df3]/10 rounded-3xl text-sm shadow-sm shadow-[#398ded]/10 cursor-pointer hover:border-[#1565C0]/30 transition-all hover:shadow-md ${!ins.jira_task_suggestion ? 'h-fit' : ''}`}
                            >
                                {renderCriticality(ins.criticality)}
                                <h1 className='text-gray-700 text-[16px] font-semibold mb-2 leading-tight'>{ins.title}</h1>
                                {renderIcon(ins.category)}
                                <p className='text-gray-400 text-xs font-light'>{ins.description}</p>
                                {/* {ins.jira_task_suggestion && (<JiraTaskSuggestion jira={ins.jira_task_suggestion} />)} */}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
            <div className="relative">
                <button
                    onClick={() => emblaApi?.scrollPrev()}
                    className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-white/1 backdrop-blur-xs cursor-pointer border border-gray-100 rounded-full p-1.5 shadow-sm shadow-[#398ded]/50 hover:bg-[#f7faff] transition-all active:scale-90"
                >
                    <ChevronLeft size={18} className="text-[#1565C0]" />
                </button>

                <div className="overflow-hidden" ref={emblaRef}>
                    <div className='flex gap-4 py-2'>
                        {insights.insights.prioritized.map((ins, index) => (
                            <div 
                                key={index} 
                                onClick={() => setActiveInsight(ins)}
                                className={`bg-white inter flex-none w-[calc(33.3%-11px)] p-6 border border-[#167df3]/10 rounded-3xl text-sm shadow-sm shadow-[#398ded]/10 cursor-pointer hover:border-[#1565C0]/30 transition-all hover:shadow-md ${!ins.jira_task_suggestion ? 'h-fit' : ''}`}
                            >
                                {renderCriticality(ins.criticality)}
                                <h1 className='text-gray-700 text-[16px] font-semibold mb-2 leading-tight'>{ins.title}</h1>
                                {renderIcon(ins.category)}
                                <p className='text-gray-400 text-[0.7rem]'>{ins.description}</p>
                                {/* {ins.jira_task_suggestion && (
                                    <JiraTaskSuggestion jira={ins.jira_task_suggestion} />
                                )} */}
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => emblaApi?.scrollNext()}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-white/1 backdrop-blur-xs cursor-pointer border border-gray-100 rounded-full p-1.5 shadow-sm shadow-[#398ded]/50 hover:bg-gray-50 transition-all active:scale-90"
                >
                    <ChevronRight size={18} className="text-[#1565C0]" />
                </button>
            </div>)}

            <DetailedInsightModal activeInsight={activeInsight} setActiveInsight={setActiveInsight} />
        </div>
    )
}
