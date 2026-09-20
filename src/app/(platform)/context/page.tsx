"use client"
import { ArrowLeft, ArrowRight, BriefcaseBusiness, FileUp, Lock, Workflow } from "lucide-react";
import Link from "next/link";
import SelectIndustry from "@/src/app/(platform)/context/_components/SelectIndustry";
import UploadDocumentos from "@/src/app/(platform)/context/_components/UploadDocuments";
import Toggle from "@/src/app/(platform)/context/_components/Toggle";
import { SiJira, SiGooglemeet, SiWhatsapp } from '@icons-pack/react-simple-icons';
import UploadLogo from "@/src/app/(platform)/context/_components/uploadLogo";
import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { createEmpresa } from "@/src/app/actions/user-actions";
import Loading from "@/src/app/(platform)/loading";

interface EmpresaForm {
  nome: string;
  content: string;
  industria: string;
  arquivos: File[];
}

export default function ContextPage(){
    const [form, setForm] = useState<EmpresaForm>({
        nome: "",
        content: "",
        industria: "",
        arquivos: [],
    })
    const router = useRouter();
    const [nomeEmpyty, setnomeEmpyty] = useState(false)
    const [contentEmpyty, setcontentEmpyty] = useState(false)
    const [industriaEmpyty, setindustriaEmpyty] = useState(false)
    const [arquivos, setArquivos] = useState<File[]>([])
    const [logo, setLogo] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [meetSelected, setMeetSelected] = useState(false)
    const [jiraSelected, setJiraSelected] = useState(false)
    const [whatsappSelected, setWhatsappSelected] = useState(false)
    const [isPublic, setIsPublic] = useState(false)
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> ) => {
        const { name, value } = e.target;    
        setForm((prevState) => ({...prevState, [name]: value,}));
    };

    const emptyFields = !form.nome || !form.content || !form.industria

    const invalidField = () => {
        if (!form.nome){
            setnomeEmpyty(true)
        } else(
            setnomeEmpyty(false)
        )

        if (!form.content){
            setcontentEmpyty(true)
        }else{
           setcontentEmpyty(false) 
        }

        if(!form.industria){
            setindustriaEmpyty(true)
        }else{
            setindustriaEmpyty(false)
        }
    }

    const handleSubmit = async () => {
        if (emptyFields){
            invalidField()
            return
        }
        
        setLoading(true)

        const data = new window.FormData();
        data.append("nome", form.nome);
        data.append("content", form.content);
        data.append("industria", form.industria);
        arquivos.forEach(file => data.append("arquivos", file))
        if (logo) data.append("logo", logo);
        data.append("isPublic", String(isPublic));

        try {
            const result = await createEmpresa(null, data);

            if (result && result.success) {
                router.push("/empresas");
            } else {
                invalidField()
                setLoading(false)
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
    <>
    {loading ? ( <Loading />) : (
                <main className="pt-18 pb-12 px-[4%]">
                
                    <Link href="/empresas" className="flex flex-row text-[#1565C0] font-bold gap-1 items-center mb-4">
                        <ArrowLeft size={18} />
                        <p className="text-[0.75rem]">Voltar para Empresas</p>
                    </Link>
                    <h1 className="text-xl font-bold mb-4">Crie um novo contexto de empresa</h1>
                    {/* <p className="text-gray-500 font-medium text-sm mb-4">Configure o contexto desta empresa para que o Recall possa extrair inteligência real das suas conversas e transformá-las em decisões.</p> */}
                
                <section className="flex flex-row gap-4">
                    {/* SECÇÃO INFORMAÇÕES  */}
                    <div className="w-full">
                        <section className={`bg-white shadow-rainbow p-6 rounded-3xl border-2 transition-all duration-300 ${isPublic ? 'border-[#5A5EB9]/20' : 'border-transparent'}`}>
                        <div className="flex flex-row gap-3 items-center mb-6">
                            <div className="flex flex-row gap-2 items-center">
                                <BriefcaseBusiness size={34} className="bg-[#EFF6FF] text-[#1565C0] p-2 rounded-lg" />
                                <h1 className="font-bold text-[1rem]">Informações da Empresa</h1>
                            </div>

                            <Toggle isPublic={isPublic} onChange={setIsPublic} />
                        </div>
                        <form>
                            <div className="flex flex-row w-full gap-2">
                                <div className="w-full">
                                    <h1 className='text-[0.65rem] font-semibold mb-2 text-gray-400'>NOME DA EMPRESA</h1>
                                    <input className={`mb-6 border-[1.55px] border-[#C2C6D4]/30 rounded-xl transition-all placeholder:text-gray-400 font-medium w-full py-[11px] px-3 text-[13px] 
                                ${nomeEmpyty
                                            ? 'border-red-400 focus:outline-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.15)]'
                                            : 'border-[#C2C6D4]/30 focus:outline-sky-500 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.15)]'}`}
                                        type='text' placeholder='ex: Totvs' name='nome' onChange={handleChange} value={form.nome}>
                                    </input>
                                    {nomeEmpyty && <p className="text-red-500 pb-4 text-[12px] -mt-5 pl-1 font-semibold animate-fade-in">Este campo precisa ser preenchido</p>}
                                </div>
                        
                                <div className="w-full">
                                    <h1 className='text-[0.65rem] font-semibold mb-2 text-gray-400'>INDUSTRIA</h1>
                                    <SelectIndustry empytyState={industriaEmpyty} value={form.industria} name="industria" onChange={handleChange} />
                                    {industriaEmpyty && <p className="text-red-500 pb-4 text-[12px] -mt-5 pl-1 font-semibold animate-fade-in">Este campo precisa ser preenchido</p>}
                                </div>

                                <div className="w-full">
                                    <h1 className='text-[0.65rem] font-semibold mb-1.5 text-gray-400'>LOGO DA EMPRESA (opicional)</h1>
                                    <UploadLogo logo={logo} setLogo={setLogo} />
                                </div>
                            </div>
                                    
                            <h1 className='text-[0.65rem] -mt-1  font-semibold text-gray-400 mb-2'>DESCRIÇÃO</h1>
                                    <textarea className={`border-[1.55px] border-[#C2C6D4]/30 rounded-xl transition-all placeholder:text-gray-400 font-medium w-full py-[11px] px-3 text-[13px] 
                                        ${contentEmpyty ? 'border-red-400 focus:outline-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.15)]'
                                    : 'border-[#C2C6D4]/30 focus:outline-sky-500 focus:shadow-[0_0_0_4px_rgba(14,165,233,0.15)]'}`}
                                rows={4} onChange={handleChange} value={form.content} placeholder='Descreva o momento atual desse cliente, dores conhecidas, histórico relevante e o que o Recall precisa saber...' name='content'>
                            </textarea>
                            {contentEmpyty && <p className="text-red-500 pb-4 text-[12px] -mt-5 pl-1 font-semibold animate-fade-in">Este campo precisa ser preenchido</p>}
                        </form>
                </section>
                <div onClick={handleSubmit} className="w-full flex my-4">
                    <button className="flex flex-row items-center gap-2 text-white rounded-xl shadow-rainbow font-semibold p-3 px-4 text-[0.8rem] cursor-pointer bg-[#1565C0] hover:bg-[#114b90] transition-colors">
                        Criar Contexto
                        <ArrowRight size={16} strokeWidth={2.5} />
                    </button>
                </div>
                </div>

                    <div className="flex flex-col gap-4 w-[60%]">
                        {/* SECÇÃO DOCUMENTOS */}
                        <div className="relative h-fit w-full">
                            <div className="absolute -inset-0.5 rainbow-shadow rounded-xl opacity-10"></div>
                            <section className="relative z-10 bg-white/95 p-6 rounded-3xl">
                                <div className="flex flex-row gap-2 items-center mb-4">
                                    <FileUp size={34} className="bg-[#EFF6FF] text-[#1565C0] p-2 rounded-lg" />
                                        <h1 className="font-bold text-[1rem]]">Documentos</h1>
                                </div>
                                <UploadDocumentos onChange={(files) => setArquivos(files)} />
                            </section>
                        </div>

                        {/* SECÇÃO INTEGRAÇÕES */}
                        <div className="relative h-fit w-full">
                            <div className="absolute -inset-0.5 rainbow-shadow rounded-xl opacity-10"></div>
                            <section className="relative z-10 bg-white/95 p-6 rounded-3xl">
                            <div className="flex flex-row gap-2 items-center mb-4">
                                <Workflow size={34} className="bg-[#EFF6FF] text-[#1565C0] p-2 rounded-lg" />
                                <div>
                                    <div className="flex flex-row items-center gap-1 mb-[0.5px]">
                                        <h1 className="font-bold text-[1rem]">Integrações</h1>
                                        <p className="text-[0.6rem] font-bold text-gray-600 bg-gray-100 p-1 rounded-md px-2">EM BREVE</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row gap-2">
                                <div onClick={() => setMeetSelected(!meetSelected)} className={`bg-white shadow-sm shadow-rainbow w-[33.3%] flex flex-row items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${meetSelected ? 'border-[#1565C0]' : 'border-transparent'}`}>
                                        <img src="/google-meet.svg" alt="Google Meet" width={16} height={16} />
                                    <h1 className="font-bold text-[0.75rem] text-gray-800">Google Meet</h1>
                                </div>

                                <div onClick={() => setJiraSelected(!jiraSelected)} className={`bg-white/50 shadow-rainbow w-[33.3%] flex flex-row items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${jiraSelected ? 'border-[#1565C0]' : 'border-transparent'}`}>
                                        <SiJira color="#2D88FF" size={15} />
                                    <h1 className="font-bold text-[0.75rem] text-gray-800">Jira</h1>
                                </div>

                                <div onClick={() => setWhatsappSelected(!whatsappSelected)} className={`relative group bg-white/50 shadow-rainbow w-[33.3%] flex flex-row items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${whatsappSelected ? 'border-[#1565C0]' : 'border-transparent'}`}>
                                        <SiWhatsapp color="#25D366" size={15} />
                                    <h1 className="font-bold text-[0.75rem] text-gray-800">WhatsApp</h1>
                                    <Lock size={12} className="text-gray-400 -ml-1" />
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[0.65rem] font-medium px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Sujeito a aprovação</span>
                                </div>
                            </div>
                        </section>
                        </div>


                    </div>
                </section>
                </main>
            )}
    </>
    )
}