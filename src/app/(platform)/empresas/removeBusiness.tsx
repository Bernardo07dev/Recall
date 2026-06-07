"use client"
import { deleteBusiness } from "@/src/app/actions/user-actions"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RemoveBusiness({ businessId }: { businessId: string }){
    const router = useRouter();

    const handleDelete = async () => {
        await deleteBusiness(businessId);
        router.push("/empresas");
    };

    return (
        <Trash onClick={handleDelete} className="mr-2 text-gray-400 hover:text-red-500 hover:text-2xl cursor-pointer" size={16} />
    )
}