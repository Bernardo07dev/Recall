'use client'
import { useState, useEffect } from "react"
import { ChevronDown, SendHorizontal, Loader2, X, FileText } from 'lucide-react';
import EmpresaSelector from "@/src/app/(platform)/chat/components/EmpresaSelector";
import * as XLSX from 'xlsx';

interface Props {
    onEnviar: (input: string, companyId: string | null, role: "human" | "AI") => void;
    enableCompany?: boolean;
    empresas: { id: string, nome: string, industry: string }[];
    defaultCompanyId?: string | null;
    isStreaming?: boolean;
    onCompanyChange?: (companyId: string | null) => void;
    attachments?: File[];
    setAttachments?: React.Dispatch<React.SetStateAction<File[]>>;
}

const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (file.type.startsWith('text/') || file.type === 'application/json' || file.name.endsWith('.csv')) {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target?.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: 'array' });
                    let result = "";
                    workbook.SheetNames.forEach(sheetName => {
                        const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
                        result += `Planilha: ${sheetName}\n${csv}\n\n`;
                    });
                    resolve(result);
                } catch (error) {
                    resolve(`Erro ao ler planilha ${file.name}`);
                }
            };
            reader.onerror = (e) => reject(e);
            reader.readAsArrayBuffer(file);
        } else {
            resolve(`[Nome do arquivo: ${file.name} - Tipo: ${file.type}]`);
        }
    });
};

export default function ChatContainer({ onEnviar, enableCompany, empresas, defaultCompanyId, isStreaming, onCompanyChange, attachments, setAttachments }: Props) {
    const [input, setInput] = useState("")
    const [companyId, setCompanyId] = useState<string | null>(defaultCompanyId ?? null)
    const [unavailable, setUnavailable] = useState<boolean>(false)
    const [isProcessing, setIsProcessing] = useState<boolean>(false)

    useEffect(() => {
        if (defaultCompanyId !== undefined) {
            setCompanyId(defaultCompanyId)
        }
    }, [defaultCompanyId])

    const handleEnviar = async () => {
        const hasAttachments = attachments && attachments.length > 0;
        if ((!input && !hasAttachments) || isStreaming || isProcessing) { return; }
        
        let finalInput = input;

        if (hasAttachments) {
            setIsProcessing(true);
            try {
                const fileContents = await Promise.all(attachments.map(file => extractTextFromFile(file)));
                const filesText = fileContents.map((content, index) => `Arquivo anexado: ${attachments[index].name}\nConteúdo:\n${content}`).join('\n\n');
                
                finalInput = `${input}\n\n[Arquivos Anexados]\n${filesText}`;
            } catch (error) {
                console.error("Erro ao ler arquivos", error);
            }
            setIsProcessing(false);
            if (setAttachments) setAttachments([]);
        }

        onEnviar(finalInput, companyId, "human");
        setInput("");
    }

    const removeAttachment = (index: number) => {
        if (setAttachments && attachments) {
            setAttachments(attachments.filter((_, i) => i !== index));
        }
    }

    const isInputEmpty = input.trim() === "" && (!attachments || attachments.length === 0);
    const disableInput = isStreaming || isProcessing;

    return (
        <div className="relative w-full z-20">
            <style>{`
                @keyframes container-gradient-shadow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-container-gradient-shadow {
                    background: linear-gradient(90deg, #1565C0, #599be7, #9b59b6, #1565C0);
                    background-size: 300% 300%;
                    animation: container-gradient-shadow 4s ease infinite;
                    filter: blur(8px);
                }
            `}</style>

            <div className={`absolute -inset-[2px] animate-container-gradient-shadow rounded-3xl transition-opacity duration-500 pointer-events-none ${isStreaming || isProcessing ? 'opacity-20' : 'opacity-0'}`}></div>
            
            <div className={`w-full relative shadow-rainbow flex flex-col text-sm bg-white rounded-3xl p-3 border transition-colors duration-300 ${isStreaming || isProcessing ? 'border-transparent shadow-sm' : 'border-[#544a972b]'}`}>
                
                {attachments && attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 px-2 pt-2 pb-3 mb-2 border-b border-gray-100">
                        {attachments.map((file, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-[#F2F3FB] text-[#004D99] px-3 py-1.5 rounded-xl border border-[#e1e4f3] max-w-[200px]">
                                <FileText size={14} className="min-w-[14px]" />
                                <span className="text-xs font-medium truncate">{file.name}</span>
                                <button onClick={() => removeAttachment(idx)} className="ml-1 text-gray-400 hover:text-red-500 transition-colors">
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="w-full pb-3 flex flex-row items-center">
                    <input 
                        onKeyDown={(e) => e.key === 'Enter' && handleEnviar()} 
                        className="p-2 w-full font-medium focus:outline-none text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent" 
                        value={input} 
                        placeholder={isProcessing ? "Lendo arquivos..." : isStreaming ? "Aguarde a resposta..." : "Pergunte Algo..."} 
                        onChange={(e) => setInput(e.target.value)} 
                        disabled={disableInput}
                    />

                    <button 
                        className={`p-3 rounded-full flex items-center justify-center transition-all duration-300 ${isInputEmpty ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#004D99] text-white cursor-pointer hover:bg-[#003d7a]'} ${disableInput ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleEnviar}
                        disabled={disableInput || isInputEmpty}
                    >
                        {isProcessing ? <Loader2 size={15} className="animate-spin" /> : <SendHorizontal size={15} />}
                    </button>
                </div>

            {/* <div 
                className="relative w-fit text-[#1E40AF] mt-2" 
                onMouseEnter={() => setUnavailable(true)} 
                onMouseLeave={() => setUnavailable(false)}
            >
                <select 
                    className="appearance-none w-full focus:outline-none bg-[#F2F3FB] px-6 py-2 rounded-full text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed" 
                    onChange={(e) => setCompanyId(e.target.value)}
                    disabled={enableCompany}
                    value={companyId ?? undefined}
                >
                    <option value={undefined}>Sem contexto</option>
                    {empresas.map((empresa) => (
                       <option key={empresa.id} value={empresa.id}>{empresa.nome}</option> 
                    ))}
                </select>

                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <ChevronDown size={14} className="" />
                </div>
            </div> */}

            <EmpresaSelector
                empresas={empresas}
                onChange={(id) => {
                    setCompanyId(id);
                    if (onCompanyChange) onCompanyChange(id);
                }}
                disabled={enableCompany}
                defaultCompanyId={companyId}
            />

        </div>
        </div>
    )
}