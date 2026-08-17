import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Field } from '../common/Field';
import { useLibraryData } from '../../context/LibraryDataContext';
import { useToast } from '../../context/ToastContext';
import { userService } from '../../services/userService';
import type { UserRole } from '../../types';

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onUserAdded?: () => void;
}

export function AddUserModal({ open, onClose, onUserAdded }: AddUserModalProps) {
  const { refreshUsers } = useLibraryData();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('member');
  const [studentId, setStudentId] = useState('');
  const [school, setSchool] = useState('');
  const [course, setCourse] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Name and email are required.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await userService.createUser({
        name: name.trim(),
        email: email.trim(),
        password: password.trim() || 'library123',
        role,
        status: 'active',
        student_id: studentId.trim() || undefined,
        school: school.trim() || undefined,
        course: course.trim() || undefined,
        year_level: yearLevel.trim() || undefined,
        phone: phone.trim() || undefined,
      });

      if (res.success) {
        showToast(`User ${name} added successfully!`, 'success');
        refreshUsers();
        onUserAdded?.();
        onClose();
        // Reset form
        setName('');
        setEmail('');
        setPassword('');
        setStudentId('');
        setSchool('');
        setCourse('');
        setPhone('');
      } else {
        showToast(res.message || 'Failed to create user.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Network error occurred.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add New User">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full Name" htmlFor="new-user-name">
            <input
              id="new-user-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Smith"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </Field>

          <Field label="Email Address" htmlFor="new-user-email">
            <input
              id="new-user-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john.smith@gmail.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Initial Password" htmlFor="new-user-pass">
            <input
              id="new-user-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Default: library123"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </Field>

          <Field label="System Role" htmlFor="new-user-role">
            <select
              id="new-user-role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
            >
              <option value="member">Member / Student</option>
              <option value="admin">Administrator</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </Field>
        </div>

        {role === 'member' && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Student / Library ID" htmlFor="new-user-studentid">
                <input
                  id="new-user-studentid"
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. 2024-00123"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </Field>

              <Field label="Phone / Mobile" htmlFor="new-user-phone">
                <input
                  id="new-user-phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 09171234567"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="School / Institution" htmlFor="new-user-school">
                <input
                  id="new-user-school"
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="e.g. Balingasag Institute"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </Field>

              <Field label="Course / Program" htmlFor="new-user-course">
                <input
                  id="new-user-course"
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g. BS Information Technology"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </Field>

              <Field label="Year Level" htmlFor="new-user-year">
                <input
                  id="new-user-year"
                  type="text"
                  value={yearLevel}
                  onChange={(e) => setYearLevel(e.target.value)}
                  placeholder="e.g. 3rd Year"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </Field>
            </div>
          </>
        )}

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : '+ Create User'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
