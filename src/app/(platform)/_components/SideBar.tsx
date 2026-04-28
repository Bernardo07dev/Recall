"use client";
import Image from "next/image";
import Logo from "../../../../public/RECALL-logo.svg";
import { CirclePlus, MessageSquare, Building2, Settings, MessageCirclePlus } from "lucide-react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { getChats } from "@/src/app/actions/chat-action";
import { useEffect, useState } from "react";

export default function SideBar({ userId }: { userId: string }){
    const pathname = usePathname();
    const router = useRouter();
    const [chats, setChats] = useState<any[]>([]);

    useEffect(() => {
        async function fetchChats() {
            const data = await getChats(userId);
            if (Array.isArray(data)) {
                setChats(data);
            }
        }
        fetchChats();
    }, []);

    console.log(chats);

    return(
        <aside className="sticky top-0 h-screen w-[18%] p-4 shadow-md z-20 bg-white overflow-y-auto">
            <Image src={Logo} alt="Logo Recall" width={100} className="pt-2"></Image>
            <p className="pt-1 text-xs text-gray-400 font-ms">UMA INICIATIVA TOTVS</p>

            <div className="sticky top-4 bg-white z-10">
                <div onClick={() => redirect('/context')} className="flex flex-row mt-6 text-white text-[13px] gap-2 font-medium items-center justify-center bg-[#1565C0] p-2 rounded-lg cursor-pointer">
                    <CirclePlus size={18}/>
                    <p>Nova Empresa</p>
                </div>

                <div onClick={() => window.location.href = '/chat'} className="flex inter flex-row mt-2 text-[#1565C0] text-[13px] font-medium items-center gap-2 justify-center bg-[#1565C0]/10 p-2 rounded-lg cursor-pointer">
                    <MessageCirclePlus size={18}/>
                    <p>Novo Chat</p>
                </div>
            </div>

            <section className="flex flex-col mt-4 text-gray-500 font-medium">
                <div onClick={() => router.push("/chat")} className={`cursor-pointer flex flex-row text-[13px] gap-2 items-center p-[8px] rounded-xl ${pathname.includes("chat") ? `text-[#1565C0]` : `text-gray-500`}`}>
                    <MessageSquare size={16}/>
                    <p>Chat</p>
                </div>

                <div onClick={() => redirect('/empresas')} className={`cursor-pointer flex flex-row text-[13px] gap-2 items-center p-[8px] rounded-xl ${pathname.includes("empresas") ? `text-[#1565C0]` : `text-gray-500`}`}>
                    <Building2 size={16}/>
                    <p>Empresas</p>
                </div>

                <div className={`cursor-pointer flex flex-row text-[13px] gap-2 items-center p-[8px] rounded-xl ${pathname.includes("config") ? `text-[#1565C0]` : `text-gray-500`}`}>
                    <Settings size={16}/>
                    <p>Configurações</p>
                </div>
            </section>

            <section className="pt-4">
                <p className="text-left text-xs pb-[6px] px-1 text-gray-400">Conversas</p>
                {chats.map((conversa) => (
                    <div onClick={() => router.push(`/chat/${conversa.id}`)} key={conversa.id} className={`p-2 px-3 text-[13px] rounded-lg font-medium cursor-pointer ${pathname.includes(conversa.id) ? "text-[#1565C0] bg-[#e7eff872]" : "text-gray-500"}`}>
                        <p>{conversa.title}</p>
                    </div>
                ))}
            </section>
        </aside>
    )
}