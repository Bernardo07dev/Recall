"use server"
import bcrypt from 'bcryptjs';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { error } from 'node:console';
import { generateTitle } from '@/src/lib/langchain/actionsAI';

export async function createConversation(userId: string, companyId: string | null, firstMessage?: string){
    console.log("CREATE CONVERSATION CALLED WITH COMPANYID:", companyId);
    const validCompanyId = (!companyId || companyId === "undefined" || companyId === "teste") ? null : companyId;
    const generatedTittle = await generateTitle(firstMessage || "Gere um texto básico para título, houve erro no envio da mensagem")

    try{
        const conversation = await prisma.conversations.create({
            data: {
                userId: userId,
                title: generatedTittle,
                companyId: validCompanyId,
            }
        })
        return { success: true, id: conversation.id }
    } catch(error){
        console.error(error)
        return { success: false, error: "Faliure" }
    }
}

export async function getChats(userId: string){
    try{
        const chats = await prisma.conversations.findMany({
            where: {userId: userId},
            orderBy: { createdAt: 'desc' }
        })
        return chats
    } catch(error){
        console.log(error)
        return { success: false, error: "Faliure" }
    }
}

export async function saveMessages(message: string, conversationId: string, role: string, toolMetadata?: any){
    try{
        await prisma.messages.create({
            data: {
                context: message,
                conversationId: conversationId,
                role: role as any,
                toolMetadata: toolMetadata,
            }
        })
        return { success: true }
    } catch(error){
        console.error(error)
        return { success: false, error: "Failure" }
    }
}

export async function getMessages(conversationId: string) {
    try{
        const messages = await prisma.messages.findMany({
            where: {conversationId: conversationId},
            orderBy: { createdAt: 'asc' }
        })
        return { success: true, data: messages}
    } catch(error){
        console.log(error)
    }
}