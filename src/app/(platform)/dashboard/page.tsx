import { cookies } from 'next/headers'
import ChatDash from './ChatDash'
import { prisma } from '@/src/lib/prisma';
import { redirect } from "next/navigation";


export default async function ChatPage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('recall-session')?.value

  if (!userId){
    redirect("/log-in")
  }

    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

  return <ChatDash user={user} />
}