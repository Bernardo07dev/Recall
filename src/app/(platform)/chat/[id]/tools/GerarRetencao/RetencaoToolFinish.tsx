'use client';
import { ShieldAlert, AlertTriangle, NotebookText } from 'lucide-react';
import { getToolDisplayName } from '../../toolsname';

interface GenericToolFinishProps {
    toolName: string;
    msg: any;
}

export default function RetencaoToolFinish({ toolName, msg }: GenericToolFinishProps) {
    const displayName = getToolDisplayName(toolName);

    const handleAdicionarInsight = (title: string, text?: string, icon: string = 'NotebookText') => {
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
        
        if (rawOutput && typeof rawOutput === 'object' && rawOutput.kwargs?.content) {
            rawOutput = rawOutput.kwargs.content;
        }

        if (typeof rawOutput === 'string') {
            let current = rawOutput;
            while (typeof current === 'string') {
                try {
                    const parsed = JSON.parse(current);
                    if (parsed === current) break;
                    current = parsed;
                } catch (e) {
                    break;
                }
            }
            parsedData = current;
            
            if (typeof parsedData === 'string') {
                parsedData = { avisoSistema: parsedData, alertas: [] };
            }
        } else {
            parsedData = rawOutput;
        }
    } catch (e) {
        console.error("Erro ao processar output da tool de retenção:", e);
        parsedData = { alertas: [] };
    }

    const alertas = parsedData?.alertas || parsedData?.retencao || [];

    const getPriorityColor = (priority: string) => {
        const p = priority?.toLowerCase() || '';
        if (p.includes('alta') || p.includes('alto') || p.includes('crít') || p.includes('crit')) return 'bg-red-50 text-red-600 border-red-100';
        if (p.includes('méd') || p.includes('med')) return 'bg-amber-50 text-amber-600 border-amber-100';
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    };

    const getPriorityBorder = (priority: string) => {
        const p = priority?.toLowerCase() || '';
        if (p.includes('alta') || p.includes('alto') || p.includes('crít') || p.includes('crit')) return 'border-red-200 hover:border-red-300';
        if (p.includes('méd') || p.includes('med')) return 'border-amber-200 hover:border-amber-300';
        return 'border-emerald-200 hover:border-emerald-300';
    };

    const getPriorityShadow = (priority: string) => {
        const p = priority?.toLowerCase() || '';
        if (p.includes('alta') || p.includes('alto') || p.includes('crít') || p.includes('crit')) return 'shadow-red';
        if (p.includes('méd') || p.includes('med')) return 'shadow-yellow';
        return 'shadow-green';
    };

    return (
        <div className="flex flex-col w-full gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2">
            <span className={`flex items-center gap-1 text-sm no-underline mb-1`}>
                <img src="/RECALL-logo.svg" className="w-10 mr-0.5 object-contain group-hover:opacity-100 transition-all" alt="Recall Logo" />
                <span className="text-[11px] text-[#0c3a6f93] group-hover:text-[#1a3d65] transition-colors">{displayName}</span>
            </span>
            
            {alertas.length > 0 ? (
                <div className="relative w-full">
                    <div className="absolute -inset-0.5 rainbow-shadow rounded-3xl opacity-10"></div>
                    
                    <div className="relative bg-white/60 rounded-3xl w-full flex flex-col overflow-hidden ">
                        <div className="flex justify-between items-center p-5 pb-4 border-b border-gray-50 bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <NotebookText size={28} className="bg-[#FEF2F2] text-[#DC2626] p-[6px] rounded-lg " />
                                <h3 className="font-bold text-gray-800 text-[1rem]">Alertas de Retenção & Churn</h3>
                            </div>
                        </div>
                        
                        <div className="p-4 bg-white/100 ">
                            <div className="flex flex-col gap-3">
                                {alertas.map((item: any, idx: number) => (
                                    <div 
                                        onClick={() => handleAdicionarInsight(item.titulo, item.descricao, 'NotebookText')} 
                                        key={idx} 
                                        className={`bg-blue-50/30 cursor-pointer p-3 px-4 w-full rounded-xl ${getPriorityBorder(item.nivel_prioridade)} ${getPriorityShadow(item.nivel_prioridade)} flex flex-row items-baseline justify-between gap-2 transition-all`}
                                    >
                                        <div className="flex flex-row items-end gap-2">
                                            <h5 className="font-semibold text-[0.80rem] text-gray-800 leading-tight">{item.titulo}</h5>
                                            <span className="text-[0.60rem] font-bold text-[#1565C0]/80 uppercase">{item.setor}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border whitespace-nowrap ${getPriorityColor(item.nivel_prioridade)}`}>
                                                {item.nivel_prioridade}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center gap-2">
                    <AlertTriangle size={14} className="opacity-50 text-amber-500" />
                    Não foi possível carregar os alertas de retenção.
                </div>
            )}
        </div>
    );
}
