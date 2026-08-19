'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, Eye, Edit3, Download, Check, Mail } from 'lucide-react';
import { Certificate } from '@/types';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { EmailCertificateModal } from '@/components/portal/EmailCertificateModal';

interface CertificateSummaryCardProps {
  certificate: Certificate;
}

export const CertificateSummaryCard: React.FC<CertificateSummaryCardProps> = ({ certificate }) => {
  const [downloaded, setDownloaded] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);
    // Create a mock download link
    const element = document.createElement('a');
    const file = new Blob([
      `CERTIFICATE OF LIABILITY INSURANCE (ACORD 25)\nCertificate Number: ${certificate.certificateNumber}\nInsured: ${certificate.insuredName}\nCertificate Holder: ${certificate.certificateHolderName} (${certificate.certificateHolderAddress})\nCertificate Date: ${certificate.certificateDate}\nAdditional Insured: ${certificate.additionalInsured ? 'Yes' : 'No'}\nStatus: ${certificate.status.toUpperCase()}\nIssued By: The Ewing Agency Inc.`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${certificate.certificateNumber}_Certificate.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <Card className="p-6 md:p-8">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-600 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              Certificate of Liability Insurance
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">ACORD 25</p>
          </div>
        </div>

        <Badge variant={certificate.status === 'active' ? 'active' : 'inactive'} className="self-start sm:self-auto">
          Active
        </Badge>
      </div>

      {/* Grid Details matching Image 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 py-6">
        <div>
          <span className="text-xs font-semibold text-slate-400 block mb-1">Certificate Holder</span>
          <p className="text-sm font-bold text-slate-900 leading-snug">
            {certificate.certificateHolderName}
          </p>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-400 block mb-1">Certificate Date</span>
          <p className="text-sm font-bold text-slate-900 leading-snug">
            {certificate.certificateDate}
          </p>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-400 block mb-1">Certificate Number</span>
          <p className="text-sm font-bold text-slate-900 leading-snug">
            {certificate.certificateNumber}
          </p>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-400 block mb-1">Insured</span>
          <p className="text-sm font-bold text-slate-900 leading-snug">
            {certificate.insuredName}
          </p>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-400 block mb-1">Last Updated</span>
          <p className="text-sm font-bold text-slate-900 leading-snug">
            {certificate.lastUpdated}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
        <Link href={`/portal/certificate/${certificate.id}`}>
          <Button variant="outline" fullWidth icon={<Eye className="w-4 h-4 text-slate-600" />}>
            View
          </Button>
        </Link>

        <Link href={`/portal/certificate/${certificate.id}/edit`}>
          <Button variant="primary" fullWidth icon={<Edit3 className="w-4 h-4 text-white" />}>
            Edit
          </Button>
        </Link>

        <Button
          variant="outline"
          fullWidth
          onClick={() => setIsEmailModalOpen(true)}
          icon={<Mail className="w-4 h-4 text-slate-600" />}
        >
          Email
        </Button>

        <Button
          variant="outline"
          fullWidth
          onClick={handleDownload}
          icon={downloaded ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4 text-slate-600" />}
        >
          {downloaded ? 'Downloaded!' : 'Download'}
        </Button>
      </div>

      <EmailCertificateModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        certificateId={certificate.id}
        certificateNumber={certificate.certificateNumber}
        certificateDate={certificate.certificateDate}
        certificateHolderName={certificate.certificateHolderName}
        certificateHolderAddress={certificate.certificateHolderAddress}
        additionalInsured={certificate.additionalInsured}
        descriptionOfOperations={certificate.descriptionOfOperations || ''}
      />
    </Card>
  );
};
