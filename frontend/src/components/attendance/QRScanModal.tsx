import { useEffect, useState } from 'react';
import { ScanLine } from 'lucide-react';
import type { User } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Field, inputClasses } from '../common/Field';

interface QRScanModalProps {
  open: boolean;
  onClose: () => void;
  members: User[];
  insideMemberIds: Set<string>;
  onCheckIn: (memberId: string) => void;
  onCheckOut: (memberId: string) => void;
}

export function QRScanModal({ open, onClose, members, insideMemberIds, onCheckIn, onCheckOut }: QRScanModalProps) {
  const [selectedId, setSelectedId] = useState(members[0]?.id ?? '');

  useEffect(() => {
    if (open) setSelectedId(members[0]?.id ?? '');
  }, [open, members]);

  const isInside = insideMemberIds.has(selectedId);

  const handleScan = () => {
    if (!selectedId) return;
    if (isInside) onCheckOut(selectedId);
    else onCheckIn(selectedId);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Simulate QR Scan"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleScan} disabled={!selectedId}>
            {isInside ? 'Scan to Check Out' : 'Scan to Check In'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
          <ScanLine className="h-8 w-8" aria-hidden="true" />
        </span>
        <p className="text-sm text-muted">Pick a member to simulate scanning their library card QR code.</p>

        <div className="w-full text-left">
          <Field label="Member" htmlFor="qr-member">
            <select id="qr-member" className={inputClasses} value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <p className="text-xs text-muted">
          {selectedId ? (isInside ? 'This member is currently inside — scanning will check them out.' : 'This member is not inside — scanning will check them in.') : 'No active members available.'}
        </p>
      </div>
    </Modal>
  );
}
