import { prisma } from "@/src/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import GeralDash from "./geralDash";

export default async function VisaoGeralPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("recall-session")?.value;

    if (!token) {
        redirect("/log-in");
    }

    let userId = "";
    try {
        const session = await decrypt(token);
        userId = session.userId as string;
    } catch {
        redirect("/api/logout");
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        redirect("/api/logout");
    }

    const business = await prisma.empresas.findMany({
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

    return <GeralDash user={user} business={business} />;
}