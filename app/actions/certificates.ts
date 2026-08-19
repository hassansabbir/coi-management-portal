'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function deleteCertificateAction(certificateId: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from('certificates')
    .delete()
    .eq('id', certificateId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/certificates');
  revalidatePath('/admin/dashboard');
  revalidatePath('/portal');
  revalidatePath('/portal/certificate');

  return { success: true };
}
