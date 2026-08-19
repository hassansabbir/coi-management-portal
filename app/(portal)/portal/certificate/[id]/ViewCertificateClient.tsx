'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit3, Download, Plus, Minus, Info, Loader2, AlertCircle, Mail } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { EmailCertificateModal } from '@/components/portal/EmailCertificateModal';

export default function ViewCertificateClient({ cert }: { cert: any }) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  useEffect(() => {
    let activeUrl: string | null = null;
    
    async function loadPdf() {
      try {
        setLoading(true);
        const res = await fetch('/api/portal/certificate/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            certificateId: cert.id,
            certificateDate: cert.certificateDate,
            certificateHolderName: cert.certificateHolderName,
            certificateHolderAddress: cert.certificateHolderAddress,
            additionalInsured: cert.additionalInsured,
            descriptionOfOperations: cert.descriptionOfOperations,
          }),
        });
        
        if (res.ok) {
          const blob = await res.blob();
          activeUrl = URL.createObjectURL(blob);
          setPdfUrl(activeUrl);
        } else {
          const data = await res.json().catch(() => null);
          setError(data?.error || 'Failed to generate PDF');
        }
      } catch (err) {
        console.error(err);
        setError('Network error loading PDF');
      } finally {
        setLoading(false);
      }
    }
    
    loadPdf();
    
    return () => {
      if (activeUrl) URL.revokeObjectURL(activeUrl);
    };
  }, [cert]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 50));
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const element = document.createElement('a');
    element.href = pdfUrl;
    element.download = `${cert.certificateNumber}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <main className="flex-1 w-full px-6 lg:px-8 py-8 space-y-6">
      {/* Header Bar & Actions matching Design Screenshot */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <Link href="/portal" className="hover:text-slate-700 transition-colors">
              Portal
            </Link>
            <span>/</span>
            <span className="text-slate-600 font-semibold">View Certificate</span>
          </nav>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Certificate of Liability Insurance
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {cert.certificateNumber} · View only
          </p>
        </div>

        {/* Top Right Controls matching Design Screenshot */}
        <div className="flex items-center gap-3">
          {/* Zoom Control Box: [-] 100% [+] */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-xs text-xs font-semibold text-slate-700">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              title="Zoom out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 min-w-11 text-center font-mono text-slate-600">
              {zoomLevel}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              title="Zoom in"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Email Certificate Button (Outline) */}
          <Button
            variant="outline"
            size="md"
            icon={<Mail className="w-4 h-4 text-slate-700" />}
            onClick={() => setIsEmailModalOpen(true)}
            className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs py-2 px-4 rounded-lg shadow-sm hidden sm:flex"
          >
            Email
          </Button>

          {/* Edit Certificate Button (Dark Navy) */}
          <Link href={`/portal/certificate/${cert.id}/edit`}>
            <Button
              variant="primary"
              size="md"
              icon={<Edit3 className="w-4 h-4 text-white" />}
              className="bg-[#0e2a47] hover:bg-[#0a1e33] font-semibold text-xs py-2 px-4 rounded-lg shadow-sm"
            >
              Edit Certificate
            </Button>
          </Link>

          {/* Download Button (Outline) */}
          <Button
            variant="outline"
            size="md"
            icon={<Download className="w-4 h-4 text-slate-700" />}
            onClick={handleDownload}
            disabled={!pdfUrl}
            className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs py-2 px-4 rounded-lg shadow-sm"
          >
            Download
          </Button>
        </div>
      </div>

      <EmailCertificateModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        certificateId={cert.id}
        certificateNumber={cert.certificateNumber}
        certificateDate={cert.certificateDate}
        certificateHolderName={cert.certificateHolderName}
        certificateHolderAddress={cert.certificateHolderAddress}
        additionalInsured={cert.additionalInsured}
        descriptionOfOperations={cert.descriptionOfOperations}
      />

      {/* Main Full-Width PDF Viewer Container matching Design Screenshot */}
      <div className="w-full bg-[#eef2f6] border border-slate-200/90 rounded-2xl p-6 sm:p-10 flex justify-center items-start overflow-x-auto min-h-[600px] shadow-inner">
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="text-sm font-semibold">Generating PDF preview...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center mt-20 text-red-500 bg-red-50 p-6 rounded-xl border border-red-200">
            <AlertCircle className="w-8 h-8 mb-4" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        ) : pdfUrl ? (
          <div
            style={{ width: `${zoomLevel}%`, minWidth: '320px' }}
            className="bg-white shadow-2xl transition-all duration-200 overflow-hidden mx-auto shrink-0"
          >
            <iframe
              src={pdfUrl + '#view=FitH&toolbar=0'}
              title="Certificate PDF"
              className="w-full border-0"
              style={{ height: '85vh', minHeight: '800px' }}
            />
          </div>
        ) : null}
      </div>

      {/* Bottom Disclaimer Notice matching Design Screenshot */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>This is a read-only view. To make changes, use Edit Certificate.</span>
      </div>
    </main>
  );
}
