import { useMemo } from 'react';
import type { User } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { generateQRCodeSVG } from '../../utils/qrcode';
import { Printer, QrCode, ShieldCheck, UserCheck } from 'lucide-react';

interface LibraryCardModalProps {
  user: User | null;
  onClose: () => void;
}

export function LibraryCardModal({ user, onClose }: LibraryCardModalProps) {
  const cardNumber = user?.libraryCardNumber || (user ? `LIB-${user.id.toUpperCase()}-2026` : '');
  const qrCodeSvg = useMemo(() => {
    if (!cardNumber) return '';
    return generateQRCodeSVG(cardNumber, 160, '#0f172a', '#ffffff');
  }, [cardNumber]);

  if (!user) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      open={Boolean(user)}
      onClose={onClose}
      title="Member Library Card"
      footer={
        <div className="flex w-full items-center justify-between">
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print Card
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-4">
        {/* Printable Library Card Container */}
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 text-white shadow-xl">
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-400/30">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wider text-indigo-300 uppercase">Library Management</p>
                <p className="text-[10px] text-slate-400">Official Membership Identity Pass</p>
              </div>
            </div>
            <Badge tone="green" dot className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ACTIVE
            </Badge>
          </div>

          {/* Card Main Content */}
          <div className="mt-5 grid grid-cols-[1fr_auto] gap-4 items-center">
            {/* Left side: Member Info */}
            <div className="space-y-2.5 min-w-0">
              <div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Member Name</span>
                <p className="truncate text-lg font-bold text-white leading-tight">{user.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Student ID</span>
                  <span className="font-semibold text-slate-200">{user.studentId || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Year Level</span>
                  <span className="font-semibold text-slate-200">{user.yearLevel || 'N/A'}</span>
                </div>
              </div>

              <div className="text-xs">
                <span className="text-[10px] text-slate-400 block">Course / Program</span>
                <p className="truncate font-semibold text-slate-200">{user.course || 'General Library Member'}</p>
              </div>

              <div className="text-xs">
                <span className="text-[10px] text-slate-400 block">Institution</span>
                <p className="truncate font-semibold text-slate-300">{user.school || 'Library Main Campus'}</p>
              </div>
            </div>

            {/* Right side: Profile Photo / Avatar */}
            <div className="flex flex-col items-center justify-center">
              {user.profilePhotoUrl ? (
                <img
                  src={user.profilePhotoUrl}
                  alt={user.name}
                  className="h-24 w-20 rounded-xl border-2 border-indigo-400/40 object-cover shadow-md"
                />
              ) : (
                <div className="flex h-24 w-20 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-600 bg-slate-800/80 text-slate-300">
                  <UserCheck className="h-8 w-8 text-indigo-400" />
                  <span className="mt-1 text-[9px] text-slate-400 font-medium">PHOTO</span>
                </div>
              )}
            </div>
          </div>

          {/* Card Footer with QR Code */}
          <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-950/70 p-3.5 border border-slate-800">
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Library Card ID</span>
              <p className="text-sm font-bold tracking-wider text-indigo-300">{cardNumber}</p>
              <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                <QrCode className="h-3 w-3 text-indigo-400" /> Scan for Library Attendance
              </p>
            </div>

            {/* QR Code Container */}
            <div
              className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-white p-1.5 shadow-inner"
              dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
