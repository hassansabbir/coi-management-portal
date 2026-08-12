'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Shield, Calendar, Building, MapPin, Check, Info } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { INITIAL_CERTIFICATES } from '@/lib/mockData';

export default function EditCertificatePage() {
  const router = useRouter();
  const cert = INITIAL_CERTIFICATES[0];

  // EXACTLY 3 EDITABLE FIELDS:
  // 1) Certificate Date
  // 2) Certificate Holder Name + Address
  // 3) Additional Insured Yes/No toggle
  const [certificateDate, setCertificateDate] = useState(cert.certificateDate);
  const [holderName, setHolderName] = useState(cert.certificateHolderName);
  const [holderAddress, setHolderAddress] = useState(cert.certificateHolderAddress);
  const [additionalInsured, setAdditionalInsured] = useState(cert.additionalInsured);

  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Update in memory mock data
    cert.certificateDate = certificateDate;
    cert.certificateHolderName = holderName;
    cert.certificateHolderAddress = holderAddress;
    cert.additionalInsured = additionalInsured;
    cert.lastUpdated = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    setTimeout(() => {
      setSaving(false);
      setSuccessToast(true);
      setTimeout(() => {
        router.push('/portal');
      }, 1200);
    }, 600);
  };

  return (
    <main className="flex-1 w-full px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/portal"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Edit Certificate</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Update allowed holder and designation details for {cert.certificateNumber}
            </p>
          </div>
        </div>

        <Badge variant="active">Active Policy</Badge>
      </div>

      {/* Toast Feedback */}
      {successToast && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm font-bold flex items-center gap-2 animate-fade-in">
          <Check className="w-5 h-5 text-emerald-200" />
          <span>Certificate updated successfully! Redirecting to portal...</span>
        </div>
      )}

      {/* Policy Read-Only Context Banner */}
      <Card className="p-4 bg-slate-50 border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider">
          <Info className="w-4 h-4 text-[#0e2a47]" />
          <span>Read-Only Policy Context (Managed by Insurance Agency)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">Insured Name</span>
            <span className="font-bold text-slate-900">{cert.insuredName}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Policy Type</span>
            <span className="font-bold text-slate-900">{cert.policyType}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Policy Limits</span>
            <span className="font-bold text-slate-900">{cert.eachOccurrenceLimit} / {cert.generalAggregateLimit}</span>
          </div>
        </div>
      </Card>

      {/* Main Edit Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Editable Certificate Fields
          </h2>

          {/* EDITABLE FIELD 1: Certificate Date */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              1. Certificate Date
            </label>
            <p className="text-[11px] text-slate-500">Specify the issuance date shown on the certificate header.</p>
            <div className="relative max-w-xs pt-1">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={certificateDate}
                onChange={(e) => setCertificateDate(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:ring-2 focus:ring-[#0e2a47] focus:outline-none"
              />
            </div>
          </div>

          {/* EDITABLE FIELD 2: Certificate Holder (Name + Address) */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-800">
                2. Certificate Holder Information
              </label>
              <p className="text-[11px] text-slate-500">Name and physical address of the certificate holder organization.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Holder Organization Name
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    required
                    placeholder="e.g. Zara Construction LLC"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:ring-2 focus:ring-[#0e2a47] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Holder Address & Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    value={holderAddress}
                    onChange={(e) => setHolderAddress(e.target.value)}
                    required
                    placeholder="Street, Suite, City, State, ZIP"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-[#0e2a47] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* EDITABLE FIELD 3: Additional Insured Yes/No Toggle */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800">
              3. Additional Insured Designation
            </label>
            <p className="text-[11px] text-slate-500">Indicate whether the certificate holder is listed as an Additional Insured.</p>

            <div className="flex items-center gap-4 pt-2">
              <label
                onClick={() => setAdditionalInsured(true)}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                  additionalInsured
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Shield className={`w-4 h-4 ${additionalInsured ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="text-sm">Yes (Additional Insured Included)</span>
              </label>

              <label
                onClick={() => setAdditionalInsured(false)}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                  !additionalInsured
                    ? 'bg-slate-100 border-slate-400 text-slate-900 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-sm">No (Standard Certificate)</span>
              </label>
            </div>
          </div>
        </Card>

        {/* Action Buttons: Save & Cancel */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/portal">
            <Button type="button" variant="outline" size="md">
              Cancel
            </Button>
          </Link>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={saving}
            icon={<Save className="w-4 h-4 text-white" />}
            className="bg-[#0e2a47] font-semibold min-w-35"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </main>
  );
}
