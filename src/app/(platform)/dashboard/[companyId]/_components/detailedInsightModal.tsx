import { X, AlertTriangle, Lightbulb, Target } from 'lucide-react'
import { renderIcon } from './renderIcon'
import { renderCriticality } from './renderCriticality'
import { JiraTaskSuggestion } from './jiraTaskSuggestion'

interface DetailedInsightModalProps {
    activeInsight: any;
    setActiveInsight: (insight: any) => void;
}

export function DetailedInsightModal({ activeInsight, setActiveInsight }: DetailedInsightModalProps) {
    if (!activeInsight) return null;

    return (
        <div 
            className="fixed w-[40%] min-w-125 inset-y-0 right-0 z-50 flex items-center p-4 animate-in fade-in duration-200" 
            onClick={() => setActiveInsight(null)}
        >
            <div className="relative h-full w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
                {/* Shadow rainbow no fundo */}
                <div className="absolute -inset-0.5 rainbow-shadow rounded-4xl opacity-30"></div>
                
                {/* Conteúdo do modal */}
                <div className="relative bg-white rounded-4xl w-full h-full flex flex-col overflow-hidden animate-in slide-in-from-right-12 duration-300">
                <div className="flex justify-between items-start p-8 pb-3 border-b border-gray-100 shadow-md shadow-gray-100">
                    <div>
                        <h2 className="text-2xl mb-2 font-bold text-gray-800 leading-tight">{activeInsight.title}</h2>
                        <div className="flex items-center gap-3 font-medium">
                            {renderCriticality(activeInsight.criticality)}
                            {renderIcon(activeInsight.category)}
                        </div>
                    </div>
                    <button 
                        onClick={() => setActiveInsight(null)}
                        className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors shrink-0"
                    >
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>
            
                    <div className="p-8 overflow-y-auto flex-1 text-sm flex flex-col gap-8 inter bg-gray-50/30 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200-200/60 hover:[&::-webkit-scrollbar-thumb]:bg-gray-200/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                    <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100/50">
                        <p className="text-gray-800">
                            {activeInsight.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-6">
                            {activeInsight.recommended_action && (
                                <div className="border border-green-100 bg-green-50/50 p-6 rounded-2xl shadow-sm shadow-green-100/20">
                                    <div className="flex items-center gap-2 mb-3 text-green-700 font-semibold">
                                        <Lightbulb size={20} />
                                        <h3 className="text-base">Ação Recomendada</h3>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed">{activeInsight.recommended_action}</p>
                                </div>
                            )}

                            {activeInsight.affected_totvs_product && (
                                <div className="border border-blue-100 bg-white p-6 rounded-2xl shadow-sm shadow-blue-100/20">
                                    <div className="flex items-center gap-2 mb-3 text-[#1565C0] font-semibold">
                                        <Target size={20} />
                                        <h3 className="text-base">Produto Afetado</h3>
                                    </div>
                                    <p className="text-gray-600 font-medium">{activeInsight.affected_totvs_product}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-6 h-fit">
                            {activeInsight.source_excerpt && (
                                <div className="border border-orange-100 bg-orange-50/30 p-6 rounded-2xl h-full shadow-sm shadow-orange-100/20">
                                    <div className="flex items-center gap-2 mb-3 text-orange-700 font-semibold">
                                        <AlertTriangle size={20} />
                                        <h3 className="text-base">Trecho de Origem</h3>
                                    </div>
                                    <p className="text-gray-600 italic leading-relaxed">"{activeInsight.source_excerpt}"</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {activeInsight.jira_task_suggestion && (
                        <div className="pt-2 w-fit">
                            <h3 className="text-xs font-medium text-gray-400 mb-4 uppercase">Sugestão de Task para o Jira</h3>
                            <JiraTaskSuggestion jira={activeInsight.jira_task_suggestion} />
                        </div>
                    )}
                </div>
            </div>
            </div>
        </div>
    )
}
