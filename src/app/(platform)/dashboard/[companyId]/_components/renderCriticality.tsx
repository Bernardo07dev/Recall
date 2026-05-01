export function renderCriticality(critic: string) {
    if (critic == "critical") {
        return (
            <p className='bg-red-500/10 mb-3 p-1 px-2 w-fit text-[11px] text-red-600 font-medium montserrat rounded-full'>
                CRÍTICO
            </p>
        )
    } else if (critic == "high") {
        return (
            <p className='bg-orange-500/10 mb-3 p-1 px-2 w-fit text-[11px] text-orange-600 font-medium montserrat rounded-full'>
                URGENTE
            </p>
        )
    } else if (critic == "medium") {
        return (
            <p className='bg-amber-500/10 mb-3 p-1 px-2 w-fit text-[11px] text-amber-600 font-medium montserrat rounded-full'>
                MODERADO
            </p>
        )
    } else if (critic == "low") {
        return (
            <p className='bg-green-500/10 mb-3 p-1 px-2 w-fit text-[11px] text-green-600 font-medium montserrat rounded-full'>
                OPCIONAL
            </p>
        )
    }
}
