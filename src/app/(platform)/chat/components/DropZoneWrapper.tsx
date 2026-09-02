'use client'
import { useState, useRef } from 'react'
import { FileCode, ImageIcon, FileText } from 'lucide-react'

interface Props {
    children: React.ReactNode
    onFilesDropped: (files: File[]) => void
}

const ACCEPTED_TYPES = [
    'application/pdf',
    'text/plain',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export default function DropZoneWrapper({ children, onFilesDropped }: Props) {
    const [isDragging, setIsDragging] = useState(false)
    const dragCounter = useRef(0)

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault()
        dragCounter.current++
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        dragCounter.current--
        if (dragCounter.current === 0) setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        dragCounter.current = 0
        setIsDragging(false)
        const droppedFiles = Array.from(e.dataTransfer.files)
        if (droppedFiles.length > 0) {
            alert(`Você soltou o arquivo ${droppedFiles[0].name}`)
        }

        const validFiles = droppedFiles.filter(file => {
            if (!ACCEPTED_TYPES.includes(file.type)) {
                console.warn(`Tipo não suportado: ${file.name} (${file.type})`)
                return false
            }
            if (file.size > MAX_FILE_SIZE) {
                console.warn(`Arquivo muito grande: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)`)
                return false
            }
            return true
        })

        if (validFiles.length > 0) {
            onFilesDropped(validFiles)
        }
    }

    return (
        <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="relative w-full h-full"
        >
            {children}

            {/* {isDragging && (
                <div className="fixed inset-0 z-50 bg-blue-500/5 backdrop-blur-[2px] flex items-center justify-center transition-all duration-200">
                    <div className="flex flex-col items-center gap-3 p-10 rounded-3xl border-2 border-dashed border-blue-400 bg-white/80">
                        <CloudUpload size={40} className="text-blue-500" />
                        <p className="text-blue-600 text-base font-semibold">Solte seus arquivos aqui</p>
                        <p className="text-gray-400 text-xs">PDF, TXT, CSV, XLSX — até 10MB</p>
                    </div>
                </div>
            )} */}

            {isDragging && ( <div className="fixed inset-0 z-50 bg-white/20 backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-200">
                <div className="flex flex-col items-center p-10 rounded-3xl">
                    <div className="relative flex items-center justify-center h-24 w-24 mb-6">
                        <div className="absolute -left-6 top-2 bg-[#9ba7ff] text-white p-3 rounded-xl -rotate-12 shadow-lg">
                            <FileCode size={32} strokeWidth={2} />
                        </div>
                        <div className="absolute -right-6 top-2 bg-[#8292ff] text-white p-3 rounded-xl rotate-12 shadow-lg">
                            <FileText size={32} strokeWidth={2} />
                        </div>
                        <div className="absolute z-10 bg-[#3b55ff] text-white p-4 rounded-2xl shadow-xl">
                            <ImageIcon size={40} strokeWidth={2.5} />
                        </div>
                    </div>
                    <p className="text-black text-2xl font-bold">Solte seus arquivos aqui</p>
                    <p className="text-gray-700 text-sm mt-2 font-medium">Adicione qualquer arquivo PDF, TXT, CSV, XLSX — até 10MB</p>
                </div>
            </div>
            )}
        </div>
    )
}
