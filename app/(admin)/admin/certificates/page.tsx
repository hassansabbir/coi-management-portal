import { createServerSupabaseClient } from '@/lib/supabase/server';
import { CertificatesClient } from '@/components/admin/CertificatesClient';
import { Certificate, Client } from '@/types';

export default async function AdminCertificatesPage() {
  const supabase = await createServerSupabaseClient();

  // 1. Fetch certificates and join client details
  const { data: certsData, error: certsError } = await supabase
    .from('certificates')
    .select(`
      *,
      client:clients(id, contact_name, business_name)
    `)
    .order('created_at', { ascending: false });

  if (certsError) {
    console.error('Error fetching certificates:', certsError.message);
  }

  const certificates: Certificate[] = (certsData || []).map((c: any) => ({
    id: c.id,
    clientId: c.client_id,
    certificateNumber: c.certificate_number,
    policyType: c.policy_type,
    policyNumber: c.policy_number,
    insuredName: c.insured_name || c.client?.business_name || c.client?.contact_name || 'Unknown Client',
    certificateHolderName: c.certificate_holder_name,
    certificateHolderAddress: c.certificate_holder_address,
    certificateDate: c.effective_date,
    additionalInsured: c.additional_insured,
    status: c.status,
    lastUpdated: new Date(c.last_updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    effectiveDate: new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    expirationDate: c.expiration_date || '',
    generalAggregateLimit: c.general_aggregate_limit || '',
    eachOccurrenceLimit: c.each_occurrence_limit || '',
    fileSize: c.file_size || '1.2 MB',
    templateStoragePath: c.template_storage_path,
    descriptionOfOperations: c.description_of_operations,
  }));

  // 2. Fetch clients list for the Upload Dropdown
  const { data: clientsData } = await supabase
    .from('clients')
    .select('id, contact_name, business_name')
    .order('contact_name', { ascending: true });

  const clientsList: Client[] = (clientsData || []).map((c: any) => ({
    id: c.id,
    contactName: c.contact_name,
    businessName: c.business_name,
    contactEmail: '',
    phone: '',
    address: '',
    avatarInitials: '',
    createdAt: '',
    certificateCount: 0,
  }));

  return <CertificatesClient initialCertificates={certificates} clientsList={clientsList} />;
}
