'use client';

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    Zap,
    AlertTriangle,
    Sparkles,
    ShieldCheck,
    FileText,
    ArrowUpRight,
    CheckCheck,
    CheckCircle2,
} from "lucide-react";
import { parseCompanyJson, getChurnRisk } from "./EmpresasCriticalidade";

export interface PrioridadeItem {
    id: string;
    companyId: string;
    companyName: string;
    insightId?: string;
    actionText: string;
    badgeLabel: "URGENTE" | "ALTA PRIORIDADE" | "MÉDIA PRIORIDADE" | "ROTINA";
    badgeClass: string;
    icon: any;
    iconBgClass: string;
    iconColorClass: string;
    tagLabel: string;
    tagClass: string;
    buttonLabel: string;
    priorityRank: number;
}

interface PrioridadesIAProps {
    business: any[];
}

export function extractRecommendedActions(business: any[]): PrioridadeItem[] {
    if (!business || !Array.isArray(business)) return [];

    const items: PrioridadeItem[] = [];

    business.forEach((empresa) => {
        if (!empresa) return;

        const parsed = parseCompanyJson(empresa.json);
        const churn = getChurnRisk(empresa.json);
        const churnRisk = parsed?.indicators?.churn_risk ?? (churn ? churn.value : null);

        // 1. Extrair de insights.prioritized
        const prioritized = parsed?.insights?.prioritized;
        if (Array.isArray(prioritized) && prioritized.length > 0) {
            prioritized.forEach((ins: any, idx: number) => {
                const actionText =
                    ins.recommended_action ||
                    ins.action ||
                    ins.acao ||
                    (ins.criticality === "critical" || ins.category === "churn_risk"
                        ? ins.description
                        : null);

                if (
                    !actionText ||
                    typeof actionText !== "string" ||
                    actionText.trim().length === 0
                ) {
                    return;
                }

                const cat = (ins.category || "").toLowerCase();
                const crit = (ins.criticality || "").toLowerCase();
                const title = ins.title || "";
                const prod = ins.affected_totvs_product || "";

                // Configuração padrão: ROTINA
                let badgeLabel: PrioridadeItem["badgeLabel"] = "ROTINA";
                let badgeClass = "border-gray-200 bg-gray-100 text-gray-600";
                let icon = FileText;
                let iconBgClass = "bg-gray-100";
                let iconColorClass = "text-gray-500";
                let tagLabel = prod || "Follow-up Demo";
                let tagClass = "text-blue-600 font-medium";
                let buttonLabel = "Revisar Proposta";
                let priorityRank = 4;

                if (
                    crit === "critical" ||
                    cat === "churn_risk" ||
                    cat === "competitor_threat" ||
                    (churnRisk !== null && churnRisk >= 70)
                ) {
                    badgeLabel = "URGENTE";
                    badgeClass = "border-rose-200/90 bg-rose-50/70 text-rose-600";
                    icon = AlertTriangle;
                    iconBgClass = "bg-rose-50";
                    iconColorClass = "text-rose-500";

                    if (churnRisk !== null && churnRisk >= 70) {
                        tagLabel = `${churnRisk}% Risco de Churn`;
                    } else if (cat === "churn_risk") {
                        tagLabel = "Risco de Churn";
                    } else if (cat === "competitor_threat") {
                        tagLabel = "Ameaça Concorrente";
                    } else if (prod) {
                        tagLabel = `${prod} em risco`;
                    } else {
                        tagLabel = "Ação Emergencial";
                    }
                    tagClass = "text-rose-600 font-semibold";
                    buttonLabel = "Ver Análise";
                    priorityRank = 1;
                } else if (
                    crit === "high" ||
                    cat === "upsell_opportunity" ||
                    cat === "growth" ||
                    (parsed?.indicators?.upsell_score && parsed.indicators.upsell_score >= 60)
                ) {
                    badgeLabel = "ALTA PRIORIDADE";
                    badgeClass = "border-amber-200/90 bg-amber-50/70 text-amber-600";
                    icon = Sparkles;
                    iconBgClass = "bg-amber-50";
                    iconColorClass = "text-amber-500";

                    if (cat === "upsell_opportunity" || cat === "growth") {
                        tagLabel = prod ? `+ Expansão ${prod}` : "+ Oportunidade ARR";
                    } else if (prod) {
                        tagLabel = `Expansão ${prod}`;
                    } else {
                        tagLabel = "+ Oportunidade";
                    }
                    tagClass = "text-emerald-600 font-bold";
                    buttonLabel = "Ver Pitch";
                    priorityRank = 2;
                } else if (
                    crit === "medium" ||
                    cat === "financial_signal" ||
                    cat === "relationship_health" ||
                    (churnRisk !== null && churnRisk >= 40)
                ) {
                    badgeLabel = "MÉDIA PRIORIDADE";
                    badgeClass = "border-blue-200/90 bg-blue-50/70 text-blue-600";
                    icon = ShieldCheck;
                    iconBgClass = "bg-blue-50";
                    iconColorClass = "text-blue-500";

                    if (cat === "financial_signal" || title.toLowerCase().includes("contrat")) {
                        tagLabel = "Renovação Contratual";
                    } else if (cat === "relationship_health") {
                        tagLabel = "Saúde da Conta";
                    } else if (prod) {
                        tagLabel = prod;
                    } else {
                        tagLabel = "Alinhamento";
                    }
                    tagClass = "text-gray-500 font-medium";
                    buttonLabel = "Histórico";
                    priorityRank = 3;
                } else {
                    if (cat === "product_feedback") {
                        tagLabel = prod ? `Feedback ${prod}` : "Feedback de Produto";
                    } else if (title.toLowerCase().includes("demo") || title.toLowerCase().includes("proposta")) {
                        tagLabel = "Follow-up Demo";
                    }
                }

                items.push({
                    id: `${empresa.id}-insight-${ins.id || idx}`,
                    companyId: empresa.id,
                    companyName: empresa.nome,
                    insightId: ins.id || undefined,
                    actionText: actionText.trim(),
                    badgeLabel,
                    badgeClass,
                    icon,
                    iconBgClass,
                    iconColorClass,
                    tagLabel,
                    tagClass,
                    buttonLabel,
                    priorityRank,
                });
            });
        }

        // 2. Extrair de possíveis listas diretas (ex: acoes_recomendadas, recommended_actions, acoes)
        const directList =
            parsed?.acoes_recomendadas ||
            parsed?.recommended_actions ||
            parsed?.acoes;

        if (Array.isArray(directList)) {
            directList.forEach((act: any, idx: number) => {
                const text =
                    typeof act === "string"
                        ? act
                        : act.texto || act.action || act.descricao || act.text;

                if (text && typeof text === "string" && text.trim().length > 0) {
                    items.push({
                        id: `${empresa.id}-direct-${idx}`,
                        companyId: empresa.id,
                        companyName: empresa.nome,
                        actionText: text.trim(),
                        badgeLabel: "ALTA PRIORIDADE",
                        badgeClass: "border-amber-200/90 bg-amber-50/70 text-amber-600",
                        icon: Sparkles,
                        iconBgClass: "bg-amber-50",
                        iconColorClass: "text-amber-500",
                        tagLabel: "+ Ação Recomendada",
                        tagClass: "text-emerald-600 font-bold",
                        buttonLabel: "Ver Análise",
                        priorityRank: 2,
                    });
                }
            });
        }

        // 3. Fallback caso a empresa tenha churn crítico sem insights específicos cadastrados
        if ((!prioritized || prioritized.length === 0) && churn && churn.label === "Crítico") {
            items.push({
                id: `${empresa.id}-fallback-churn`,
                companyId: empresa.id,
                companyName: empresa.nome,
                actionText: "Alinhamento emergencial sobre risco iminente de Churn identificado nos indicadores da conta.",
                badgeLabel: "URGENTE",
                badgeClass: "border-rose-200/90 bg-rose-50/70 text-rose-600",
                icon: AlertTriangle,
                iconBgClass: "bg-rose-50",
                iconColorClass: "text-rose-500",
                tagLabel: `${churn.value}% ARR em risco`,
                tagClass: "text-rose-600 font-semibold",
                buttonLabel: "Ver Análise",
                priorityRank: 1,
            });
        }
    });

    // Ordenar do mais urgente ao menos urgente
    return items.sort((a, b) => a.priorityRank - b.priorityRank);
}

