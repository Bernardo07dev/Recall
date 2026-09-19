import React from 'react';
import GenericToolLoading from './generic/GenericToolLoading';
import GenericToolFinish from './generic/GenericToolFinish';
import ToolMessageBlock from '../components/ToolMessageBlock';
import BuscaToolLoading from './BuscaEmpresa/BuscaToolLoading';
import BuscaToolFinish from './BuscaEmpresa/BuscaToolFinish';
import WebToolLading from './WebSearch/WebToolLading';

interface ToolRendererProps {
    toolName: string;
    isStart: boolean;
    showTool: boolean;
    msg: any;
}

// Registro das tools específicas
// Mapeie o toolName para seus respectivos componentes de Loading e Result
// Exemplo:
// import WebSearchLoading from './WebSearch/WebSearchLoading';
// import WebSearchResult from './WebSearch/WebSearchResult';
const toolRegistry: Record<string, { Loading?: React.ComponentType<any>, Result?: React.ComponentType<any> }> = {
    "web_search_tool": {
        Loading: WebToolLading,
        Result: ToolMessageBlock,
    },
    
    "buscar_dados_empresa": {
        Loading: BuscaToolLoading,
        Result: BuscaToolFinish,
    }
};

export default function ToolRenderer({ toolName, isStart, showTool, msg }: ToolRendererProps) {
    const ToolConfig = toolRegistry[toolName];

    if (isStart) {
        const LoadingComponent = ToolConfig?.Loading || GenericToolLoading;
        return <LoadingComponent toolName={toolName} showTool={showTool} />;
    }

    const ResultComponent = ToolConfig?.Result || GenericToolFinish;
    return <ResultComponent msg={msg} toolName={toolName} />;
}
