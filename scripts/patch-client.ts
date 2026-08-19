import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function patch() {
  const { error } = await supabase
    .from('user_profiles')
    .update({
      client_id: '8c0b8f47-7643-426b-a34d-5ecfef278c67',
      business_name: 'Naziya LLC',
      avatar_initials: 'N'
    })
    .eq('id', '60f94c3b-4b32-4588-95c5-f275930e03b5');
    
  if (error) {
    console.error('Failed to patch:', error);
  } else {
    console.log('Successfully patched database!');
  }
}

patch();
