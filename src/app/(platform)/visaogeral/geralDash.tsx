'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Calendar,
    TableOfContents,
    ShieldAlert,
    Layers,
    ArrowRight,
} from "lucide-react";
import EmpresasCriticalidade, { getChurnRisk } from "./components/EmpresasCriticalidade";

interface UserType {
    id: string;
    nome: string;
    email: string;
    cargo: string;
    area: string;
    createdAt: Date;
}

interface GeralDashProps {
    user: UserType | null;
    business: any[];
}

function getTodayFormatted() {
    const now = new Date();
    const weekday = now.toLocaleDateString("pt-BR", { weekday: "long" });
    const day = now.getDate();
    const month = now.toLocaleDateString("pt-BR", { month: "long" });

    const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

    return `${capitalizedWeekday}, ${day} de ${capitalizedMonth}`;
}

export default function GeralDash({ user, business }: GeralDashProps) {
    const nome = user?.nome?.split(" ")[0] || user?.nome || "Usuário";
    const [currentDate, setCurrentDate] = useState(getTodayFormatted);
    const totalContextos = business?.length || 0;

    const contextosCriticos = business?.filter((empresa) => {
        const churn = getChurnRisk(empresa.json);
        return empresa.json && churn && churn.label === "Crítico";
    }).length || 0;

    useEffect(() => {
        setCurrentDate(getTodayFormatted());
    }, []);

    return (
        <main className="pt-18 pb-12 px-[5%]">
            <section className="flex flex-row justify-between items-start">
                <div>
                    <h1 className="text-4xl font-bold mb-1">Bem vindo {nome}!</h1>
                    <p className="text-gray-500 font-medium text-sm mb-4">Veja a visão geral do seu espaço de trabalho</p>
                </div>
                <div className="flex items-center text-[0.8rem] gap-2.5 px-4 py-2 bg-white rounded-xl shadow-rainbow text-slate-700/80 font-semibold">
                    <Calendar className="w-3 h-3 text-blue-600" />
                    <span suppressHydrationWarning>{currentDate}</span>
                </div>
            </section>

            <section className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                    <h1 className="text-[0.7rem] font-semibold text-gray-500 uppercase tracking-wider">SEUS CONTEXTOS</h1>
                    <span className="text-[0.7rem] font-semibold text-[#1565C0] bg-[#EFF6FF] px-2 py-0.5 rounded-full">
                        {totalContextos}
                    </span>
                </div>

                <div className="flex flex-row flex-wrap gap-4">
                    <div className="bg-white shadow-rainbow rounded-2xl p-4 border border-gray-100/80 w-fit min-w-[220px] flex items-center gap-3.5">
                        <div className="bg-[#EFF6FF] text-[#1565C0] p-2.5 rounded-xl">
                            <TableOfContents size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold uppercase text-gray-400 tracking-wider">total</p>
                            <div className="flex items-baseline gap-1.5">
                                <p className="text-xl font-bold text-gray-800 tracking-tight">{totalContextos}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-rainbow rounded-2xl shadow-red p-4 border border-gray-100/80 w-fit min-w-[220px] flex items-center gap-3.5">
                        <div className="bg-red-50 text-red-600 p-2 rounded-xl">
                            <ShieldAlert size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold uppercase text-gray-400 tracking-wider">Churn crítico</p>
                            <div className="flex items-baseline gap-1.5">
                                <p className="text-xl font-bold text-gray-800 tracking-tight">{contextosCriticos}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Layers size={14} className="text-gray-400" />
                        <h2 className="text-[0.7rem] font-semibold text-gray-500 uppercase tracking-wider">
                            EMPRESAS & CRITICALIDADE • INSIGHTS PRIORIZADOS ({business?.length || 0})
                        </h2>
                    </div>
                    <Link
                        href="/empresas"
                        className="text-xs font-semibold text-[#1565C0] hover:text-[#0d47a1] flex items-center gap-1 transition-colors"
                    >
                        <span>Ver todas as {business?.length || 0} contas</span>
                        <ArrowRight size={13} />
                    </Link>
                </div>

                <EmpresasCriticalidade business={business} />
            </section>
        </main>
    );
}



