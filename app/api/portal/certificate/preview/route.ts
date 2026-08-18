import { NextRequest } from 'next/server';
import { generateCOI, COIGenerationError } from '@/lib/pdf/generateCOI';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

/**
 * POST /api/portal/certificate/preview
 *
 * Generates a stamped PDF from the admin template and returns it
 * as raw bytes. Does NOT save anything — this is preview only.
 *
 * Body: {
 *   certificateId: string,
 *   certificateDate: string,          // YYYY-MM-DD or MM/DD/YYYY
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

    // Use admin client so we can access the storage bucket regardless of RLS
    const supabase = await createAdminSupabaseClient();

    // Fetch the certificate to get the template storage path
    const { data: cert, error: certError } = await supabase
      .from('certificates')
      .select('template_storage_path')
      .eq('id', certificateId)
      .single();

    if (certError || !cert) {
      return Response.json({ error: 'Certificate not found' }, { status: 404 });
    }

    if (!cert.template_storage_path) {
      return Response.json(
        { error: 'No template PDF has been uploaded for this certificate yet.' },
        { status: 422 }
      );
    }

    // Download the template PDF from Supabase storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('coi-templates')
      .download(cert.template_storage_path);

    if (downloadError || !fileData) {
      console.error('Storage download error:', downloadError);
      return Response.json({ error: 'Template file could not be downloaded.' }, { status: 404 });
    }

    const templateBytes = new Uint8Array(await fileData.arrayBuffer());

    // Generate the stamped PDF
    const generatedBytes = await generateCOI({
      templateBytes,
      certificateDate: certificateDate ?? '',
      certificateHolderName: certificateHolderName ?? '',
      certificateHolderAddress: certificateHolderAddress ?? '',
      additionalInsured: Boolean(additionalInsured),
      descriptionOfOperations: descriptionOfOperations ?? '',
    });

    return new Response(Buffer.from(generatedBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="certificate-preview.pdf"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    if (err instanceof COIGenerationError) {
      return Response.json({ error: err.message }, { status: 422 });
    }
    console.error('Preview generation error:', err);
    return Response.json({ error: 'Failed to generate certificate preview.' }, { status: 500 });
  }
}
