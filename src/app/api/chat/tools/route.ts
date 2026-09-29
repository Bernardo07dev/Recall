import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get('chatId');

  if (!chatId) return NextResponse.json({ error: 'Missing chatId' }, { status: 400 });

  try {
    const tools = await prisma.conversationTool.findMany({
      where: { conversationId: chatId },
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json({ tools });
  } catch (error) {
    console.error("Erro listando tools", error);
    return NextResponse.json({ error: 'Error fetching tools' }, { status: 500 });
  }
}
