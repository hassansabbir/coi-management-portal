'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Mail, Download } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { INITIAL_CERTIFICATES } from '@/lib/mockData';

export default function AdminCertificateDetailPage({ params }: { params: Promise<{ certId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const certId = resolvedParams.certId;

  const cert = INITIAL_CERTIFICATES.find((c) => c.id === certId) || INITIAL_CERTIFICATES[0];
  const [showSuccessEmailModal, setShowSuccessEmailModal] = useState(false);

  const handleDownload = () => {
    alert(`Downloading ${cert.policyType}.pdf...`);
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

              {/* ACORD 25 Document Preview Frame matching Image 4 */}
              <div className="p-6 bg-slate-100/70 flex justify-center">
                <div className="bg-white border border-slate-300 shadow-md p-8 rounded-sm w-full text-[11px] space-y-4 text-slate-900 font-sans">
                  {/* Top Header Banner */}
                  <div className="bg-[#0e2a47] text-white p-3 rounded-xs flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-xs uppercase tracking-tight">CERTIFICATE OF LIABILITY INSURANCE</h3>
                      <p className="text-[9px] text-slate-300 font-mono">ACORD 25 (2016/03)</p>
                    </div>
                    <div className="text-right text-[9px] font-mono">
                      <p>DATE (MM/DD/YYYY): 2025-01-30</p>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <p className="text-[9px] text-slate-500 leading-tight">
                    THIS CERTIFICATE IS ISSUED AS A MATTER OF INFORMATION ONLY AND CONFERS NO RIGHTS UPON THE CERTIFICATE HOLDER. THIS CERTIFICATE DOES NOT AFFIRMATIVELY OR NEGATIVELY AMEND, EXTEND OR ALTER THE COVERAGE AFFORDED BY THE POLICIES BELOW.
                  </p>

                  {/* Producer & Insured */}
                  <div className="grid grid-cols-2 gap-4 border border-slate-300 p-3 rounded-xs text-[10px]">
                    <div>
                      <p className="font-bold uppercase text-[9px] text-slate-400">PRODUCER</p>
                      <p className="font-bold">Acme Insurance Agency LLC</p>
                      <p>123 Insurance Ave, Suite 400</p>
                      <p>New York, NY 10001</p>
                      <p>Phone: (212) 555-0100</p>
                    </div>
                    <div>
                      <p className="font-bold uppercase text-[9px] text-slate-400">INSURED</p>
                      <p className="font-bold">{cert.insuredName}</p>
                      <p>456 Builder Blvd, Suite 200</p>
                      <p>Dallas, TX 75001</p>
                    </div>
                  </div>

                  {/* Coverages Table */}
                  <div className="border border-slate-300 rounded-xs overflow-hidden text-[9px]">
                    <div className="bg-slate-100 p-1.5 font-bold uppercase text-slate-600 border-b border-slate-300">
                      COVERAGES
                    </div>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-300 bg-slate-50 font-bold">
                          <th className="p-1.5">COMMERCIAL GENERAL LIABILITY</th>
                          <th className="p-1.5">POLICY NUMBER</th>
                          <th className="p-1.5">LIMITS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr>
                          <td className="p-1.5">General Liability (Occur X)</td>
                          <td className="p-1.5 font-mono">GL-2024-88473</td>
                          <td className="p-1.5 font-mono">
                            Each Occ: $1,000,000 | Gen Agg: $2,000,000
                          </td>
                        </tr>
                        <tr>
                          <td className="p-1.5">Automobile Liability</td>
                          <td className="p-1.5 font-mono">AU-2024-77223</td>
                          <td className="p-1.5 font-mono">CSL: $1,000,000</td>
                        </tr>
                        <tr>
                          <td className="p-1.5">Umbrella Liab</td>
                          <td className="p-1.5 font-mono">UMB-2024-55119</td>
                          <td className="p-1.5 font-mono">Agg: $5,000,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Holder & Representative Footer */}
                  <div className="grid grid-cols-2 gap-4 border border-slate-300 p-3 rounded-xs text-[10px]">
                    <div>
                      <p className="font-bold uppercase text-[9px] text-slate-400 mb-1">CERTIFICATE HOLDER</p>
                      <p className="font-bold">{cert.certificateHolderName}</p>
                      <p className="text-slate-600">{cert.certificateHolderAddress}</p>
                    </div>
                    <div>
                      <p className="font-bold uppercase text-[9px] text-slate-400 mb-1">AUTHORIZED REPRESENTATIVE</p>
                      <p className="font-serif italic font-bold text-slate-800">Jane M. Reynolds</p>
                      <p className="text-[9px] text-slate-400 mt-2">© 1988-2016 ACORD CORPORATION. All rights reserved.</p>
                    </div>
                  </div>
                </div>
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
