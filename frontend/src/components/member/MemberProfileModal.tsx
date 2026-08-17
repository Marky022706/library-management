import { useState } from 'react';
import { UserCheck, Key, QrCode, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Field } from '../common/Field';
import type { User } from '../../types';

interface MemberProfileModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onOpenCard: () => void;
  onSaveProfile?: (updated: Partial<User>) => void;
}

export function MemberProfileModal({
  isOpen,
  user,
  onClose,
  onOpenCard,
  onSaveProfile,
}: MemberProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [contactNumber, setContactNumber] = useState(user?.contactNumber || '09123456789');
  const [address, setAddress] = useState(user?.address || 'Balingasag, Misamis Oriental');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSaveProfile) {
      onSaveProfile({
        contactNumber,
        address,
      });
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const cardNumber = user.libraryCardNumber || `LIB-${user.id.toUpperCase()}-2026`;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Member Account & Profile"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" onClick={onClose} className="text-xs">
            Close
          </Button>
          <Button
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
          >
            Save Changes
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 text-xs">
        {/* Navigation tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold text-xs transition-colors ${
              activeTab === 'profile'
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            Personal & Account Details
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold text-xs transition-colors ${
              activeTab === 'security'
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Key className="h-4 w-4" />
            Security & Password
          </button>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-emerald-900 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Profile information updated successfully!</span>
          </div>
        )}

        {activeTab === 'profile' ? (
          <form onSubmit={handleSave} className="flex flex-col gap-3">
            {/* Account Summary Banner */}
            <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200/80 p-3">
              <div>
                <p className="font-bold text-slate-900">{user.name}</p>
                <p className="text-emerald-700 font-semibold">{cardNumber}</p>
                <p className="text-[11px] text-slate-500">Registered: {user.registeredAt || 'Aug 14, 2026'}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <Badge tone="green" dot>
                  ACTIVE MEMBER
                </Badge>
                <button
                  type="button"
                  onClick={onOpenCard}
                  className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 hover:underline"
                >
                  <QrCode className="h-3.5 w-3.5" />
                  View Digital Pass
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Full Name" htmlFor="prof-name">
                <input
                  id="prof-name"
                  type="text"
                  disabled
                  value={user.name}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100/70 p-2.5 text-xs text-slate-600 cursor-not-allowed"
                />
              </Field>

              <Field label="Email Address" htmlFor="prof-email">
                <input
                  id="prof-email"
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100/70 p-2.5 text-xs text-slate-600 cursor-not-allowed"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Student / Member ID" htmlFor="prof-id">
                <input
                  id="prof-id"
                  type="text"
                  disabled
                  value={user.studentId || cardNumber}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100/70 p-2.5 text-xs text-slate-600 cursor-not-allowed"
                />
              </Field>

              <Field label="Contact Phone Number" htmlFor="prof-phone">
                <input
                  id="prof-phone"
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                />
              </Field>
            </div>

            <Field label="Home / Campus Address" htmlFor="prof-address">
              <input
                id="prof-address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </Field>
          </form>
        ) : (
          <div className="flex flex-col gap-3">
            <Field label="Current Password" htmlFor="sec-current">
              <input
                id="sec-current"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </Field>

            <Field label="New Password" htmlFor="sec-new">
              <input
                id="sec-new"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </Field>

            <Field label="Confirm New Password" htmlFor="sec-confirm">
              <input
                id="sec-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </Field>
          </div>
        )}
      </div>
    </Modal>
  );
}
