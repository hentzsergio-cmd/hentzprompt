# HentzPrompt

Ferramenta web que transforma entradas simples em **prompts robustos e profissionais**, otimizados para ChatGPT, Claude, Google Gemini, Microsoft Copilot, DeepSeek e Agentes/System Prompts — aplicando os frameworks **E.P.I.C.O.**, **P.R.O.F.I.S.S.I.O.N.A.L.** e **P.E.R.S.O.N.A.**

## Funcionalidades

- Seleção da **IA alvo** com diretrizes específicas injetadas no prompt (Markdown/CoT para ChatGPT, contexto longo para Claude, tabelas/multimodal para Gemini, Office 365 para Copilot, raciocínio rigoroso para DeepSeek, guardrails para Agentes).
- Seleção do **nível/framework**: Básico (E.P.I.C.O.), Avançado/Corporativo (P.R.O.F.I.S.S.I.O.N.A.L.) e Assistente/Agente (P.E.R.S.O.N.A.).
- **Formulário adaptativo** conforme o framework (persona, objetivo, contexto, guardrails, formato de saída, técnica de raciocínio: Zero-Shot, Few-Shot, Chain-of-Thought, Tree-of-Thought, ReAct).
- **Preview em tempo real** do prompt montado.
- **Copiar Prompt de Alta Performance** com 1 clique.
- **Validador Anti-Erro** (checklist: especialista, objetivo, contexto, restrições, formato).
- **Refinar com IA** via `/api/refine` (OpenAI, Anthropic ou Gemini — configurável por variável de ambiente).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · TailwindCSS 4 · Lucide React · Vitest + Testing Library

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # opcional: chave para o modo "Refinar com IA"
npm run dev                  # http://localhost:3000
```

## Scripts

| Comando             | Descrição                         |
| ------------------- | --------------------------------- |
| `npm run dev`       | Servidor de desenvolvimento       |
| `npm run build`     | Build de produção                 |
| `npm run start`     | Servir build de produção          |
| `npm run lint`      | ESLint                            |
| `npm run typecheck` | `tsc --noEmit`                    |
| `npm test`          | Testes unitários e de componentes |

## Estrutura

```
src/
  app/                 # páginas e API routes (Next.js App Router)
    api/refine/        # POST /api/refine — reescreve o prompt com um LLM
  components/          # UI (seletores, formulário adaptativo, preview, checklist)
  lib/engine/          # Prompt Builder Engine
    frameworks.ts      # definições E.P.I.C.O. / P.R.O.F.I.S.S.I.O.N.A.L. / P.E.R.S.O.N.A.
    platforms.ts       # diretrizes por IA alvo
    techniques.ts      # técnicas de raciocínio e formatos de saída
    validator.ts       # checklist anti-erro
    builder.ts         # montagem final do prompt
```

## Deploy

Compatível com Vercel: importe o repositório e defina `OPENAI_API_KEY` (ou `ANTHROPIC_API_KEY` / `GEMINI_API_KEY`) nas variáveis de ambiente do projeto.
