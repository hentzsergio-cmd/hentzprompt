import type { Framework, FrameworkDefinition } from "./types";

export const FRAMEWORKS: Record<Framework, FrameworkDefinition> = {
  epico: {
    id: "epico",
    name: "Método E.P.I.C.O.",
    acronym: "E.P.I.C.O.",
    tagline: "Básico / Rápido",
    description:
      "A estrutura essencial de qualquer prompt. Ideal para tarefas do dia a dia com respostas rápidas e precisas.",
    sections: [
      { letter: "E", title: "Especialista", description: "Defina quem a IA deve ser." },
      { letter: "P", title: "Problema", description: "Explique claramente o que precisa ser resolvido." },
      { letter: "I", title: "Informações", description: "Forneça contexto, dados relevantes e detalhes importantes." },
      { letter: "C", title: "Critérios", description: "Estabeleça regras, restrições, limitações e requisitos." },
      { letter: "O", title: "Output (Saída)", description: "Defina o formato e o nível de detalhamento da resposta." },
    ],
  },
  profissional: {
    id: "profissional",
    name: "Método P.R.O.F.I.S.S.I.O.N.A.L.",
    acronym: "P.R.O.F.I.S.S.I.O.N.A.L.",
    tagline: "Avançado / Corporativo",
    description:
      "Framework completo para prompts de alto nível. Ideal para diagnósticos, estratégias, consultorias e projetos complexos.",
    sections: [
      { letter: "P", title: "Persona", description: "Quem a IA deve ser." },
      { letter: "R", title: "Resultado", description: "Resultado esperado." },
      { letter: "O", title: "Objetivo", description: "Objetivo principal." },
      { letter: "F", title: "Formato", description: "Formato da resposta." },
      { letter: "I", title: "Informações", description: "Contexto completo." },
      { letter: "S", title: "Sequência Lógica", description: "Passo a passo." },
      { letter: "S", title: "Sistema de Avaliação", description: "Como medir." },
      { letter: "I", title: "Iteração", description: "Refine e melhore." },
      { letter: "O", title: "Otimização", description: "Busque excelência." },
      { letter: "N", title: "Nível de Profundidade", description: "Detalhamento." },
      { letter: "A", title: "Ações Práticas", description: "Aplicabilidade." },
      { letter: "L", title: "Lições Aprendidas", description: "Aprendizado final." },
    ],
  },
  persona: {
    id: "persona",
    name: "Framework P.E.R.S.O.N.A.",
    acronym: "P.E.R.S.O.N.A.",
    tagline: "Assistente / Agente",
    description:
      "Para criar personas e assistentes de IA poderosos. Personas bem definidas geram respostas consistentes, seguras e alinhadas ao objetivo.",
    sections: [
      { letter: "P", title: "Propósito", description: "Razão de existir." },
      { letter: "E", title: "Especialidade", description: "Área de atuação." },
      { letter: "R", title: "Responsabilidades", description: "O que faz." },
      { letter: "S", title: "Segurança", description: "Limites e cuidados." },
      { letter: "O", title: "Objetivos", description: "Metas principais." },
      { letter: "N", title: "Nível de Linguagem", description: "Tom e estilo." },
      { letter: "A", title: "Ações", description: "O que pode ou não fazer." },
    ],
  },
};

export const FRAMEWORK_LIST = Object.values(FRAMEWORKS);
