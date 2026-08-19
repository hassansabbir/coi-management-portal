import fs from 'fs';
// @ts-ignore
import pdf from 'pdf-parse';

async function parse() {
  const dataBuffer = fs.readFileSync('template.pdf');
  const data = await pdf(dataBuffer);
  console.log(data.text.substring(0, 500));
}

parse();
