"use client";
import React, { useState } from 'react';
import { ExternalLink, Globe, ChevronRight, ChevronDown } from 'lucide-react';

interface ToolContentProps {
    content: any;
}

const CollapsibleItem = ({ item }: { item: any }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col">
            <div 
                className="flex items-center gap-2 cursor-pointer group py-1.5"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="text-gray-400 group-hover:text-gray-700 transition-colors flex items-center justify-center w-4">
                    {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={14} />}
                </div>
                <div className="flex items-center gap-2">
                    <Globe size={13} className="text-[#1a3d65]" />
                    <span className="text-[12px] font-medium text-gray-500 group-hover:text-[#1a3d65] transition-colors line-clamp-1">
                        {item.title || "Resultado da pesquisa"}
                    </span>
                </div>
            </div>
            
            {isOpen && (
                <div className="flex">
                    {/* Linha vertical que conecta o bloco */}
                    {/* <div className="w-4 flex justify-center ml-0.5">
                        <div className="w-[1.5px] bg-gray-200 min-h-full my-1 rounded-full"></div>
                    </div> */}
                    <div className="flex-1 py-1 pl-2">
                        {/* {item.content && (
                                <p className="text-[11px] text-gray-600 leading-relaxed mb-2 whitespace-pre-wrap">
                                    {item.content}
                                </p>
                        )} */}
                        {item.url && (
                            <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-[11px] text-[#1a3d6599] font-medium hover:underline"
                            >
                                <ExternalLink size={10} />
                                <span>Acessar fonte</span>
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const CollapsibleJson = ({ data }: { data: any }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col pb-2">
            <div 
                className="flex items-center gap-2 cursor-pointer group py-1.5"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="text-gray-400 group-hover:text-gray-700 transition-colors flex items-center justify-center w-4">
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </div>
                <span className="text-[13px] font-medium text-gray-700 group-hover:text-[#1a3d65] transition-colors">
                    Visualizar detalhes
                </span>
            </div>
            {isOpen && (
                <div className="flex">
                    {/* <div className="w-4 flex justify-center ml-0.5">
                        <div className="w-[1.5px] bg-gray-200 min-h-full my-1 rounded-full"></div>
                    </div> */}
                    <div className="flex-1 pb-4 pt-1 pl-4">
                        <pre className="text-[10px] overflow-x-auto bg-gray-50 p-3 rounded-xl border border-gray-100">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function ToolContent({ content }: ToolContentProps) {
    if (!content) return null;

    let parsedContent = content;

    if (typeof content === 'string') {
        try {
            parsedContent = JSON.parse(content);
        } catch (e) {
            parsedContent = content;
        }
    }

    if (Array.isArray(parsedContent)) {
        return (
            <div className="flex flex-col mt-2 w-full max-w-xl pb-2">
                <div className="flex flex-col gap-0.5">
                    {parsedContent.map((item, idx) => (
                        <CollapsibleItem key={item.id || idx} item={item} />
                    ))}
                </div>
            </div>
        );
    }

    if (typeof parsedContent === 'object' && parsedContent !== null) {
        return <CollapsibleJson data={parsedContent} />;
    }

    return (
        <p className="text-xs text-gray-500 font-normal whitespace-pre-wrap mt-2 pb-2">
            {String(parsedContent)}
        </p>
    );
}
