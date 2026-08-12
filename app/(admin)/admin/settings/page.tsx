'use client';

import React, { useState } from 'react';
import { User, Lock, Plus, Eye, EyeOff, Edit2, Trash2, ChevronDown, ChevronUp, Camera, Check } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export default function AdminSettingsPage() {
  // Profile State
  const [fullName, setFullName] = useState('Admin User');
  const [emailAddress, setEmailAddress] = useState('admin@coiplatform.com');
  const [profileToast, setProfileToast] = useState('');

  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [securityToast, setSecurityToast] = useState('');

  // Help & Support FAQ State
  const [faqs, setFaqs] = useState<FaqItem[]>([
    {
      id: '1',
      question: 'How do I update my certificate?',
      answer:
        'Navigate to your certificate from the portal home, then click "Edit Certificate." You can update the Certificate Holder, certificate date, and Additional Insured designation. After making your changes, click "Review Certificate" and confirm to generate the updated document.',
    },
    {
      id: '2',
      question: 'What does Additional Insured mean?',
      answer:
        'An Additional Insured designation extends policy coverage protection to a third party (such as a property owner or general contractor) for claims arising out of your operations or work.',
    },
    {
      id: '3',
      question: 'Which fields can I edit?',
      answer:
        'As a client user, you can edit the Certificate Holder organization name and address, the Certificate Date, and the Additional Insured designation toggle.',
    },
    {
      id: '4',
      question: 'What if I make a mistake?',
      answer:
        'You can edit your certificate details at any time from your portal or contact your insurance agent directly at The Ewing Agency Inc.',
    },
  ]);

  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('1');
  const [showAddFaqModal, setShowAddFaqModal] = useState(false);
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');

  // Handlers
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileToast('Profile changes saved successfully!');
    setTimeout(() => setProfileToast(''), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setSecurityToast('New passwords do not match!');
      setTimeout(() => setSecurityToast(''), 3000);
      return;
    }
    setSecurityToast('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSecurityToast(''), 3000);
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQuestion || !newFaqAnswer) return;

    const createdFaq: FaqItem = {
      id: `faq-${Date.now()}`,
      question: newFaqQuestion,
      answer: newFaqAnswer,
    };

    setFaqs([...faqs, createdFaq]);
    setShowAddFaqModal(false);
    setNewFaqQuestion('');
    setNewFaqAnswer('');
    setExpandedFaqId(createdFaq.id);
  };

  const handleDeleteFaq = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFaqs(faqs.filter((f) => f.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Header Bar matching Design Screenshot */}
      <header className="bg-white border-b border-slate-200/80 px-6 lg:px-8 py-4">
        <span className="text-xs text-slate-400 font-semibold block mb-0.5">Settings</span>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 p-6 lg:p-8 space-y-6 w-full">
        {/* Top Grid: Profile Card (Left) & Security Card (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Profile Card matching Design Screenshot */}
          <Card className="p-6 sm:p-8 border-slate-200 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Profile</h2>
            </div>

            {/* Profile Avatar Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-[#0e2a47] text-white flex items-center justify-center text-lg font-bold shadow-md">
                  AU
                </div>
                <button
                  type="button"
                  onClick={() => alert('Photo upload dialog')}
                  className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center border-2 border-white text-xs hover:bg-slate-900 cursor-pointer"
                  title="Change avatar photo"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">Admin User</h3>
                <p className="text-xs text-slate-500 mt-0.5">admin@coiplatform.com</p>
                <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block">Administrator</span>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {profileToast && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{profileToast}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e2a47]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e2a47]"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="bg-[#0e2a47] hover:bg-[#0a1e33] text-white font-semibold text-xs py-2.5 px-5 rounded-lg"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Security Card matching Design Screenshot */}
          <Card className="p-6 sm:p-8 border-slate-200 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Security</h2>
            </div>

            {/* Security Form */}
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {securityToast && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{securityToast}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e2a47]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e2a47]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e2a47]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="bg-[#0e2a47] hover:bg-[#0a1e33] text-white font-semibold text-xs py-2.5 px-5 rounded-lg"
                >
                  Update Password
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Bottom Full-Width Card: Help & Support matching Design Screenshots */}
        <Card className="p-6 sm:p-8 border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Help & Support</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Get answers to common questions or contact our support team.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              icon={<Plus className="w-4 h-4 text-white" />}
              className="bg-[#0e2a47] hover:bg-[#0a1e33] text-white font-semibold text-xs px-4 py-2.5 rounded-lg self-start sm:self-auto"
              onClick={() => setShowAddFaqModal(true)}
            >
              Add FAQ
            </Button>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Frequently Asked Questions
            </h3>

            {/* Accordion Items List matching Design Screenshot 1 */}
            <div className="space-y-3">
              {faqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="border border-slate-200/90 rounded-2xl bg-white overflow-hidden transition-all shadow-xs"
                  >
                    <div
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                    >
                      <span className="font-bold text-sm text-slate-900">{faq.question}</span>

                      {/* Right Control Icons: Edit, Delete, Chevron */}
                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Edit FAQ: "${faq.question}"`);
                          }}
                          className="text-teal-600 hover:text-teal-800 transition-colors p-1"
                          title="Edit FAQ"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteFaq(faq.id, e)}
                          className="text-rose-500 hover:text-rose-700 transition-colors p-1"
                          title="Delete FAQ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="text-slate-400 pl-1">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </main>

      {/* Add FAQ Modal matching Design Screenshot 2 */}
      {showAddFaqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-lg p-6 sm:p-8 animate-in fade-in zoom-in-95">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500 mb-6">Create a frequently asked question to help users.</p>

            <form onSubmit={handleAddFaq} className="space-y-4">
              {/* Field 1: FAQ Question */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  FAQ
                </label>
                <input
                  type="text"
                  value={newFaqQuestion}
                  onChange={(e) => setNewFaqQuestion(e.target.value)}
                  placeholder="Enter the question here.."
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e2a47]"
                />
              </div>

              {/* Field 2: Answer Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Answer
                </label>
                <textarea
                  rows={4}
                  value={newFaqAnswer}
                  onChange={(e) => setNewFaqAnswer(e.target.value)}
                  placeholder="Provide a detailed answer.."
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e2a47]"
                />
              </div>

              {/* Buttons matching Design Screenshot 2 */}
              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setShowAddFaqModal(false)}
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
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
