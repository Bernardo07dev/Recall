import React, { useState, useRef } from "react";
import { Globe, Check, Copy } from "lucide-react";

export default function LinkWithTooltip({ href, children }: { href: string, children: React.ReactNode }) {
    const [showTooltip, setShowTooltip] = useState(false);
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const truncateUrl = (url: string) => {
        if (!url) return "";
        const cleanUrl = url.replace(/^https?:\/\//, '');
        if (cleanUrl.length > 35) {
            return cleanUrl.substring(0, 32) + '...';
        }
        return cleanUrl;
    };

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setShowTooltip(false);
        }, 300);
    };

    return (
        <span 
            className="relative inline-block cursor-pointer" 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <a 
                href={href}
                className="text-black font-medium underline decoration-dotted decoration-[1px] underline-offset-[2px] decoration-gray-400 hover:decoration-black transition-colors" target="_blank" 
                rel="noopener noreferrer"
            >
                {children} <span className="inline-block text-[10px] ml-[2px]">↗</span>
            </a>
            
            {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-0.5 z-9999 flex items-center gap-2 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 px-3 py-2 text-xs font-normal text-gray-700 whitespace-nowrap">
                    <Globe size={14} className="text-[#1a3d65]" />
                    <span className="font-medium tracking-tight text-gray-600">{truncateUrl(href)}</span>
                    <button 
                        onClick={handleCopy}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md bg-gray-50 hover:bg-gray-100"
                        title="Copiar link"
                    >
                        {copied ? <Check size={14} className="text-gray-600" /> : <Copy size={14} />}
                    </button>
                </div>
            )}
        </span>
    );
}
