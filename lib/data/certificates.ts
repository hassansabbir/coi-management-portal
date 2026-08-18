/**
 * Certificate data fetchers — server-side, Supabase-backed.
 * These run in Server Components and Route Handlers only.
 */

import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server';
import { Certificate } from '@/types';

// Map Supabase row to the Certificate type used throughout the UI
function mapRow(row: Record<string, unknown>): Certificate {
  return {
    id: row.id as string,
    clientId: row.client_id as string,
    certificateNumber: row.certificate_number as string,
    certificateHolderName: row.certificate_holder_name as string,
    certificateHolderAddress: row.certificate_holder_address as string,
    certificateDate: row.certificate_date
      ? new Date(row.certificate_date as string).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
        })
      : '',
    insuredName: row.insured_name as string,
    additionalInsured: Boolean(row.additional_insured),
    status: (row.status as 'active' | 'inactive') ?? 'active',
    lastUpdated: row.last_updated
      ? new Date(row.last_updated as string).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
        })
      : '',
    policyType: row.policy_type as string,
    policyNumber: row.policy_number as string,
    effectiveDate: row.effective_date
      ? new Date(row.effective_date as string).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
        })
      : '',
    expirationDate: (row.expiration_date as string) ?? '',
    generalAggregateLimit: (row.general_aggregate_limit as string) ?? '',
    eachOccurrenceLimit: (row.each_occurrence_limit as string) ?? '',
    fileSize: (row.file_size as string) ?? undefined,
    templateStoragePath: (row.template_storage_path as string) ?? undefined,
    descriptionOfOperations: (row.description_of_operations as string) ?? '',
  };
}

/** Fetch all certificates (admin use). */
export async function getAllCertificates(): Promise<Certificate[]> {
  const supabase = await createAdminSupabaseClient();
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getAllCertificates error:', error);
    return [];
  }

  return (data ?? []).map(mapRow);
}

/** Fetch all certificates belonging to a specific client. */
export async function getCertificatesForClient(clientId: string): Promise<Certificate[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getCertificatesForClient error:', error);
    return [];
  }

  return (data ?? []).map(mapRow);
}

/** Fetch a single certificate by ID. */
export async function getCertificateById(id: string): Promise<Certificate | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('getCertificateById error:', error);
    return null;
  }

  return mapRow(data);
}

/** Update the 4 client-editable fields on a certificate. */
export async function updateCertificateFields(
  id: string,
  fields: {
    certificateDate?: string;
    certificateHolderName?: string;
    certificateHolderAddress?: string;
    additionalInsured?: boolean;
    descriptionOfOperations?: string;
  }
): Promise<Certificate | null> {
  const supabase = await createServerSupabaseClient();

  const update: Record<string, unknown> = {
    last_updated: new Date().toISOString(),
  };
  if (fields.certificateDate !== undefined) update.certificate_date = fields.certificateDate || null;
  if (fields.certificateHolderName !== undefined) update.certificate_holder_name = fields.certificateHolderName;
  if (fields.certificateHolderAddress !== undefined) update.certificate_holder_address = fields.certificateHolderAddress;
  if (fields.additionalInsured !== undefined) update.additional_insured = fields.additionalInsured;
  if (fields.descriptionOfOperations !== undefined) update.description_of_operations = fields.descriptionOfOperations;

  const { data, error } = await supabase
    .from('certificates')
    .update(update)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    console.error('updateCertificateFields error:', error);
    return null;
  }

  return mapRow(data);
}
