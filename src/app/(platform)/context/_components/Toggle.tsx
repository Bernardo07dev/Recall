import { Globe, Lock } from "lucide-react";

interface ToggleProps {
    isPublic: boolean;
    onChange: (value: boolean) => void;
}

export default function Toggle({ isPublic, onChange }: ToggleProps) {
    return (
        <div onClick={() => onChange(!isPublic)} className="flex flex-row items-center gap-2 cursor-pointer select-none group">
            <div className={`relative w-8 h-[18px] rounded-full transition-colors duration-200 ${isPublic ? 'bg-[#1565C0]' : 'bg-gray-300'}`}>
                <div className={`absolute top-[3px] w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200 ${isPublic ? 'translate-x-[17px]' : 'translate-x-[3px]'}`}></div>
            </div>
            <div className="flex flex-row items-center gap-1">
                {isPublic ? <Globe size={14} className="text-[#1565C0]" /> : <Lock size={14} className="text-gray-400" />}
                <span className={`text-[0.75rem] font-semibold ${isPublic ? 'text-[#1565C0]' : 'text-gray-400'}`}>
                    {isPublic ? 'Público' : 'Privado'}
                </span>
            </div>
        </div>
    )
}
