import { prisma } from "@/src/lib/prisma";
import ChatIdClient from "./ChatIdClient";
import { Suspense } from "react";
import { cookies } from 'next/headers'
import { redirect } from "next/navigation";
import { decrypt } from '@/src/lib/auth';

interface Props {
    params: Promise<{ id: string }>
}

export default async function ChatPage({ params }: Props){
    const { id } = await params
    
    const cookieStore = await cookies()
    const token = cookieStore.get('recall-session')?.value

    if (!token) {
        redirect("/log-in");
    }

    const session = await decrypt(token);
    const userId = session.userId as string;

    const empresas = await prisma.empresas.findMany({
        where: {
            OR: [
                { ownerId: userId },
                { isPublic: true },
                { shares: { some: { userId: userId } } },
            ],
        },
        include: {
            owner: { select: { id: true, nome: true } },
            shares: {
                where: { userId: userId },
                select: { sharedBy: { select: { id: true, nome: true } } },
            },
        },
        orderBy: { createdAt: 'desc' }
    });
    const conversation = await prisma.conversations.findUnique({ where: { id } });

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="text-gray-400">Carregando...</span></div>}>
            <ChatIdClient id={id} empresas={empresas} companyId={conversation?.companyId ?? null} userId={conversation?.userId ?? ""} />
        </Suspense>
    )
}