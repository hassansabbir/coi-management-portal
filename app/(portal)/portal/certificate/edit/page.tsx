'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Shield,
  Calendar,
  Building,
  MapPin,
  Check,
  Info,
  Eye,
  EyeOff,
  FileText,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { INITIAL_CERTIFICATES } from '@/lib/mockData';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface EditFormValues {
  certificateDate: string;
  holderName: string;
  holderAddress: string;
  additionalInsured: boolean;
  descriptionOfOperations: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
/** Convert MM/DD/YYYY or "Jan 1, 2026" → YYYY-MM-DD for <input type="date"> */
function toInputDate(dateStr: string): string {
  if (!dateStr) return '';
  // Already ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  // MM/DD/YYYY
  const slash = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (slash) return `${slash[3]}-${slash[1]}-${slash[2]}`;
  // Friendly format (Jan 1, 2026)
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }
  return '';
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function EditCertificatePage() {
  const router = useRouter();

  // In production: use useParams() and fetch from Supabase.
  // Currently: reads from mockData as a fallback until Supabase is populated.
  const cert = INITIAL_CERTIFICATES[0];

  const [values, setValues] = useState<EditFormValues>({
    certificateDate: toInputDate(cert.certificateDate),
    holderName: cert.certificateHolderName,
    holderAddress: cert.certificateHolderAddress,
    additionalInsured: cert.additionalInsured,
    descriptionOfOperations: cert.descriptionOfOperations ?? '',
  });

  // ── Save state
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState(false);

  // ── Preview state
  const [previewing, setPreviewing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // ─────────────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────────────
  function update<K extends keyof EditFormValues>(key: K, value: EditFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Clear preview when values change (stale preview)
    setPreviewUrl(null);
    setShowPreview(false);
    setPreviewError(null);
    setSaveError(null);
  }

  const handlePreview = async () => {
    setPreviewing(true);
    setPreviewError(null);

    try {
      // Revoke previous blob
      if (previewUrl) URL.revokeObjectURL(previewUrl);

      const res = await fetch('/api/portal/certificate/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificateId: cert.id,
          certificateDate: values.certificateDate,
          certificateHolderName: values.holderName,
          certificateHolderAddress: values.holderAddress,
          additionalInsured: values.additionalInsured,
          descriptionOfOperations: values.descriptionOfOperations,
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({ error: 'Preview failed.' }));
        setPreviewError(json.error ?? 'Failed to generate preview.');
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setShowPreview(true);

      // Scroll to preview
      setTimeout(() => {
        previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch {
      setPreviewError('Network error — could not generate preview.');
    } finally {
      setPreviewing(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
      const res = await fetch('/api/portal/certificate/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificateId: cert.id,
          certificateDate: values.certificateDate,
          certificateHolderName: values.holderName,
          certificateHolderAddress: values.holderAddress,
          additionalInsured: values.additionalInsured,
          descriptionOfOperations: values.descriptionOfOperations,
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({ error: 'Save failed.' }));
        setSaveError(json.error ?? 'Failed to save changes.');
        return;
      }

      // Fallback: also update in-memory mockData so the view page reflects changes
      cert.certificateDate = values.certificateDate;
      cert.certificateHolderName = values.holderName;
      cert.certificateHolderAddress = values.holderAddress;
      cert.additionalInsured = values.additionalInsured;
      cert.descriptionOfOperations = values.descriptionOfOperations;
      cert.lastUpdated = new Date().toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      });

      setSuccessToast(true);
      setTimeout(() => router.push('/portal'), 1500);
    } catch {
      setSaveError('Network error — could not save changes.');
    } finally {
      setSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <main className="flex-1 w-full px-6 lg:px-8 py-8 space-y-6">

      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/portal"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Edit Certificate
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Update allowed fields for {cert.certificateNumber}
            </p>
          </div>
        </div>
        <Badge variant="active">Active Policy</Badge>
      </div>

      {/* ── Success Toast ───────────────────────────────────────────────── */}
      {successToast && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check className="w-5 h-5 text-emerald-200 shrink-0" />
          <span>Certificate updated successfully! Redirecting…</span>
        </div>
      )}

      {/* ── Policy Context Banner ───────────────────────────────────────── */}
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
            <span className="font-bold text-slate-900">
              {cert.eachOccurrenceLimit} / {cert.generalAggregateLimit}
            </span>
          </div>
        </div>
      </Card>

      {/* ── Edit Form ───────────────────────────────────────────────────── */}
      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Editable Certificate Fields
          </h2>

          {/* FIELD 1: Certificate Date */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              1. Certificate Date
            </label>
            <p className="text-[11px] text-slate-500">
              The issuance date shown on the certificate header.
            </p>
            <div className="relative max-w-xs pt-1">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="cert-date"
                type="date"
                value={values.certificateDate}
                onChange={(e) => update('certificateDate', e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:ring-2 focus:ring-[#0e2a47] focus:outline-none"
              />
            </div>
          </div>

          {/* FIELD 2: Certificate Holder */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-800">
                2. Certificate Holder Information
              </label>
              <p className="text-[11px] text-slate-500">
                Name and physical address of the certificate holder organisation.
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Holder Organisation Name
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="holder-name"
                    type="text"
                    value={values.holderName}
                    onChange={(e) => update('holderName', e.target.value)}
                    required
                    placeholder="e.g. Apex Property Holdings LLC"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:ring-2 focus:ring-[#0e2a47] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Holder Address &amp; Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    id="holder-address"
                    rows={2}
                    value={values.holderAddress}
                    onChange={(e) => update('holderAddress', e.target.value)}
                    required
                    placeholder="Street, Suite, City, State, ZIP"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-[#0e2a47] focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* FIELD 3: Additional Insured */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800">
              3. Additional Insured Designation
            </label>
            <p className="text-[11px] text-slate-500">
              If Yes, an&nbsp;<strong>X</strong> will be added to the General Liability and
              Auto Liability checkboxes, and the certificate holder will be named as additional
              insured in the Description of Operations.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <button
                type="button"
                id="addl-insured-yes"
                onClick={() => update('additionalInsured', true)}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                  values.additionalInsured
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Shield
                  className={`w-4 h-4 ${values.additionalInsured ? 'text-emerald-600' : 'text-slate-400'}`}
                />
                <span className="text-sm">Yes — Additional Insured</span>
              </button>
              <button
                type="button"
                id="addl-insured-no"
                onClick={() => update('additionalInsured', false)}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                  !values.additionalInsured
                    ? 'bg-slate-100 border-slate-400 text-slate-900 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-sm">No — Standard Certificate</span>
              </button>
            </div>
          </div>

          {/* FIELD 4: Description of Operations */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label
              htmlFor="desc-of-ops"
              className="block text-xs font-bold text-slate-800"
            >
              4. Description of Operations / Locations / Vehicles
            </label>
            <p className="text-[11px] text-slate-500">
              Full text for the Description of Operations box. If Additional Insured is set to
              Yes, the system will automatically append the required additional insured statement.
            </p>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <textarea
                id="desc-of-ops"
                rows={5}
                value={values.descriptionOfOperations}
                onChange={(e) => update('descriptionOfOperations', e.target.value)}
                placeholder="Enter description of operations, locations, vehicles, or any special conditions…"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-[#0e2a47] focus:outline-none resize-y min-h-[100px]"
              />
            </div>
            {values.additionalInsured && values.holderName && (
              <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-[11px] text-emerald-800">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Auto-appended:</strong> &ldquo;{values.holderName} is included as Additional
                  Insured with respect to General Liability and Automobile Liability as required
                  by written contract.&rdquo;
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* ── Error Messages ─────────────────────────────────────────────── */}
        {(saveError || previewError) && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-800">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{saveError ?? previewError}</span>
          </div>
        )}

        {/* ── Action Buttons ─────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Link href="/portal">
            <Button type="button" variant="outline" size="md">
              Cancel
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            {/* Preview PDF Button */}
            <Button
              type="button"
              id="preview-pdf-btn"
              variant="outline"
              size="md"
              disabled={previewing}
              onClick={handlePreview}
              icon={
                previewing ? (
                  <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-600" />
                )
              }
              className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs py-2 px-4 rounded-lg"
            >
              {previewing ? 'Generating…' : 'Preview PDF'}
            </Button>

            {/* Save Changes Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={saving}
              icon={
                saving ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Save className="w-4 h-4 text-white" />
                )
              }
              className="bg-[#0e2a47] font-semibold min-w-36"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>

      {/* ── Inline PDF Preview ─────────────────────────────────────────── */}
      {previewUrl && (
        <div ref={previewRef} className="space-y-3 pb-8">
          {/* Preview header bar */}
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2 text-slate-700">
              <FileText className="w-4 h-4 text-[#0e2a47]" />
              <span className="text-sm font-bold">Certificate Preview</span>
              <span className="text-[11px] text-slate-400 ml-1">
                — not saved yet, this is a preview only
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Download preview */}
              <a
                href={previewUrl}
                download={`${cert.certificateNumber}-preview.pdf`}
                className="text-xs font-semibold text-[#0e2a47] hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3 rotate-[-90deg]" />
                Download
              </a>
              {/* Toggle collapse */}
              <button
                type="button"
                onClick={() => setShowPreview((v) => !v)}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded"
                title={showPreview ? 'Collapse preview' : 'Expand preview'}
              >
                {showPreview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  URL.revokeObjectURL(previewUrl);
                  setPreviewUrl(null);
                  setShowPreview(false);
                }}
                className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded"
                title="Close preview"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* iframe PDF viewer */}
          {showPreview && (
            <div className="w-full rounded-xl overflow-hidden border border-slate-200 shadow-lg bg-slate-100">
              <iframe
                src={previewUrl}
                title="Certificate PDF Preview"
                className="w-full"
                style={{ height: '80vh', minHeight: '600px' }}
              />
            </div>
          )}
        </div>
      )}
    </main>
  );
}
