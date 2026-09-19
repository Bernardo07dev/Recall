"use client"
import ChatContainer from "@/src/app/(platform)/chat/components/ChatContainer"
import { saveMessages, getMessages } from "@/src/app/actions/chat-action";
import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ToolRenderer from './tools/ToolRenderer';
import LinkWithTooltip from './components/LinkWithTooltip';
import CopyButton from './components/CopyButton';
import DropZoneWrapper from "../components/DropZoneWrapper";
import HumanMessage from "../components/HumanMessage";

interface Message {
    input: string;
    companyId: string | null;
    role: "human" | "AI" | "Tool";
    id?: string;
    toolMetadata?: any;
}

interface Props {
    id: string;
    empresas: { id: string, nome: string, industry: string }[];
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
    const [showTool, setShowTool] = useState(true)
    const [attachments, setAttachments] = useState<File[]>([])

    useEffect(() => {
        getMessages(id).then((result) => {
            if (result?.success && Array.isArray(result.data)) {
                setMessages(result.data.map((m: any) => ({
                    input: m.context,
                    companyId: m.conversationId,
                    role: m.role,
                    toolMetadata: m.toolMetadata,
                })))
            }
        })
    }, [id])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: isStreaming ? "auto" : "smooth"
            });
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
            let buffer = ""
            let currentToolMetadata: any = null

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                buffer += decoder.decode(value, { stream: true })
                const lines = buffer.split("\n")
                buffer = lines.pop() || ""

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const parsed = JSON.parse(line)
                        if (parsed.type === "text") {
                            fullText += parsed.content
                        } else if (parsed.type === "tool_start") {
                            setShowTool(true);
                            fullText += `\n\n[${parsed.toolName}](https://tool.start/${parsed.toolName})\n\n`
                        } else if (parsed.type === "tool_end") {
                            setShowTool(false);
                            fullText += `\n\n[${parsed.toolName}](https://tool.end/${parsed.toolName})\n\n`
                            if (parsed.toolMetadata) {
                                currentToolMetadata = parsed.toolMetadata
                            }
                        }
                    } catch (e) {
                        console.error("Erro no parser do chunk JSON:", line)
                    }
                }
                
                setMessages(prev => {
                    const aiIndex = prev.findIndex((m: any) => m.id === aiMessageId)
                    if (aiIndex === -1) {
                        return [...prev, { 
                            input: fullText, 
                            companyId, 
                            role: "AI", 
                            id: aiMessageId,
                            ...(currentToolMetadata ? { toolMetadata: currentToolMetadata } : {}) 
                        }]
                    }

                    const updated = [...prev]
                    updated[aiIndex] = {
                        ...updated[aiIndex],
                        input: fullText,
                        ...(currentToolMetadata ? { toolMetadata: currentToolMetadata } : {})
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
        <DropZoneWrapper onFilesDropped={(files) => setAttachments(prev => [...prev, ...files])}>
            <div className="py-22 px-[13%] min-h-screen flex flex-col justify-end items-center">
                <section className='mb-18 fade-in my-4 w-[80%] font-medium text-gray-500 text-[0.9375rem]'>
                    {messages?.map((msg, index) => (
                        <div key={index} className={`flex items-center ${msg.role === "Tool" ? "mb-0" : "mb-1"} text-[0.9375rem] ${msg.role === "human" ? "justify-end ml-[40%]" : "justify-start w-full"}`}
                        >
                            <div className={`w-fit ${
                                msg.role === "human" 
                                    ? "flex flex-col items-end" 
                                    : msg.role === "Tool"
                                        ? "px-4 py-0 text-gray-800"
                                        : "p-4 py-3 rounded-2xl text-gray-800"
                            }`}>
                                {msg.role === "AI" ? (
                                    <div className="prose prose-base max-w-none text-gray-800 text-[0.9375rem] leading-relaxed prose-h1:text-[1.4rem] prose-h1:tracking-tight prose-h1:font-bold prose-h1:text-gray-800 prose-h2:text-[1.05rem] prose-h2:font-bold prose-h2:text-gray-800 prose-h2:mb-2 prose-p:my-2">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                a: ({ node, ...props }) => {
                                                    const href = props.href || "";
                                                    if (href.startsWith("https://tool.start/") || href.startsWith("https://tool.end/")) {
                                                        const isStart = href.startsWith("https://tool.start/");
                                                        const toolName = isStart ? href.replace("https://tool.start/", "") : href.replace("https://tool.end/", "");

                                                        return <ToolRenderer toolName={toolName} isStart={isStart} showTool={showTool} msg={msg} />;
                                                    }
                                                    return <LinkWithTooltip href={props.href || ""}>{props.children}</LinkWithTooltip>
                                                },
                                                p: ({ node, children, ...props }) => {
                                                    // Check if this <p> only wraps a tool link (no visible text)
                                                    const childArray = Array.isArray(children) ? children : [children];
                                                    const hasOnlyToolLinks = childArray.every((child: any) => {
                                                        if (typeof child === 'string') return child.trim() === '';
                                                        if (child?.props?.href?.startsWith('https://tool.start/')) return true;
                                                        if (child?.props?.href?.startsWith('https://tool.end/')) return true;
                                                        // Check for already-rendered tool components (span with not-prose)
                                                        if (child?.props?.className?.includes('not-prose')) return true;
                                                        return false;
                                                    });
                                                    if (hasOnlyToolLinks) {
                                                        return <div {...props} className="!m-0 !p-0">{children}</div>;
                                                    }
                                                    return <p {...props}>{children}</p>;
                                                }
                                            }}
                                        >
                                            {msg.input}

                                        </ReactMarkdown>
                                        {msg.input === "" && isStreaming && (
                                            <svg className="animate-pulse w-5 h-5 opacity-70 inline-block ml-1" viewBox="-3 -3 22 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M0 18.8262V0H8.56934C12.4189 0 14.3438 1.68311 14.3438 5.04932C14.3438 7.32568 12.8452 9.21094 9.84814 10.7051L15.8203 18.8525H11.417L5.68213 10.6392V9.04395C9.02197 8.47266 10.6919 7.17627 10.6919 5.15479C10.6919 3.76611 9.90967 3.07178 8.34521 3.07178H3.55957V18.8262H0Z" fill="#1E40AF"/>
                                            </svg>
                                        )}
                                        {msg.input && !(isStreaming && index === messages.length - 1) && (
                                            <div className="flex justify-start mt-3">
                                                <CopyButton text={msg.input} />
                                            </div>
                                        )}
                                    </div>
                                ) : msg.role === "Tool" ? (
                                    <ToolRenderer 
                                        toolName={msg.toolMetadata?.name || "unknown_tool"} 
                                        isStart={false} 
                                        showTool={false} 
                                        msg={msg} 
                                    />
                                ) : (
                                    <HumanMessage content={msg.input} />
                                )}
                            </div>
                        </div>
                    ))}
                </section>
                <div ref={bottomRef} />
                <div className="w-[55%] fixed bottom-0">
                    <ChatContainer 
                        empresas={empresas} 
                        onEnviar={handleEnviar} 
                        enableCompany={true} 
                        defaultCompanyId={companyId} 
                        isStreaming={isStreaming}
                        attachments={attachments}
                        setAttachments={setAttachments}
                    />
                    <div className='bg-[#FBFBFF] backdrop-blur-sm w-full h-8 z-999 '></div>
                </div>
            </div> 
        </DropZoneWrapper>
        
)}