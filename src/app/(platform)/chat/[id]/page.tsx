import { prisma } from "@/src/lib/prisma";
import ChatIdClient from "./ChatIdClient";

interface Props {
    params: Promise<{ id: string }>
}

export default async function ChatPage({ params }: Props){
    const { id } = await params
    const empresas = await prisma.empresas.findMany({ orderBy: { createdAt: 'desc' } });
    const conversation = await prisma.conversations.findUnique({ where: { id } });

    return <ChatIdClient id={id} empresas={empresas} companyId={conversation?.companyId ?? null} userId={conversation?.userId ?? ""} />
}