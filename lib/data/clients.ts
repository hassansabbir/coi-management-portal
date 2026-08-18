/**
 * Client data fetchers — server-side, Supabase-backed.
 */

import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server';
import { Client } from '@/types';

function mapRow(row: Record<string, unknown>): Client {
  return {
    id: row.id as string,
    contactName: row.contact_name as string,
    businessName: row.business_name as string,
    contactEmail: row.contact_email as string,
    phone: (row.phone as string) ?? '',
    address: (row.address as string) ?? '',
    avatarInitials: (row.avatar_initials as string) ?? '',
    certificateCount: (row.certificate_count as number) ?? 0,
    createdAt: row.created_at
      ? new Date(row.created_at as string).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
        })
      : '',
  };
}

/** Fetch all clients with their certificate counts (admin use). */
export async function getAllClients(): Promise<Client[]> {
  const supabase = await createAdminSupabaseClient();

  const { data, error } = await supabase
    .from('clients')
    .select('*, certificates(count)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getAllClients error:', error);
    return [];
  }

  return (data ?? []).map((row) => ({
    ...mapRow(row),
    // Supabase returns count as [{ count: number }]
    certificateCount:
      Array.isArray(row.certificates) && row.certificates.length > 0
        ? (row.certificates[0] as { count: number }).count
        : 0,
  }));
}

/** Fetch a single client by ID. */
export async function getClientById(id: string): Promise<Client | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('clients')
    .select('*, certificates(count)')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('getClientById error:', error);
    return null;
  }

  return {
    ...mapRow(data),
    certificateCount:
      Array.isArray(data.certificates) && data.certificates.length > 0
        ? (data.certificates[0] as { count: number }).count
        : 0,
  };
}
