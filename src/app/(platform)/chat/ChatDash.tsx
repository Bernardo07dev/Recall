'use client'
import { ChartBar, NotebookText, Map } from 'lucide-react';
import ChatContainer from './components/ChatContainer'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createConversation, saveMessages } from '@/src/app/actions/chat-action';

interface UserType {
    id: string
    nome: string
    email: string
    cargo: string
    area: string
    password: string
    createdAt: Date
}

interface Props {
    user: UserType | null;
    empresas: { id: string, nome: string, industry: string }[];
}

interface Message {
    msg: string;
    companyId: string | null;
    role: "human" | "AI"
}

export default function Dashboard({ user, empresas }: Props) {
    const [firstmsg, setFirstmsg] = useState(false)
    const [hiding, setHiding] = useState(false)
    const [message, setMessage] = useState<Message[]>([])
    const [conversationId, setConversationId] = useState<string | null>(null)
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null)
    const router = useRouter()

    const nome = user?.nome?.split(" ")[0];


    const recebeMensagem = async (msg: string, companyId: string | null, role: "human" | "AI") => {
        let currentConversationId = conversationId

        if (currentConversationId == null){
            const result = await createConversation(user?.id || "0000", companyId, msg)
            if(result.success){
                currentConversationId = result.id!
                setConversationId(currentConversationId)
                await saveMessages(msg, currentConversationId, role)
                const params = new URLSearchParams()
                if (companyId) params.set('company', companyId)
                params.set('pending', '1')
                const qs = params.toString()
                router.push(`/chat/${currentConversationId}${qs ? `?${qs}` : ''}`)
                return
            }
        }

        setHiding(true)
        if (currentConversationId) {
            saveMessages(msg, currentConversationId, role)
        }
        setMessage(prev => [...prev, { msg, companyId, role }])
        setTimeout(() => setFirstmsg(true), 500)
    }

    const oportunidades = "Analise o contexto desta empresa e me mostre todas as oportunidades de upsell e cross-sell identificadas, com nível de prioridade e ação recomendada."
    const retencao = "Existe algum sinal de insatisfação ou risco de churn nesta empresa? Me mostre os alertas encontrados e o que deve ser feito para reter esse cliente."
    const map = "Quais produtos da TOTVS estão sendo mencionados nas conversas desta empresa? Faça um mapeamento total dos produtos"

    return (
        <main className={`py-8 px-[16%] w-full flex flex-col items-center ${!firstmsg ? "justify-between" : "justify-end"} min-h-screen bg-[#fbfbff]`}>
            {!firstmsg &&
                (<div className={`w-full py-18 flex flex-col items-start gap-2 ${hiding ? "animate-fade-out" : "animate-fade-in"}`}>
                    <h1 className="text-4xl font-semibold">Olá, {nome}!</h1>
                    <p className="text-gray-500 font-medium text-[0.9375rem] mb-4 -mt-1">Como posso te ajudar hoje?</p>
                    <section className="flex flex-row gap-4">
                        <div onClick={() => recebeMensagem(oportunidades, selectedCompanyId, "human")} className="bg-white p-6 w-[33%] rounded-3xl flex flex-col shadow-sm shadow-gray-100 cursor-pointer gap-1">
                            <div className='flex items-center gap-2 mb-2'>
                                <ChartBar size={28} className="bg-[#EFF6FF] text-[#2563EB] p-[6px] rounded-lg " />
                                <h1 className="text-[0.9rem] font-semibold">Oportunidades</h1>
                            </div>
                            <p className="text-xs text-gray-400 font-medium">Pergunte para o Recall mapear todas as possíveis oportunidades da empresa escolhida</p>
                        </div>

                        <div onClick={() => recebeMensagem(retencao, selectedCompanyId, "human")} className="bg-white p-6 w-[33%] rounded-3xl flex flex-col shadow-sm shadow-gray-100 cursor-pointer gap-1">
                            <div className='flex items-center gap-2 mb-2'>
                                <NotebookText size={28} className="bg-[#FFEEE6] text-[#813900] p-[6px] rounded-lg " />
                                <h1 className="text-[0.9rem] font-semibold">Retenção</h1>
                            </div>
                            <p className="text-xs text-gray-400 font-medium">Pergunte para o Recall identificar insatisfação ou risco na contexto da empresa</p>
                        </div>

                        <div onClick={() => recebeMensagem(map, selectedCompanyId, "human")} className="bg-white p-6 w-[33%] rounded-3xl flex flex-col shadow-sm shadow-gray-100 cursor-pointer gap-1">
                            <div className='flex items-center gap-2 mb-2'>
                                <Map size={28} className="bg-[#D1FFE5] text-[#25751D] p-[6px] rounded-lg " />
                                <h1 className="text-[0.9rem] font-semibold">Mapeamento</h1>
                            </div>
                            <p className="text-xs text-gray-400 font-medium">Pergunte para o Recall mapear os produtos que estão sendo comentados ou possíveis ofertas</p>
                        </div>
                    </section>
                </div>)
            }

            {firstmsg && <section className='mb-32 fade-in my-4 w-[80%] inter text-[0.75rem]'>
                {message?.map((message, index) => (
                    <div 
                        key={index} className={`flex items-center mt-2 text-sm ${
                        message.role === "human" ? "justify-end ml-[40%]" : "justify-start w-full"
                        }`}
                    >
                        <div className={`w-fit p-3 rounded-xl ${message.role === "human" ? "bg-[#F2F3FB] text-gray-600" : " text-gray-800"}`}>
                            <p>{message.msg}</p>
                        </div>
                    </div>
                ))}
            </section>}

            <section className='w-[48%] fixed bottom-0 z-10'>
                <ChatContainer 
                    onEnviar={recebeMensagem} 
                    enableCompany={firstmsg} 
                    empresas={empresas} 
                    onCompanyChange={setSelectedCompanyId}
                />
                <div className='bg-[#FBFBFF]/5 backdrop-blur-sm w-full h-8 z-10 '></div>
            </section>
        </main>
    );
}