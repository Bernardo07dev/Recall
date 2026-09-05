import { getFileIcon } from '../[id]/components/FileIcons';

interface Props {
    content: string;
}

export default function HumanMessage({ content }: Props) {
    if (!content) return null;
    
    const attachmentRegex = /<file-attachment name="([^"]+)">[\s\S]*?<\/file-attachment>/g;
    
    type MessagePart = { type: 'text'; content: string } | { type: 'file'; name: string };
    const parts: MessagePart[] = [];
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
        return <p className="whitespace-pre-wrap bg-[#F2F3FB] text-gray-800 p-4 py-3 rounded-2xl w-fit ml-auto">{content.trim()}</p>;
    }

    const fileParts = parts.filter((p): p is { type: 'file'; name: string } => p.type === 'file');
    const textParts = parts.filter((p): p is { type: 'text'; content: string } => p.type === 'text' && !!p.content?.trim());

    return (
        <div className="flex flex-col gap-2 items-end">
            {fileParts.length > 0 && (
                <div className="flex flex-wrap gap-3 justify-end">
                    {fileParts.map((part, idx) => {
                        const Icon = getFileIcon(part.name);
                        const ext = part.name.split('.').pop()?.toLowerCase();
                        
                        const isAudio = ['mp3', 'wav', 'ogg'].includes(ext || '');
                        const isSpreadsheet = ['csv', 'xls', 'xlsx'].includes(ext || '');
                        const isDoc = ['txt', 'pdf', 'doc', 'docx'].includes(ext || '');
                        
                        let iconColor = "text-gray-500";
                        let typeText = "File";
                        
                        if (isAudio) {
                            iconColor = "text-[#8A2BE2]"; 
                            typeText = "File";
                        } else if (isSpreadsheet) {
                            iconColor = "text-[#00A35C]";
                            typeText = "Spreadsheet";
                        } else if (isDoc) {
                            iconColor = "text-[#0078FF]"; 
                            typeText = "Document";
                        }

                        return (
                            <div key={`file-${idx}`} className="flex items-center gap-4 bg-white border border-[#EBEBEB] px-5 py-4 rounded-[1.25rem] w-[280px]">
                                <div className={`flex-shrink-0 ${iconColor}`}>
                                    <Icon size={18} strokeWidth={2} />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-[0.85rem] font-semibold text-gray-900 truncate leading-tight mb-0.5">{part.name}</span>
                                    <span className="text-[0.7rem] font-medium text-gray-400 leading-tight">{typeText}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            {textParts.map((part, idx) => (
                <p key={`text-${idx}`} className="whitespace-pre-wrap bg-[#F2F3FB] text-gray-800 p-4 py-3 rounded-2xl w-fit ml-auto">{part.content.trim()}</p>
            ))}
        </div>
    );
}
