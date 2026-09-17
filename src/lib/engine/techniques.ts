import type { FewShotExample, OutputFormat, Technique } from "./types";

export const TECHNIQUES: { id: Technique; name: string; description: string }[] = [
  { id: "none", name: "Nenhuma (padrão)", description: "Sem instrução de raciocínio adicional." },
  { id: "zero-shot", name: "Zero-Shot", description: "Sem exemplos. Tarefas simples e respostas rápidas." },
  { id: "few-shot", name: "Few-Shot", description: "Vários exemplos entrada/saída para maior precisão e padrão de formato." },
  { id: "chain-of-thought", name: "Chain-of-Thought", description: "Raciocínio passo a passo antes de responder. Problemas complexos." },
  { id: "tree-of-thought", name: "Tree-of-Thought", description: "Explora múltiplos caminhos de solução e escolhe o melhor." },
  { id: "react", name: "ReAct", description: "Ciclo Raciocínio → Ação → Observação. Ideal para agentes e uso de ferramentas." },
];

export const OUTPUT_FORMATS: { id: OutputFormat; name: string; instruction: string }[] = [
  { id: "markdown", name: "Markdown", instruction: "Responda em Markdown bem estruturado, com títulos, listas e destaques." },
  { id: "topicos", name: "Tópicos", instruction: "Responda em tópicos (bullet points) curtos, objetivos e organizados por tema." },
  { id: "tabela", name: "Tabela", instruction: "Responda em formato de tabela (Markdown), com colunas claramente nomeadas." },
  { id: "json", name: "JSON", instruction: "Responda exclusivamente com um JSON válido, sem texto adicional fora do JSON." },
  { id: "codigo", name: "Código", instruction: "Responda com código completo e funcional em blocos de código, com breves comentários explicativos." },
  { id: "relatorio", name: "Relatório", instruction: "Responda em formato de relatório: Resumo Executivo, Análise, Recomendações e Próximos Passos." },
  { id: "email", name: "E-mail", instruction: "Responda em formato de e-mail profissional: assunto, saudação, corpo e encerramento." },
  { id: "outro", name: "Outro (especificar)", instruction: "" },
];

export function techniqueInstructions(
  technique: Technique,
  examples: FewShotExample[],
): string {
  switch (technique) {
    case "none":
      return "";
    case "zero-shot":
      return "Responda diretamente à tarefa com base no seu conhecimento, sem necessidade de exemplos adicionais.";
    case "few-shot": {
      const valid = examples.filter((e) => e.input.trim() || e.output.trim());
      const rendered = valid
        .map(
          (e, i) =>
            `Exemplo ${i + 1}:\nEntrada: ${e.input.trim()}\nSaída: ${e.output.trim()}`,
        )
        .join("\n\n");
      return `Siga rigorosamente o padrão dos exemplos abaixo (formato, tom e nível de detalhe):\n\n${rendered || "(adicione exemplos de entrada e saída)"}`;
    }
    case "chain-of-thought":
      return [
        "Raciocine passo a passo antes de apresentar a resposta final:",
        "1. Entenda o problema e reformule-o com suas palavras.",
        "2. Identifique as variáveis, dados e restrições relevantes.",
        "3. Analise as opções possíveis.",
        "4. Conclua com a melhor solução, justificando a escolha.",
        "Apresente o raciocínio de forma resumida e, em seguida, a resposta final destacada.",
      ].join("\n");
    case "tree-of-thought":
      return [
        "Utilize a técnica Tree-of-Thought:",
        "1. Gere pelo menos 3 abordagens distintas para resolver o problema.",
        "2. Para cada abordagem, avalie prós, contras e riscos.",
        "3. Selecione a melhor abordagem (ou combine as mais fortes) e justifique.",
        "4. Desenvolva a solução final com base na abordagem escolhida.",
      ].join("\n");
    case "react":
      return [
        "Opere no ciclo ReAct (Raciocínio → Ação → Observação):",
        "- Pensamento: explique o que precisa descobrir ou fazer a seguir.",
        "- Ação: descreva a ação/ferramenta/consulta que executaria.",
        "- Observação: registre o resultado obtido.",
        "Repita o ciclo até ter informações suficientes e então apresente a Resposta Final.",
      ].join("\n");
  }
}
