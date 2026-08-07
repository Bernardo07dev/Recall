export const toolNames: Record<string, string> = {
    "web_search_tool": "Pesquisa na Web",
    // Adicione outras tools abaixo conforme for criando no futuro:
    // "nome_da_nova_tool": "Nome Bonito para a UI"
};

export const getToolDisplayName = (toolName: string) => {
    return toolNames[toolName] || toolName;
};
