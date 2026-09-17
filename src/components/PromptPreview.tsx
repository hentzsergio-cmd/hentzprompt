"use client";

import { Check, Copy, Loader2, RotateCcw, Wand2 } from "lucide-react";
import { useState } from "react";
import type { Platform, ValidationResult } from "@/lib/engine";
import { Checklist } from "./Checklist";

type Props = {
  prompt: string;
  platform: Platform;
  validation: ValidationResult;
};

export function PromptPreview({ prompt, platform, validation }: Props) {
  const [copied, setCopied] = useState(false);
  const [refinement, setRefinement] = useState<{ source: string; text: string } | null>(null);
  const [refining, setRefining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refined = refinement?.source === prompt ? refinement.text : null;
  const shown = refined ?? prompt;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Não foi possível copiar. Selecione o texto manualmente.");
    }
  };

  const refine = async () => {
    setRefining(true);
    setError(null);
    try {
      const res = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, platform }),
      });
      const data = (await res.json()) as { refined?: string; error?: string };
      if (!res.ok || !data.refined) throw new Error(data.error ?? "Erro ao refinar.");
      setRefinement({ source: prompt, text: data.refined });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao refinar.");
    } finally {
      setRefining(false);
    }
  };

  const words = shown.split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-4">
      <Checklist result={validation} />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={copy}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-900/40 transition hover:brightness-110 active:scale-[0.99]"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copiado!" : "Copiar Prompt de Alta Performance"}
        </button>
        <button
          type="button"
          onClick={refine}
          disabled={refining}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-fuchsia-500/50 bg-fuchsia-500/10 px-4 py-2.5 text-sm font-bold text-fuchsia-200 transition hover:bg-fuchsia-500/20 disabled:opacity-60"
        >
          {refining ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          Refinar com IA
        </button>
        {refined && (
          <button
            type="button"
            onClick={() => setRefinement(null)}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-700 px-3 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            title="Voltar ao prompt original"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Original
          </button>
        )}
      </div>

      {!validation.passed && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          O prompt ainda não atende a todos os critérios do checklist. Você pode copiá-lo, mas
          recomendamos completar os itens pendentes para obter o melhor resultado.
        </p>
      )}

      {error && (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {error}
        </p>
      )}

      <div className="relative">
        <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
          <span>{refined ? "Versão refinada pela IA" : "Preview em tempo real"}</span>
          <span>
            {words} palavras · {shown.length} caracteres
          </span>
        </div>
        <pre
          data-testid="prompt-preview"
          className="max-h-[70vh] overflow-auto whitespace-pre-wrap rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-[13px] leading-relaxed text-slate-200"
        >
          {shown}
        </pre>
      </div>
    </div>
  );
}
