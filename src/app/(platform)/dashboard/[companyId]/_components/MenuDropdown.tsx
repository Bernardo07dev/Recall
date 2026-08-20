"use client"
import { useState, useRef, useEffect } from 'react'
import { Menu, LayoutDashboard, FolderOpen } from 'lucide-react'
import Link from 'next/link'

interface Props {
    companyId: string
}

export default function MenuDropdown({ companyId }: Props) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div ref={ref} className="relative">
            <div
                onClick={() => setOpen(!open)}
                className='bg-white/40 shadow-rainbow  cursor-pointer h-fit p-2 rounded-lg hover:bg-white/80 active:scale-95'
            >
                <Menu className='text-[#1565C0]/80' size={20} />
            </div>

            {open && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/80 shadow-rainbow rounded-lg overflow-hidden backdrop-blur-md z-50">
                    <Link
                            href={`/dashboard/${companyId}`}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-3 text-[13px] font-medium text-gray-700 hover:bg-[#1565C0]/5 hover:text-[#1565C0] transition-colors duration-150"
                        >
                        <LayoutDashboard size={16} />
                        Dashboard
                    </Link>
                    <Link
                        href={`/dashboard/${companyId}/archives`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-[13px] font-medium text-gray-700 hover:bg-[#1565C0]/5 hover:text-[#1565C0] transition-colors duration-150"
                    >
                        <FolderOpen size={16} />
                        Arquivos
                    </Link>
                </div>
            )}
        </div>
    )
}
