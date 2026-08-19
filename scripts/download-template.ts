import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function main() {
  const { data: certs } = await supabase.from('certificates').select('*');
  const cert = certs?.[0];
  if (!cert) return console.log('No certs');

  console.log('Downloading template:', cert.template_storage_path);
  const { data: fileData, error } = await supabase.storage.from('coi-templates').download(cert.template_storage_path);
  
  if (error) {
    return console.error('Download error:', error);
  }
  
  const buffer = Buffer.from(await fileData.arrayBuffer());
  fs.writeFileSync('template.pdf', buffer);
  console.log('Saved to template.pdf');
}

main();
