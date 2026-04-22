"use client";
import Image from "next/image";
import Logo from "../../../../public/RECALL-logo.svg";
import { Plus, MessageSquare, Building2, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function SideBar(){
    const pathname = usePathname();
    const router = useRouter();

    return(
        <aside className="min-h-screen w-[16%] p-6 shadow-md z-5 bg-white">
            <Image src={Logo} alt="Logo Recall" width={100}></Image>
            <p className="pt-1 text-xs text-gray-400 font-ms">UMA INICIATIVA TOTVS</p>

            <div className="flex flex-row mt-8 text-white text-[13px] font-semibold items-center justify-center bg-[#1565C0] p-3 rounded-xl cursor-pointer">
                <Plus size={20}/>
                <p>Nova Empresa</p>
            </div>

            <section className="flex flex-col mt-6 text-gray-500 font-bold gap-2">
                <div onClick={() => router.push("/dashboard")} className={`cursor-pointer flex flex-row text-[13px] gap-2 items-center p-3 rounded-xl ${pathname.includes("dashboard") ? `text-[#1565C0] border-r-3 border-[#1565C0] bg-[#eff6ff6d]` : `text-gray-500`}`}>
                    <MessageSquare size={16}/>
                    <p>Chat</p>
                </div>

                <div className={`cursor-pointer flex flex-row text-[13px] gap-2 items-center p-3 rounded-xl ${pathname.includes("empresas") ? `text-[#1565C0] border-r-3 border-[#1565C0] bg-[#eff6ff6d]` : `text-gray-500`}`}>
                    <Building2 size={16}/>
                    <p>Empresas</p>
                </div>

                <div className={`cursor-pointer flex flex-row text-[13px] gap-2 items-center p-3 rounded-xl ${pathname.includes("config") ? `text-[#1565C0] border-r-3 border-[#1565C0] bg-[#eff6ff6d]` : `text-gray-500`}`}>
                    <Settings size={16}/>
                    <p>Configurações</p>
                </div>

            </section>
        </aside>
    )
}