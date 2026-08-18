/**
 * Calibration Script — Step 2: Test Candidate Coordinates
 *
 * Stamps test markers at your candidate coordinates so you can
 * visually verify alignment before locking them into coiFieldMap.ts.
 *
 * Usage:
 *   1. Read coordinates from: assets/sample-coi-grid.pdf (step 1)
 *   2. Update the `candidates` object below with your estimates
 *   3. Run: npx tsx scripts/test-coi-coordinates.ts
 *   4. Open: assets/sample-coi-test.pdf
 *   5. Adjust coordinates, re-run, repeat until all markers align
 *   6. Copy final values into: lib/pdf/coiFieldMap.ts
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function testCoordinates() {
  const inputPath = path.join(process.cwd(), 'assets', 'sample-coi.pdf');
  const outputPath = path.join(process.cwd(), 'assets', 'sample-coi-test.pdf');

  if (!fs.existsSync(inputPath)) {
    console.error('❌ Error: Place your ACORD 25 PDF at: assets/sample-coi.pdf');
    process.exit(1);
  }

  const bytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(bytes);
  const page = pdfDoc.getPages()[0];
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // ─────────────────────────────────────────────────────────────────────
  // EDIT THESE VALUES based on what you read from sample-coi-grid.pdf
  // ─────────────────────────────────────────────────────────────────────
  const candidates = {
    date: { x: 525, y: 747 },
    certificateHolder: { x: 28, y: 120 },
    additionalInsuredGL: { x: 185, y: 450 },
    additionalInsuredAuto: { x: 185, y: 390 },
    descriptionOfOperations: { x: 42, y: 215 },
  };
  // ─────────────────────────────────────────────────────────────────────

  // Draw a red marker (X + label) at each candidate position
  Object.entries(candidates).forEach(([label, { x, y }]) => {
    // Red X marker
    page.drawText('X', { x, y, size: 10, font, color: rgb(1, 0, 0) });
    // Label to the right
    page.drawText(`<- ${label} (${x},${y})`, {
      x: x + 12,
      y: y + 1,
      size: 6,
      font,
      color: rgb(1, 0, 0),
    });
    // Small crosshair dot
    page.drawCircle({ x, y, size: 1.5, color: rgb(1, 0, 0) });
  });

  // Also stamp sample data to test actual text wrapping
  page.drawText('08/17/2026', { x: candidates.date.x, y: candidates.date.y, size: 9, font, color: rgb(0, 0, 0.8) });
  page.drawText('Sample Holder LLC', { x: candidates.certificateHolder.x, y: candidates.certificateHolder.y, size: 9, font, color: rgb(0, 0, 0.8) });
  page.drawText('X', { x: candidates.additionalInsuredGL.x, y: candidates.additionalInsuredGL.y, size: 9, font, color: rgb(0, 0, 0.8) });
  page.drawText('X', { x: candidates.additionalInsuredAuto.x, y: candidates.additionalInsuredAuto.y, size: 9, font, color: rgb(0, 0, 0.8) });

  fs.writeFileSync(outputPath, await pdfDoc.save());
  console.log(`✅ Test markers written to: ${outputPath}`);
  console.log('📖 Open it and check if markers align with the form fields.');
  console.log('   Adjust coordinates above and re-run until all markers align.');
  console.log('   Then copy the final values into: lib/pdf/coiFieldMap.ts');
}

testCoordinates().catch(console.error);
