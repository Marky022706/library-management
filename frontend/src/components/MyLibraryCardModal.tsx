import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';
import { X, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MyLibraryCardModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const card = user?.library_card;

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-700/60 rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Card Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">Balingasag Public Library</h3>
            <p className="text-xs text-slate-400 font-medium">Digital Patron Identity Card</p>
          </div>
        </div>

        {/* The Card Body */}
        <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-inner">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Patron Name</span>
              <h2 className="text-xl font-extrabold text-white mt-0.5">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-xs text-indigo-400 font-mono mt-0.5">{user.school_id || `ID: BPL-${user.user_id}`}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
              user.role?.role_name === 'Super Admin' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
              user.role?.role_name === 'Admin' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
              user.role?.role_name === 'Librarian' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
              'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}>
              {user.role?.role_name || 'Member'}
            </span>
          </div>

          {/* QR Code Container */}
          <div className="my-5 flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow-lg border border-slate-200">
            {card ? (
              <>
                <QRCodeSVG
                  value={card.qr_code_value}
                  size={160}
                  level="H"
                  includeMargin={false}
                />
                <p className="text-[11px] font-mono text-slate-600 mt-2 font-bold tracking-wider">
                  {card.qr_code_value}
                </p>
              </>
            ) : (
              <div className="h-40 flex items-center justify-center text-slate-400 text-sm">
                No active card QR available
              </div>
            )}
          </div>

          {/* Card Footer Info */}
          <div className="flex justify-between items-center pt-2 border-t border-slate-700/60 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Status: <strong className="text-emerald-300">{card?.card_status || 'Active'}</strong></span>
            </div>
            <div>
              <span>Issued: <strong>{card?.issued_date || '2026-08-04'}</strong></span>
            </div>
          </div>
        </div>

        {/* Bottom Notice */}
        <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Scan at front desk for attendance, borrowing & circulation
        </p>
      </div>
    </div>
  );
};
