import { prisma } from "@/src/lib/prisma";
import Container from "./ArchivesContainer";

export default async function Archives({ params }: { params: Promise<{ companyId: string }> }){
    const { companyId } = await params

    const company = await prisma.empresas.findUnique(
        { where: { id: companyId } }
    );

    return (
        <Container empresa={company}/>
    )
}