import React from 'react';
import GenericToolLoading from './generic/GenericToolLoading';
import GenericToolFinish from './generic/GenericToolFinish';
import WebToolFinish from './WebSearch/WebToolFinish';
import BuscaToolLoading from './BuscaEmpresa/BuscaToolLoading';
import BuscaToolFinish from './BuscaEmpresa/BuscaToolFinish';
import WebToolLading from './WebSearch/WebToolLading';
import OpToolLoading from './GerarOportunidades/OpToolLoading';
import OpToolFinish from './GerarOportunidades/OpToolFinish';
import RetencaoToolLoading from './GerarRetencao/RetencaoToolLoading';
import RetencaoToolFinish from './GerarRetencao/RetencaoToolFinish';
import MapeamentoToolLoading from './GerarMapeamento/MapeamentoToolLoading';
import MapeamentoToolFinish from './GerarMapeamento/MapeamentoToolFinish';
import PlanToolLoading from './PlanExecution/PlanToolLoading';
import PlanToolFinish from './PlanExecution/PlanToolFinish';

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
    },
    "gerar_retencao": {
        Loading: RetencaoToolLoading,
        Result: RetencaoToolFinish,
    },
    "gerar_mapeamento": {
        Loading: MapeamentoToolLoading,
        Result: MapeamentoToolFinish,
    },
    "plan_execution": {
        Loading: PlanToolLoading,
        Result: PlanToolFinish,
    },
    "plan_executionn": {
        Loading: PlanToolLoading,
        Result: PlanToolFinish,
    }
};

export default function ToolRenderer({ toolName, isStart, showTool, msg }: ToolRendererProps) {
    const ToolConfig = toolRegistry[toolName];

    if (isStart) {
        const LoadingComponent = ToolConfig?.Loading || GenericToolLoading;
        return <LoadingComponent toolName={toolName} showTool={showTool} />;
    }

    const ResultComponent = ToolConfig?.Result || GenericToolFinish;

    let htmlId = null;
    try {
        let rawOutput = msg?.toolMetadata?.output;
        if (rawOutput && typeof rawOutput === 'object' && rawOutput.kwargs?.content) {
            rawOutput = rawOutput.kwargs.content;
        }
        if (typeof rawOutput === 'string') {
            let current: any = rawOutput;
            while (typeof current === 'string') {
                try {
                    const parsed = JSON.parse(current);
                    if (parsed === current) break;
                    current = parsed;
                } catch (e) {
                    break;
                }
            }
            if (typeof current === 'object' && current !== null && 'htmlId' in current) {
                htmlId = current.htmlId;
            }
        } else if (rawOutput && typeof rawOutput === 'object' && 'htmlId' in rawOutput) {
            htmlId = rawOutput.htmlId;
        }
    } catch (e) {
        console.error("Erro extraindo htmlId no ToolRenderer", e);
    }

    return (
        <div id={htmlId ? `tool-anchor-${htmlId}` : undefined} className="w-full relative scroll-mt-20">
            <ResultComponent msg={msg} toolName={toolName} />
        </div>
    );
}
