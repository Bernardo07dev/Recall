'use client'
import { useState, useRef } from 'react'
import { Upload, FileText, X } from 'lucide-react'

interface Props {
    onChange: (files: File[]) => void
}

export default function UploadDocumentos({ onChange }: Props) {
    const [files, setFiles] = useState<File[]>([])
    const [dragging, setDragging] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    function handleFiles(newFiles: FileList | null) {
        if (!newFiles) return
        const updated = [...files, ...Array.from(newFiles)]
        setFiles(updated)
        onChange(updated)
    }

    function removeFile(index: number) {
        const updated = files.filter((_, i) => i !== index)
        setFiles(updated)
        onChange(updated)
    }

    return (
        <div className="flex flex-col gap-2">
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                    e.preventDefault()
                    setDragging(false)
                    handleFiles(e.dataTransfer.files)
                }}
                className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 ${
                    dragging ? 'border-blue-500 bg-blue-50 shadow-[0_0_20px_rgba(90,94,185,0.25)]' : 'border-gray-200 hover:border-[#5A5EB9]/40 hover:shadow-[0_0_24px_rgba(90,94,185,0.15)]'
                }`}
            >
                <Upload size={24} className="text-[#1565C0]/75" />
                <div className="text-center">
                    <p className="font-semibold text-[0.85rem] text-gray-600">Enviar Arquivos</p>
                    {/* <p className="text-xs font-medium text-gray-400">Arraste transcrições, PDFs ou arquivos de texto</p> */}
                </div>
                <button className="flex items shadow-rainbow-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer text-gray-600 text-[0.70rem] font-semibold transition-colors">
                    Escolher Arquivos
                </button>
            </div>

            <input
                ref={inputRef}
                type="file"
                multiple
                className="hidden"
                accept=".pdf,.txt,.csv,.xlsx"
                onChange={(e) => handleFiles(e.target.files)}
            />

            {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-xl">
                    <div className="flex items-center gap-3">
                        <FileText size={18} className="text-blue-500" />
                        <div>
                            <p className="text-[0.8rem] text-gray-700 font-medium">{file.name}</p>
                            <p className="text-[0.7rem] text-gray-400">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                        </div>
                    </div>
                    <button onClick={() => removeFile(index)}>
                        <X size={16} className="text-gray-400 cursor-pointer hover:text-red-500 transition-colors" />
                    </button>
                </div>
            ))}
        </div>
    )
}