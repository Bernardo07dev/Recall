# 🎨 Recall — Design System & Style Guide

Este documento define a identidade visual, padrões de interface (UI), tipografia, paleta de cores e componentes do **Recall**. Ele serve como fonte única de verdade para desenvolvimento de novas telas e geração de protótipos (Google Stitch, Figma, v0, etc.).

---

## 1. Filosofia de Design & Visão Geral

> *"Cada conversa guarda tesouros. O Recall os revela."*

* **Estética**: Minimalista, refinada e tecnológica, inspirada em produtos SaaS B2B de alto padrão (Linear, Stripe, Vercel).
* **Tema Principal**: *Light Mode* acolhedor com superfícies translúcidas (*glassmorphism* suave) e iluminação ambiente colorida (*rainbow ambient glow*).
* **Sensação**: Clareza cognitiva, precisão executiva e inteligência proativa sem poluição visual.

---

## 2. Paleta de Cores

### 2.1 Cores Principais da Marca
| Nome | Código HEX / Tailwind | Aplicação |
| :--- | :--- | :--- |
| **Recall Blue (Primária)** | `#1565C0` | Botões primários, links ativos, acentos principais |
| **Recall Blue Hover** | `#1255A0` | Hover de botões primários |
| **Recall Blue Dark** | `#0C3A6F` | Textos de marca, subtítulos com opacidade |
| **Recall Blue Soft** | `#EFF6FF` (`bg-blue-50`) | Fundos de ícones, tags ativas e containers de destaque |
| **Brand Rainbow Gradient** | `linear-gradient(90deg, #1565C0, #599BE7, #9B59B6, #1565C0)` | Bordas iluminadas e efeitos de ambient glow |

### 2.2 Fundo & Superfícies (Backgrounds & Cards)
| Nome | Valor | Descrição |
| :--- | :--- | :--- |
| **App Background** | `#FBFBFF` | Fundo geral da aplicação com sutil subtom azul/lavanda |
| **Card Surface (Puro)** | `#FFFFFF` | Fundo padrão de cartões e modais |
| **Card Surface (Glass)** | `rgba(255, 255, 255, 0.8)` + `backdrop-blur-md` | Dropdowns, menus flutuantes e sidebars |
| **Card Section Tint** | `#F8FAFC` (`bg-slate-50/50`) ou `#F9FAFB` | Cabeçalhos e rodapés de cards |
| **Subtle Inner Card** | `rgba(239, 246, 255, 0.3)` (`bg-blue-50/30`) | Subitens e listas dentro de cards de ferramentas |

### 2.3 Sistema Semântico de Prioridade / Risco / Criticalidade
Usado para indicar risco de *churn*, prioridade de oportunidades e alertas:

| Nível / Status | Texto | Fundo (Badge/Card) | Borda | Sombra Customizada |
| :--- | :--- | :--- | :--- | :--- |
| **Crítico / Alta** | `#DC2626` (`text-red-600`) | `#FEF2F2` (`bg-red-50`) | `#FECACA` (`border-red-200`) | `shadow-red` |
| **Moderado / Média** | `#D97706` (`text-amber-600`) | `#FFFBEB` (`bg-amber-50`) | `#FDE68A` (`border-amber-200`) | `shadow-yellow` |
| **Saudável / Baixa** | `#059669` (`text-emerald-600`) | `#ECFDF5` (`bg-emerald-50`) | `#A7F3D0` (`border-emerald-200`) | `shadow-green` |

### 2.4 Tipografia & Escala de Cinzas
| Escala | HEX | Uso |
| :--- | :--- | :--- |
| **Títulos / Ênfase** | `#1F2937` (`text-gray-800`) | Cabeçalhos e títulos principais |
| **Corpo de Texto** | `#4B5563` (`text-gray-600`) | Textos principais e parágrafos |
| **Texto Secundário** | `#6B7280` (`text-gray-500`) | Descrições, metadados e legendas |
| **Labels & Subtítulos**| `#9CA3AF` (`text-gray-400`) | Títulos de seções em caixa alta |
| **Bordas Sutis** | `#F3F4F6` / `#E5E7EB` | Linhas divisórias e contornos de cards |

---

## 3. Tipografia

A tipografia do Recall utiliza fontes geométricas e neutras do Google Fonts para máxima legibilidade:

1. **`Manrope`** (Fonte Padrão da Aplicação)
   * Aplicada no `body`. Excelente para leitura geral, números e interfaces modernas.
   * Pesos comuns: `400` (Normal), `500` (Medium), `600` (Semibold), `700` (Bold).
2. **`Inter`** (Dados, Métricas & Tabelas)
   * Classe: `inter` / `var(--font-inter)`.
   * Utilizada em dashboards de dados analíticos, métricas e tabelas de indicadores.
3. **`Source Serif 4`** (Editorial / Destaques)
   * Utilizada pontualmente para citações ou detalhes elegantes de narrativa.

### Padrão de Cabeçalho de Seção
Todo agrupamento de cartões ou seções internas segue este padrão consistente:
```tsx
<h4 className="text-[0.7rem] font-bold text-gray-400 mb-3 uppercase tracking-widest">
    Indicadores Principais
</h4>
```

