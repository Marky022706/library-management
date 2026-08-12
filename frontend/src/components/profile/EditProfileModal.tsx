import { useState, type FormEvent } from 'react';
import type { User } from '@/types';
import { Modal, Button, Input } from '@/components/ui';
import { useLibrary } from '@/hooks/useLibrary';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

export interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

interface FormState {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
}

export function EditProfileModal({ isOpen, onClose, user }: EditProfileModalProps) {
  const { updateProfile } = useLibrary();
  const { updateCurrentUser } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState<FormState>({
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    address: user.address,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (isSubmitting) return;
    setForm({ firstName: user.firstName, lastName: user.lastName, phone: user.phone, address: user.address });
    setErrors({});
    onClose();
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.firstName.trim()) nextErrors.firstName = 'First name is required.';
    if (!form.lastName.trim()) nextErrors.lastName = 'Last name is required.';
    if (!form.phone.trim()) nextErrors.phone = 'Phone number is required.';
    if (!form.address.trim()) nextErrors.address = 'Address is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const patch = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      };
      await updateProfile(user.id, patch);
      updateCurrentUser(patch);
      toast.success('Profile updated.');
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Profile"
      description="Update your personal information."
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form="edit-profile-form" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </>
      }
    >
      <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="First Name"
            required
            value={form.firstName}
            onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
            error={errors.firstName}
          />
          <Input
            label="Last Name"
            required
            value={form.lastName}
            onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
            error={errors.lastName}
          />
        </div>
        <Input label="Email" value={user.email} disabled hint="Email cannot be changed." />
        <Input
          label="Phone"
          required
          value={form.phone}
          onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
          error={errors.phone}
        />
        <Input
          label="Address"
          required
          value={form.address}
          onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
          error={errors.address}
        />
      </form>
    </Modal>
  );
}
