"use client";

export function SupportButton() {
    const handleSuporte = () => {
        alert("Função Indisponível no momento")
    }

    return (
        <button onClick={handleSuporte} className="inter text-sm text-gray-500 cursor-pointer">
            Suporte
        </button>
    )
}
