import { PDFFont } from 'pdf-lib';

/**
 * Wraps text into lines that fit within maxWidth, respecting explicit newlines.
 *
 * @param text      - Raw text (may contain \n for paragraph breaks)
 * @param maxWidth  - Maximum line width in PDF points
 * @param font      - Embedded PDF font (used to measure character widths)
 * @param size      - Font size in points
 * @returns         - Array of strings, each fitting within maxWidth
 */
export function wrapText(
  text: string,
  maxWidth: number,
  font: PDFFont,
  size: number
): string[] {
  const lines: string[] = [];

  // Preserve explicit newlines as paragraph breaks
  text.split('\n').forEach((paragraph) => {
    if (paragraph.trim() === '') {
      lines.push(''); // blank separator line
      return;
    }

    const words = paragraph.split(' ');
    let currentLine = '';

    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;

      if (font.widthOfTextAtSize(testLine, size) > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) lines.push(currentLine);
  });

  return lines;
}
