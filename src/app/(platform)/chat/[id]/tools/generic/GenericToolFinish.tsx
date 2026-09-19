import { CircleCheckBig, Bot } from 'lucide-react';
import { getToolDisplayName } from '../../toolsname';

interface GenericToolFinishProps {
    toolName: string;
    msg: any;
}

export default function GenericToolFinish({ toolName, msg }: GenericToolFinishProps) {
    const displayName = getToolDisplayName(toolName);
    
    return (
        <span className="flex flex-col gap-1 my-1 w-fit">
            <span className={`flex items-center gap-2 text-sm no-underline`}>
                <Bot className="text-[#1565c0d1]/70" size={15} />
                <span className="text-[11px] text-[#1565c0d1]/60 font-medium">Finalizando {displayName}...</span>
            </span>
        </span>
    );
}
