'use client';
import { Map, Smile, Frown, Meh, Minus } from 'lucide-react';
import { getToolDisplayName } from '../../toolsname';

interface GenericToolFinishProps {
    toolName: string;
    msg: any;
}

export default function MapeamentoToolFinish({ toolName, msg }: GenericToolFinishProps) {
    const displayName = getToolDisplayName(toolName);

    const handleAdicionarInsight = (title: string, text?: string, icon: string = 'Map') => {
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
                parsedData = { avisoSistema: parsedData, produtos: [] };
            }
        } else {
            parsedData = rawOutput;
        }
    } catch (e) {
        console.error("Erro ao processar output da tool de mapeamento:", e);
        parsedData = { produtos: [] };
    }

    const produtos = parsedData?.produtos || parsedData?.mapeamento || [];

    const getStatusBadge = (status: string) => {
        const s = status?.toLowerCase() || '';
        if (s.includes('ativo') || s.includes('active')) {
            return {
                badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                border: 'border-emerald-200 hover:border-emerald-300',
                shadow: 'shadow-green'
            };
        }
        if (s.includes('oportunidade') || s.includes('opportunity')) {
            return {
                badge: 'bg-blue-50 text-blue-700 border-blue-200',
                border: 'border-blue-200 hover:border-blue-300',
                shadow: 'shadow-blue'
            };
        }
        if (s.includes('risco') || s.includes('risk')) {
            return {
                badge: 'bg-amber-50 text-amber-700 border-amber-200',
                border: 'border-amber-200 hover:border-amber-300',
                shadow: 'shadow-yellow'
            };
        }
        return {
            badge: 'bg-rose-50 text-rose-700 border-rose-200',
            border: 'border-red-200 hover:border-red-300',
            shadow: 'shadow-red'
        };
    };

    const renderSatisfaction = (satisfaction?: string) => {
        const s = satisfaction?.toLowerCase() || '';
        if (s.includes('positiv')) {
            return (
                <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50/70 px-2 py-0.5 rounded-full border border-emerald-100" title="Sentimento Positivo">
                    <Smile size={12} />
                    <span>Positivo</span>
                </div>
            );
        }
        if (s.includes('negativ')) {
            return (
                <div className="flex items-center gap-1 text-[11px] font-medium text-rose-600 bg-rose-50/70 px-2 py-0.5 rounded-full border border-rose-100" title="Sentimento Negativo">
                    <Frown size={12} />
                    <span>Negativo</span>
                </div>
            );
        }
        if (s.includes('mist')) {
            return (
                <div className="flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50/70 px-2 py-0.5 rounded-full border border-amber-100" title="Sentimento Misto">
                    <Meh size={12} />
                    <span>Misto</span>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-50/70 px-2 py-0.5 rounded-full border border-slate-200" title="Sentimento Neutro">
                <Minus size={12} />
                <span>Neutro</span>
            </div>
        );
    };

    return (
        <div className="flex flex-col w-full gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2">
            <span className={`flex items-center gap-1 text-sm no-underline mb-1`}>
                <img src="/RECALL-logo.svg" className="w-10 mr-0.5 object-contain group-hover:opacity-100 transition-all" alt="Recall Logo" />
                <span className="text-[11px] text-[#0c3a6f93] group-hover:text-[#1a3d65] transition-colors">{displayName}</span>
            </span>
            
            {produtos.length > 0 ? (
                <div className="relative w-full">
                    <div className="absolute -inset-0.5 rainbow-shadow rounded-3xl opacity-10"></div>
                    
                    <div className="relative bg-white/60 rounded-3xl w-full flex flex-col overflow-hidden ">
                        <div className="flex justify-between items-center p-5 pb-4 border-b border-gray-50 bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <Map size={28} className="bg-[#D1FFE5] text-[#25751D] p-[6px] rounded-lg " />
                                <h3 className="font-bold text-gray-800 text-[1rem]">Mapeamento de Produtos TOTVS</h3>
                            </div>
                        </div>
                        
                        <div className="p-4 bg-white/100 ">
                            <div className="flex flex-col gap-3">
                                {produtos.map((item: any, idx: number) => {
                                    const style = getStatusBadge(item.status);
                                    return (
                                        <div 
                                            onClick={() => handleAdicionarInsight(item.produto, item.detalhes, 'Map')} 
                                            key={idx} 
                                            className={`bg-emerald-50/20 hover:bg-emerald-50/30 cursor-pointer p-3 px-4 w-full rounded-xl ${style.border} ${style.shadow} flex flex-col gap-1.5 transition-all`}
                                        >
                                            <div className="flex flex-row items-center justify-between gap-2">
                                                <div className="flex flex-row items-center gap-2">
                                                    <h5 className="font-semibold text-[0.85rem] text-gray-800 leading-tight">{item.produto}</h5>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${style.badge}`}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    {renderSatisfaction(item.satisfacao)}
                                                </div>
                                            </div>
                                            {item.detalhes && (
                                                <p className="text-gray-500 text-[0.75rem] leading-relaxed">{item.detalhes}</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center gap-2">
                    <Map size={14} className="opacity-50 text-emerald-600" />
                    Não foi possível carregar o mapeamento de produtos.
                </div>
            )}
        </div>
    );
}
