import { Project } from "../types";

/**
 * Exports the project as a Markdown file download.
 * Each step includes its description and image URL.
 */
export function exportMarkdown(project: Project): void {
    const lines: string[] = [];

    lines.push(`# ${project.title}`);
    lines.push("");
    if (project.url) {
        lines.push(`**Source:** ${project.url}`);
        lines.push("");
    }

    for (const step of project.steps) {
        lines.push(`## Step ${step.stepNumber}`);
        lines.push("");
        lines.push(step.sceneDescription);
        lines.push("");
        if (step.imageUrl) {
            lines.push(`![Step ${step.stepNumber} — ${step.altText}](${step.imageUrl})`);
            lines.push("");
        }
    }

    const content = lines.join("\n");
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugify(project.title)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Exports the project as a PDF by injecting a print stylesheet
 * and triggering the browser's native print-to-PDF dialog.
 * No external libraries required.
 */
export function exportPDF(project: Project): void {
    const STYLE_ID = "nanocraft-print-style";

    // Remove any existing print style
    document.getElementById(STYLE_ID)?.remove();

    // Build the printable HTML
    const printHtml = buildPrintHtml(project);

    // Open a new window with a clean print layout
    const win = window.open("", "_blank", "width=800,height=900");
    if (!win) {
        alert("Please allow pop-ups to export as PDF.");
        return;
    }

    win.document.write(printHtml);
    win.document.close();

    // Wait for images to load before printing
    win.onload = () => {
        win.focus();
        win.print();
    };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 60);
}

function buildPrintHtml(project: Project): string {
    const stepsHtml = project.steps
        .map(
            (step) => `
      <section class="step">
        <h2>Step ${step.stepNumber}</h2>
        <p>${escapeHtml(step.sceneDescription)}</p>
        ${step.imageUrl ? `<img src="${step.imageUrl}" alt="${escapeHtml(step.altText)}" />` : ""}
      </section>`
        )
        .join("\n");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(project.title)}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      font-size: 13pt;
      line-height: 1.65;
      color: #1a1a1a;
      background: #fff;
      padding: 2cm;
    }
    h1 {
      font-size: 22pt;
      margin-bottom: 0.5em;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 0.3em;
    }
    .meta { font-size: 10pt; color: #666; margin-bottom: 2em; }
    .step {
      margin-bottom: 2.5em;
      page-break-inside: avoid;
    }
    h2 {
      font-size: 14pt;
      font-weight: 600;
      margin-bottom: 0.4em;
      color: #222;
    }
    p { margin-bottom: 0.8em; color: #333; }
    img {
      display: block;
      max-width: 100%;
      max-height: 340px;
      object-fit: contain;
      margin-top: 0.8em;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
    }
    @media print {
      body { padding: 0; }
      .step { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>${escapeHtml(project.title)}</h1>
  ${project.url ? `<p class="meta">Source: ${escapeHtml(project.url)}</p>` : ""}
  ${stepsHtml}
</body>
</html>`;
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
