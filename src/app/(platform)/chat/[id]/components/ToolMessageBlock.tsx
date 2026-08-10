"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { getToolDisplayName } from '../toolsname';
import ToolContent from './toolContent';

export default function ToolMessageBlock({ msg }: { msg: any }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-[-35px] flex flex-col">
            <div 
                className="text-[11px] font-medium flex items-center gap-2 cursor-pointer group py-1 w-fit"
                onClick={() => setIsOpen(!isOpen)}
            >
                <img src="/RECALL-logo.svg" className="w-10 object-contain group-hover:opacity-100 transition-all" alt="Recall Logo" />
                <span className="text-[#0c3a6f93] group-hover:text-[#1a3d65] transition-colors">
                    {getToolDisplayName(msg.toolMetadata?.name || "Desconhecida")}
                </span>
                <div className="text-gray-400 group-hover:text-[#1a3d65] transition-colors ml-0.5 mt-[1px]">
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </div>
            </div>
            {isOpen && (
                <div className="flex w-full mt-1">
                    <div className="flex-1 w-full">
                        <ToolContent content={msg.toolMetadata?.output?.kwargs?.content || msg.toolMetadata?.output} />
                    </div>
                </div>
            )}
        </div>
    );
}
