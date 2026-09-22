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
                <div className="relative w-full">
                    <div className="absolute -inset-0.5 rainbow-shadow rounded-3xl opacity-10"></div>
                    
                    <div className="relative bg-white rounded-3xl w-full flex flex-col overflow-hidden ">
                        <div className="flex justify-between items-center p-5 pb-4 border-b border-gray-100/80 bg-gray-50/40">
                            <h3 className="font-semibold text-gray-800 text-[1.15rem] tracking-tight">
                                {companyData.nome || 'Relatório de Inteligência da Empresa'}
                            </h3>
                            <button
                                onClick={() => router.push(`/dashboard/${companyData.id}`)}
                                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 text-xs font-semibold shadow-rainbow hover:border-gray-200 transition-all duration-150 cursor-pointer"
                            >
                                <span>Ver Dashboard</span>
                                <ArrowUpRight size={13} className="text-gray-400 group-hover:text-gray-700 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </button>
                        </div>
                        
                        <div className="p-5 flex flex-col gap-6 bg-white">
                            {companyData.indicators && (
                                <div>
                                    <h4 className="text-[0.7rem] font-bold text-gray-400 mb-3 uppercase tracking-widest">Indicadores Principais</h4>
                                    <IndicatorsToolsContainer indicators={companyData.indicators} />
                                </div>
                            )}

                            {companyData.insights?.prioritized && companyData.insights.prioritized.length > 0 && (
                                <div>
                                    <h4 className="text-[0.7rem] font-bold text-gray-400 mb-3 uppercase tracking-widest">Top Insights</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {companyData.insights.prioritized.slice(0, 4).map((insight: any, idx: number) => (
                                            <div key={idx} className="bg-blue-50/30 p-4 rounded-2xl border border-blue-100/50 flex flex-col gap-2 shadow-sm shadow-blue-100/10 hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start gap-2">
                                                    <h5 className="font-bold text-[0.85rem] text-gray-800 leading-tight">{insight.title}</h5>
                                                    <div className="flex-shrink-0 scale-90 origin-top-right -mt-1 -mr-1">
                                                        {renderCriticality(insight.criticality)}
                                                    </div>
                                                </div>
                                                <p className="text-gray-500 text-[0.75rem] leading-relaxed mt-1">{insight.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center gap-2">
                    <BarChart3 size={14} className="opacity-50" />
                    Não foi possível carregar o relatório visual.
                </div>
            )}
        </div>
    );
}
