import { prisma } from "@/src/lib/prisma";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

export async function fetchCompany(companyId: string) {
    const data = await prisma.empresas.findUnique({
        where: {id: companyId}
    })

    return data
}

export async function fetchMessages(chatId: string) {
    const messages = await prisma.messages.findMany({
        where: { conversationId: chatId },
        orderBy: { createdAt: "asc" }
    });

    return messages.map(msg => {
        if (msg.role === "human") {
            return new HumanMessage(msg.context);
        } else {
            return new AIMessage(msg.context);
        }
    });
}