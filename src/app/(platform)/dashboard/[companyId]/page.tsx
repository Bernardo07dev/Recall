import { prisma } from "@/src/lib/prisma";
import Container from "./dashboardContainer";

export default async function Dashboard({ params }: { params: Promise<{ companyId: string }> }){
    const { companyId } = await params

    const company = await prisma.empresas.findUnique(
        { where: { id: companyId } }
    );

    console.log(company)

    return (<Container empresa={company}/>)
}