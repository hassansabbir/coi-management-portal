import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

async function checkPdf() {
  const bytes = fs.readFileSync('template.pdf');
  const pdfDoc = await PDFDocument.load(bytes);
  console.log('Pages:', pdfDoc.getPageCount());
  
  const page = pdfDoc.getPages()[0];
  const size = page.getSize();
  console.log('Size:', size);
}

checkPdf();
