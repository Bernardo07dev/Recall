'use client';
import { ListTodo } from 'lucide-react';
import { ThinkingOrb } from 'thinking-orbs';
import { getToolDisplayName } from '../../toolsname';

interface GenericToolLoadingProps {
    toolName: string;
    showTool: boolean;
}

export default function PlanToolLoading({ toolName, showTool }: GenericToolLoadingProps) {
    const displayName = getToolDisplayName(toolName);

    return (
        <span className="flex flex-col w-fit">
            <span className={`flex items-center gap-2 text-sm no-underline ${showTool ? "animate-pulse" : ""}`}>
                <span className="w-5 h-5 flex items-center justify-center shrink-0">
                    {showTool ? (
                        <ThinkingOrb state="composing" size={20} />
                    ) : (
                        <ListTodo className="text-[#0c3a6f71]/40" size={15} />
                    )}
                </span>
                <span className="text-[11px] text-[#0c3a6f71]/39 font-medium">
                    Estruturando Plano de Ação e Execução
                </span>
            </span>
            {!showTool && (
                <span className="w-[1.5px] h-3 my-1 bg-gradient-to-b from-gray-100 to-[#1565C0]/40 rounded-full ml-[9px]" />
            )}
        </span>
    );
}
