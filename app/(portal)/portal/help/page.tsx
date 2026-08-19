'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/shared/Card';
import { createClient } from '@/lib/supabase/client';

export default function ClientHelpPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<{question: string, answer: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('faqs')
        .select('question, answer')
        .order('created_at', { ascending: true });
        
      if (!error && data) {
        setFaqs(data);
      }
      setLoading(false);
    };
    
    fetchFaqs();
  }, []);

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
          {loading ? (
            <div className="text-sm text-slate-500">Loading FAQs...</div>
          ) : faqs.length === 0 ? (
            <div className="text-sm text-slate-500">No FAQs available.</div>
          ) : (
            faqs.map((faq, idx) => {
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
                    <span className="font-bold text-sm text-slate-900">{faq.question}</span>
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
                      {faq.answer}
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
