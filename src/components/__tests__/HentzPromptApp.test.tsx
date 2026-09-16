import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HentzPromptApp } from "../HentzPromptApp";

describe("HentzPromptApp", () => {
  it("atualiza o preview em tempo real ao digitar", () => {
    render(<HentzPromptApp />);
    const preview = screen.getByTestId("prompt-preview");
    expect(preview.textContent).toContain("[defina o especialista]");

    fireEvent.change(screen.getByPlaceholderText("Quem a IA deve ser?"), {
      target: { value: "advogado trabalhista" },
    });
    expect(preview.textContent).toContain("Atue como advogado trabalhista.");
  });

  it("carregar exemplo aprova o checklist", () => {
    render(<HentzPromptApp />);
    expect(screen.getByTestId("checklist-score").textContent).not.toBe("100%");
    fireEvent.click(screen.getByText("Carregar exemplo"));
    expect(screen.getByTestId("checklist-score").textContent).toBe("100%");
  });

  it("selecionar Agente força o framework P.E.R.S.O.N.A. e gera SYSTEM PROMPT", () => {
    render(<HentzPromptApp />);
    fireEvent.click(screen.getByRole("radio", { name: /Agente Personalizado/ }));
    expect(screen.getByRole("radio", { name: /P\.E\.R\.S\.O\.N\.A\./ })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByTestId("prompt-preview").textContent).toContain("# SYSTEM PROMPT");
    expect(screen.getByText("Responsabilidades (o que o agente faz)")).toBeInTheDocument();
  });

  it("copia o prompt para a área de transferência", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<HentzPromptApp />);
    fireEvent.click(screen.getByText("Copiar Prompt de Alta Performance"));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("E.P.I.C.O."));
    expect(await screen.findByText("Copiado!")).toBeInTheDocument();
  });

  it("mostra erro quando a API de refino não está configurada", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Nenhuma chave de API configurada." }),
      }),
    );
    render(<HentzPromptApp />);
    fireEvent.click(screen.getByText("Refinar com IA"));
    expect(await screen.findByRole("alert")).toHaveTextContent("Nenhuma chave de API configurada.");
    vi.unstubAllGlobals();
  });
});
