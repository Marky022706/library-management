import type { User } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/date';
import { CheckCircle2, FileText, QrCode, ShieldCheck, UserCheck } from 'lucide-react';

interface UserDetailsModalProps {
  user: User | null;
  onClose: () => void;
  onApprove?: (user: User) => void;
  onOpenCard?: (user: User) => void;
}

export function UserDetailsModal({ user, onClose, onApprove, onOpenCard }: UserDetailsModalProps) {
  if (!user) return null;

  return (
    <Modal
      open={Boolean(user)}
      onClose={onClose}
      title="Member Application & Details"
      footer={
        <div className="flex w-full items-center justify-between gap-3">
          <div>
            {user.status === 'pending' && onApprove && (
              <Button
                onClick={() => {
                  onApprove(user);
                  onClose();
                }}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                <ShieldCheck className="h-4 w-4" />
                Approve Account
              </Button>
            )}
            {user.status === 'active' && onOpenCard && (
              <Button
                onClick={() => {
                  onOpenCard(user);
                  onClose();
                }}
                className="gap-2 bg-indigo-600 hover:bg-indigo-700"
              >
                <QrCode className="h-4 w-4" />
                View Library Card
              </Button>
            )}
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Header Profile Summary */}
        <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 border border-line">
          <div className="flex items-center gap-3">
            {user.profilePhotoUrl ? (
              <img src={user.profilePhotoUrl} alt={user.name} className="h-12 w-12 rounded-full object-cover ring-2 ring-primary-200" />
            ) : (
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-800" aria-hidden="true">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
            <div>
              <p className="text-base font-bold text-ink">{user.name}</p>
              <p className="text-xs text-muted">{user.email}</p>
              {user.username && <p className="text-[11px] text-primary-700">@{user.username}</p>}
            </div>
          </div>

          <div className="text-right">
            <Badge tone={user.status === 'active' ? 'green' : user.status === 'pending' ? 'amber' : 'red'} dot>
              {user.status.toUpperCase()}
            </Badge>
            <p className="mt-1 text-[11px] text-muted">Applied: {formatDate(user.registeredAt)}</p>
          </div>
        </div>

        {/* Student Information Section */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
            <UserCheck className="h-3.5 w-3.5 text-primary-600" /> Student / Academic Info
          </h4>
          <div className="grid grid-cols-2 gap-3 rounded-xl border border-line p-3 text-xs bg-surface">
            <div>
              <span className="text-muted block">Student ID Number</span>
              <span className="font-semibold text-ink">{user.studentId || 'N/A'}</span>
            </div>
            <div>
              <span className="text-muted block">Year Level</span>
              <span className="font-semibold text-ink">{user.yearLevel || 'N/A'}</span>
            </div>
            <div className="col-span-2">
              <span className="text-muted block">Course / Program</span>
              <span className="font-semibold text-ink">{user.course || 'N/A'}</span>
            </div>
            <div className="col-span-2">
              <span className="text-muted block">School / Institution</span>
              <span className="font-semibold text-ink">{user.school || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Personal Details Section */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-primary-600" /> Personal Details
          </h4>
          <div className="grid grid-cols-2 gap-3 rounded-xl border border-line p-3 text-xs bg-surface">
            <div>
              <span className="text-muted block">Contact Number</span>
              <span className="font-semibold text-ink">{user.contactNumber || 'N/A'}</span>
            </div>
            <div>
              <span className="text-muted block">Gender</span>
              <span className="font-semibold text-ink">{user.gender || 'N/A'}</span>
            </div>
            <div>
              <span className="text-muted block">Date of Birth</span>
              <span className="font-semibold text-ink">{user.dateOfBirth ? formatDate(user.dateOfBirth) : 'N/A'}</span>
            </div>
            <div>
              <span className="text-muted block">Library Card ID</span>
              <span className="font-semibold text-primary-700">{user.libraryCardNumber || (user.id ? `LIB-${user.id.toUpperCase()}-2026` : 'Pending Approval')}</span>
            </div>
            <div className="col-span-2">
              <span className="text-muted block">Complete Address</span>
              <span className="font-medium text-ink">{user.address || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Documents & Agreements */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Verification & Agreements
          </h4>
          <div className="flex flex-col gap-2 rounded-xl border border-line p-3 text-xs bg-surface">
            <div className="flex items-center justify-between">
              <span className="text-muted">School ID Document Upload:</span>
              {user.schoolIdUrl ? (
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Uploaded & Verified
                </span>
              ) : (
                <span className="text-muted italic">Standard verification on file</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Terms & Conditions Agreement:</span>
              <span className="font-semibold text-ink">{user.termsAgreed !== false ? 'Confirmed' : 'Pending'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Accuracy Confirmation:</span>
              <span className="font-semibold text-ink">{user.infoAccurateConfirmed !== false ? 'Confirmed' : 'Pending'}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
