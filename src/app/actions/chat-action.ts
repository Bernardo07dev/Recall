"use server"
import bcrypt from 'bcryptjs';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { error } from 'node:console';

export async function createConversation(userId: string, companyId: string | null){
    const validCompanyId = (!companyId || companyId === "undefined" || companyId === "teste") ? null : companyId;

    try{
        const conversation = await prisma.conversations.create({
            data: {
                userId: userId,
                title: "Nova Conversa",
                companyId: validCompanyId,
            }
        })
        return { success: true, id: conversation.id }
    } catch(error){
        console.error(error)
        return { success: false, error: "Faliure" } 
    }
}

export async function getChats(){
    try{
        const chats = await prisma.conversations.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return chats
    } catch(error){
        console.log(error)
        return { success: false, error: "Faliure" }
    }
}

export async function saveMessages(message: string, conversationId: string, role: string){
    try{
        await prisma.messages.create({
            data: {
                context: message,
                conversationId: conversationId,
                role: role as any,
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
            orderBy: { createdAt: 'desc' }
        })
        return { success: true, data: messages}
    } catch(error){
        console.log(error)
    }
}