import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ClientsClient } from '@/components/admin/ClientsClient';
import { Client } from '@/types';

export default async function AdminClientsPage() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('clients')
    .select('id, contact_name, business_name, contact_email, phone, address, avatar_initials, created_at, certificates(count)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching clients:', error.message);
  }

  const clients: Client[] = (data || []).map((c: any) => ({
    id: c.id,
    contactName: c.contact_name,
    businessName: c.business_name,
    contactEmail: c.contact_email,
    phone: c.phone || '',
    address: c.address || '',
    avatarInitials: c.avatar_initials || '',
    createdAt: c.created_at,
    certificateCount: c.certificates?.[0]?.count || 0,
  }));

  return <ClientsClient initialClients={clients} />;
}
