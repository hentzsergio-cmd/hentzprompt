"use client";

import { BrainCircuit, Eraser, Layers, ListChecks, Target } from "lucide-react";
import { useMemo, useState } from "react";
import {
  DEFAULT_INPUT,
  FRAMEWORKS,
  PLATFORMS,
  buildPrompt,
  validatePrompt,
  type Framework,
  type Platform,
  type PromptInput,
} from "@/lib/engine";
import { FrameworkSelector } from "./FrameworkSelector";
import { PlatformSelector } from "./PlatformSelector";
import { PromptForm } from "./PromptForm";
import { PromptPreview } from "./PromptPreview";
import { Card } from "./ui";

const EXAMPLE: Partial<PromptInput> = {
  role: "consultor financeiro especialista em investimentos",
  objective: "Quero criar uma reserva de R$ 10.000 o mais rápido possível.",
  context:
    "Tenho R$ 300 por mês para investir. Perfil conservador. Já possuo conta em corretora e não tenho dívidas.",
  rules: "Considere apenas investimentos de baixo risco. Não inclua criptomoedas. Linguagem simples.",
  outputFormat: "tabela",
  outputFormatDetails: "Tabela comparativa de 3 opções e um plano de ação passo a passo.",
  technique: "chain-of-thought",
};

export function HentzPromptApp() {
  const [input, setInput] = useState<PromptInput>(DEFAULT_INPUT);

  const patch = (p: Partial<PromptInput>) => setInput((prev) => ({ ...prev, ...p }));

  const setPlatform = (platform: Platform) => {
    // Agentes/System Prompts exigem estritamente o framework P.E.R.S.O.N.A.
    if (platform === "agent") patch({ platform, framework: "persona" });
    else if (input.framework === "persona") patch({ platform, framework: "epico" });
    else patch({ platform });
  };

  const setFramework = (framework: Framework) => {
    if (framework === "persona" && input.platform !== "agent") patch({ framework, platform: "agent" });
    else if (framework !== "persona" && input.platform === "agent") patch({ framework, platform: "chatgpt" });
    else patch({ framework });
  };

  const prompt = useMemo(() => buildPrompt(input), [input]);
  const validation = useMemo(() => validatePrompt(input), [input]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(14,116,144,0.25),_transparent_60%),radial-gradient(ellipse_at_bottom_right,_rgba(126,34,206,0.2),_transparent_60%)] bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-900/50">
              <BrainCircuit className="h-6 w-6 text-white" />
            </span>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white">
                Hentz<span className="text-cyan-400">Prompt</span>
              </h1>
              <p className="text-xs text-slate-400">
                Engenharia de Prompts Profissional · E.P.I.C.O. · P.R.O.F.I.S.S.I.O.N.A.L. · P.E.R.S.O.N.A.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => patch(EXAMPLE)}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Carregar exemplo
            </button>
            <button
              type="button"
              onClick={() => setInput(DEFAULT_INPUT)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              <Eraser className="h-3.5 w-3.5" /> Limpar
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card step={1} title="Plataforma / IA Alvo" icon={<Target className="h-5 w-5" />}>
            <PlatformSelector value={input.platform} onChange={setPlatform} />
            <p className="mt-3 text-xs text-slate-400">{PLATFORMS[input.platform].description}</p>
          </Card>

          <Card step={2} title="Complexidade / Nível do Prompt" icon={<Layers className="h-5 w-5" />}>
            <FrameworkSelector value={input.framework} onChange={setFramework} />
            {input.platform === "agent" && (
              <p className="mt-3 text-xs text-emerald-300">
                System Prompts / Agentes usam estritamente o framework P.E.R.S.O.N.A. com guardrails.
              </p>
            )}
          </Card>

          <Card
            step={3}
            title={`Campos do ${FRAMEWORKS[input.framework].acronym}`}
            icon={<ListChecks className="h-5 w-5" />}
          >
            <PromptForm value={input} onChange={patch} />
          </Card>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <Card title="Prompt de Alta Performance" icon={<BrainCircuit className="h-5 w-5" />}>
            <PromptPreview prompt={prompt} platform={input.platform} validation={validation} />
          </Card>
        </div>
      </main>

      <footer className="mx-auto max-w-7xl px-4 pb-8 text-center text-xs text-slate-500 sm:px-6">
        Pense. Estruture. Evolua. — Método + Estratégia + Prática + Iteração = Excelência com IA.
      </footer>
    </div>
  );
}
