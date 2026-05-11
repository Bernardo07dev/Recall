import { SiJira } from '@icons-pack/react-simple-icons';

export function JiraTaskSuggestion({ jira }: { jira: any }) {
    return (
        <div className='flex flex-col gap-1 items-start mt-4 border border-[#2381eb]/10 shadow-md shadow-[#2380eb15] p-6 rounded-xl'>
            <div className='flex flex-row gap-1 mb-1'>
                <SiJira color="#2D88FF" size={13}/>
                <h1 className='text-xs text-gray-400'>Sugestão de Task no Jira</h1>
            </div>
            <p className='font-semibold'>{jira.title}</p>
            <p className='text-gray-500 text-[11px] font-medium'>{jira.label}</p>
        </div>
    )
}
