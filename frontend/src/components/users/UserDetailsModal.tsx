import type { User } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/date';

interface UserDetailsModalProps {
  user: User | null;
  onClose: () => void;
}

export function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  if (!user) return null;

  return (
    <Modal open={Boolean(user)} onClose={onClose} title="User Details" footer={<Button onClick={onClose}>Close</Button>}>
      <div className="flex items-center gap-3">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-xl font-semibold text-primary-800" aria-hidden="true">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <div>
          <p className="text-base font-semibold text-ink">{user.name}</p>
          <p className="text-sm text-muted">{user.email}</p>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-muted">Role</dt>
          <dd className="mt-1 capitalize text-ink">{user.role === 'superadmin' ? 'Super Admin' : user.role}</dd>
        </div>
        <div>
          <dt className="text-muted">Status</dt>
          <dd className="mt-1">
            <Badge tone={user.status === 'active' ? 'green' : user.status === 'pending' ? 'amber' : 'red'} dot>
              {user.status}
            </Badge>
          </dd>
        </div>
        <div>
          <dt className="text-muted">Registered</dt>
          <dd className="mt-1 text-ink">{formatDate(user.registeredAt)}</dd>
        </div>
        <div>
          <dt className="text-muted">Library Card ID</dt>
          <dd className="mt-1 text-ink">{user.id.toUpperCase()}</dd>
        </div>
      </dl>
    </Modal>
  );
}