---

## 4. Sombras & Efeitos Visuais (CSS Utilities)

Definidos em `src/app/globals.css`:

```css
/* Brilho ambiente sutil azul/roxo característico da marca */
@utility shadow-rainbow {
  box-shadow: 0 4px 20px 0px rgba(21, 101, 192, 0.05), 0 0 30px 0px rgba(155, 89, 182, 0.05);
}

/* Sombras semânticas para cards de risco e oportunidade */
@utility shadow-red {
  box-shadow: 0 2px 12px 0px rgba(225, 29, 72, 0.12), 0 0 18px 0px rgba(147, 51, 234, 0.08);
}

@utility shadow-yellow {
  box-shadow: 0 2px 12px 0px rgba(234, 179, 8, 0.10), 0 0 18px 0px rgba(251, 146, 60, 0.06);
}

@utility shadow-green {
  box-shadow: 0 2px 12px 0px rgba(16, 185, 129, 0.10), 0 0 18px 0px rgba(5, 150, 105, 0.06);
}

/* Glow animado multicolorido por trás de cards */
@utility rainbow-shadow {
  background: linear-gradient(90deg, #1565C0, #599be7, #9b59b6, #1565C0);
  background-size: 300% 300%;
  animation: gradient-shadow 4s ease infinite;
  filter: blur(12px);
}
```

---

## 5. Anatomia de Componentes

### 5.1 Card Principal (Padrão Recall)
Grandes blocos de conteúdo e relatórios utilizam borda arredondada generosa (`rounded-3xl`) com um fundo iluminado suave:

```tsx
<div className="relative w-full max-w-[830px]">
    {/* Glow de fundo sutil */}
    <div className="absolute -inset-0.5 rainbow-shadow rounded-3xl opacity-10"></div>
    
    {/* Card branco principal */}
    <div className="relative bg-white rounded-3xl w-full flex flex-col overflow-hidden border border-gray-100/80">
        {/* Header com divisória */}
        <div className="flex justify-between items-center p-5 pb-4 border-b border-gray-100/80 bg-gray-50/40">
            <h3 className="font-semibold text-gray-800 text-[1.15rem] tracking-tight">
                Título do Card
            </h3>
            {/* Botão de ação opcional */}
        </div>
        
        {/* Corpo do card */}
        <div className="p-5 flex flex-col gap-4">
            {/* Conteúdo */}
        </div>
    </div>
</div>
```

### 5.2 Botão Minimalista de Ação / Navegação
Substitui botões pesados por elementos discretos, limpos e com micro-interações:

```tsx
<button
    className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 text-xs font-semibold shadow-rainbow hover:border-gray-200 transition-all duration-150 cursor-pointer"
>
    <span>Ver Dashboard</span>
    <ArrowUpRight 
        size={13} 
        className="text-gray-400 group-hover:text-gray-700 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
    />
</button>
```

### 5.3 Badges de Status / Criticalidade
Pills compactas com cantos arredondados totais (`rounded-full`) e texto legível:

```tsx
<span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-red-50 text-red-600 border-red-100">
    ALTA
</span>
```

### 5.4 Itens de Lista / Cards de Oportunidades
Cartões internos leves (`rounded-xl` ou `rounded-2xl`) com sombra semântica correspondente:

```tsx
<div className="bg-blue-50/30 p-3 px-4 w-full rounded-xl border border-red-200 shadow-red flex flex-row items-baseline justify-between gap-2 transition-all">
    <div className="flex flex-row items-end gap-2">
        <h5 className="font-semibold text-[0.80rem] text-gray-800 leading-tight">Nome da Ação</h5>
        <span className="text-[0.60rem] font-bold text-[#1565C0]/80 uppercase">SETOR</span>
    </div>
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-red-50 text-red-600 border-red-100">
        ALTA
    </span>
</div>
```

---

## 6. Ícones
* **Biblioteca**: `lucide-react`.
* **Estilo**: Traços finos (`stroke-width: 1.5` ou `1.75`), tamanhos proporcionais (`size={13}` a `size={20}` para botões e listas, `size={28}` para ícones de cabeçalho com fundo arredondado).
* **Ícones Frequentes**:
  * Navegação externa: `ArrowUpRight`
  * Oportunidades: `ChartBar`, `Target`, `Lightbulb`
  * Retenção / Churn: `NotebookText`, `ShieldAlert`
  * Mapeamento: `Map`
  * Insights / IA: `Sparkles`
  * Status público/privado: `Globe`, `Lock`

---

## 7. Regras de Ouro de UI para o Recall

1. **Evite botões ou cards excessivamente pesados**: Dê preferência a fundos claros, bordas finas translúcidas (`border-gray-100`) e sombras suaves.
2. **Consistência de Largura no Chat**: Containers de resposta e ferramentas devem seguir `max-w-[830px]` para alinhar perfeitamente com a barra de chat.
3. **Micro-animações**: Ícones de navegação devem se mover suavemente no hover (`translate-x-0.5 -translate-y-0.5`).
4. **Hierarquia Semântica**: Cores saturadas (vermelho, amarelo, verde) devem ser reservadas para status, alertas e métricas, mantendo a estrutura geral neutra e elegante.
