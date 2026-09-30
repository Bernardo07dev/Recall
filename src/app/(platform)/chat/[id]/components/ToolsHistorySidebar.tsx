'use client';
import { useEffect, useState } from 'react';
import { Layers, ChevronRight, ChevronLeft, Sparkles, PanelLeftClose, Globe, Building2, Lightbulb, ShieldAlert, PackageSearch, ListTodo, Wrench } from 'lucide-react';

interface ToolHistory {
  id: string;
  title: string;
  type: string;
  createdAt: string;
}

const getToolIcon = (type: string) => {
  switch (type) {
    case 'buscar_dados_empresa': return <Building2 size={13} />;
    case 'gerar_oportunidades': return <Lightbulb size={13} />;
    case 'gerar_retencao': return <ShieldAlert size={13} />;
    case 'gerar_mapeamento': return <PackageSearch size={13} />;
    case 'plan_execution': return <ListTodo size={13} />;
    case 'web_search_tool': return <Globe size={13} />;
    default: return <Wrench size={13} />;
  }
};

export default function ToolsHistorySidebar({ chatId }: { chatId: string }) {
  const [tools, setTools] = useState<ToolHistory[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  const fetchTools = async () => {
    try {
      const res = await fetch(`/api/chat/tools?chatId=${chatId}`);
      if (res.ok) {
        const data = await res.json();
        const toolsData = data.tools || [];
        const sortedTools = toolsData.sort((a: ToolHistory, b: ToolHistory) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setTools(sortedTools);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTools();
    const interval = setInterval(fetchTools, 3000);
    return () => clearInterval(interval);
  }, [chatId]);

  const scrollToTool = (id: string) => {
    const element = document.getElementById(`tool-anchor-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Efeito de highlight rápido para chamar atenção
      element.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      element.style.transform = 'scale(1.02)';
      
      setTimeout(() => {
        element.style.transform = 'scale(1)';
      }, 700);
    }
  };

  if (isCollapsed) {
    return ( 
      <button 
        className="fixed top-5 right-5 z-50 p-2 rounded-xl bg-white border border-gray-200 shadow-rainbow text-[#1565C0] hover:bg-blue-50 transition-all group cursor-pointer" 
        onClick={() => setIsCollapsed(false)}
        title="Expandir ferramentas geradas"
      >
        <PanelLeftClose size={16} className="text-gray-500 group-hover:text-[#1565C0] transition-colors" />
      </button>
    );
  }

  return (
    <aside 
      className="flex flex-col w-72 max-h-[350px] bg-white/95 backdrop-blur-md border-2 border-gray-200/70 shadow-rainbow rounded-2xl p-4 fixed right-3 top-3 z-50 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-[#1565C0]" />
          <h2 className="text-[0.7rem] font-bold uppercase tracking-wider text-gray-600">Ferramentas</h2>
          {tools.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-blue-50 text-[#1565C0] border border-blue-100">
              {tools.length}
            </span>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 cursor-pointer hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
          title="Recolher painel"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      
      {tools.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 px-2 text-center text-gray-400">
          <div className="w-10 h-10 rounded-xl bg-gray-100/80 flex items-center justify-center mb-2.5 text-gray-400">
            <Sparkles size={18} className="text-gray-400" />
          </div>
          <p className="text-xs font-semibold text-gray-600">Nenhuma ferramenta</p>
          <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
            As ações executadas na conversa aparecerão aqui para navegação rápida.
          </p>
        </div>
      ) : (
          <div className="flex flex-col gap-3 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full transition-colors">
          {tools.map((tool) => (
            <button 
              key={tool.id}
              onClick={() => scrollToTool(tool.id)}
              className="flex flex-col text-left p-2.5 bg-white cursor-pointer hover:bg-gray-50/80 rounded-xl transition-all border shadow-sm border-gray-200/60 group hover:border-[#1565C0]/30 hover:shadow"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 rounded-md bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-[#1565C0] transition-colors">
                  {getToolIcon(tool.type)}
                </div>
                <span className="font-medium text-[0.75rem] text-gray-800 leading-tight group-hover:text-[#1565C0] transition-colors">
                  {tool.title}
                </span>
              </div>
              <span className="text-[0.65rem] text-gray-400 font-medium ml-[2.1rem] -mt-1.5">
                {new Date(tool.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}
