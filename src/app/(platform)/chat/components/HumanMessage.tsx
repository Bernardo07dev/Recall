import { FileText } from 'lucide-react';

interface Props {
    content: string;
}

export default function HumanMessage({ content }: Props) {
    if (!content) return null;
    
    const attachmentRegex = /<file-attachment name="([^"]+)">[\s\S]*?<\/file-attachment>/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = attachmentRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
            parts.push({ type: 'text', content: content.substring(lastIndex, match.index) });
        }
        parts.push({ type: 'file', name: match[1] });
        lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < content.length) {
        parts.push({ type: 'text', content: content.substring(lastIndex) });
    }

    if (parts.length === 0 || (parts.length === 1 && parts[0].type === 'text')) {
        return <p className="whitespace-pre-wrap">{content}</p>;
    }

    return (
        <div className="flex flex-col">
            {parts.map((part, idx) => {
                if (part.type === 'text') {
                    if (!part.content.trim()) return null;
                    return <p key={idx} className="whitespace-pre-wrap">{part.content}</p>;
                } else if (part.type === 'file') {
                    return (
                        <div key={idx} className="flex items-center gap-2 -mt-3 bg-white/50 border border-[#e1e4f3] px-3 py-2 rounded-xl w-fit">
                            <FileText size={16} className="text-[#004D99]" />
                            <span className="text-sm font-medium text-[#004D99]">{part.name}</span>
                        </div>
                    )
                }
                return null;
            })}
        </div>
    );
}
