"use client"
import ChatContainer from "@/src/app/(platform)/chat/ChatContainer"
import { useState, useRef, useEffect } from "react";

interface Message {
    input: string;
    companyId: string | null;
    role: "human" | "AI"
}

interface Props {
    id: string;
    empresas: any[];
    companyId: string | null;
}

export default function ChatIdClient({ id, empresas, companyId }: Props) {
    const [message, setMessage] = useState<Message[]>([])
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [message])

    const handleEnviar = (input: string, companyId: string | null, role: "human" | "AI") => {
        console.log(input, companyId, role)
        setMessage(prev => [...prev, { input, companyId, role }])
    }

    return (
        <div className="py-22 px-[15%] min-h-screen flex flex-col justify-end items-center">
            <section className='mb-18 fade-in my-4 w-[80%] inter text-sm'>
                {message?.map((message, index) => (
                    <div 
                        key={index} className={`flex items-center mt-2 text-sm ${
                        message.role === "human" ? "justify-end ml-[40%]" : "justify-start w-full"
                        }`}
                    >
                        <div className={`w-fit p-3 rounded-xl ${message.role === "human" ? "bg-[#F2F3FB] text-gray-600" : " text-gray-800"}`}>
                            <p>{message.input}</p>
                        </div>
                    </div>
                ))}
            </section>
            <div ref={bottomRef} />
            <div className="w-[48%] fixed bottom-6">
                <ChatContainer empresas={empresas} onEnviar={handleEnviar} enableCompany={true} defaultCompanyId={companyId} />
            </div>
        </div>
    )
}
