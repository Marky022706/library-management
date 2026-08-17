import { useMemo } from 'react';
import { QrCode, ShieldCheck, Printer, ArrowRight } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { generateQRCodeSVG } from '../../utils/qrcode';
import type { User } from '../../types';

interface MemberLibraryCardWidgetProps {
  user: User | null;
  onOpenCard: () => void;
}

export function MemberLibraryCardWidget({ user, onOpenCard }: MemberLibraryCardWidgetProps) {
  const uid = user?.id || user?.user_id || 'U';
  const cardNumber = user?.libraryCardNumber || `LIB-${uid.toUpperCase()}-2026`;
  const qrSvg = useMemo(() => {
    return generateQRCodeSVG(cardNumber, 96, '#0f172a', '#ffffff');
  }, [cardNumber]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 p-5 text-white shadow-md">
      {/* Card Top */}
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-wider text-emerald-300 uppercase">Balingasag Library</p>
            <p className="text-[9px] text-slate-400">Digital Membership Pass</p>
          </div>
        </div>
        <Badge tone="green" dot className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">
          ACTIVE
        </Badge>
      </div>

      {/* Card Body with QR */}
      <div className="flex items-center justify-between gap-4 py-1">
        <div className="min-w-0">
          <p className="text-sm font-bold text-white truncate">{user?.name || 'Member'}</p>
          <p className="text-[11px] text-emerald-300 tracking-wider mt-0.5">{cardNumber}</p>
          <p className="text-[10px] text-slate-400 mt-1 truncate">
            {user?.course || 'BS Computer Science'} {user?.yearLevel && `· ${user.yearLevel}`}
          </p>
        </div>

        {/* QR Code thumbnail */}
        <div
          onClick={onOpenCard}
          className="flex h-18 w-18 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-white p-1 shadow-sm hover:scale-105 transition-transform"
          title="Click to expand QR Code"
        >
          {qrSvg ? (
            <div dangerouslySetInnerHTML={{ __html: qrSvg }} className="h-full w-full flex items-center justify-center" />
          ) : (
            <QrCode className="h-10 w-10 text-slate-900" />
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="flex items-center gap-2 border-t border-slate-700/60 pt-3">
        <Button
          size="sm"
          onClick={onOpenCard}
          className="flex-1 h-7.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5"
        >
          <span>View Full Card</span>
          <ArrowRight className="h-3 w-3" />
        </Button>
        <button
          onClick={handlePrint}
          className="flex h-7.5 items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-2.5 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          title="Print library card"
        >
          <Printer className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Print</span>
        </button>
      </div>
    </div>
  );
}
