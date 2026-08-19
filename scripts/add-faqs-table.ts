import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Adding faqs table...');
  
  const mockFaqs = [
    {
      question: 'How do I generate a new COI?',
      answer: 'You can generate a new COI by navigating to the "Certificates" page and clicking "New Certificate".'
    },
    {
      question: 'How do I add a new client?',
      answer: 'Go to the "Clients" tab and click on the "Add Client" button in the top right corner.'
    },
    {
      question: 'Can clients edit their own certificates?',
      answer: 'Clients can only edit specific fields such as the certificate holder name, address, and date.'
    }
  ];

  console.log('Inserting mock FAQs data...');
  const { data, error } = await supabase.from('faqs').insert(mockFaqs).select();

  if (error) {
    console.error('Error inserting FAQs:', error.message);
  } else {
    console.log('Successfully inserted FAQs:', data?.length);
  }
}

main();
