import React from 'react';
import GenericToolLoading from './generic/GenericToolLoading';
import GenericToolFinish from './generic/GenericToolFinish';
import WebToolFinish from './WebSearch/WebToolFinish';
import BuscaToolLoading from './BuscaEmpresa/BuscaToolLoading';
import BuscaToolFinish from './BuscaEmpresa/BuscaToolFinish';
import WebToolLading from './WebSearch/WebToolLading';
import OpToolLoading from './GerarOportunidades/OpToolLoading';
import OpToolFinish from './GerarOportunidades/OpToolFinish';

interface ToolRendererProps {
    toolName: string;
    isStart: boolean;
    showTool: boolean;
    msg: any;
}

const toolRegistry: Record<string, { Loading?: React.ComponentType<any>, Result?: React.ComponentType<any> }> = {
    "web_search_tool": {
        Loading: WebToolLading,
        Result: WebToolFinish,
    },
    
    "buscar_dados_empresa": {
        Loading: BuscaToolLoading,
        Result: BuscaToolFinish,
    },
    "gerar_oportunidades": {
        Loading: OpToolLoading,
        Result: OpToolFinish,
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
