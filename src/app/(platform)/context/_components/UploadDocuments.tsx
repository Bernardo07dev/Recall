'use client'
import { useState, useRef } from 'react'
import { Upload, FileText, X } from 'lucide-react'

export default function UploadDocumentos() {
    const [files, setFiles] = useState<File[]>([])
    const [dragging, setDragging] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    function handleFiles(newFiles: FileList | null) {
        if (!newFiles) return
        setFiles(prev => [...prev, ...Array.from(newFiles)])
    }

    function removeFile(index: number) {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="flex flex-col gap-3">
            {/* área de drop */}
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                    e.preventDefault()
                    setDragging(false)
                    handleFiles(e.dataTransfer.files)
                }}
                className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-3 cursor-pointer transition-colors ${
                    dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`}
            >
                <Upload size={32} className="text-gray-400" />
                <div className="text-center">
                    <p className="font-semibold mb-1 text-gray-600">Enviar Arquivos</p>
                    <p className="text-xs font-medium text-gray-400">Arraste transcrições, PDFs ou arquivos de texto</p>
                </div>
                <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer text-gray-600 text-[13px] font-semibold transition-colors">
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
                <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-xl">
                    <div className="flex items-center gap-3">
                        <FileText size={18} className="text-blue-500" />
                        <div>
                            <p className="text-[14px] text-gray-700 font-medium">{file.name}</p>
                            <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
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