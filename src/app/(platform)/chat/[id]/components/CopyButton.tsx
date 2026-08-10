import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button onClick={handleCopy} className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors rounded-md hover:bg-gray-100 flex items-center gap-1 text-xs" title="Copiar">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? <span>Copiado!</span> : <span>Copiar</span>}
        </button>
    );
}
