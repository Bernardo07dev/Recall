"use server"
import bcrypt from 'bcryptjs';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { error } from 'node:console';

export async function createConversation(userId: string){
    try{
        await prisma.conversations.create({
            data: {
                userId: userId,
                title: "Teste",
            }
        })
    } catch(error){
        console.error(error)
        return { success: false, error: "DEU RUIM" } 
    }

    console.log("CRIADO")
    return { success: true, error: "DEU BOM" } 
}