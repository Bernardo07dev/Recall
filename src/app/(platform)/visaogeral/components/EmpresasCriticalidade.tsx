'use client';
import { useRouter } from "next/navigation";
import {
    Clock,
    AlertCircle,
    Landmark,
    CheckCheck,
} from "lucide-react";

export function parseCompanyJson(json: any) {
    if (!json) return null;
    try {
        return typeof json === "string" ? JSON.parse(json) : json;
    } catch {
        return null;
    }
}

export function getRelativeTime(dateInput: Date | string) {
    if (!dateInput) return "Recente";
    const date = new Date(dateInput);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Agora";
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `${diffDays} dias atrás`;
    return date.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
}

export function getChurnRisk(json: any) {
    if (!json) return null;
    try {
        const parsed = typeof json === "string" ? JSON.parse(json) : json;
        const risk = parsed?.indicators?.churn_risk;
        if (typeof risk !== "number") return null;

        if (risk >= 70) {
            return { value: risk, label: "Crítico" };
        } else if (risk >= 40) {
            return { value: risk, label: "Médio" };
        } else {
            return { value: risk, label: "Bom" };
        }
    } catch {
        return null;
    }
}

interface EmpresasCriticalidadeProps {
    business: any[];
}

export default function EmpresasCriticalidade({ business }: EmpresasCriticalidadeProps) {
    const router = useRouter();

    if (!business || business.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-[1.5rem] border border-gray-100 text-center text-gray-400 text-[0.8rem]">
                Nenhum contexto encontrado. Crie um novo contexto para começar.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1rem] w-full">
            {business.map((empresa) => {
                const parsed = parseCompanyJson(empresa.json);
                const churn = getChurnRisk(empresa.json);
                const churnRisk = parsed?.indicators?.churn_risk ?? (churn ? churn.value : null);

                const oppCount =
                    parsed?.totvs_products_mapped?.filter((p: any) => p.status === "opportunity").length ||
                    parsed?.insights?.prioritized?.filter((i: any) => i.category === "upsell_opportunity").length ||
                    (parsed?.indicators?.upsell_score && parsed.indicators.upsell_score > 60 ? 2 : 1);

                const prioritized = parsed?.insights?.prioritized || [];
                const topInsight = prioritized[0];

                let statusBadge = {
                    label: "SAUDÁVEL",
                    classes: "bg-emerald-50 text-emerald-600 border-emerald-100/90",
                };

                if (churn?.label === "Crítico" || (churnRisk !== null && churnRisk >= 70)) {
                    statusBadge = {
                        label: "URGENTE",
                        classes: "bg-rose-50 text-rose-600 border-rose-100/90",
                    };
                } else if (churn?.label === "Médio" || (churnRisk !== null && churnRisk >= 40)) {
                    statusBadge = {
                        label: "ATENÇÃO",
                        classes: "bg-amber-50 text-amber-600 border-amber-100/90",
                    };
                }

                let insightStyle = {
                    bg: "bg-[#f0f7ff] border-[#d8ebff] text-[#0066cc]",
                    title: topInsight?.title || "Risco de Churn Elevado",
                    desc: topInsight?.description || empresa.resume || "Métricas e histórico da empresa sendo monitorados continuamente.",
                    icon: AlertCircle,
                };

                if (topInsight) {
                    if (
                        topInsight.category === "product_feedback" ||
                        topInsight.sentiment === "positive" ||
                        topInsight.criticality === "low"
                    ) {
                        insightStyle = {
                            bg: "bg-[#f0fbf5] border-[#d3f3e1] text-[#0d9455]",
                            title: topInsight.title,
                            desc: topInsight.description,
                            icon: CheckCheck,
                        };
                    } else if (
                        topInsight.category === "financial_signal" ||
                        topInsight.criticality === "medium" ||
                        topInsight.title?.toLowerCase().includes("contrat")
                    ) {
                        insightStyle = {
                            bg: "bg-[#fffbf0] border-[#fdecd0] text-[#b47509]",
                            title: topInsight.title,
                            desc: topInsight.description,
                            icon: Landmark,
                        };
                    } else {
                        insightStyle = {
                            bg: "bg-[#f0f7ff] border-[#d8ebff] text-[#0066cc]",
                            title: topInsight.title,
                            desc: topInsight.description,
                            icon: AlertCircle,
                        };
                    }
                }

                const InsightIcon = insightStyle.icon;

                return (
                    <div
                        key={empresa.id}
                        onClick={() => router.push(`/dashboard/${empresa.id}`)}
                        className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#1565C0]/60 transition-all flex flex-col justify-between cursor-pointer"
                    >
                        <div>
                            {/* Top row: Badge and Time */}
                            <div className="flex items-center justify-between">
                                <span
                                    className={`text-[0.55rem] sm:text-[0.5rem] font-bold px-[0.55rem] py-[0.15rem] rounded-full uppercase tracking-wider border ${statusBadge.classes}`}
                                >
                                    {statusBadge.label}
                                </span>
                                <div className="flex items-center gap-[0.3rem] text-[0.65rem] md:text-[0.5rem] text-gray-400 font-medium">
                                    <Clock size={12} className="text-gray-400" />
                                    <span>{getRelativeTime(empresa.createdAt)}</span>
                                </div>
                            </div>

                            {/* Company Name & Industry */}
                            <div className="mt-[0.65rem] mb-[0.5rem]">
                                <h3 className="text-[1rem] font-bold text-gray-900 tracking-tight line-clamp-1">
                                    {empresa.nome}
                                </h3>
                                <p className="text-[0.68rem] text-gray-400 font-medium line-clamp-1 mt-[0.1rem]">
                                    {empresa.industry || "Tecnologia & Serviços"}
                                </p>
                            </div>

                            {/* Metrics Row */}
                            <div className="grid grid-cols-2 gap-[0.5rem] my-[0.75rem]">
                                <div>
                                    <span className="text-[0.6rem] sm:text-[0.5rem] font-bold uppercase text-gray-400 tracking-wider">
                                        CHURN
                                    </span>
                                    <p
                                        className={`text-[1.35rem] font-extrabold tracking-tight mt-[0.1rem] ${
                                            churnRisk !== null && churnRisk >= 70
                                                ? "text-rose-600"
                                                : churnRisk !== null && churnRisk >= 40
                                                ? "text-amber-500"
                                                : "text-emerald-600"
                                        }`}
                                    >
                                        {churnRisk !== null ? `${churnRisk}%` : "—"}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-[0.6rem] sm:text-[0.5rem] font-bold uppercase text-gray-400 tracking-wider">
                                        OPORTUNIDADES
                                    </span>
                                    <p className="text-[1.1rem] font-bold text-gray-800 tracking-tight mt-[0.1rem]">
                                        {oppCount}{" "}
                                        <span className="text-[0.75rem] font-semibold text-gray-600">
                                            {oppCount === 1 ? "ativa" : "ativas"}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Highlighted Insight Box */}
                            <div className={`p-[0.75rem] text-[0.68rem] font-medium rounded-xl border ${insightStyle.bg}`}>
                                    <span className="">{insightStyle.title}</span>
                                {/* <p className="text-[0.68rem] text-gray-600 leading-relaxed line-clamp-3">
                                    {insightStyle.desc}
                                </p> */}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
