import { generateCOI } from '../lib/pdf/generateCOI';
import fs from 'fs';
import * as path from 'path';

async function test() {
  const templateBytes = fs.readFileSync('template.pdf');
  
  const pdfBytes = await generateCOI({
    templateBytes,
    certificateDate: '08/18/2026',
    certificateHolderName: 'Test Holder',
    certificateHolderAddress: '123 Test St\nTest City, TX 12345',
    additionalInsured: true,
    descriptionOfOperations: 'Test operations',
  });
  
  fs.writeFileSync('test-out.pdf', pdfBytes);
  console.log('Saved to test-out.pdf');
}

test();