export default function PrioridadesIA({ business }: PrioridadesIAProps) {
    const [readActionIds, setReadActionIds] = useState<string[]>([]);

    const actions = useMemo(() => {
        return extractRecommendedActions(business);
    }, [business]);

    const isAllRead =
        actions.length > 0 &&
        actions.every((item) => readActionIds.includes(item.id));

    const handleToggleAllRead = () => {
        if (isAllRead) {
            setReadActionIds([]);
        } else {
            setReadActionIds(actions.map((item) => item.id));
        }
    };

    const handleToggleSingleRead = (id: string, e: React.SyntheticEvent) => {
        e.stopPropagation();
        setReadActionIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    return (
        <div className="w-full">
            {/* Header da seção */}
            <div className="flex items-center justify-between mb-4 w-full">
                <div className="flex items-center gap-2">
                    <Zap size={14} className="text-blue-600 fill-blue-600/20" />
                    <h2 className="text-[0.7rem] font-semibold text-gray-500 uppercase tracking-wider">
                        O QUE FAZER HOJE <span className="text-gray-300 font-normal mx-1">•</span> PRIORIDADES IA ({actions.length})
                    </h2>
                </div>

                {actions.length > 0 && (
                    <button
                        onClick={handleToggleAllRead}
                        className="text-xs font-semibold text-[#1565C0] hover:text-[#0d47a1] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                        <span>{isAllRead ? "Desmarcar lidas" : "Marcar Todas"}</span>
                        <CheckCheck size={14} />
                    </button>
                )}
            </div>

            {/* Lista de Ações Recomendadas */}
            {actions.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-center flex flex-col items-center justify-center">
                    <div className="w-10 h-10 bg-blue-50 text-[#1565C0] rounded-xl flex items-center justify-center mb-2.5">
                        <Sparkles size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 mb-1">
                        Nenhuma ação prioritária pendente
                    </h3>
                    <p className="text-xs text-gray-400 max-w-sm">
                        Todas as recomendações geradas pela IA para seus contextos estão em dia ou sendo processadas.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {actions.map((action) => {
                        const isRead = readActionIds.includes(action.id);
                        const IconComponent = action.icon;

                        return (
                            <Link
                                href={`/dashboard/${action.companyId}${action.insightId ? `?insight=${action.insightId}` : ''}`}
                                key={action.id}
                                className={`bg-white cursor-pointer rounded-2xl md:rounded-[1.35rem] p-4 sm:px-5 sm:py-4 border border-gray-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:border-gray-200/80 transition-all flex flex-row items-start gap-3 w-full ${
                                    isRead ? "opacity-50 bg-gray-50/50 border-green-500" : ""
                                }`}
                            >
                                {/* Ícone */}
                                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl -mb-2 flex items-center justify-center shrink-0 ${action.iconBgClass}`}>
                                    <IconComponent size={15} className={action.iconColorClass} />
                                </div>

                                {/* Resto do conteúdo (flex-col) */}
                                <div className="flex flex-col w-full min-w-0">
                                    {/* Linha 1: flex-row com width full */}
                                    <div className="flex flex-row items-start sm:items-center justify-between flex-wrap mb-1  w-full gap-1">
                                        <div className="flex flex-row items-center gap-2 flex-wrap flex-1">
                                            {/* <span
                                                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${action.badgeClass}`}
                                                >
                                                    {action.badgeLabel}
                                                </span> */}

                                            <span className="font-bold text-gray-900 text-[0.8rem] text-sm tracking-tight">
                                                    {action.companyName}
                                                </span>

                                                <span className={`text-[0.7rem] ${action.tagClass}`}>
                                                    {action.tagLabel}
                                                </span>

                                                {isRead && (
                                                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                                        <CheckCircle2 size={10} />
                                                        Lida
                                                    </span>
                                            )}
                                            
                                        </div>

                                        <div
                                            className="border border-gray-200/90 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-rainbow shrink-0 ml-1"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleToggleSingleRead(action.id, e);
                                            }}
                                            title={isRead ? "Desmarcar" : "Marcar como lido"}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isRead}
                                                readOnly
                                                className="w-3.5 h-3.5 sm:w-[1.125rem] sm:h-[1.125rem] accent-emerald-600 cursor-pointer pointer-events-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Linha 2: row com actionText e botões */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full -mt-1 pr-12">
                                        <p className="md:text-[0.8rem] sm:text-[0.7rem] text-gray-600 leading-relaxed font-medium flex-1">
                                            {action.actionText}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
