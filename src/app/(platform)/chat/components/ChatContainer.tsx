'use client'
import { useState, useEffect, useRef } from "react"
import { ChevronDown, SendHorizontal, Loader2, X, FileText, Paperclip } from 'lucide-react';
import EmpresaSelector from "@/src/app/(platform)/chat/components/EmpresaSelector";
import * as XLSX from 'xlsx';
import { getFileIcon } from '../[id]/components/FileIcons';

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
                    reject(`Erro ao ler planilha ${file.name}`);
                }
            };
            reader.onerror = (e) => reject(e);
            reader.readAsArrayBuffer(file);
        } else {
            reject("Arquivo Proibido");
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

    const [PopUp, setPopUp] = useState<string | false>(false);

    useEffect(() => {
        if (PopUp) {
            const timer = setTimeout(() => setPopUp(false), 4000)
            return () => clearTimeout(timer)
        }
    }, [PopUp])

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        
        const ACCEPTED_TYPES = [
            'text/plain',
            'text/csv',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
        ];
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

        const validFiles = files.filter(file => {
            if (!ACCEPTED_TYPES.includes(file.type)) {
                setPopUp(`Arquivo Proibido: O arquivo ${file.name} não é suportado. Apenas arquivos .txt, .csv, .xls e .xlsx são aceitos.`)
                return false
            }
            if (file.size > MAX_FILE_SIZE) {
                setPopUp(`Arquivo Proibido: O arquivo ${file.name} é muito grande. O limite é 10MB.`)
                return false
            }
            return true
        })

        if (validFiles.length > 0 && setAttachments) {
            setAttachments(prev => [...prev, ...validFiles]);
        }
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    const handleEnviar = async () => {
        const hasAttachments = attachments && attachments.length > 0;
        if ((!input && !hasAttachments) || isStreaming || isProcessing) { return; }
        
        let finalInput = input;

        if (hasAttachments) {
            setIsProcessing(true);
            try {
                const fileContents = await Promise.all(attachments.map(file => extractTextFromFile(file)));
                const filesText = fileContents.map((content, index) => 
                    `<file-attachment name="${attachments[index].name}">\n${content}\n</file-attachment>`
                ).join('\n\n');
                
                finalInput = `${input}\n\n${filesText}`;
            } catch (error) {
                console.error("Erro ao ler arquivos", error);
                setIsProcessing(false);
                return;
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
                    <div className="flex flex-wrap gap-2 px-2 pt-2 pb-3 mb-2">
                        {attachments.map((file, idx) => {
                            const Icon = getFileIcon(file.name);
                            const ext = file.name.split('.').pop()?.toLowerCase();
                            
                            const isAudio = ['mp3', 'wav', 'ogg'].includes(ext || '');
                            const isSpreadsheet = ['csv', 'xls', 'xlsx'].includes(ext || '');
                            const isDoc = ['txt', 'pdf', 'doc', 'docx'].includes(ext || '');
                            
                            let iconColor = "text-gray-500";
                            let typeText = "File";
                            
                            if (isAudio) {
                                iconColor = "text-[#8A2BE2]"; 
                                typeText = "File";
                            } else if (isSpreadsheet) {
                                iconColor = "text-[#00A35C]";
                                typeText = "Spreadsheet";
                            } else if (isDoc) {
                                iconColor = "text-[#0078FF]"; 
                                typeText = "Document";
                            }

                            return (
                                <div key={idx} className="relative flex items-center gap-4 bg-white border border-[#EBEBEB] px-5 py-4 rounded-[1.25rem] w-[280px]">
                                    <div className={`flex-shrink-0 ${iconColor}`}>
                                        <Icon size={18} strokeWidth={2} />
                                    </div>
                                    <div className="flex flex-col overflow-hidden pr-6">
                                        <span className="text-[0.85rem] font-semibold text-gray-900 truncate leading-tight mb-0.5">{file.name}</span>
                                        <span className="text-[0.7rem] font-medium text-gray-400 leading-tight">{typeText}</span>
                                    </div>
                                    <button 
                                        onClick={() => removeAttachment(idx)} 
                                        className="absolute -top-1.5 cursor-pointer -right-1.5 bg-black text-white rounded-full p-1 hover:bg-gray-800 transition-colors"
                                    >
                                        <X size={10} strokeWidth={3} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="w-full pb-3 flex flex-row items-center">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disableInput}
                        className="p-2 ml-1 cursor-pointer text-gray-300 hover:text-gray-600 transition-colors disabled:opacity-50"
                        title="Anexar arquivo"
                    >
                        <Paperclip size={15} strokeWidth={2.5} />
                    </button>

                    <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileSelect} accept=".txt,.csv,.xls,.xlsx,.pdf,.doc,.docx,.mp3,.wav,.ogg" />

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
            {PopUp && (
                <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 bg-[#ef4444] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-4 animate-in fade-in slide-in-from-top-5 duration-300">
                    <span className="font-semibold text-sm">{PopUp}</span>
                    <button onClick={() => setPopUp(false)} className="text-white/80 hover:text-white transition-colors cursor-pointer">
                        <X size={16} />
                    </button>
                </div>
            )}
        </div>
    )
}