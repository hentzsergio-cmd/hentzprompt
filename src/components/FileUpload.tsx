"use client";

import { useRef, useState } from "react";
import { FileText, Paperclip, Trash2 } from "lucide-react";
import type { PromptAttachment } from "@/lib/engine";

const MAX_FILE_BYTES = 500_000;
const MAX_CHARS_PER_FILE = 60_000;
const ACCEPT =
  ".txt,.md,.markdown,.csv,.tsv,.json,.xml,.yaml,.yml,.html,.htm,.log,.sql,.js,.ts,.tsx,.jsx,.py,.java,.cs,.go,.rb,.php,.sh,.bat,.ini,.env.example,text/*";

type Props = {
  value: PromptAttachment[];
  onChange: (attachments: PromptAttachment[]) => void;
};

function readAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export function FileUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const addFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    const added: PromptAttachment[] = [];
    const skipped: string[] = [];

    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_BYTES) {
        skipped.push(`${file.name} (muito grande, máx. 500 KB)`);
        continue;
      }
      if (/\.(pdf|docx?|xlsx?|pptx?)$/i.test(file.name)) {
        skipped.push(`${file.name} (converta para TXT/CSV/MD antes de anexar)`);
        continue;
      }
      try {
        const text = await readAsText(file);
        if (!text.trim() || text.includes("\u0000")) {
          skipped.push(`${file.name} (não é um arquivo de texto legível)`);
          continue;
        }
        added.push({
          name: file.name,
          content:
            text.length > MAX_CHARS_PER_FILE
              ? `${text.slice(0, MAX_CHARS_PER_FILE)}\n[... conteúdo truncado ...]`
              : text,
        });
      } catch {
        skipped.push(`${file.name} (falha na leitura)`);
      }
    }

    if (added.length) {
      const names = new Set(value.map((a) => a.name));
      onChange([...value, ...added.filter((a) => !names.has(a.name))]);
    }
    if (skipped.length) setError(`Ignorados: ${skipped.join("; ")}`);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT}
        className="hidden"
        data-testid="file-input"
        onChange={(e) => void addFiles(e.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void addFiles(e.dataTransfer.files);
        }}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 bg-slate-900/40 px-3 py-3 text-sm text-slate-300 transition hover:border-cyan-500/60 hover:text-cyan-200"
      >
        <Paperclip className="h-4 w-4" />
        Anexar arquivos de referência (TXT, MD, CSV, JSON, código…)
      </button>

      {value.length > 0 && (
        <ul className="space-y-1" aria-label="Arquivos anexados">
          {value.map((a) => (
            <li
              key={a.name}
              className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300"
            >
              <FileText className="h-3.5 w-3.5 shrink-0 text-cyan-300" />
              <span className="truncate font-medium">{a.name}</span>
              <span className="ml-auto shrink-0 text-slate-500">
                {a.content.length.toLocaleString("pt-BR")} caracteres
              </span>
              <button
                type="button"
                aria-label={`Remover ${a.name}`}
                onClick={() => onChange(value.filter((x) => x.name !== a.name))}
                className="shrink-0 text-slate-500 hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p role="alert" className="text-xs text-amber-300">
          {error}
        </p>
      )}
    </div>
  );
}
