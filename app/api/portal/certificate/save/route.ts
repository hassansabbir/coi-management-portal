import { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * POST /api/portal/certificate/save
 *
 * Persists the 4 client-editable fields back to the certificates table.
 *
 * Body: {
 *   certificateId: string,
 *   certificateDate: string,
 *   certificateHolderName: string,
 *   certificateHolderAddress: string,
 *   additionalInsured: boolean,
 *   descriptionOfOperations: string,
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      certificateId,
      certificateDate,
      certificateHolderName,
      certificateHolderAddress,
      additionalInsured,
      descriptionOfOperations,
    } = body;

    if (!certificateId) {
      return Response.json({ error: 'certificateId is required' }, { status: 400 });
    }

    // Use anon client so RLS is enforced — only the cert's client can update
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('certificates')
      .update({
        certificate_date: certificateDate || null,
        certificate_holder_name: certificateHolderName ?? '',
        certificate_holder_address: certificateHolderAddress ?? '',
        additional_insured: Boolean(additionalInsured),
        description_of_operations: descriptionOfOperations ?? '',
        last_updated: new Date().toISOString(),
      })
      .eq('id', certificateId)
      .select()
      .single();

    if (error) {
      console.error('Certificate save error:', error);
      return Response.json({ error: 'Failed to save certificate changes.' }, { status: 500 });
    }

    return Response.json({ success: true, certificate: data }, { status: 200 });
  } catch (err) {
    console.error('Save route error:', err);
    return Response.json({ error: 'Unexpected error saving certificate.' }, { status: 500 });
  }
}
