import { createServerSupabaseClient } from '@/lib/supabase/server';
import { SettingsClient, FaqItem } from '@/components/admin/SettingsClient';

export default async function AdminSettingsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Profile Data
  let initialFullName = 'Admin User';
  let initialEmail = user?.email || 'admin@coiplatform.com';
  let initialAvatarInitials = 'AU';

  if (user) {
    if (user.user_metadata?.full_name) {
      initialFullName = user.user_metadata.full_name;
    }
    
    // Fetch user_profile for avatar
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('avatar_initials')
      .eq('id', user.id)
      .single();

    if (profile?.avatar_initials) {
      initialAvatarInitials = profile.avatar_initials;
    } else if (user.user_metadata?.full_name) {
      initialAvatarInitials = user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
    }
  }

  // FAQs Data
  let initialFaqs: FaqItem[] = [];
  const { data: faqs, error } = await supabase
    .from('faqs')
    .select('*')
    .order('created_at', { ascending: true });

  if (!error && faqs) {
    initialFaqs = faqs.map((f: any) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
    }));
  } else if (error?.code === '42P01') {
    // If the table doesn't exist yet, fall back to mock data
    initialFaqs = [
      {
        id: '1',
        question: 'How do I update my certificate?',
        answer: 'Navigate to your certificate from the portal home, then click "Edit Certificate." You can update the Certificate Holder, certificate date, and Additional Insured designation. After making your changes, click "Review Certificate" and confirm to generate the updated document.',
      },
      {
        id: '2',
        question: 'What does Additional Insured mean?',
        answer: 'An Additional Insured designation extends policy coverage protection to a third party (such as a property owner or general contractor) for claims arising out of your operations or work.',
      },
      {
        id: '3',
        question: 'Which fields can I edit?',
        answer: 'As a client user, you can edit the Certificate Holder organization name and address, the Certificate Date, and the Additional Insured designation toggle.',
      },
      {
        id: '4',
        question: 'What if I make a mistake?',
        answer: 'You can edit your certificate details at any time from your portal or contact your insurance agent directly at The Ewing Agency Inc.',
      },
    ];
  }

  return (
    <SettingsClient 
      initialFullName={initialFullName}
      initialEmail={initialEmail}
      initialAvatarInitials={initialAvatarInitials}
      initialFaqs={initialFaqs}
    />
  );
}
