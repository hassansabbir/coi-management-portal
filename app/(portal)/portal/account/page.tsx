'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Camera, Eye, EyeOff, Check } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { getCurrentUser, logout } from '@/lib/auth/mockAuth';

export default function ClientAccountPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('Jordan Miller');
  const [email, setEmail] = useState('jordan@riverside.com');
  const [businessName, setBusinessName] = useState('Riverside Contractors Inc.');
  const [toastMessage, setToastMessage] = useState('');

  // Password Modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  React.useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      if (user.name) setFullName(user.name);
      if (user.email) setEmail(user.email);
      if (user.businessName) setBusinessName(user.businessName);
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('Account profile updated successfully!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setToastMessage('Passwords do not match.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setToastMessage('Password updated successfully!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  return (
    <main className="flex-1 w-full px-6 lg:px-8 py-8 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl text-xs font-semibold animate-bounce flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb & Header Bar matching Screenshot 1 */}
      <div>
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
          <Link href="/portal" className="hover:text-slate-700 transition-colors">
            Portal
          </Link>
          <span>/</span>
          <span className="text-slate-600 font-semibold">Account</span>
        </nav>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
      </div>

      {/* Top Grid: Profile Card (Left) & Password Card (Right) matching Screenshot 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Profile Form Card (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-8 border-slate-200 space-y-6">
            {/* Header Avatar & Info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-[#0e2a47] text-white flex items-center justify-center text-xl font-bold shadow-md">
                  J
                </div>
                <button
                  type="button"
                  onClick={() => alert('Photo upload dialog')}
                  className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#0e2a47] text-white flex items-center justify-center border-2 border-white text-xs hover:bg-[#0a1e33] cursor-pointer"
                  title="Change avatar photo"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900 leading-tight">{fullName}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{businessName}</p>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Profile Form matching Screenshot 1 */}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Row 1: Full name */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1">
                <label className="text-xs font-medium text-slate-400">
                  Full name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="sm:w-72 px-3 py-2 text-right text-xs font-semibold text-slate-900 bg-transparent border border-transparent focus:border-slate-200 focus:bg-white rounded-lg focus:outline-none"
                />
              </div>

              {/* Row 2: Email */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1 border-t border-slate-50">
                <label className="text-xs font-medium text-slate-400">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="sm:w-72 px-3 py-2 text-right text-xs font-semibold text-slate-900 bg-transparent border border-transparent focus:border-slate-200 focus:bg-white rounded-lg focus:outline-none"
                />
              </div>

              {/* Save Button */}
              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="bg-[#0e2a47] hover:bg-[#0a1e33] text-white font-semibold text-xs py-2.5 px-6 rounded-xl"
                >
                  Save all changes
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column: Password Card (5 cols) matching Screenshot 1 */}
        <div className="lg:col-span-5">
          <Card className="p-6 sm:p-8 border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Password</h3>
                <p className="text-xs text-slate-400 mt-1">Last changed 90 days ago</p>
              </div>

              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline transition-colors cursor-pointer"
              >
                Change password
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Section: Sign Out Card matching Screenshot 1 */}
      <div className="pt-4 max-w-sm">
        <h3 className="text-sm font-bold text-slate-900">Sign Out</h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">You&apos;ll be returned to the login screen.</p>
        <button
          onClick={handleSignOut}
          className="px-5 py-2 text-xs font-semibold text-rose-600 border border-rose-300 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-md p-6 sm:p-8 animate-in fade-in zoom-in-95">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Change Password</h2>
            <p className="text-xs text-slate-500 mb-6">Enter your current password and set a new password.</p>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                    className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e2a47]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e2a47]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e2a47]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setShowPasswordModal(false)}
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
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
