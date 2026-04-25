'use client'
import { useState } from 'react'

interface Props {
    enabled?: boolean
    onChange?: (value: boolean) => void
}

export default function Toggle({ enabled = false, onChange }: Props) {
    const [active, setActive] = useState(enabled)

    function handleToggle() {
        setActive(prev => !prev)
        onChange?.(!active)
    }

    return (
        <button
            onClick={handleToggle}
            className={`w-11 h-6 rounded-full transition-colors duration-300 relative ${
                active ? 'bg-blue-600' : 'bg-gray-200'
            }`}
        >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                active ? 'translate-x-5' : 'translate-x-0.5'
            }`} />
        </button>
    )
}