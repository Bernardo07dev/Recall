import Image from "next/image";
import { ArrowLeft, FileText, UploadCloud } from "lucide-react";
import MenuDropdown from "@/src/app/(platform)/dashboard/[companyId]/_components/MenuDropdown";

interface Empresa {
    id: string
    nome: string
    content: string
    json: any
    context: string | null
    resume: string | null
    industry: string
    files: string[]
    logo: string | null
    relation: string | null
    status: string;
    createdAt: Date
}

interface Props {
    empresa: Empresa | null
}

export default function Container({ empresa }: Props) {
    const files = empresa?.files ?? [];

    return (
        <main className="p-14 pt-16 animate-fade-in">
            <div className='w-full flex flex-row justify-between items-start mb-6'>
                <MenuDropdown companyId={empresa?.id ?? ""} />
            </div>
            <div>
                <Image src="/RECALL-logo.svg" className='w-16' alt="Logo" width={150} height={40}/>
                <div className='flex flex-row items-baseline gap-1'>
                    <h1 className='text-4xl font-bold mb-2'>Arquivos</h1>
                    <h1 className='font-semibold text-gray-500'>{empresa && empresa.nome}</h1>
                </div>
            </div>

            <div className="mt-6">
                {files.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 mb-5">
                            <UploadCloud size={28} className="text-[#1565C0]" />
                        </div>
                        <p className="text-lg font-semibold text-gray-700">Nenhum arquivo enviado</p>
                        <p className="text-sm text-gray-400 mt-1">Faça upload de arquivos para visualizá-los aqui.</p>
                    </div>
                ) : (
                    <div className="relative">
                        <div className="absolute -inset-0.5 rainbow-shadow rounded-2xl opacity-5"></div>
                        <div className="relative z-10 bg-white p-4 py-6 rounded-xl">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs font-semibold text-gray-400 border-b border-gray-100">
                                    <th className="pb-3 pl-4 font-semibold">Arquivo</th>
                                    <th className="pb-3 font-semibold">Tipo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {files.map((file, index) => {
                                    const fileName = file.split('/').pop() ?? file;
                                    const extension = fileName.split('.').pop()?.toUpperCase() ?? '';

                                    return (
                                        <tr
                                            key={index}
                                            className="group border-b border-gray-50 hover:bg-gray-50/60 transition-colors duration-150 cursor-pointer"
                                        >
                                            <td className="py-3 pl-4">
                                                <div className="flex flex-row items-center gap-1">
                                                    <div className="flex items-center justify-center w-9 h-9 rounded-lg">
                                                        <FileText size={17} className="text-gray-800/60" />
                                                    </div>
                                                    <p className="text-[0.8rem] font-medium text-gray-600 truncate max-w-xs" title={fileName}>
                                                        {fileName}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                {extension && (
                                                    <span className="text-[10px] font-bold tracking-wider text-[#1565C0] bg-blue-50 px-2 py-0.5 rounded-full">
                                                        {extension}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    </div>
                )}
            </div>
        </main>
    )
}