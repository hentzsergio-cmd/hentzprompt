import { NextResponse } from "next/server";
import { PLATFORMS, type Platform } from "@/lib/engine";

const REFINER_SYSTEM_PROMPT = `Você é um Engenheiro de Prompts Sênior. Sua tarefa é reescrever e enriquecer o prompt fornecido pelo usuário, mantendo rigorosamente a estrutura de seções (títulos em Markdown) e o framework utilizado (E.P.I.C.O., P.R.O.F.I.S.S.I.O.N.A.L. ou P.E.R.S.O.N.A.).
Regras:
- Preserve todas as informações fornecidas; nunca invente dados factuais sobre a empresa/projeto.
- Substitua placeholders entre colchetes por sugestões plausíveis e genéricas, sinalizando-as com "(sugestão)".
- Torne cada seção mais específica, acionável e clara, adicionando critérios de qualidade quando faltarem.
- Responda em português do Brasil e retorne SOMENTE o prompt reescrito, sem comentários antes ou depois.`;

interface RefineBody {
  prompt?: string;
  platform?: Platform;
}

type Provider = "openai" | "anthropic" | "gemini";

function detectProvider(): { provider: Provider; apiKey: string } | null {
  if (process.env.OPENAI_API_KEY) return { provider: "openai", apiKey: process.env.OPENAI_API_KEY };
  if (process.env.ANTHROPIC_API_KEY) return { provider: "anthropic", apiKey: process.env.ANTHROPIC_API_KEY };
  if (process.env.GEMINI_API_KEY) return { provider: "gemini", apiKey: process.env.GEMINI_API_KEY };
  return null;
}

async function callOpenAI(apiKey: string, userMessage: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        { role: "system", content: REFINER_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { choices: { message: { content: string } }[] };
  return data.choices[0]?.message.content ?? "";
}

async function callAnthropic(apiKey: string, userMessage: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL ?? "claude-3-5-haiku-latest",
      max_tokens: 4096,
      system: REFINER_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { content: { type: string; text?: string }[] };
  return data.content.map((c) => c.text ?? "").join("");
}

async function callGemini(apiKey: string, userMessage: string): Promise<string> {
  const model = process.env.GEMINI_MODEL ?? "gemini-1.5-flash";
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: REFINER_SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: userMessage }] }],
      }),
    },
  );
  if (!res.ok) throw new Error(`Gemini: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as {
    candidates: { content: { parts: { text: string }[] } }[];
  };
  return data.candidates[0]?.content.parts.map((p) => p.text).join("") ?? "";
}

export async function POST(request: Request) {
  let body: RefineBody;
  try {
    body = (await request.json()) as RefineBody;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const prompt = body.prompt?.trim();
  if (!prompt) {
    return NextResponse.json({ error: "Campo 'prompt' é obrigatório." }, { status: 400 });
  }

  const config = detectProvider();
  if (!config) {
    return NextResponse.json(
      {
        error:
          "Nenhuma chave de API configurada. Defina OPENAI_API_KEY, ANTHROPIC_API_KEY ou GEMINI_API_KEY no arquivo .env.local.",
      },
      { status: 503 },
    );
  }

  const target = body.platform ? PLATFORMS[body.platform]?.name : undefined;
  const userMessage = `${target ? `IA alvo do prompt: ${target}.\n\n` : ""}Prompt a refinar:\n\n${prompt}`;

  try {
    const refined =
      config.provider === "openai"
        ? await callOpenAI(config.apiKey, userMessage)
        : config.provider === "anthropic"
          ? await callAnthropic(config.apiKey, userMessage)
          : await callGemini(config.apiKey, userMessage);
    return NextResponse.json({ refined: refined.trim(), provider: config.provider });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ error: `Falha ao refinar: ${message}` }, { status: 502 });
  }
}
