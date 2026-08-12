import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Info } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

export function Register() {
  const { register, isLoading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '' });
  const [error, setError] = useState('');

  const update = (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await register(form);
      toast.success('Registration submitted! Your account is pending admin approval.');
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to register.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>
      <p className="mt-1 text-sm text-gray-500">Register for a Balingasag Public Library membership.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="First name" leftIcon={<User className="h-4 w-4" />} value={form.firstName} onChange={update('firstName')} required />
          <Input label="Last name" leftIcon={<User className="h-4 w-4" />} value={form.lastName} onChange={update('lastName')} required />
        </div>
        <Input type="email" label="Email address" leftIcon={<Mail className="h-4 w-4" />} value={form.email} onChange={update('email')} required />
        <Input type="tel" label="Phone number" leftIcon={<Phone className="h-4 w-4" />} value={form.phone} onChange={update('phone')} required />
        <Textarea label="Address" value={form.address} onChange={update('address')} rows={2} required />

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <div className="flex items-start gap-2 rounded-lg border border-primary-100 bg-primary-50/60 p-3 text-xs text-primary-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" aria-hidden="true" />
          <p>Your registration will be reviewed by library staff. Once approved, log in using the demo password "password".</p>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary-700 hover:text-primary-800">
          Log in
        </Link>
      </p>
    </div>
  );
}
