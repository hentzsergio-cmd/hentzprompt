import type { ChecklistItem, PromptInput, ValidationResult } from "./types";

const MIN_CONTEXT_CHARS = 40;

export function validatePrompt(input: PromptInput): ValidationResult {
  const hasRole = input.role.trim().length >= 3;
  const hasObjective = input.objective.trim().length >= 10;
  const hasContext = input.context.trim().length >= MIN_CONTEXT_CHARS;
  const hasRules =
    input.rules.trim().length >= 5 || input.forbiddenActions.trim().length >= 5;
  const hasFormat =
    input.outputFormat !== "outro" || input.outputFormatDetails.trim().length >= 3;
  const hasFewShotExamples =
    input.technique !== "few-shot" ||
    input.fewShotExamples.some((e) => e.input.trim() && e.output.trim());

  const items: ChecklistItem[] = [
    {
      id: "role",
      label: "Especialista / Persona definido",
      passed: hasRole,
      hint: "Diga quem a IA deve ser (ex.: consultor financeiro sênior).",
    },
    {
      id: "objective",
      label: "Objetivo / Problema claro",
      passed: hasObjective,
      hint: "Explique com clareza o que precisa ser resolvido.",
    },
    {
      id: "context",
      label: "Contexto suficiente",
      passed: hasContext,
      hint: `Forneça dados, histórico e limitações (mín. ${MIN_CONTEXT_CHARS} caracteres).`,
    },
    {
      id: "rules",
      label: "Restrições e critérios claros",
      passed: hasRules,
      hint: "Defina regras, tom de voz e o que NÃO fazer.",
    },
    {
      id: "format",
      label: "Formato de saída explícito",
      passed: hasFormat,
      hint: "Escolha um formato ou descreva o formato desejado.",
    },
  ];

  if (input.technique === "few-shot") {
    items.push({
      id: "fewshot",
      label: "Exemplos Few-Shot preenchidos",
      passed: hasFewShotExamples,
      hint: "Adicione ao menos um exemplo com entrada e saída.",
    });
  }

  if (input.framework === "persona") {
    items.push({
      id: "responsibilities",
      label: "Responsabilidades do agente definidas",
      passed: input.responsibilities.trim().length >= 5,
      hint: "Descreva o que o agente faz.",
    });
  }

  const passedCount = items.filter((i) => i.passed).length;
  const score = Math.round((passedCount / items.length) * 100);
  return { items, score, passed: passedCount === items.length };
}
