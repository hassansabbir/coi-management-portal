'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Upload, FileText, Check } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { INITIAL_CERTIFICATES, INITIAL_CLIENTS } from '@/lib/mockData';
import { Certificate } from '@/types';

export default function AdminCertificatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  
  // Modals state matching design screenshots
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSuccessUploadModal, setShowSuccessUploadModal] = useState(false);
  const [showSuccessEmailModal, setShowSuccessEmailModal] = useState(false);

  // Upload Form State (Image 2)
  const [selectedClient, setSelectedClient] = useState('');
  const [holderName, setHolderName] = useState('');
  const [holderEmail, setHolderEmail] = useState('');
  const [fileName, setFileName] = useState('');

  const filteredCerts = certificates.filter(
    (c) =>
      c.policyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.insuredName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      clientId: selectedClient || 'client-1',
      certificateNumber: `COI-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      certificateHolderName: holderName || 'Certificate Holder LLC',
      certificateHolderAddress: '100 Main Street, Suite 200',
      certificateDate: 'Jan 1, 2026',
      insuredName: selectedClient ? INITIAL_CLIENTS.find(c => c.id === selectedClient)?.contactName || 'Client' : 'James Okafor',
      additionalInsured: true,
      status: 'active',
      lastUpdated: 'Aug 8, 2026',
      policyType: fileName ? fileName.replace('.pdf', '') : 'General Liability 2026',
      policyNumber: 'GL-99381-01',
      effectiveDate: 'Jan 1, 2026',
      expirationDate: 'Jan 1, 2027',
      generalAggregateLimit: '$5,000,000',
      eachOccurrenceLimit: '$2,000,000',
      fileSize: '1.2 MB',
    };

    setCertificates([newCert, ...certificates]);
    setShowUploadModal(false);
    setShowSuccessUploadModal(true);
  };

  const handleTriggerEmail = () => {
    setShowSuccessEmailModal(true);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Header Bar matching Image 1 */}
      <header className="bg-white border-b border-slate-200/80 px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 font-semibold block mb-0.5">Certificates</span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">All Certificates</h1>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={<Upload className="w-4 h-4 text-white" />}
            className="bg-[#0e2a47] hover:bg-[#0a1e33] font-semibold text-sm px-4 py-2.5 rounded-lg"
            onClick={() => setShowUploadModal(true)}
          >
            Upload Certificate
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-8 space-y-6 w-full">
        {/* Search Bar matching Image 1 */}
        <Card className="p-4">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search certificates..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e2a47] transition-all"
            />
          </div>
        </Card>

        {/* Certificate Table matching Image 1 */}
        <Card className="p-0 overflow-hidden border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Certificate</th>
                  <th className="px-6 py-3.5">Client</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Updated</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredCerts.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Certificate Title & File Size with Green File Icon matching Image 1 */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{cert.policyType}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{cert.fileSize || '1.2 MB'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Client Name */}
                    <td className="px-6 py-4 text-slate-600 text-xs font-medium">
                      {cert.insuredName}
                    </td>

                    {/* Certificate Date */}
                    <td className="px-6 py-4 text-slate-600 text-xs font-normal">
                      {cert.effectiveDate}
                    </td>

                    {/* Updated Date */}
                    <td className="px-6 py-4 text-slate-500 text-xs font-normal">
                      {cert.lastUpdated}
                    </td>

                    {/* Actions: View (teal) & Email (gray) matching Image 1 */}
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-3">
                        <Link
                          href={`/admin/certificates/${cert.id}`}
                          className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline transition-colors"
                        >
                          View
                        </Link>
                        <button
                          onClick={handleTriggerEmail}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline transition-colors cursor-pointer"
                        >
                          Email
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredCerts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                      No certificates found matching &quot;{searchTerm}&quot;
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {/* Upload Certificate Modal matching Image 2 */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-md p-6 sm:p-8 animate-in fade-in zoom-in-95">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Upload Certificate</h2>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Field 1: Select Client */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Client
                </label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e2a47]"
                >
                  <option value="">Choose a client...</option>
                  {INITIAL_CLIENTS.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.contactName} ({client.businessName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 2: Drag & Drop File Container matching Image 2 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Certificate File
                </label>
                <div
                  onClick={() => setFileName('General Liability 2026.pdf')}
                  className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-teal-500 transition-colors bg-slate-50/50 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mx-auto mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-700 font-semibold">
                    Drop PDF here or <span className="text-teal-600 underline">browse</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {fileName ? `Selected: ${fileName}` : 'PDF files only · Max 10 MB'}
                  </p>
                </div>
              </div>

              {/* Field 3: Certificate Holder's Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Certificate Holder&apos;s Name
                </label>
                <input
                  type="text"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  placeholder="Full name"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e2a47]"
                />
              </div>

              {/* Field 4: Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={holderEmail}
                  onChange={(e) => setHolderEmail(e.target.value)}
                  placeholder="holder@gmail.com"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e2a47]"
                />
              </div>

              {/* Buttons matching Image 2 */}
              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setShowUploadModal(false)}
                  className="w-1/3 py-2.5 rounded-xl text-slate-700 border-slate-300 font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-2/3 py-2.5 rounded-xl bg-[#0e2a47] hover:bg-[#0a1e33] text-white font-semibold shadow-sm"
                >
                  Upload & Mail
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Uploaded Success Modal matching Image 3 */}
      {showSuccessUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-sm p-6 text-center animate-in fade-in zoom-in-95 flex flex-col items-center">
            {/* Orange SUCCESS Badge matching Image 3 */}
            <div className="mb-4">
              <span className="px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest border-2 border-slate-900 shadow-md">
                SUCCESS
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Certificate Uploaded Successfully
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              The certificate has been uploaded successfully, emailed to the certificate holder and is now available in the client portal.
            </p>

            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => setShowSuccessUploadModal(false)}
              className="bg-[#0e2a47] hover:bg-[#0a1e33] text-white px-8 py-2.5 rounded-xl font-bold text-xs"
            >
              OK
            </Button>
          </div>
        </div>
      )}

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
