/**
 * Calibration Script — Step 1: Generate Coordinate Grid
 *
 * Overlays a red coordinate grid on your sample ACORD 25 PDF so you
 * can visually read off the x/y values for each field.
 *
 * Usage:
 *   1. Place your ACORD 25 PDF at: assets/sample-coi.pdf
 *   2. Run: npx tsx scripts/calibrate-coi-fields.ts
 *   3. Open the output: assets/sample-coi-grid.pdf
 *   4. Read off approximate x/y coordinates near each target field:
 *        - DATE box (top right)
 *        - CERTIFICATE HOLDER box (bottom left)
 *        - ADDITIONAL INSURED checkboxes (GL row and Auto row in coverages table)
 *        - DESCRIPTION OF OPERATIONS box (large text area)
 *   5. Use those values in: scripts/test-coi-coordinates.ts
 *
 * Note: pdf-lib coordinates start at BOTTOM-LEFT of the page.
 *       Standard ACORD 25: 612 × 792 points.
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function drawGrid() {
  const inputPath = path.join(process.cwd(), 'assets', 'sample-coi.pdf');
  const outputPath = path.join(process.cwd(), 'assets', 'sample-coi-grid.pdf');

  if (!fs.existsSync(inputPath)) {
    console.error('❌ Error: Place your ACORD 25 PDF at: assets/sample-coi.pdf');
    process.exit(1);
  }

  const bytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(bytes);
  const page = pdfDoc.getPages()[0];
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  console.log(`📐 Page size: ${width}w × ${height}h points`);

  // Draw vertical grid lines every 20 pts, label every 100 pts
  for (let x = 0; x < width; x += 20) {
    page.drawLine({
      start: { x, y: 0 },
      end: { x, y: height },
      thickness: x % 100 === 0 ? 0.5 : 0.2,
      color: rgb(1, 0, 0),
      opacity: x % 100 === 0 ? 0.6 : 0.3,
    });
    if (x % 100 === 0) {
      page.drawText(String(x), { x: x + 1, y: 2, size: 5, font, color: rgb(1, 0, 0) });
    }
  }

  // Draw horizontal grid lines every 20 pts, label every 100 pts
  for (let y = 0; y < height; y += 20) {
    page.drawLine({
      start: { x: 0, y },
      end: { x: width, y },
      thickness: y % 100 === 0 ? 0.5 : 0.2,
      color: rgb(1, 0, 0),
      opacity: y % 100 === 0 ? 0.6 : 0.3,
    });
    if (y % 100 === 0) {
      page.drawText(String(y), { x: 2, y: y + 1, size: 5, font, color: rgb(1, 0, 0) });
    }
  }

  fs.writeFileSync(outputPath, await pdfDoc.save());
  console.log(`✅ Grid overlay written to: ${outputPath}`);
  console.log('📖 Open it and read off the x/y values near each target field.');
  console.log('   Then update scripts/test-coi-coordinates.ts with those values.');
}

drawGrid().catch(console.error);
