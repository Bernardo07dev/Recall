export const toolNames: Record<string, string> = {
    "web_search_tool": "Pesquisa na Web",
    "unknown_tool": "Ferramenta Recall",
    "buscar_dados_empresa": "Busca na Empresa",
    "gerar_oportunidades": "Gerar oportunidades",
    // Adicionar outras tools abaixo que for criando no futuro:
    // "nome_da_nova_tool": "Nome Bonito para a UI"
};

export const getToolDisplayName = (toolName: string) => {
    return toolNames[toolName] || toolName;
};
