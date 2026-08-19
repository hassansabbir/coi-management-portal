import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createAdminSupabaseClient();
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (clientError || !client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const { data: certificatesData, error: certError } = await supabase
      .from('certificates')
      .select('*')
      .eq('client_id', id)
      .order('created_at', { ascending: false });

    // Map to frontend structure expected by the page
    const mappedClient = {
      id: client.id,
      businessName: client.business_name,
      contactName: client.contact_name,
      contactEmail: client.contact_email,
      phone: client.phone || '',
      address: client.address || '',
      avatarInitials: client.avatar_initials || '',
      createdAt: new Date(client.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    const mappedCertificates = (certificatesData || []).map((c: any) => ({
      id: c.id,
      clientId: c.client_id,
      certificateNumber: c.certificate_number,
      policyType: c.policy_type,
      policyNumber: c.policy_number,
      insuredName: c.insured_name || client.business_name || client.contact_name,
      certificateHolderName: c.certificate_holder_name,
      certificateHolderAddress: c.certificate_holder_address,
      certificateDate: c.effective_date,
      additionalInsured: c.additional_insured,
      status: c.status,
      lastUpdated: new Date(c.last_updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      effectiveDate: c.effective_date ? new Date(c.effective_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown',
      expirationDate: c.expiration_date || '',
      generalAggregateLimit: c.general_aggregate_limit || '',
      eachOccurrenceLimit: c.each_occurrence_limit || '',
      fileSize: c.file_size || '1.2 MB',
      templateStoragePath: c.template_storage_path,
      descriptionOfOperations: c.description_of_operations,
    }));

    return NextResponse.json({ client: mappedClient, certificates: mappedCertificates });
  } catch (err) {
    console.error('Fetch client error:', err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
