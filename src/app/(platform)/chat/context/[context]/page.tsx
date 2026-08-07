import { cookies } from 'next/headers'
import ChatContext from './chatContext'
import { prisma } from '@/src/lib/prisma';
import { redirect } from "next/navigation";
import { decrypt } from '@/src/lib/auth';

export default async function ContextChatPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('recall-session')?.value

  if (!token) {
    redirect("/log-in");
  }

  const session = await decrypt(token);
  const userId = session.userId as string;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const empresas = await prisma.empresas.findMany({ orderBy: { createdAt: 'desc' } });

  if (!user) {
    redirect("/api/logout");
  }

  return <ChatContext user={user} empresas={empresas} />
}
