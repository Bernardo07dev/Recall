import { prisma } from "@/src/lib/prisma";
import ChatIdClient from "./ChatIdClient";
import { Suspense } from "react";

interface Props {
    params: Promise<{ id: string }>
}

export default async function ChatPage({ params }: Props){
    const { id } = await params
    const empresas = await prisma.empresas.findMany({ orderBy: { createdAt: 'desc' } });
    const conversation = await prisma.conversations.findUnique({ where: { id } });

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="text-gray-400">Carregando...</span></div>}>
            <ChatIdClient id={id} empresas={empresas} companyId={conversation?.companyId ?? null} userId={conversation?.userId ?? ""} />
        </Suspense>
    )
}