"use client"
import ChatContainer from "@/src/app/(platform)/chat/ChatContainer"
import { saveMessages, getMessages } from "@/src/app/actions/chat-action";
import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ReactMarkdown from 'react-markdown';

interface Message {
    input: string;
    companyId: string | null;
    role: "human" | "AI"
}

interface Props {
    id: string;
    empresas: any[];
    companyId: string | null;
    userId: string;
}

export default function ChatIdClient({ id, empresas, companyId, userId }: Props) {
    const [messages, setMessages] = useState<Message[]>([])
    const [isStreaming, setIsStreaming] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)
    const hasFiredPending = useRef(false)
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        getMessages(id).then((result) => {
            if (result?.success && Array.isArray(result.data)) {
                setMessages(result.data.map((m: any) => ({
                    input: m.context,
                    companyId: m.conversationId,
                    role: m.role,
                })))
            }
        })
    }, [id])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: isStreaming ? "auto" : "smooth", block: "end" })
        }, 100);
        return () => clearTimeout(timeoutId);
    }, [messages, isStreaming])

    const streamResponse = useCallback(async (mensagem: string) => {
        setIsStreaming(true)

        const aiMessageId = Math.random().toString(36).substring(7);
        setMessages(prev => [...prev, { input: "", companyId, role: "AI", id: aiMessageId }])

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mensagem,
                    id: companyId,
                    chatId: id,
                }),
            })

            if (!response.ok || !response.body) {
                throw new Error("Failed to stream response")
            }

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let fullText = ""

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const text = decoder.decode(value, { stream: true })
                fullText += text
                
                setMessages(prev => {
                    const aiIndex = prev.findIndex((m: any) => m.id === aiMessageId)
                    if (aiIndex === -1) {
                        // Case where React StrictMode or DB fetch overwrites the state and removes the AI placeholder
                        return [...prev, { input: fullText, companyId, role: "AI", id: aiMessageId }]
                    }

                    const updated = [...prev]
                    updated[aiIndex] = {
                        ...updated[aiIndex],
                        input: fullText,
                    }
                    return updated
                })
            }
        } catch (error) {
            console.error("Stream error:", error)
            setMessages(prev => {
                const aiIndex = prev.findIndex((m: any) => m.id === aiMessageId)
                if (aiIndex === -1) return prev;

                const updated = [...prev]
                updated[aiIndex] = {
                    ...updated[aiIndex],
                    input: "Desculpe, ocorreu um erro ao gerar a resposta.",
                }
                return updated
            })
        } finally {
            setIsStreaming(false)
        }
    }, [companyId, id])

    useEffect(() => {
        const pending = searchParams.get("pending")
        if (pending === "1" && !hasFiredPending.current && messages.length > 0) {
            hasFiredPending.current = true
            const lastHumanMsg = messages[messages.length - 1]
            if (lastHumanMsg && lastHumanMsg.role === "human") {
                streamResponse(lastHumanMsg.input)
                router.replace(window.location.pathname, { scroll: false })
            }
        }
    }, [searchParams, messages, streamResponse, router])

    const handleEnviar = async (input: string, _companyId: string | null, role: "human" | "AI") => {
        setMessages(prev => [...prev, { input, companyId: _companyId, role }])
        await saveMessages(input, id, role)
        
        streamResponse(input)
    }

    return (
        <div className="py-22 px-[15%] min-h-screen flex flex-col justify-end items-center">
            <section className='mb-18 fade-in my-4 w-[80%] inter text-[0.75rem]'>
                {messages?.map((msg, index) => (
                    <div 
                        key={index} className={`flex items-center mt-2 text-sm ${
                        msg.role === "human" ? "justify-end ml-[40%]" : "justify-start w-full"
                        }`}
                    >
                        <div className={`w-fit p-4 py-3 rounded-2xl ${msg.role === "human" ? "bg-[#F2F3FB] text-gray-800" : " text-gray-800"}`}>
                            {msg.role === "AI" ? (
                                <div className="prose prose-sm max-w-none text-gray-800">
                                    <ReactMarkdown>{msg.input}</ReactMarkdown>
                                    {msg.input === "" && isStreaming && (
                                        <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse rounded-sm ml-0.5" />
                                    )}
                                </div>
                            ) : (
                                <p className="whitespace-pre-wrap">{msg.input}</p>
                            )}
                        </div>
                    </div>
                ))}
            </section>
            <div ref={bottomRef} />
            <div className="w-[53%] fixed bottom-0">
                <ChatContainer 
                    empresas={empresas} 
                    onEnviar={handleEnviar} 
                    enableCompany={true} 
                    defaultCompanyId={companyId} 
                    isStreaming={isStreaming}
                />
                <div className='bg-[#FBFBFF] backdrop-blur-sm w-full h-8 z-10 '></div>
            </div>
        </div> 
        
)}