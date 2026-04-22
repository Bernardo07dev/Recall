<br/>

<div align="center">
  <img src="./public/RECALL-logo.svg" alt="Recall Logo" width="200" />
  <br/><br/>
  <a href="https://recall-ten-delta.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/Acessar%20Deploy-Vercel-000000?style=for-the-badge&logo=vercel" alt="Deploy na Vercel" />
  </a>
</div>

<br/>

> Cada conversa esconde ouro. O Recall encontra.

Plataforma alimentada por IA que transforma transcrições de reuniões de vendas em inteligência acionável para o ecossistema TOTVS.

---

## O que é o Recall?

Todos os dias, centenas de reuniões de vendas e CS (Customer Success) acontecem na TOTVS. O conhecimento compartilhado nessas conversas — dores dos clientes, menções a concorrentes, sinais de cancelamento (churn), oportunidades de upsell — desaparece no momento em que a chamada termina.

**O Recall resolve isso.**

Ao processar transcrições brutas de reuniões através de um pipeline de IA, o Recall extrai inteligência estruturada e a exibe em um painel rico em dados, alertas em tempo real e tarefas automatizadas no Jira — para que nada se perca e cada insight se torne uma ação.

---

## Funcionalidades

- 🎙️ **Entrada em múltiplos formatos** — Faça upload de áudio, TXT, PDF ou cole transcrições brutas.
- 🧬 **Pipeline de Processamento com IA** — Grafo alimentado por LangGraph que resume, analisa e estrutura todo o contexto.
- 📊 **Dashboard de Inteligência** — Painel rico da empresa com insights categorizados por risco de churn, oportunidade de upsell, ameaça de concorrente, feedback de produto e mais.
- 💬 **Chat Contextual** — Interface de chat onde você pode selecionar uma empresa e a IA já sabe tudo sobre ela.
- 🔄 **Contexto Vivo** — Cada nova entrada aciona um reprocessamento completo do contexto da empresa, mantendo os insights sempre atualizados.
- 🔐 **Acesso Baseado em Cargos** — Administradores controlam quais membros da equipe podem acessar o contexto de cada empresa.

---

## Tecnologias Utilizadas (Tech Stack)

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS |
| ORM | Prisma |
| Orquestração de IA | LangChain.js + LangGraph.js |
| LLM | OpenAI (GPT-4o / GPT-4o mini) |
| Speech-to-Text | API OpenAI Whisper |
| Embeddings | OpenAI text-embedding-3-small |
| Banco de Dados | Supabase (PostgreSQL + pgvector) |
| Deploy | Vercel |

---

## Arquitetura

### Grafo de Inteligência da Empresa

Quando uma nova entrada é adicionada a uma empresa, um pipeline LangGraph roda de ponta a ponta:

```
Entrada (áudio/texto/arquivo)
    │
    ▼
Nó Inicialização
Transcreve áudio, limpa e resume as entradas brutas
    │
    ▼
Nó Criação Conteúdo
Gera um resumo rico e estruturado de todo o contexto da empresa
    │
    ├──────────────────────┐
    ▼                      ▼
Nó Criação JSON       Nó Criação Embeddings
Gera o JSON de        Gera embeddings vetoriais
inteligência          para busca semântica
    │                      │
    └──────────┬───────────┘
               ▼
         Banco de Dados Supabase
    (json + vetor atualizados)
```

### Grafo do Chat

```
Mensagem do Usuário
    │
    ▼
Nó Roteador
Detecta se a mensagem é uma pergunta ou uma adição de contexto
    │
    ├── Pergunta → Resposta LLM → salva no BD → envia para o cliente (stream)
    │
    └── Adição de Contexto → Chamada de Ferramenta (Tool Call) → roda o Grafo da Empresa novamente
                                     → Resposta LLM → salva no BD → envia para o cliente (stream)
```

---

### Categorias de Insights

| Categoria | Descrição |
|---|---|
| `churn_risk` | Sinais de risco de cancelamento |
| `upsell_opportunity` | Sinais de expansão e cross-sell |
| `competitor_threat` | Menções e avaliações de concorrentes |
| `product_feedback` | Reclamações ou elogios sobre os produtos TOTVS |
| `relationship_health` | Indicadores de confiança e qualidade do relacionamento |
| `financial_signal` | Menções sobre orçamento e contexto financeiro |
| `growth` | Dados numéricos de crescimento para gráficos |
| `strategic_alert` | Ações críticas exigidas imediatamente |

---

## Contexto

Construído como parte do **FIAP x TOTVS Challenge — Inteligência Conversacional**, com o objetivo de transformar diálogos não estruturados em motores de crescimento.

> "Você não está apenas analisando texto. Você está construindo um motor de decisão que diz ao Diretor Comercial onde está o dinheiro antes mesmo que ele veja."

---

## Licença

Proprietary — developed for the FIAP x TOTVS Challenge.