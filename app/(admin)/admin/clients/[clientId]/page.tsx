'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Plus, Upload } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Avatar } from '@/components/shared/Avatar';
import { INITIAL_CLIENTS, INITIAL_CERTIFICATES } from '@/lib/mockData';

export default function ClientDetailPage({ params }: { params: Promise<{ clientId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const clientId = resolvedParams.clientId;

  const [client, setClient] = useState<any>(null);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function fetchClient() {
      try {
        const response = await fetch(`/api/admin/clients/${clientId}`);
        if (response.ok) {
          const data = await response.json();
          setClient(data.client);
          setCertificates(data.certificates || []);
        }
      } catch (err) {
        console.error('Failed to fetch client details', err);
      } finally {
        setLoading(false);
      }
    }
    fetchClient();
  }, [clientId]);

  const [activeTab, setActiveTab] = useState<'overview' | 'certificates'>('overview');
  const [showAddCertModal, setShowAddCertModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading client details...</div>;
  }

  if (!client) {
    return <div className="p-8 text-center text-slate-500">Client not found.</div>;
  }

  const handleDeleteClient = () => {
    if (confirm(`Are you sure you want to delete client "${client.contactName}"?`)) {
      router.push('/admin/clients');
    }
  };

  const handleSendEmail = (certName: string) => {
    setToastMessage(`Certificate "${certName}" sent to ${client.contactEmail}`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl text-xs font-semibold animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Main Content Area matching Images 3 & 4 */}
      <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl w-full">
        {/* Breadcrumb & Top Bar matching Images 3 & 4 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
              <Link href="/admin/clients" className="hover:text-slate-700 transition-colors">
                Clients
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-600 font-semibold">{client.contactName}</span>
            </nav>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{client.contactName}</h1>
          </div>

          {/* Top Right Action Buttons matching Images 3 & 4 */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => router.push('/admin/clients')}
              className="bg-white border-slate-300 text-slate-700 font-semibold px-5 rounded-lg"
            >
              Back
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={handleDeleteClient}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-5 rounded-lg"
            >
              Delete Client
            </Button>
          </div>
        </div>

        {/* Profile Header Card matching Images 3 & 4 */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Avatar initials={client.avatarInitials} size="lg" />
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">{client.contactName}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{client.contactEmail}</p>
            </div>
          </div>
        </Card>

        {/* Tabs Bar matching Images 3 & 4 */}
        <div className="border-b border-slate-200">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer ${
                activeTab === 'overview'
                  ? 'text-[#0e2a47]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Overview
              {activeTab === 'overview' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0e2a47] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('certificates')}
              className={`pb-3 text-sm font-semibold transition-all relative cursor-pointer ${
                activeTab === 'certificates'
                  ? 'text-[#0e2a47]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Certificates ({certificates.length || 4})
              {activeTab === 'certificates' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0e2a47] rounded-full" />
              )}
            </button>
          </nav>
        </div>

        {/* TAB 1: OVERVIEW CONTENT matching Image 3 */}
        {activeTab === 'overview' && (
          <Card className="p-6 sm:p-8 space-y-6">
            <h3 className="text-sm font-bold text-slate-900">Client Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Full Name
                </span>
                <p className="text-sm font-semibold text-slate-900">{client.contactName}</p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Created
                </span>
                <p className="text-sm font-semibold text-slate-900">{client.createdAt || 'Jan 15, 2025'}</p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Email
                </span>
                <p className="text-sm font-semibold text-slate-900">{client.contactEmail}</p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Total Certificates
                </span>
                <p className="text-sm font-semibold text-slate-900">{certificates.length || 4}</p>
              </div>
            </div>
          </Card>
        )}

        {/* TAB 2: CERTIFICATES CONTENT matching Image 4 */}
        {activeTab === 'certificates' && (
          <Card className="p-0 overflow-hidden">
            {/* Header matching Image 4 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Certificates</h3>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-4 h-4 text-white" />}
                className="bg-[#0e2a47] hover:bg-[#0a1e33] font-semibold text-xs py-2 px-3 rounded-lg"
                onClick={() => setShowAddCertModal(true)}
              >
                Add Certificate
              </Button>
            </div>

            {/* Table matching Image 4 */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-3.5">Certificate</th>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {certificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 leading-tight">{cert.policyType}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Updated {cert.lastUpdated}</p>
                      </td>

                      <td className="px-6 py-4 text-slate-600 text-xs font-medium">
                        {cert.effectiveDate}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-3">
                          <Link
                            href="/portal/certificate"
                            className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline transition-colors"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleSendEmail(cert.policyType)}
                            className="text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline transition-colors cursor-pointer"
                          >
                            Email
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {certificates.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-slate-400 text-sm">
                        No certificates added yet for this client.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>

      {/* Add Certificate Modal */}
      {showAddCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-md p-6 sm:p-8 animate-in fade-in zoom-in-95">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Add Certificate</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowAddCertModal(false);
                setToastMessage('New certificate added for Sarah Mitchell');
                setTimeout(() => setToastMessage(''), 3500);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Policy Type Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cyber Liability 2026"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e2a47]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Effective Date</label>
                <input
                  type="date"
                  required
                  defaultValue="2026-09-01"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e2a47]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Attach PDF Document</label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:border-slate-400 transition-colors cursor-pointer">
                  <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-600 font-medium">Click to select PDF certificate</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setShowAddCertModal(false)}
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
                  Add Certificate
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
