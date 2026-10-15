'use client';
import { useRouter } from 'next/navigation';
import { Bot, BarChart3, ArrowUpRight } from 'lucide-react';
import { getToolDisplayName } from '../../toolsname';
import IndicatorsToolsContainer from './components/indicatorsToolsContainer';
import { renderCriticality } from '../../../../dashboard/[companyId]/_components/renderCriticality';

interface GenericToolFinishProps {
    toolName: string;
    msg: any;
}

export default function BuscaToolFinish({ toolName, msg }: GenericToolFinishProps) {
    const router = useRouter();
    const displayName = getToolDisplayName(toolName);

    const handleAdicionarInsight = (title: string, text?: string, icon: string = 'ChartBar') => {
        window.dispatchEvent(new CustomEvent('add-insight', {
            detail: {
                title: title,
                text: text,
                icon: icon
            }
        }));
    };
    
    let parsedData: any = null;
    try {
        let rawOutput = msg?.toolMetadata?.output;
        console.log(rawOutput)
        
        // Handle Langchain ToolMessage format
        if (rawOutput && typeof rawOutput === 'object' && rawOutput.kwargs?.content) {
            rawOutput = rawOutput.kwargs.content;
        }

        parsedData = typeof rawOutput === 'string' ? JSON.parse(rawOutput) : rawOutput;
        console.log("Parsed Data:", parsedData);
    } catch (e) {
        console.error("Erro ao parsear output da tool:", e);
    }

    const companyData = parsedData?.dados_empresa;

    return (
        <div className="flex flex-col w-full gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2">
            <span className={`flex items-center gap-1 text-sm no-underline mb-1`}>
                <img src="/RECALL-logo.svg" className="w-10 mr-0.5 object-contain group-hover:opacity-100 transition-all" alt="Recall Logo" />
                <span className="text-[11px] text-[#0c3a6f93] group-hover:text-[#1a3d65] transition-colors">{displayName}</span>
            </span>
            
            {companyData ? (
                <div className="w-full flex flex-col gap-4.5 pt-0.5">
                    {/* Header Flutuante */}
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-2.5">
                            <h3 className="font-semibold text-gray-800 text-[1.05rem] tracking-tight">
                                {companyData.nome || 'Relatório de Inteligência da Empresa'}
                            </h3>
                            {companyData.industry && (
                                <span className="text-[0.68rem] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                                    {companyData.industry}
                                </span>
                            )}
                        </div>
                        <a
                            href={`/dashboard/${companyData.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-1.5 p-2 px-4 rounded-xl border border-gray-200 bg-white/80 hover:bg-white text-gray-600 hover:text-gray-900 text-[0.7rem] font-semibold hover:shadow-sm hover:border-gray-300 transition-all duration-200 cursor-pointer"
                        >
                            <span>Ver Dashboard</span>
                            <ArrowUpRight size={13} className="text-gray-400 group-hover:text-gray-700 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                    </div>

                    {/* Indicadores Principais Flutuantes */}
                    {companyData.indicators && (
                        <div className="w-full">
                            <h4 className="text-[0.64rem] font-medium text-gray-400 mb-2 uppercase tracking-wider">
                                Indicadores Principais
                            </h4>
                            <IndicatorsToolsContainer indicators={companyData.indicators} />
                        </div>
                    )}

                    {/* Top Insights Flutuantes */}
                    {companyData.insights?.prioritized && companyData.insights.prioritized.length > 0 && (
                        <div className="w-full">
                            <h4 className="text-[0.64rem] font-medium text-gray-400 mb-2 uppercase tracking-wider">
                                Top Insights
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {companyData.insights.prioritized.slice(0, 4).map((insight: any, idx: number) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleAdicionarInsight(insight.title, insight.description, "Sparkles")}
                                        className="group bg-gradient-to-br from-white via-white/95 to-blue-50/20 border border-gray-100 hover:border-blue-200/70 p-6 rounded-2xl cursor-pointer flex flex-col justify-start gap-1 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_6px_18px_-4px_rgba(37,99,235,0.08)] hover:-translate-y-0.5 transition-all duration-200"
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <h5 className="font-semibold text-[0.83rem] text-neutral-700 group-hover:text-neutral-900 leading-tight transition-colors !m-0">
                                                {insight.title}
                                            </h5>
                                            <div className="flex-shrink-0 scale-90 origin-top-right -mt-0.5 -mr-0.5 [&_p]:!m-0 [&_p]:!mb-0">
                                                {renderCriticality(insight.criticality)}
                                            </div>
                                        </div>
                                        <p className="text-neutral-400 group-hover:text-neutral-500 text-[0.73rem] leading-snug transition-colors !m-0 !mt-0.5">
                                            {insight.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                    <div className="text-xs text-gray-400 bg-gray-50/80 p-3 rounded-xl border border-gray-100 flex items-center gap-2">
                    <BarChart3 size={14} className="opacity-50" />
                    Não foi possível carregar o relatório visual.
                </div>
            )}
        </div>
    );
}
