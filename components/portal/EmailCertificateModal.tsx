import React, { useState } from 'react';
import { X, Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/shared/Button';

interface EmailCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificateId: string;
  certificateNumber: string;
  // Passing the current unsaved values so we generate the PDF with the latest edits
  certificateDate: string;
  certificateHolderName: string;
  certificateHolderAddress: string;
  additionalInsured: boolean;
  descriptionOfOperations: string;
}

export function EmailCertificateModal({
  isOpen,
  onClose,
  certificateId,
  certificateNumber,
  certificateDate,
  certificateHolderName,
  certificateHolderAddress,
  additionalInsured,
  descriptionOfOperations,
}: EmailCertificateModalProps) {
  const [emails, setEmails] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emails.trim()) {
      setError('Please enter at least one email address.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const emailList = emails.split(',').map((e) => e.trim()).filter(Boolean);

      const res = await fetch('/api/portal/certificate/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificateId,
          emails: emailList,
          certificateDate,
          certificateHolderName,
          certificateHolderAddress,
          additionalInsured,
          descriptionOfOperations,
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({ error: 'Failed to send email.' }));
        throw new Error(json.error || 'Failed to send email.');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setEmails('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#0e2a47]" />
            Email Certificate
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSend} className="p-6 space-y-5">
          <p className="text-sm text-slate-600 font-medium">
            Send <strong>{certificateNumber}</strong> as a PDF attachment.
            The email will include a pre-written message from the agency.
          </p>

          <div className="space-y-1.5">
            <label htmlFor="emails" className="block text-xs font-bold text-slate-800">
              Recipient Email(s)
            </label>
            <p className="text-[11px] text-slate-500">
              Separate multiple email addresses with a comma.
            </p>
            <input
              id="emails"
              type="text"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="e.g. client@example.com, vendor@example.com"
              className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:ring-2 focus:ring-[#0e2a47] focus:outline-none"
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-800">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm text-emerald-800 font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Certificate sent successfully!
            </div>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="outline" size="md" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading || success || !emails.trim()}
              icon={
                loading ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Mail className="w-4 h-4 text-white" />
                )
              }
              className="bg-[#0e2a47] hover:bg-[#0a1e33] min-w-[100px]"
            >
              {loading ? 'Sending...' : 'Send Email'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
