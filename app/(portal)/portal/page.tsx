import React from 'react';
import { CertificateSummaryCard } from '@/components/portal/CertificateSummaryCard';
import { InfoBanner } from '@/components/portal/InfoBanner';
import { Illustration } from '@/components/shared/Illustration';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Certificate } from '@/types';
import { redirect } from 'next/navigation';

export default async function ClientPortalHomePage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user profile and client info
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('business_name, client_id, client:clients(contact_name)')
    .eq('id', user.id)
    .single();

  const clientName = (Array.isArray(profile?.client) 
    ? profile.client[0]?.contact_name 
    : (profile?.client as any)?.contact_name) || user.user_metadata?.full_name || 'Client';
  const businessName = profile?.business_name || 'Your Business';

  // Fetch their most recent certificate
  let certificate: Certificate | null = null;
  
  if (profile?.client_id) {
    const { data: certData } = await supabase
      .from('certificates')
      .select('*')
      .eq('client_id', profile.client_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (certData) {
      certificate = {
        id: certData.id,
        clientId: certData.client_id,
        certificateNumber: certData.certificate_number,
        policyType: certData.policy_type,
        policyNumber: certData.policy_number,
        insuredName: certData.insured_name,
        certificateHolderName: certData.certificate_holder_name,
        certificateHolderAddress: certData.certificate_holder_address,
        certificateDate: certData.effective_date,
        additionalInsured: certData.additional_insured,
        status: certData.status,
        lastUpdated: new Date(certData.last_updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        effectiveDate: new Date(certData.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        expirationDate: certData.expiration_date || '',
        generalAggregateLimit: certData.general_aggregate_limit || '',
        eachOccurrenceLimit: certData.each_occurrence_limit || '',
        fileSize: certData.file_size || '1.2 MB',
        templateStoragePath: certData.template_storage_path,
        descriptionOfOperations: certData.description_of_operations,
      };
    }
  }

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back, {clientName}
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          {businessName} · Certificate portal
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Summary Card + Info Banner (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {certificate ? (
            <>
              <CertificateSummaryCard certificate={certificate} />
              <InfoBanner />
            </>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Certificates Yet</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Your agent hasn't uploaded any certificates to your account yet. Check back soon, or contact your agent if you need immediate assistance.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Decorative Vector Laptop Graphic */}
        <div className="lg:col-span-5 hidden lg:flex items-center justify-center p-2 pt-6">
          <Illustration size="lg" />
        </div>
      </div>
    </main>
  );
}
