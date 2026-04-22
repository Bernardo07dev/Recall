import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";

export default async function Dashboard() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("recall-session")?.value;

    if (!userId) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    return (
        <main className="py-22 px-12">
            <h1 className="text-2xl font-bold">Olá, {user?.nome}!</h1>
            <p>Seu e-mail é: {user?.email}</p>
        </main>
    );
}