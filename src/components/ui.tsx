"use client";

import type { ReactNode } from "react";

export function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline gap-2 text-sm font-semibold text-slate-200">
        {label}
        {required && <span className="text-xs font-normal text-amber-400">obrigatório</span>}
      </span>
      {hint && <span className="mb-2 block text-xs text-slate-400">{hint}</span>}
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`${inputClass} min-h-[88px] resize-y leading-relaxed ${props.className ?? ""}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function Card({
  title,
  icon,
  step,
  children,
  className = "",
}: {
  title: string;
  icon?: ReactNode;
  step?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-800 bg-slate-900/50 p-5 shadow-lg shadow-black/20 backdrop-blur ${className}`}
    >
      <header className="mb-4 flex items-center gap-3">
        {step !== undefined && (
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
            {step}
          </span>
        )}
        {icon && <span className="text-cyan-400">{icon}</span>}
        <h2 className="text-base font-bold tracking-tight text-white">{title}</h2>
      </header>
      {children}
    </section>
  );
}
