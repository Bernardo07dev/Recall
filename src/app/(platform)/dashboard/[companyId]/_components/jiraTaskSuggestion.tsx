import { ExternalLink } from 'lucide-react';
import { SiJira } from '@icons-pack/react-simple-icons';

function formatLabel(label: string) {
    const cleaned = label.replace(/_/g, ' ').trim();
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export function JiraTaskSuggestion({ jira }: { jira: any }) {
    return (
        <div className='group relative overflow-hidden flex flex-col cursor-pointer gap-1 items-start mt-4 border border-[#2381eb]/10 shadow-md shadow-[#2380eb15] p-5 rounded-2xl transition-all hover:border-[#2D88FF]/30 hover:shadow-[#2D88FF]/10'>
            <div className='flex flex-row gap-2 mb-1 items-center transition-opacity duration-300 group-hover:opacity-20'>
                <SiJira color="#2D88FF" size={13} />
                <p className='text-xs -ml-1'>Jira</p>
                <p className='text-[#2D88FF] text-[0.7rem] bg-[#EDF3FA] p-1 px-2 rounded-sm font-semibold transition-opacity duration-300 group-hover:opacity-20'>{formatLabel(jira.label)}</p>
            </div>
            <p className='font-medium text-[0.8rem] transition-opacity duration-300 group-hover:opacity-20'>{jira.title}</p>
            

            <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300'>
                <div className='text-[#2D88FF] font-semibold text-[0.7rem] flex items-center gap-2 bg-blue-50/90 px-5 py-2.5 rounded-full shadow-sm'>
                    Ir para o Jira
                    <ExternalLink size={15} />
                </div>
            </div>
        </div>
    )
}
