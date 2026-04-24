'use client'
import { ChartBar, NotebookText, Map } from 'lucide-react';
import ChatDashboard from './ChatContainer'

interface UserType {
  id: string
  nome: string
  email: string
  cargo: string
  area: string
  password: string
  createdAt: Date
}

interface Props {
  user: UserType | null
}

export default function Dashboard({ user }: Props) {

    console.log(user)

    const nome = user?.nome?.split(" ")[0];

    const recebeAMensagem = (msg: string, companyId: string | null) => {
        console.log("mensagem:", msg)
        console.log("empresa:", companyId)
    }

    return (
        <main className="py-8 px-[15%] w-full flex flex-col items-center justify-between min-h-screen bg-[#fbfbff]">
            <div className="w-full py-18 flex flex-col items-start gap-2">
                <h1 className="text-3xl font-bold">Olá, {nome}!</h1>
                <p className="text-gray-500 font-semibold text-[15px] mb-4 -mt-1">Como posso te ajudar hoje?</p>
                <section className="flex flex-row gap-4">
                    <div className="bg-white p-6 w-[33%] rounded-2xl flex flex-col shadow-sm shadow-gray-100 cursor-pointer gap-1">
                        <ChartBar size={36} className="bg-[#EFF6FF] text-[#2563EB] mb-2 p-2 rounded-xl "/>
                        <h1 className="text-md font-bold">Oportunidades</h1>
                        <p className="text-xs font-semibold text-gray-400">Pergunte para o Recall mapear todas as possíveis oportunidades da empresa escolhida</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl w-[33%] flex flex-col shadow-sm shadow-gray-100 cursor-pointer gap-1">
                        <NotebookText size={36} className="bg-[#FFEEE6] text-[#813900] mb-2 p-2 rounded-xl "/>
                        <h1 className="text-md font-bold">Retenção</h1>
                        <p className="text-xs font-semibold text-gray-400">Pergunte para o Recall identificar insatisfação ou risco na contexto da empresa</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl flex w-[33%] flex-col shadow-sm shadow-gray-100 cursor-pointer gap-1">
                        <Map size={36} className="bg-[#D1FFE5] text-[#25751D] mb-2 p-2 rounded-xl "/>
                        <h1 className="text-md font-bold">Mapeamento</h1>
                        <p className="text-xs font-semibold text-gray-400">Pergunte para o Recall mapear os produtos que estão sendo comentados ou possíveis ofertas</p>
                    </div>
                </section>
            </div>

            <section className='w-[80%]'>
                <ChatDashboard onEnviar={recebeAMensagem} />
            </section>
        </main>
    );
}