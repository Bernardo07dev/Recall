import { Map } from 'lucide-react';
import { getToolDisplayName } from '../../toolsname';

interface GenericToolLoadingProps {
    toolName: string;
    showTool: boolean;
}

export default function MapeamentoToolLoading({ toolName, showTool }: GenericToolLoadingProps) {
    const displayName = getToolDisplayName(toolName);

    return (
        <span className="flex flex-col w-fit">
            <span className={`flex items-center gap-2 text-sm no-underline ${showTool ? "animate-pulse" : ""}`}>
                <Map className="text-[#0c3a6f71]/40" size={15} />
                <span className="text-[11px] text-[#0c3a6f71]/39 font-medium">
                    Mapeando Produtos TOTVS na Empresa
                </span>
            </span>
            {!showTool && (
                <span className="w-[1.5px] h-3 my-1 bg-gradient-to-b from-gray-100 to-[#1565C0]/40 rounded-full ml-[7px]" />
            )}
        </span>
    );
}
