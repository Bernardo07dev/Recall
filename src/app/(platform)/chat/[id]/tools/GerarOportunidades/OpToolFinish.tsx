'use client';
import { Lightbulb, Target } from 'lucide-react';
import { getToolDisplayName } from '../../toolsname';

interface GenericToolFinishProps {
    toolName: string;
    msg: any;
}

export default function OpToolFinish({ toolName, msg }: GenericToolFinishProps) {
    const displayName = getToolDisplayName(toolName);
    
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
                parsedData = { avisoSistema: parsedData, oportunidades: [] };
            }
        } else {
            parsedData = rawOutput;
        }
    } catch (e) {
        console.error("Erro ao processar output da tool:", e);
        parsedData = { oportunidades: [] };
    }

    const oportunidades = parsedData?.oportunidades || [];

    console.log(parsedData)

    const getPriorityColor = (priority: string) => {
        const p = priority?.toLowerCase() || '';
        if (p === 'alta') return 'bg-red-50 text-red-600 border-red-100';
        if (p === 'média' || p === 'media') return 'bg-amber-50 text-amber-600 border-amber-100';
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    };

    return (
        <div className="flex flex-col w-full gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2">
            <span className={`flex items-center gap-1 text-sm no-underline mb-1`}>
                <img src="/RECALL-logo.svg" className="w-10 mr-0.5 object-contain group-hover:opacity-100 transition-all" alt="Recall Logo" />
                <span className="text-[11px] text-[#0c3a6f93] group-hover:text-[#1a3d65] transition-colors">{displayName}</span>
            </span>
            
            {oportunidades.length > 0 ? (
                <div className="relative w-full">
                    <div className="absolute -inset-0.5 rainbow-shadow rounded-3xl opacity-10"></div>
                    
                    <div className="relative bg-white rounded-3xl w-full flex flex-col overflow-hidden ">
                        <div className="flex justify-between items-center p-5 pb-4 border-b border-gray-50 bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-gray-800 text-[1.2rem]">Oportunidades Comerciais</h3>
                            </div>
                        </div>
                        
                        <div className="p-5 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {oportunidades.map((op: any, idx: number) => (
                                    <div key={idx} className="bg-blue-50/30 p-4 rounded-2xl border border-blue-100/50 flex flex-col gap-3 shadow-sm shadow-blue-100/10 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start gap-2">
                                            <h5 className="font-bold text-[0.85rem] text-gray-800 leading-tight">{op.titulo}</h5>
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border whitespace-nowrap ${getPriorityColor(op.nivel_prioridade)}`}>
                                                {op.nivel_prioridade}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Target size={12} className="text-[#1565C0] opacity-70" />
                                            <span className="text-[10px] font-semibold text-[#1565C0] uppercase tracking-wider">{op.setor}</span>
                                        </div>
                                        <p className="text-gray-500 text-[0.75rem] leading-relaxed">{op.descricao}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center gap-2">
                    <Lightbulb size={14} className="opacity-50" />
                    Não foi possível carregar as oportunidades.
                </div>
            )}
        </div>
    );
}
