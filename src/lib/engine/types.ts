export type Platform =
  | "chatgpt"
  | "claude"
  | "gemini"
  | "copilot"
  | "deepseek"
  | "agent";

export type Framework = "epico" | "profissional" | "persona";

export type Technique =
  | "none"
  | "zero-shot"
  | "few-shot"
  | "chain-of-thought"
  | "tree-of-thought"
  | "react";

export type OutputFormat =
  | "markdown"
  | "topicos"
  | "tabela"
  | "json"
  | "codigo"
  | "relatorio"
  | "email"
  | "outro";

export interface FewShotExample {
  input: string;
  output: string;
}

export interface PromptAttachment {
  name: string;
  content: string;
}

export interface PromptInput {
  platform: Platform;
  framework: Framework;
  role: string;
  objective: string;
  context: string;
  attachments: PromptAttachment[];
  rules: string;
  outputFormat: OutputFormat;
  outputFormatDetails: string;
  technique: Technique;
  fewShotExamples: FewShotExample[];
  // Campos adicionais do P.R.O.F.I.S.S.I.O.N.A.L.
  expectedResult: string;
  logicalSequence: string;
  evaluationSystem: string;
  depthLevel: "basico" | "intermediario" | "avancado" | "especialista";
  // Campos adicionais do P.E.R.S.O.N.A.
  responsibilities: string;
  languageLevel: string;
  allowedActions: string;
  forbiddenActions: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  passed: boolean;
  hint: string;
}

export interface ValidationResult {
  items: ChecklistItem[];
  score: number;
  passed: boolean;
}

export interface FrameworkSection {
  letter: string;
  title: string;
  description: string;
}

export interface FrameworkDefinition {
  id: Framework;
  name: string;
  acronym: string;
  tagline: string;
  description: string;
  sections: FrameworkSection[];
}

export interface PlatformDefinition {
  id: Platform;
  name: string;
  vendor: string;
  description: string;
  strengths: string[];
}
