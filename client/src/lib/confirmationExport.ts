export type ConfirmationLanguage = "en" | "hi";

export function formatConfirmationDate(sourceDate: string, language: ConfirmationLanguage) {
  const parsed = new Date(sourceDate);
  if (Number.isNaN(parsed.getTime())) return sourceDate;

  return new Intl.DateTimeFormat(language === "hi" ? "hi-IN-u-nu-deva" : "en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

function joinBytes(parts: Uint8Array[]) {
  const length = parts.reduce((total, part) => total + part.length, 0);
  const output = new Uint8Array(length);
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }
  return output;
}

/** Builds a minimal one-page PDF that embeds a browser-rendered JPEG confirmation artifact. */
export function buildJpegPdf(jpeg: Uint8Array, imageWidth: number, imageHeight: number) {
  const encoder = new TextEncoder();
  const pageWidth = 595;
  const pageHeight = 842;
  const renderedHeight = Math.min(pageHeight, pageWidth * (imageHeight / imageWidth));
  const yOffset = (pageHeight - renderedHeight) / 2;
  const content = `q\n${pageWidth} 0 0 ${renderedHeight.toFixed(2)} 0 ${yOffset.toFixed(2)} cm\n/Im0 Do\nQ\n`;
  const objects = [
    encoder.encode("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"),
    encoder.encode("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"),
    encoder.encode("3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>\nendobj\n"),
    encoder.encode(`4 0 obj\n<< /Length ${content.length} >>\nstream\n${content}endstream\nendobj\n`),
    joinBytes([
      encoder.encode(`5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`),
      jpeg,
      encoder.encode("\nendstream\nendobj\n"),
    ]),
  ];
  const header = encoder.encode("%PDF-1.4\n%âãÏÓ\n");
  let position = header.length;
  const offsets = [0];
  for (const object of objects) {
    offsets.push(position);
    position += object.length;
  }
  const xrefOffset = position;
  const xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return joinBytes([header, ...objects, encoder.encode(xref)]);
}
