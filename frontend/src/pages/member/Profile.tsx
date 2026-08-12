import { Mail, Phone, MapPin, Pencil } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useDisclosure } from '@/hooks/useDisclosure';
import { Badge, Button, Card, CardHeader, CardTitle } from '@/components/ui';
import { LibraryCard } from '@/components/profile/LibraryCard';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import type { UserStatus } from '@/types';

const STATUS_VARIANT: Record<UserStatus, 'success' | 'warning' | 'danger' | 'neutral'> = {
  active: 'success',
  pending: 'warning',
  suspended: 'danger',
  inactive: 'neutral',
};

export function Profile() {
  const { currentUser } = useAuth();
  const editModal = useDisclosure();

  if (!currentUser) return null;

  const initials = `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <Button size="sm" variant="outline" leftIcon={<Pencil className="h-3.5 w-3.5" />} onClick={editModal.open}>
              Edit Profile
            </Button>
          </CardHeader>

          <div className="flex flex-col items-center gap-4 border-b border-gray-100 pb-6 text-center sm:flex-row sm:text-left">
            {currentUser.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt="" className="h-20 w-20 rounded-full object-cover" />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary-100 text-2xl font-semibold text-primary-700">
                {initials}
              </div>
            )}
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {currentUser.firstName} {currentUser.lastName}
              </p>
              <p className="text-sm text-gray-500">Library Card: {currentUser.libraryCardId}</p>
              <div className="mt-2">
                <Badge variant={STATUS_VARIANT[currentUser.status]} className="capitalize">
                  {currentUser.status}
                </Badge>
              </div>
            </div>
          </div>

          <dl className="mt-6 space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Email</dt>
                <dd className="text-sm font-medium text-gray-900">{currentUser.email}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Phone</dt>
                <dd className="text-sm font-medium text-gray-900">{currentUser.phone}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Address</dt>
                <dd className="text-sm font-medium text-gray-900">{currentUser.address}</dd>
              </div>
            </div>
          </dl>
        </Card>

        <div className="flex flex-col items-center gap-3 lg:items-stretch">
          <LibraryCard user={currentUser} />
        </div>
      </div>

      <EditProfileModal isOpen={editModal.isOpen} onClose={editModal.close} user={currentUser} />
    </div>
  );
}
