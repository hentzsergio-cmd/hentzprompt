const MAX_PDF_PAGES = 50;

export type ExtractProgress = (message: string) => void;

export function isPdf(file: File): boolean {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}

export function isImage(file: File): boolean {
  return /^image\/(png|jpe?g|webp|bmp|gif)$/i.test(file.type) || /\.(png|jpe?g|webp|bmp|gif)$/i.test(file.name);
}

export function isTextLike(file: File): boolean {
  return !isPdf(file) && !isImage(file) && !/\.(docx?|xlsx?|pptx?|zip|rar|7z|exe|dll)$/i.test(file.name);
}

export function readAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export async function extractPdfText(file: File, onProgress?: ExtractProgress): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjs.getDocument({ data }).promise;
  const pages = Math.min(doc.numPages, MAX_PDF_PAGES);
  const out: string[] = [];

  for (let i = 1; i <= pages; i++) {
    onProgress?.(`${file.name}: página ${i}/${pages}`);
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (text) out.push(`[Página ${i}]\n${text}`);
  }
  if (doc.numPages > MAX_PDF_PAGES) out.push(`[... ${doc.numPages - MAX_PDF_PAGES} páginas omitidas ...]`);

  const result = out.join("\n\n");
  if (!result.trim()) {
    onProgress?.(`${file.name}: sem texto, aplicando OCR…`);
    return extractPdfByOcr(doc, Math.min(pages, 5), onProgress, file.name);
  }
  return result;
}

async function extractPdfByOcr(
  doc: Awaited<ReturnType<typeof import("pdfjs-dist/legacy/build/pdf.mjs")["getDocument"]>["promise"]>,
  pages: number,
  onProgress: ExtractProgress | undefined,
  name: string,
): Promise<string> {
  const out: string[] = [];
  for (let i = 1; i <= pages; i++) {
    onProgress?.(`${name}: OCR página ${i}/${pages}`);
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;
    await page.render({ canvas, canvasContext: ctx, viewport }).promise;
    const text = await ocrImage(canvas, onProgress);
    if (text.trim()) out.push(`[Página ${i}]\n${text.trim()}`);
  }
  return out.join("\n\n");
}

export async function ocrImage(
  source: File | HTMLCanvasElement,
  onProgress?: ExtractProgress,
): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker(["por", "eng"], 1, {
    logger: (m) => {
      if (m.status === "recognizing text") {
        onProgress?.(`OCR: ${Math.round(m.progress * 100)}%`);
      } else if (m.status) {
        onProgress?.(`OCR: ${m.status}`);
      }
    },
  });
  try {
    const { data } = await worker.recognize(source);
    return data.text;
  } finally {
    await worker.terminate();
  }
}

export async function extractText(file: File, onProgress?: ExtractProgress): Promise<string> {
  if (isPdf(file)) return extractPdfText(file, onProgress);
  if (isImage(file)) {
    onProgress?.(`${file.name}: iniciando OCR…`);
    return ocrImage(file, onProgress);
  }
  return readAsText(file);
}
