import { describe, expect, it } from "vitest";
import { buildJpegPdf, formatConfirmationDate } from "./confirmationExport";

describe("confirmation export helpers", () => {
  it("formats the static synthetic due date in Hindi with Devanagari numerals", () => {
    const formatted = formatConfirmationDate("31 August 2026", "hi");
    expect(formatted).toContain("अगस्त");
    expect(formatted).toMatch(/[०-९]/);
  });

  it("formats the same synthetic due date in English for the English flow", () => {
    expect(formatConfirmationDate("31 August 2026", "en")).toContain("August");
  });

  it("builds a PDF shell that embeds a JPEG artifact", () => {
    const pdf = buildJpegPdf(new Uint8Array([0xff, 0xd8, 0xff, 0xd9]), 1600, 1000);
    const output = new TextDecoder().decode(pdf);
    expect(output.startsWith("%PDF-1.4")).toBe(true);
    expect(output).toContain("/DCTDecode");
    expect(output).toContain("%%EOF");
  });
});
