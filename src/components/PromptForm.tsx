"use client";

import { Plus, Trash2 } from "lucide-react";
import { OUTPUT_FORMATS, TECHNIQUES, type FewShotExample, type PromptInput } from "@/lib/engine";
import { Field, Select, TextArea, TextInput } from "./ui";

type Props = {
  value: PromptInput;
  onChange: (patch: Partial<PromptInput>) => void;
};

export function PromptForm({ value, onChange }: Props) {
  const isPersona = value.framework === "persona";
  const isPro = value.framework === "profissional";

  const roleLabel = isPersona
    ? "Nome / Identidade do Agente"
    : isPro
      ? "Persona (quem a IA deve ser)"
      : "Especialista (quem a IA deve simular)";

  const objectiveLabel = isPersona
    ? "Propósito (razão de existir do agente)"
    : isPro
      ? "Objetivo principal"
      : "Problema a resolver";

  const contextLabel = isPersona
    ? "Especialidade e conhecimento do agente"
    : "Contexto e informações de apoio";

  const rulesLabel = isPersona
    ? "Segurança: limites, cuidados e guardrails"
    : "Regras, critérios e proibições (guardrails)";

  const updateExample = (i: number, patch: Partial<FewShotExample>) => {
    const next = value.fewShotExamples.map((e, idx) => (idx === i ? { ...e, ...patch } : e));
    onChange({ fewShotExamples: next });
  };

  return (
    <div className="space-y-4">
      <Field label={roleLabel} required hint="Ex.: consultor financeiro especialista em investimentos">
        <TextInput
          name="role"
          value={value.role}
          onChange={(e) => onChange({ role: e.target.value })}
          placeholder="Quem a IA deve ser?"
        />
      </Field>

      <Field label={objectiveLabel} required hint="O que precisa ser resolvido ou alcançado?">
        <TextArea
          name="objective"
          value={value.objective}
          onChange={(e) => onChange({ objective: e.target.value })}
          placeholder="Ex.: Quero criar uma reserva de R$ 10.000 o mais rápido possível."
        />
      </Field>

      <Field
        label={contextLabel}
        required
        hint="Dados, histórico, público, limitações da empresa/projeto. Quanto mais contexto, melhor."
      >
        <TextArea
          name="context"
          value={value.context}
          onChange={(e) => onChange({ context: e.target.value })}
          placeholder="Ex.: Tenho R$ 300 por mês para investir. Perfil conservador."
          className="min-h-[120px]"
        />
      </Field>

      {isPersona && (
        <Field label="Responsabilidades (o que o agente faz)" required>
          <TextArea
            name="responsibilities"
            value={value.responsibilities}
            onChange={(e) => onChange({ responsibilities: e.target.value })}
            placeholder="Ex.: Responder dúvidas sobre produtos, registrar chamados, escalar para humano quando necessário."
          />
        </Field>
      )}

      <Field label={rulesLabel} required hint="Restrições, tom de voz e o que NÃO fazer.">
        <TextArea
          name="rules"
          value={value.rules}
          onChange={(e) => onChange({ rules: e.target.value })}
          placeholder="Ex.: Considere apenas investimentos de baixo risco. Não inclua criptomoedas."
        />
      </Field>

      {(isPro || isPersona) && (
        <Field label={isPersona ? "Objetivos / metas do agente" : "Resultado esperado"}>
          <TextArea
            name="expectedResult"
            value={value.expectedResult}
            onChange={(e) => onChange({ expectedResult: e.target.value })}
            placeholder={
              isPersona
                ? "Ex.: Resolver 80% das dúvidas sem intervenção humana."
                : "Ex.: Um plano de investimento mensal com metas e prazos."
            }
          />
        </Field>
      )}

      {isPro && (
        <>
          <Field label="Sequência lógica (passo a passo desejado)">
            <TextArea
              name="logicalSequence"
              value={value.logicalSequence}
              onChange={(e) => onChange({ logicalSequence: e.target.value })}
              placeholder="Ex.: 1. Diagnóstico 2. Opções 3. Recomendação 4. Plano"
            />
          </Field>
          <Field label="Sistema de avaliação (como medir a qualidade)">
            <TextArea
              name="evaluationSystem"
              value={value.evaluationSystem}
              onChange={(e) => onChange({ evaluationSystem: e.target.value })}
              placeholder="Ex.: Precisão dos números, aderência ao perfil de risco, clareza."
            />
          </Field>
          <Field label="Nível de profundidade">
            <Select
              name="depthLevel"
              value={value.depthLevel}
              onChange={(e) => onChange({ depthLevel: e.target.value as PromptInput["depthLevel"] })}
            >
              <option value="basico">Básico</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
              <option value="especialista">Especialista</option>
            </Select>
          </Field>
        </>
      )}

      {isPersona && (
        <>
          <Field label="Nível de linguagem (tom e estilo)">
            <TextInput
              name="languageLevel"
              value={value.languageLevel}
              onChange={(e) => onChange({ languageLevel: e.target.value })}
              placeholder="Ex.: Cordial, profissional, frases curtas, sem jargões."
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ações permitidas (pode)">
              <TextArea
                name="allowedActions"
                value={value.allowedActions}
                onChange={(e) => onChange({ allowedActions: e.target.value })}
                placeholder="Ex.: Consultar FAQ, abrir chamado."
              />
            </Field>
            <Field label="Ações proibidas (não pode)">
              <TextArea
                name="forbiddenActions"
                value={value.forbiddenActions}
                onChange={(e) => onChange({ forbiddenActions: e.target.value })}
                placeholder="Ex.: Prometer descontos, falar de concorrentes."
              />
            </Field>
          </div>
        </>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Formato do output esperado" required>
          <Select
            name="outputFormat"
            value={value.outputFormat}
            onChange={(e) => onChange({ outputFormat: e.target.value as PromptInput["outputFormat"] })}
          >
            {OUTPUT_FORMATS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Detalhes do formato (opcional)">
          <TextInput
            name="outputFormatDetails"
            value={value.outputFormatDetails}
            onChange={(e) => onChange({ outputFormatDetails: e.target.value })}
            placeholder="Ex.: máx. 300 palavras, 3 colunas, em inglês"
          />
        </Field>
      </div>

      <Field label="Técnica de raciocínio desejada (opcional)">
        <Select
          name="technique"
          value={value.technique}
          onChange={(e) => onChange({ technique: e.target.value as PromptInput["technique"] })}
        >
          {TECHNIQUES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} — {t.description}
            </option>
          ))}
        </Select>
      </Field>

      {value.technique === "few-shot" && (
        <div className="space-y-3 rounded-xl border border-dashed border-slate-700 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Exemplos Few-Shot (entrada → saída)
          </p>
          {value.fewShotExamples.map((ex, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <TextInput
                aria-label={`Entrada do exemplo ${i + 1}`}
                value={ex.input}
                onChange={(e) => updateExample(i, { input: e.target.value })}
                placeholder="Entrada"
              />
              <TextInput
                aria-label={`Saída do exemplo ${i + 1}`}
                value={ex.output}
                onChange={(e) => updateExample(i, { output: e.target.value })}
                placeholder="Saída esperada"
              />
              <button
                type="button"
                aria-label="Remover exemplo"
                disabled={value.fewShotExamples.length === 1}
                onClick={() =>
                  onChange({ fewShotExamples: value.fewShotExamples.filter((_, idx) => idx !== i) })
                }
                className="rounded-lg border border-slate-700 px-2 text-slate-400 hover:text-red-400 disabled:opacity-30"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              onChange({ fewShotExamples: [...value.fewShotExamples, { input: "", output: "" }] })
            }
            className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-cyan-200"
          >
            <Plus className="h-3.5 w-3.5" /> Adicionar exemplo
          </button>
        </div>
      )}
    </div>
  );
}
