'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Edit3, Download, Plus, Minus, Info } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { INITIAL_CERTIFICATES } from '@/lib/mockData';

export default function ViewCertificatePage() {
  const cert = INITIAL_CERTIFICATES[0];
  const [zoomLevel, setZoomLevel] = useState(85);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 5, 125));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 5, 60));
  };

  const handleDownload = () => {
    alert(`Downloading certificate ${cert.certificateNumber}.pdf...`);
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
          {/* Zoom Control Box: [-] 85% [+] */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-xs text-xs font-semibold text-slate-700">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              title="Zoom out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 min-w-[44px] text-center font-mono text-slate-600">
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

          {/* Edit Certificate Button (Dark Navy) */}
          <Link href="/portal/certificate/edit">
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
            className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs py-2 px-4 rounded-lg"
          >
            Download
          </Button>
        </div>
      </div>

      {/* Main Full-Width PDF Viewer Container matching Design Screenshot */}
      <div className="w-full bg-[#eef2f6] border border-slate-200/90 rounded-2xl p-6 sm:p-10 flex justify-center items-start overflow-x-auto min-h-[750px] shadow-inner">
        {/* PDF Document Document View Frame scaled dynamically by Zoom Level */}
        <div
          style={{ width: `${zoomLevel}%`, maxWidth: '1000px', minWidth: '320px' }}
          className="bg-white border border-slate-300 shadow-xl p-8 rounded-sm text-[11px] space-y-4 text-slate-900 font-sans transition-all duration-200"
        >
          {/* Top Header Banner */}
          <div className="bg-[#0e2a47] text-white p-3 rounded-xs flex justify-between items-center">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-tight">CERTIFICATE OF LIABILITY INSURANCE</h3>
              <p className="text-[9px] text-slate-300 font-mono">ACORD 25 (2016/03)</p>
            </div>
            <div className="text-right text-[9px] font-mono">
              <p>DATE (MM/DD/YYYY): {cert.certificateDate}</p>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-[9px] text-slate-500 leading-tight">
            THIS CERTIFICATE IS ISSUED AS A MATTER OF INFORMATION ONLY AND CONFERS NO RIGHTS UPON THE CERTIFICATE HOLDER. THIS CERTIFICATE DOES NOT AFFIRMATIVELY OR NEGATIVELY AMEND, EXTEND OR ALTER THE COVERAGE AFFORDED BY THE POLICIES BELOW. THIS CERTIFICATE OF INSURANCE DOES NOT CONSTITUTE A CONTRACT BETWEEN THE ISSUING INSURER(S), AUTHORIZED REPRESENTATIVE OR PRODUCER, AND THE CERTIFICATE HOLDER.
          </p>

          {/* Producer & Insured */}
          <div className="grid grid-cols-2 gap-4 border border-slate-300 p-3 rounded-xs text-[10px]">
            <div>
              <p className="font-bold uppercase text-[9px] text-slate-400">PRODUCER</p>
              <p className="font-bold">Acme Insurance Agency LLC</p>
              <p>123 Insurance Ave, Suite 400</p>
              <p>New York, NY 10001</p>
              <p>Phone: (212) 555-0100</p>
              <p>Fax: (212) 555-0101</p>
            </div>
            <div>
              <p className="font-bold uppercase text-[9px] text-slate-400">INSURED</p>
              <p className="font-bold">Riverside Contractors Inc.</p>
              <p>456 Builder Blvd, Suite 200</p>
              <p>Dallas, TX 75001</p>
            </div>
          </div>

          {/* Insurers Affording Coverage */}
          <div className="border border-slate-300 p-2.5 rounded-xs text-[9px] grid grid-cols-2 gap-2 text-slate-600 font-mono">
            <div>
              <p><strong className="text-slate-800">Insurer A:</strong> Great Northern Insurance Co. &ndash; NAIC # 20281</p>
              <p><strong className="text-slate-800">Insurer B:</strong> Continental General Ins. Co. &ndash; NAIC # 37273</p>
            </div>
            <div>
              <p><strong className="text-slate-800">Insurer C:</strong> Allied Casualty Company &ndash; NAIC # 00818</p>
              <p><strong className="text-slate-800">Insurer D:</strong></p>
            </div>
          </div>

          {/* Coverages Table */}
          <div className="border border-slate-300 rounded-xs overflow-hidden text-[9px]">
            <div className="bg-slate-100 p-1.5 font-bold uppercase text-slate-600 border-b border-slate-300">
              COVERAGES &bull; POLICY NUMBER / EFFECTIVE DATE / EXPIRATION DATE / LIMITS
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-50 font-bold text-slate-700">
                  <th className="p-1.5">TYPE OF INSURANCE</th>
                  <th className="p-1.5">POLICY NUMBER</th>
                  <th className="p-1.5">EFF / EXP DATE</th>
                  <th className="p-1.5 text-right">LIMITS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                <tr>
                  <td className="p-1.5">
                    <p className="font-bold text-slate-900">COMMERCIAL GENERAL LIABILITY</p>
                    <p className="text-[8px] text-slate-400 font-normal">Claims-Made X Occur &check;</p>
                  </td>
                  <td className="p-1.5">GL-2024-88473</td>
                  <td className="p-1.5">01/01/2025 &ndash; 01/01/2026</td>
                  <td className="p-1.5 text-right">
                    <p>Each Occ: $1,000,000</p>
                    <p>Gen Agg: $2,000,000</p>
                  </td>
                </tr>
                <tr>
                  <td className="p-1.5 font-bold">AUTOMOBILE LIABILITY</td>
                  <td className="p-1.5">AU-2024-77223</td>
                  <td className="p-1.5">01/01/2025 &ndash; 01/01/2026</td>
                  <td className="p-1.5 text-right">CSL: $1,000,000</td>
                </tr>
                <tr>
                  <td className="p-1.5 font-bold">UMBRELLA LIAB</td>
                  <td className="p-1.5">UMB-2024-55119</td>
                  <td className="p-1.5">01/01/2025 &ndash; 01/01/2026</td>
                  <td className="p-1.5 text-right">Agg: $5,000,000</td>
                </tr>
                <tr>
                  <td className="p-1.5 font-bold">WORKERS COMPENSATION</td>
                  <td className="p-1.5">WC-2024-31074</td>
                  <td className="p-1.5">01/01/2025 &ndash; 01/01/2026</td>
                  <td className="p-1.5 text-right">E.L. Each Acc: $1,000,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Description of Operations */}
          <div className="border border-slate-300 p-2.5 rounded-xs text-[9px]">
            <p className="font-bold uppercase text-slate-400 text-[8px] mb-0.5">DESCRIPTION OF OPERATIONS / LOCATIONS / VEHICLES</p>
            <p className="text-slate-700">N/A</p>
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
              <p className="font-serif italic font-bold text-slate-800 text-xs">Jane M. Reynolds</p>
              <p className="text-[8px] text-slate-400 mt-2 font-mono">© 1988-2016 ACORD CORPORATION. All rights reserved. ACORD 25 (2016/03)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Disclaimer Notice matching Design Screenshot */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>This is a read-only preview. To make changes, use Edit Certificate.</span>
      </div>
    </main>
  );
}
