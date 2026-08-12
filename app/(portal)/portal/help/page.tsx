'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/shared/Card';

export default function ClientHelpPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I update my certificate?',
      a: 'Navigate to your certificate from the portal home, then click "Edit Certificate." You can update the Certificate Holder, certificate date, and Additional Insured designation. After making your changes, click "Review Certificate" and confirm to generate the updated document.',
    },
    {
      q: 'What does Additional Insured mean?',
      a: 'An Additional Insured designation extends policy coverage protection to a third party (such as a property owner or general contractor) for claims arising out of your operations or work.',
    },
    {
      q: 'How do I download my certificate?',
      a: 'Click on your certificate card from the main portal screen or click the Download button on your certificate preview page to save a high-resolution ACORD 25 PDF copy to your device.',
    },
    {
      q: 'Which fields can I edit?',
      a: 'As a client, you can edit the Certificate Holder organization name and address, the Certificate Date, and the Additional Insured designation toggle. Policy limits and coverage types are managed directly by your insurance agent at The Ewing Agency Inc.',
    },
    {
      q: 'What if I make a mistake?',
      a: 'You can re-edit your certificate details at any time from your portal or contact your insurance agent directly at support@ewingagency.com or (800) 555-EWING.',
    },
  ];

  return (
    <main className="flex-1 w-full px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb & Page Title matching Screenshot 2 */}
      <div>
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
          <Link href="/portal" className="hover:text-slate-700 transition-colors">
            Portal
          </Link>
          <span>/</span>
          <span className="text-slate-600 font-semibold">Help & Support</span>
        </nav>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Help & Support</h1>
        <p className="text-xs text-slate-500 mt-1">
          Get answers to common questions or contact our support team.
        </p>
      </div>

      {/* Frequently Asked Questions Section matching Screenshot 2 */}
      <div className="space-y-4 pt-2">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Frequently Asked Questions
        </h2>

        {/* Accordion Cards List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <Card
                key={idx}
                className="p-0 border-slate-200/90 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <span className="font-bold text-sm text-slate-900">{faq.q}</span>
                  <div className="text-slate-400 shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}
