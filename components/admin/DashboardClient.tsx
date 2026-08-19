'use client';

import React, { useState } from 'react';
import { Plus, Upload, Bell, Check } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { StatCard } from '@/components/admin/StatCard';
import { RecentClientsList } from '@/components/admin/RecentClientsList';
import { RecentActivityFeed } from '@/components/admin/RecentActivityFeed';
import { Client, Activity } from '@/types';

interface DashboardClientProps {
  totalClients: number;
  totalCertificates: number;
  recentClients: Client[];
  recentActivities: Activity[];
}

export function DashboardClient({
  totalClients,
  totalCertificates,
  recentClients,
  recentActivities,
}: DashboardClientProps) {
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [notification, setNotification] = useState('');

  const handleActionToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Add Client Action Button */}
          <Button
            variant="outline"
            size="md"
            icon={<Plus className="w-4 h-4 text-slate-700" />}
            onClick={() => setShowAddClientModal(true)}
            className="flex-1 sm:flex-none justify-center bg-white border-slate-200 font-semibold text-slate-800"
          >
            Add Client
          </Button>

          {/* Upload Certificate Action Button */}
          <Button
            variant="primary"
            size="md"
            icon={<Upload className="w-4 h-4 text-white" />}
            onClick={() => setShowUploadModal(true)}
            className="flex-1 sm:flex-none justify-center bg-[#0e2a47] font-semibold"
          >
            Upload
          </Button>

        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content Body */}
      <main className="flex-1 p-6 lg:p-8 space-y-6">
        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Clients"
            value={totalClients}
            subtitle="Across all accounts"
          />
          <StatCard
            title="Total Certificates"
            value={totalCertificates}
            subtitle="All documents"
          />
        </div>

        {/* Dashboard Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Recent Clients List (7 cols) */}
          <div className="lg:col-span-7">
            <RecentClientsList clients={recentClients} />
          </div>

          {/* Right Column: Recent Activity Feed (5 cols) */}
          <div className="lg:col-span-5">
            <RecentActivityFeed activities={recentActivities} />
          </div>
        </div>
      </main>

      {/* Add Client Modal */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Add New Client</h2>
            <p className="text-xs text-slate-500 mb-4">Create a client record to manage their certificates.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowAddClientModal(false);
                handleActionToast('New client created successfully!');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Mitchell"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0e2a47]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Business Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meridian Group LLC"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0e2a47]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  required
                  placeholder="email@company.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0e2a47]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddClientModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-[#0e2a47]">
                  Create Client
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Certificate Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Upload Certificate</h2>
            <p className="text-xs text-slate-500 mb-4">Upload a new ACORD or custom policy document for a client.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowUploadModal(false);
                handleActionToast('Certificate uploaded and associated with client.');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Client</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0e2a47]">
                  {/* Real clients drop down will be wired up later, just show a blank or placeholder for now */}
                  <option value="" disabled selected>Select a client...</option>
                  {recentClients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.contactName} ({c.businessName})
                    </option>
                  ))}
                </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">Certificate Type</label>
                  <input
                    type="text"
                    defaultValue="Certificate of Liability Insurance"
                    readOnly
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-500 font-medium cursor-not-allowed"
                  />
                </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">File Attachment (PDF)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:border-slate-400 transition-colors">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-600 font-medium">Click to select or drag PDF file</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Maximum file size 10MB</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-[#0e2a47]">
                  Upload & Issue
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
