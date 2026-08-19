import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import EditCertificateClient from './EditCertificateClient';

export default async function EditCertificatePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createServerSupabaseClient();
  const { data: cert } = await supabase.from('certificates').select('*').eq('id', params.id).single();
  
  if (!cert) return notFound();

  const formattedCert = {
    id: cert.id,
    certificateNumber: cert.certificate_number,
    policyType: cert.policy_type,
    policyNumber: cert.policy_number,
    insuredName: cert.insured_name,
    certificateHolderName: cert.certificate_holder_name,
    certificateHolderAddress: cert.certificate_holder_address,
    certificateDate: cert.certificate_date || cert.created_at.split('T')[0],
    additionalInsured: cert.additional_insured,
    status: cert.status,
    descriptionOfOperations: cert.description_of_operations,
    eachOccurrenceLimit: cert.each_occurrence_limit || '',
    generalAggregateLimit: cert.general_aggregate_limit || '',
    lastUpdated: new Date(cert.last_updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };

  return <EditCertificateClient cert={formattedCert} />;
}
