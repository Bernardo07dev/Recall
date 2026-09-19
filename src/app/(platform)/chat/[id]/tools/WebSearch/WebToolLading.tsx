import { Globe } from 'lucide-react';
import { getToolDisplayName } from '../../toolsname';

interface GenericToolLoadingProps {
    toolName: string;
    showTool: boolean;
}

export default function GenericToolLoading({ toolName, showTool }: GenericToolLoadingProps) {
    const displayName = getToolDisplayName(toolName);
    
    return (
        <span className="flex flex-col gap-1 my-1 w-fit">
            <span className={`flex items-center gap-2 text-sm no-underline ${showTool ? "animate-pulse" : ""}`}>
                <Globe className="text-[#0c3a6f71]/40" size={15} />
                <span className="text-[11px] text-[#0c3a6f71]/40 font-medium">Iniciando {displayName}...</span>
            </span>
            <span className={`w-[1.5px] -mb-1.5 h-3 bg-gradient-to-b from-gray-100 to-[#1565C0]/40 rounded-full ml-[7px] animate-pulse`} />
        </span>
    );
}
