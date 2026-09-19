"use client";
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { getToolDisplayName } from '../toolsname';
import ToolContent from './toolContent';

export default function ToolMessageBlock({ msg, toolName }: { msg: any, toolName?: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <span className="not-prose block my-1 ">
            <span className="flex flex-col">
                <span 
                    className="text-[11px] font-medium flex items-center gap-1 cursor-pointer group py-1 w-fit"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <img src="/RECALL-logo.svg" className="w-10 mr-0.5 object-contain group-hover:opacity-100 transition-all" alt="Recall Logo" />
                    <span className="text-[#0c3a6f93] group-hover:text-[#1a3d65] transition-colors">
                        {getToolDisplayName(toolName || msg.toolMetadata?.name || "Desconhecida")}
                    </span>
                    <span className="text-gray-400 group-hover:text-[#1a3d65] transition-colors mt-[1px]">
                        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                </span>
                {isOpen && (
                    <span className="flex w-full">
                        <span className="flex-1 w-full">
                            <ToolContent content={msg.toolMetadata?.output?.kwargs?.content || msg.toolMetadata?.output} />
                        </span>
                    </span>
                )}
            </span>
        </span>
    );
}
