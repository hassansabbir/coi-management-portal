import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createAdminSupabaseClient();

    // Fetch the certificate to get the template storage path
    const { data: cert, error: certError } = await supabase
      .from('certificates')
      .select('template_storage_path')
      .eq('id', id)
      .single();

    if (certError || !cert) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    if (!cert.template_storage_path) {
      return NextResponse.json(
        { error: 'No template PDF has been uploaded for this certificate yet.' },
        { status: 422 }
      );
    }

    // Download the raw template PDF from Supabase storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('coi-templates')
      .download(cert.template_storage_path);

    if (downloadError || !fileData) {
      console.error('Storage download error:', downloadError);
      return NextResponse.json({ error: 'Template file could not be downloaded.' }, { status: 404 });
    }

    const templateBytes = await fileData.arrayBuffer();

    return new Response(Buffer.from(templateBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="template.pdf"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('Raw PDF download error:', err);
    return NextResponse.json({ error: 'Failed to download raw PDF.' }, { status: 500 });
  }
}
