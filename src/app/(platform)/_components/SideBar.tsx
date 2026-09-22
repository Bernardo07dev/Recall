"use client";
import Image from "next/image";
import Logo from "../../../../public/RECALL-logo.svg";
import { CirclePlus, MessageSquare, Building2, Settings, MessageCirclePlus, PanelRight, PanelLeft, Trash, TvMinimal, LayoutList } from "lucide-react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { getChats } from "@/src/app/actions/chat-action";
import { useEffect, useState } from "react";
import { deleteChat } from "@/src/app/actions/user-actions";
import { size } from "zod/v4";

export default function SideBar({ userId }: { userId: string }){
    const pathname = usePathname();
    const router = useRouter();
    const [chats, setChats] = useState<any[]>([]);
    const [collapsed, setCollapsed] = useState(true);

    useEffect(() => {
        async function fetchChats() {
            const data = await getChats(userId);
            if (Array.isArray(data)) {
                setChats(data);
            }
        }
        fetchChats();
    }, [pathname, userId]);

    console.log(chats);

    const deleteChatUI = async (conversationId: string) => {
        await deleteChat(conversationId);
        setChats(prevChats => prevChats.filter(chat => chat.id !== conversationId));
    }

    return(
        <div 
            style={{ width: collapsed ? '4.5rem' : '28%', transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
            className="sticky top-0 h-screen p-3 z-20 transition-all bg-[#FBFBFF]"
        >

            <div className="relative h-full w-full">
                {/* Sombra de gradiente animada */}
                <div className={`absolute -inset-0.5 rainbow-shadow rounded-xl transition-opacity duration-300 ${collapsed ? 'opacity-40' : 'opacity-0'}`}></div>
                
                <aside
                    className={`relative z-10 scroll-smooth h-full rounded-xl bg-white overflow-y-auto transition-opacity overflow-x-hidden [&::-webkit-scrollbar]:h-8 [&::-webkit-scrollbar]:w-[0.4rem] [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-[#E7EFF8] [&::-webkit-scrollbar-thumb]:rounded-full transition-all duration-300 ${!collapsed ? 'shadow-sm border border-gray-100 p-4' : 'p-2'}`}
                >
            <div className={`flex flex-row items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
                {!collapsed && <Image src={Logo} alt="Logo Recall" width={90} className="pt-2"></Image>}
                <div onClick={() => setCollapsed(!collapsed)} className="hover:bg-gray-100 p-1 rounded-md transition-colors">
                    {collapsed
                        ? <PanelLeft size={19} className="text-gray-400 cursor-pointer"/>
                        : <PanelRight size={19} className="text-gray-400 cursor-pointer"/>
                    }
                </div>
            </div>

            <p className={`pt-1 text-xs text-gray-400 font-ms ${collapsed ? 'hidden' : 'block'}`}>UMA INICIATIVA TOTVS</p>
            <div className="top-6 bg-white z-10">
                <div
                    onClick={() => redirect('/context')}
                    title="Nova Empresa"
                    className={`flex flex-row mt-6 text-white text-[0.8rem] gap-2 font-medium items-center justify-center bg-[#1565C0] p-2 rounded-lg cursor-pointer ${collapsed ? 'px-0' : ''}`}
                >
                    <CirclePlus size={18} className="shrink-0"/>
                    {!collapsed && <p className="whitespace-nowrap">Nova Empresa</p>}
                </div>

                <div
                    onClick={() => window.location.href = '/chat'}
                    title="Novo Chat"
                    className={`flex inter flex-row mt-2 text-[#1565C0] text-[0.8rem] font-medium items-center gap-2 justify-center bg-[#1565C0]/10 p-2 rounded-lg cursor-pointer ${collapsed ? 'px-0' : ''}`}
                >
                    <MessageCirclePlus size={18} className="shrink-0"/>
                    {!collapsed && <p className="whitespace-nowrap">Novo Chat</p>}
                </div>
            </div>

            <section className="flex flex-col mt-5 text-gray-500 font-medium">
                <div
                    onClick={() => router.push("/visaogeral")}
                    title="Chat"
                    className={`cursor-pointer flex flex-row text-[0.8rem] gap-2 font-semibold items-center p-1.5 rounded-xl ${collapsed ? 'justify-center' : ''} ${pathname.includes("geral") ? `text-[#1565C0]` : `text-gray-500`}`}
                >
                    <LayoutList size={18} className="shrink-0" />
                    {!collapsed && <p>Visão Geral</p>}
                </div>        

                <div
                    onClick={() => router.push("/chat")}
                    title="Chat"
                    className={`cursor-pointer flex flex-row text-[0.8rem] gap-2 font-semibold items-center p-1.5 rounded-xl ${collapsed ? 'justify-center' : ''} ${pathname.includes("chat") ? `text-[#1565C0]` : `text-gray-500`}`}
                >
                    <MessageSquare size={18} className="shrink-0"/>
                    {!collapsed && <p>Chat</p>}
                </div>

                <div
                    onClick={() => redirect('/empresas')}
                    title="Empresas"
                            className={`cursor-pointer flex flex-row text-[0.8rem] gap-2 font-semibold items-center p-1.5 rounded-xl ${collapsed ? 'justify-center' : ''} ${pathname.includes("empresas") ? `text-[#1565C0]` : `text-gray-500`}`}
                >
                    <Building2 size={18} className="shrink-0"/>
                    {!collapsed && <p>Empresas</p>}
                </div>

                <div
                    title="Configurações"
                            className={`cursor-pointer flex flex-row text-[0.8rem] gap-2 font-semibold items-center p-1.5 rounded-xl ${collapsed ? 'justify-center' : ''} ${pathname.includes("config") ? `text-[#1565C0]` : `text-gray-500`}`}
                >
                    <Settings size={18} className="shrink-0"/>
                    {!collapsed && <p>Configurações</p>}
                </div>
            </section>

            {!collapsed && (
                <section className="pt-4 fade-in">
                    <p className="text-left text-xs pb-1.5 px-1 text-gray-400">Conversas</p>
                    {chats.map((conversa) => (
                        <div onClick={() => router.push(`/chat/${conversa.id}`)} key={conversa.id} className={`p-1.75 px-1 text-[0.8rem] flex gap-1 items-center justify-between rounded-lg font-medium cursor-pointer hover:text-[#1565C0] ${pathname.includes(conversa.id) ? "text-[#1565C0] px-2 bg-[#e7eff872]" : "text-gray-500"}`}>
                            <p>{conversa.title.length > 30 ? conversa.title.substring(0, 34) + "..." : conversa.title}</p>
                            <Trash onClick={(e) => { e.stopPropagation(); deleteChatUI(conversa.id); }} size={13} className="hover:text-red-500"/>
                        </div>
                    ))}
                </section>
            )}
        </aside>
        </div>
        </div>
    )
}