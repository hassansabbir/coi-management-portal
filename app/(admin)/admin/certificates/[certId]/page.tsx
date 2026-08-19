'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Mail, Download, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { INITIAL_CERTIFICATES } from '@/lib/mockData';

export default function AdminCertificateDetailPage({ params }: { params: Promise<{ certId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const certId = resolvedParams.certId;
  const [showSuccessEmailModal, setShowSuccessEmailModal] = useState(false);
  const [cert, setCert] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Fetch real data on mount
  React.useEffect(() => {
    async function fetchCert() {
      try {
        const response = await fetch(`/api/admin/certificates/${certId}`);
        if (response.ok) {
          const data = await response.json();
          setCert(data);
          setPdfUrl(`/api/admin/certificates/${certId}/pdf`);
        }
      } catch (err) {
        console.error('Failed to fetch certificate', err);
        setPdfError('Network error loading PDF');
      } finally {
        setLoading(false);
      }
    }
    fetchCert();
  }, [certId]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading certificate details...</div>;
  }

  if (!cert) {
    return <div className="p-8 text-center text-slate-500">Certificate not found.</div>;
  }

  const handleDownload = () => {
    alert(`Downloading ${cert.policy_type || cert.policyType}.pdf...`);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Header Bar & Actions matching Image 4 */}
      <header className="bg-white border-b border-slate-200/80 px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
              <Link href="/admin/certificates" className="hover:text-slate-700 transition-colors">
                Certificates
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-600 font-semibold">{cert.policyType}</span>
            </nav>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{cert.policyType}</h1>
          </div>

          {/* Action Buttons matching Image 4 */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => router.push('/admin/certificates')}
              className="bg-white border-slate-300 text-slate-700 font-semibold px-4 rounded-lg text-xs"
            >
              Back
            </Button>
            <Button
              variant="outline"
              size="md"
              icon={<Mail className="w-3.5 h-3.5 text-slate-700" />}
              onClick={() => setShowSuccessEmailModal(true)}
              className="bg-white border-slate-300 text-slate-700 font-semibold px-4 rounded-lg text-xs"
            >
              Email
            </Button>
            <Button
              variant="outline"
              size="md"
              icon={<Download className="w-3.5 h-3.5 text-slate-700" />}
              onClick={handleDownload}
              className="bg-white border-slate-300 text-slate-700 font-semibold px-4 rounded-lg text-xs"
            >
              Download
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area matching Image 4 2-column layout */}
      <main className="flex-1 p-6 lg:p-8 space-y-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Certificate Details (4 cols) matching Image 4 */}
          <div className="lg:col-span-3 xl:col-span-3 space-y-6">
            <Card className="p-6 space-y-5 border-slate-200">
              <h2 className="text-sm font-bold text-slate-900">Certificate Details</h2>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    CLIENT
                  </span>
                  <p className="font-semibold text-slate-900">{cert.insuredName}</p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    CERTIFICATE DATE
                  </span>
                  <p className="font-semibold text-slate-900">{cert.effectiveDate}</p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    LAST UPDATED
                  </span>
                  <p className="font-semibold text-slate-900">{cert.lastUpdated}</p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    FILE SIZE
                  </span>
                  <p className="font-semibold text-slate-900">{cert.fileSize || '1.2 MB'}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: PDF Preview Container (9 cols) matching Image 4 */}
          <div className="lg:col-span-9 xl:col-span-9 space-y-3">
            <Card className="p-0 border-slate-200 overflow-hidden">
              <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-700">{cert.policyType}.pdf</span>
              </div>

              {/* Actual PDF Preview Frame */}
              <div className="bg-[#eef2f6] p-6 flex justify-center items-start overflow-x-auto min-h-[600px] shadow-inner">
                {loading ? (
                  <div className="flex flex-col items-center justify-center mt-20 text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin mb-4" />
                    <p className="text-sm font-semibold">Loading certificate details...</p>
                  </div>
                ) : pdfError ? (
                  <div className="flex flex-col items-center justify-center mt-20 text-red-500 bg-red-50 p-6 rounded-xl border border-red-200">
                    <AlertCircle className="w-8 h-8 mb-4" />
                    <p className="text-sm font-semibold">{pdfError}</p>
                  </div>
                ) : pdfUrl ? (
                  <div className="bg-white shadow-2xl transition-all duration-200 overflow-hidden mx-auto shrink-0 w-full max-w-4xl">
                    <iframe
                      src={pdfUrl + '#view=FitH&toolbar=0'}
                      title="Certificate PDF"
                      className="w-full border-0"
                      style={{ height: '85vh', minHeight: '800px' }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center mt-20 text-slate-500">
                    <p className="text-sm font-semibold">Generating PDF preview...</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Certificate Emailed Success Modal matching Image 5 */}
      {showSuccessEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-sm p-6 text-center animate-in fade-in zoom-in-95 flex flex-col items-center">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Certificate Emailed Successfully
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              The certificate has been successfully emailed to the certificate holder.
            </p>

            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => setShowSuccessEmailModal(false)}
              className="bg-[#0e2a47] hover:bg-[#0a1e33] text-white px-8 py-2.5 rounded-xl font-bold text-xs"
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
