'use client'
import { ChartBar, NotebookText, Map } from 'lucide-react';
import ChatContainer from './components/ChatContainer'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createConversation, saveMessages } from '@/src/app/actions/chat-action';
import Loading from '../loading';
import DropZoneWrapper from './components/DropZoneWrapper';

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
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    const [attachments, setAttachments] = useState<File[]>([])

    const nome = user?.nome?.split(" ")[0];


    const recebeMensagem = async (msg: string, companyId: string | null, role: "human" | "AI") => {
        let currentConversationId = conversationId
        setLoading(true)
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

    if (loading) {
        return <Loading />
    }

    return (
        <DropZoneWrapper onFilesDropped={(files) => setAttachments(prev => [...prev, ...files])}>
        <main
            className={`py-8 px-[15%] w-full flex flex-col items-center ${!firstmsg ? "justify-between" : "justify-end"} min-h-screen`}
            style={{
                background: 'linear-gradient(to right, #F7F9FE 0px, rgba(247, 249, 254, 0) 220px), radial-gradient(at 0% 0%, rgba(21, 101, 192, 0.09) 0px, transparent 55%), radial-gradient(at 100% 0%, rgba(155, 89, 182, 0.09) 0px, transparent 55%), radial-gradient(at 10% 50%, rgba(16, 185, 129, 0.065) 0px, transparent 50%), radial-gradient(at 90% 55%, rgba(245, 158, 11, 0.065) 0px, transparent 50%), radial-gradient(at 50% 95%, rgba(236, 72, 153, 0.075) 0px, transparent 55%), #ffffff',
                backgroundAttachment: 'scroll, fixed, fixed, fixed, fixed, fixed',
            }}
        >
            {!firstmsg &&
                (<div className={`w-full max-w-[960px] py-18 flex flex-col items-start gap-2 ${hiding ? "animate-fade-out" : "animate-fade-in"}`}>
                    <h1 className="text-4xl font-semibold">Olá, {nome}!</h1>
                    <p className="text-gray-500 font-medium text-[0.9375rem] mb-4 -mt-1">Como posso te ajudar hoje?</p>
                    <section className="flex flex-row gap-3 w-full">
                        <div 
                            onClick={() => recebeMensagem(oportunidades, selectedCompanyId, "human")} 
                            className="group flex-1 bg-white p-4 px-5.5 rounded-3xl flex flex-col justify-between hover:border-black/6 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer gap-1.5"
                        >
                            <div className='flex items-center gap-2'>
                                <div className="p-1.5 rounded-lg bg-blue-50/80 text-blue-600 border border-blue-100/50 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                                    <ChartBar size={12} />
                                </div>
                                <h1 className="text-[0.85rem] font-semibold text-neutral-600">Oportunidades</h1>
                            </div>
                            <p className="text-[0.7rem] leading-4 mt-0.5 text-neutral-400 font-medium">Mapeie todas as possíveis oportunidades comerciais da empresa</p>
                        </div>

                        <div 
                            onClick={() => recebeMensagem(retencao, selectedCompanyId, "human")} 
                            className="group flex-1 bg-white p-4 px-5.5 rounded-3xl flex flex-col justify-between hover:border-black/6 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer gap-1.5"
                        >
                            <div className='flex items-center gap-2'>
                                <div className="p-1.5 rounded-lg bg-amber-50/80 text-amber-600 border border-amber-100/50 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                                    <NotebookText size={12} />
                                </div>
                                <h1 className="text-[0.85rem] font-semibold text-neutral-600">Retenção</h1>
                            </div>
                            <p className="text-[0.7rem] leading-4 mt-0.5 text-gray-400 font-medium">Identifique insatisfação ou risco no contexto da empresa escolhida</p>
                        </div>

                        <div 
                            onClick={() => recebeMensagem(map, selectedCompanyId, "human")} 
                            className="group flex-1 bg-white p-4 px-5.5 rounded-3xl flex flex-col justify-between hover:border-black/6 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer gap-1.5"
                        >
                            <div className='flex items-center gap-2'>
                                <div className="p-1.5 rounded-lg bg-emerald-50/80 text-emerald-600 border border-emerald-100/50 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                                    <Map size={12} />
                                </div>
                                <h1 className="text-[0.85rem] font-semibold text-neutral-600">Mapeamento</h1>
                            </div>
                            <p className="text-[0.7rem] leading-4 mt-0.5 text-gray-400 font-medium">Encontre os produtos que estão sendo comentados ou possíveis ofertas</p>
                        </div>
                    </section>
                </div>)
            }

            {firstmsg && <section className='mb-32 fade-in my-4 w-[80%] max-w-[830px] inter text-[0.75rem]'>
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

            <section className='w-[55%] max-w-[830px] fixed bottom-0 z-10'>
                <ChatContainer 
                    onEnviar={recebeMensagem} 
                    enableCompany={firstmsg} 
                    empresas={empresas} 
                    onCompanyChange={setSelectedCompanyId}
                    attachments={attachments}
                    setAttachments={setAttachments}
                />
                <div className='bg-[#FBFBFF]/5 backdrop-blur-sm w-full h-8 z-10 '></div>
            </section>
            </main>
        </DropZoneWrapper>
    );
}