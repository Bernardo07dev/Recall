'use client'
import { useState, useEffect, useRef } from "react"
import { ChevronDown, SendHorizontal, Loader2, X, FileText, Paperclip } from 'lucide-react';
import EmpresaSelector from "@/src/app/(platform)/chat/components/EmpresaSelector";
import * as XLSX from 'xlsx';
import { getFileIcon } from '../[id]/components/FileIcons';
import { getMentionIconSvg } from "./mentionIcons";
import { BorderBeam } from 'border-beam';

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
    const editorRef = useRef<HTMLDivElement>(null)
    const lastRangeRef = useRef<Range | null>(null)

    const saveSelection = () => {
        const editor = editorRef.current;
        if (!editor) return;
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            if (editor.contains(range.commonAncestorContainer)) {
                lastRangeRef.current = range.cloneRange();
            }
        }
    };

    useEffect(() => {
        const handleSelectionChange = () => {
            if (document.activeElement === editorRef.current || editorRef.current?.contains(document.activeElement)) {
                saveSelection();
            }
        };
        document.addEventListener('selectionchange', handleSelectionChange);
        return () => document.removeEventListener('selectionchange', handleSelectionChange);
    }, []);

    useEffect(() => {
        if (defaultCompanyId !== undefined) {
            setCompanyId(defaultCompanyId)
        }
    }, [defaultCompanyId])

    const getTextWithMentions = (root: HTMLElement): string => {
        let result = '';
        const traverse = (node: Node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                result += (node.nodeValue || '').replace(/\u00A0/g, ' ');
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const el = node as HTMLElement;
                const mention = el.getAttribute('data-mention');
                const icon = el.getAttribute('data-icon');
                if (mention !== null) {
                    if (icon) {
                        result += `<mention icon="${icon}">${mention}</mention>`;
                    } else {
                        result += `<mention>${mention}</mention>`;
                    }
                } else if (el.tagName === 'BR') {
                    result += '\n';
                } else {
                    for (let i = 0; i < el.childNodes.length; i++) {
                        traverse(el.childNodes[i]);
                    }
                    if (el.tagName === 'DIV' && el !== root) {
                        result += '\n';
                    }
                }
            }
        };
        traverse(root);
        return result;
    };

    const updateValue = () => {
        if (!editorRef.current) return;
        const text = getTextWithMentions(editorRef.current);
        setInput(text);
    };

    const createMentionElement = (title: string, icon = 'ChartNoAxesCombined'): HTMLElement => {
        const span = document.createElement('span');
        span.setAttribute('data-mention', title);
        span.setAttribute('data-icon', icon);
        span.contentEditable = 'false';
        span.className = 'mention-pin';
        
        const iconSpan = document.createElement('span');
        iconSpan.className = 'mention-icon';
        iconSpan.innerHTML = getMentionIconSvg(icon);
        
        const textSpan = document.createElement('span');
        textSpan.className = 'mention-text';
        textSpan.textContent = title;
        
        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'mention-close';
        closeBtn.title = 'Remover menção';
        closeBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
        
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            span.remove();
            updateValue();
        });

        span.appendChild(iconSpan);
        span.appendChild(textSpan);
        span.appendChild(closeBtn);
        return span;
    };

    const scanAndReplaceAllMentions = (root: HTMLElement): boolean => {
        const regex = /<mention(?: icon="([^"]+)")?>([\s\S]*?)<\/mention>/i;
        let replacedAny = false;
        let found = true;
        
        while (found) {
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
            let targetNode: Text | null = null;
            let match: RegExpExecArray | null = null;
            let current = walker.nextNode();
            
            while (current) {
                const parentMention = (current.parentElement as HTMLElement)?.closest('[data-mention]');
                if (!parentMention) {
                    const m = regex.exec(current.nodeValue || '');
                    if (m) {
                        targetNode = current as Text;
                        match = m;
                        break;
                    }
                }
                current = walker.nextNode();
            }

            if (!targetNode || !match) {
                found = false;
                break;
            }

            replacedAny = true;
            const fullMatch = match[0];
            const icon = match[1] || 'ChartNoAxesCombined';
            const mentionContent = match[2];
            const startIndex = match.index;
            const endIndex = startIndex + fullMatch.length;
            const textBefore = (targetNode.nodeValue || '').substring(0, startIndex);
            const textAfter = (targetNode.nodeValue || '').substring(endIndex);

            const parent = targetNode.parentNode;
            if (!parent) break;

            const beforeNode = textBefore ? document.createTextNode(textBefore) : null;
            const mentionEl = createMentionElement(mentionContent, icon);
            const afterNode = document.createTextNode(textAfter.length > 0 ? textAfter : '\u00A0');

            if (beforeNode) {
                parent.insertBefore(beforeNode, targetNode);
            }
            parent.insertBefore(mentionEl, targetNode);
            parent.insertBefore(afterNode, targetNode);
            parent.removeChild(targetNode);

            const sel = window.getSelection();
            if (sel) {
                const range = document.createRange();
                range.setStart(afterNode, textAfter.length > 0 ? 0 : 1);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }

        return replacedAny;
    };

    const insertMention = (title: string, icon = 'ChartNoAxesCombined') => {
        const editor = editorRef.current;
        if (!editor) return;

        let range = lastRangeRef.current;
        if (range && !editor.contains(range.commonAncestorContainer)) {
            range = null;
        }

        if (!range) {
            range = document.createRange();
            range.selectNodeContents(editor);
            range.collapse(false);
        }

        const sel = window.getSelection();
        if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
        }

        const mentionEl = createMentionElement(title, icon);
        const spaceNode = document.createTextNode('\u00A0');

        range.deleteContents();
        range.insertNode(spaceNode);
        range.insertNode(mentionEl);

        const newRange = document.createRange();
        newRange.setStart(spaceNode, 1);
        newRange.collapse(true);
        sel?.removeAllRanges();
        sel?.addRange(newRange);

        lastRangeRef.current = newRange.cloneRange();
        editor.focus();

        updateValue();
    };

    const handleInput = () => {
        if (!editorRef.current) return;
        scanAndReplaceAllMentions(editorRef.current);
        saveSelection();
        updateValue();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleEnviar();
            return;
        }

        if (e.key === 'Backspace') {
            const sel = window.getSelection();
            if (sel && sel.isCollapsed && sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);
                if (range.startOffset === 0) {
                    const prevNode = range.startContainer.previousSibling;
                    if (prevNode && (prevNode as HTMLElement).getAttribute?.('data-mention')) {
                        e.preventDefault();
                        prevNode.parentNode?.removeChild(prevNode);
                        updateValue();
                        return;
                    }
                }
            }
        }
    };

    useEffect(() => {
        const handleAddInsight = (e: any) => {
            if (e.detail?.title) {
                insertMention(e.detail.title, e.detail.icon || 'ChartNoAxesCombined');
            }
        };
        window.addEventListener('add-insight', handleAddInsight);
        return () => window.removeEventListener('add-insight', handleAddInsight);
    }, []);

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
        const currentInput = editorRef.current ? getTextWithMentions(editorRef.current) : input;
        if ((!currentInput.trim() && !hasAttachments) || isStreaming || isProcessing) { return; }
        
        let finalInput = currentInput.trim();

        if (hasAttachments) {
            setIsProcessing(true);
            try {
                const fileContents = await Promise.all(attachments.map(file => extractTextFromFile(file)));
                const filesText = fileContents.map((content, index) => 
                    `<file-attachment name="${attachments[index].name}">\n${content}\n</file-attachment>`
                ).join('\n\n');
                
                finalInput = finalInput ? `${finalInput}\n\n${filesText}` : filesText;
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
        lastRangeRef.current = null;
        if (editorRef.current) {
            editorRef.current.innerHTML = "";
        }
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
            <BorderBeam
                size="pulse-outside"
                colorVariant="colorful"
                strength={2}
                brightness={1.7}
                saturation={0.5}
                glowSize={1.5}
                active={Boolean(isStreaming || isProcessing)}
                theme="light"
                borderRadius={24}
                className="w-full rounded-3xl"
                style={{
                    overflow: 'visible',
                    '--beam-stroke-opacity': 3.5,
                    '--beam-bloom-opacity': 2.2,
                    '--beam-inner-opacity': 2,
                } as React.CSSProperties}
            >
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
                                <div key={`file-${idx}`} className="relative flex items-center gap-4 bg-white border border-[#EBEBEB] px-5 py-4 rounded-[1.25rem] w-[280px]">
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

                <div className="w-full pb-3 flex flex-row items-center gap-2">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disableInput}
                        className="p-2 ml-1 cursor-pointer text-gray-300 hover:text-gray-600 transition-colors disabled:opacity-50 flex-shrink-0"
                        title="Anexar arquivo"
                    >
                        <Paperclip size={15} strokeWidth={2.5} />
                    </button>

                    <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileSelect} accept=".txt,.csv,.xls,.xlsx,.pdf,.doc,.docx,.mp3,.wav,.ogg" />

                    <div className="relative flex-1 min-w-[200px] flex items-center">
                        {isInputEmpty && (
                            <span className="absolute left-2 text-gray-400 font-medium pointer-events-none select-none text-sm">
                                {isProcessing ? "Lendo arquivos..." : isStreaming ? "Aguarde a resposta..." : "Pergunte Algo..."}
                            </span>
                        )}
                        <div
                            ref={editorRef}
                            contentEditable={!disableInput}
                            onInput={handleInput}
                            onKeyDown={handleKeyDown}
                            onKeyUp={saveSelection}
                            onMouseUp={saveSelection}
                            onBlur={saveSelection}
                            className="p-2 w-full font-medium focus:outline-none text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent min-h-[38px] max-h-32 overflow-y-auto break-words whitespace-pre-wrap text-sm leading-relaxed"
                            role="textbox"
                            aria-multiline="true"
                        />
                    </div>

                    <button 
                        className={`p-3 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${isInputEmpty ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#004D99] text-white cursor-pointer hover:bg-[#003d7a]'} ${disableInput ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleEnviar}
                        disabled={disableInput || isInputEmpty}
                    >
                            {isProcessing || isStreaming ? <Loader2 size={15} className="animate-spin" /> : <SendHorizontal size={15} />}
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
            </BorderBeam>
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