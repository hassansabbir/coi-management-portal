import { NextRequest } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

/**
 * POST /api/admin/certificates/upload
 *
 * Handles admin PDF template upload:
 *   1. Receives: FormData with fields: clientId, policyType, policyNumber,
 *      insuredName, holderName, holderEmail, file (PDF)
 *   2. Uploads the PDF to the 'coi-templates' bucket
 *   3. Creates a certificates row with template_storage_path
 *   4. Returns the new certificate record
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const clientId = formData.get('clientId') as string;
    const policyType = formData.get('policyType') as string;
    const policyNumber = formData.get('policyNumber') as string | null;
    const insuredName = formData.get('insuredName') as string | null;
    const holderName = formData.get('holderName') as string;
    const file = formData.get('file') as File | null;

    if (!clientId || !policyType || !holderName) {
      return Response.json(
        { error: 'Missing required fields: clientId, policyType, holderName' },
        { status: 400 }
      );
    }

    const supabase = await createAdminSupabaseClient();

    let templateStoragePath: string | null = null;

    // Upload PDF to storage if a file was provided
    if (file && file.size > 0) {
      const fileBytes = new Uint8Array(await file.arrayBuffer());
      const fileName = `${clientId}/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('coi-templates')
        .upload(fileName, fileBytes, {
          contentType: 'application/pdf',
          upsert: false,
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        return Response.json({ error: 'Failed to upload PDF file.' }, { status: 500 });
      }

      templateStoragePath = uploadData.path;
    }

    // Generate a certificate number
    const certNumber = `COI-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    // Create the certificate record
    const { data: cert, error: insertError } = await supabase
      .from('certificates')
      .insert({
        client_id: clientId,
        certificate_number: certNumber,
        policy_type: policyType,
        policy_number: policyNumber ?? '',
        insured_name: insuredName ?? '',
        certificate_holder_name: holderName,
        certificate_holder_address: '',
        additional_insured: false,
        description_of_operations: '',
        template_storage_path: templateStoragePath,
        status: 'active',
        last_updated: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Certificate insert error:', insertError);
      return Response.json({ error: 'Failed to create certificate record.' }, { status: 500 });
    }

    // Log activity
    await supabase.from('activities').insert({
      certificate_id: cert.id,
      client_name: insuredName ?? '',
      title: policyType,
      action: 'Certificate uploaded',
    });

    return Response.json({ success: true, certificate: cert }, { status: 201 });
  } catch (err) {
    console.error('Upload route error:', err);
    return Response.json({ error: 'Unexpected error during upload.' }, { status: 500 });
  }
}
