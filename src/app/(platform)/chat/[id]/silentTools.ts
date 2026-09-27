export const silentTools = [
    "buscar_dados_empresa",
    "gerar_oportunidades",
    "gerar_retencao",
    "gerar_mapeamento",
    "plan_execution",
    "planExecution",
] as const;

export const SILENT_TOOLS = new Set<string>(silentTools);

export const isSilentTool = (toolName: string): boolean => {
    return SILENT_TOOLS.has(toolName);
};
