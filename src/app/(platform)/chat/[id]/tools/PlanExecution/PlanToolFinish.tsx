'use client';
import { ListTodo, CheckCircle2, ArrowRight } from 'lucide-react';
import { getToolDisplayName } from '../../toolsname';

interface GenericToolFinishProps {
    toolName: string;
    msg: any;
}

export default function PlanToolFinish({ toolName, msg }: GenericToolFinishProps) {
    const displayName = getToolDisplayName(toolName);

    const handleAdicionarInsight = (title: string, text?: string, icon: string = 'ListTodo') => {
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
                parsedData = { avisoSistema: parsedData, plano: [] };
            }
        } else {
            parsedData = rawOutput;
        }
    } catch (e) {
        console.error("Erro ao processar output da tool de plano de execução:", e);
        parsedData = { plano: [] };
    }

    const plano = parsedData?.plano || parsedData?.planExecution || parsedData?.steps || [];

    return (
        <div className="flex flex-col w-full gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2">
            <span className={`flex items-center gap-1 text-sm no-underline mb-4`}>
                <img src="/RECALL-logo.svg" className="w-10 mr-0.5 object-contain group-hover:opacity-100 transition-all" alt="Recall Logo" />
                <span className="text-[11px] text-[#0c3a6f93] group-hover:text-[#1a3d65] transition-colors">{displayName}</span>
            </span>
            
            {plano.length > 0 ? (
                <div className="relative w-full">      
                    <div className="relative w-full flex flex-col">
                        <div className="flex flex-col gap-0">
                            {plano.map((item: any, idx: number) => {
                                const stepNum = item.stepnumber ?? (idx + 1);
                                const rawTitle = item.tittle || item.title || `Etapa ${stepNum}`;
                                const cleanTitle = rawTitle.replace(/^\d+[\s\.\-]+/, '').trim() || rawTitle;
                                const titleText = cleanTitle;
                                const titleFormatted = `${stepNum} - ${cleanTitle}`;
                                const isLast = idx === plano.length - 1;
                                
                                return (
                                    <div 
                                        onClick={() => handleAdicionarInsight(titleFormatted, item.description || item.action, 'ListTodo')} 
                                        key={idx} 
                                        className="cursor-pointer group flex flex-row items-stretch"
                                    >
                                        {/* Timeline column */}
                                        <div className="relative flex flex-col items-center flex-shrink-0 w-10">
                                            <div className="w-[35px] h-[35px] rounded-full bg-[#f0f4f8] border border-[#d8e2ed] text-[#3b6b9a] font-semibold text-[0.9rem] flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:bg-[#1565C0] group-hover:text-white group-hover:border-[#1565C0] group-hover:shadow-md">
                                                {stepNum}
                                            </div>
                                            {!isLast && (
                                                <div className="flex-1 w-px border-l border-dashed border-[#d0dae5] my-1" />
                                            )}
                                        </div>

                                        {/* Content column */}
                                        <div className={`flex flex-col ml-4 ${isLast ? 'pb-0' : 'pb-8'} pt-[3px] flex-1 min-w-0`}>
                                            <h5 className="font-semibold text-[0.875rem] text-[#1a2b3c] leading-snug group-hover:text-[#1565C0] transition-colors duration-200">
                                                {titleText}
                                            </h5>

                                            {item.action && (
                                                <span className="text-[0.78rem] text-[#5a7a96] mt-1.5 leading-relaxed">
                                                    {item.action}
                                                </span>
                                            )}

                                            {/* {item.description && (
                                                <p className="text-[#8a9bae] text-[0.75rem] leading-relaxed mt-1.5">
                                                    {item.description}
                                                </p>
                                            )} */}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center gap-2">
                    <ListTodo size={14} className="opacity-50 text-[#1565C0]" />
                    Não foi possível carregar o plano de execução.
                </div>
            )}
        </div>
    );
}
