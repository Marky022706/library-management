import { useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useLibrary } from '@/hooks/useLibrary';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/utils/cn';
import type { LibrarySettings } from '@/types';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function Settings() {
  const { settings, updateSettings } = useLibrary();
  const { currentUser } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState<LibrarySettings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(settings), [form, settings]);

  const toggleDay = (day: string) => {
    setForm((prev) => {
      const daysOpen = prev.operatingHours.daysOpen.includes(day)
        ? prev.operatingHours.daysOpen.filter((d) => d !== day)
        : [...prev.operatingHours.daysOpen, day];
      return { ...prev, operatingHours: { ...prev.operatingHours, daysOpen } };
    });
  };

  const handleSave = async () => {
    if (!currentUser) {
      toast.error('You must be signed in to update settings.');
      return;
    }
    setIsSaving(true);
    try {
      updateSettings(form, currentUser.id);
      toast.success('Settings updated successfully.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Library Configuration</CardTitle>
        </CardHeader>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              type="number"
              min={1}
              label="Maximum Books per Member"
              value={form.maxBooksPerMember}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, maxBooksPerMember: Number(e.target.value) }))
              }
            />
            <Input
              type="number"
              min={1}
              label="Loan Duration (days)"
              value={form.loanDurationDays}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, loanDurationDays: Number(e.target.value) }))
              }
            />
            <Input
              type="number"
              min={1}
              label="Reservation Duration (days)"
              value={form.reservationDurationDays}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, reservationDurationDays: Number(e.target.value) }))
              }
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Operating Hours</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                type="time"
                label="Opening Time"
                value={form.operatingHours.open}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    operatingHours: { ...prev.operatingHours, open: e.target.value },
                  }))
                }
              />
              <Input
                type="time"
                label="Closing Time"
                value={form.operatingHours.close}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    operatingHours: { ...prev.operatingHours, close: e.target.value },
                  }))
                }
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Days Open</p>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => {
                const active = form.operatingHours.daysOpen.includes(day);
                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() => toggleDay(day)}
                    aria-pressed={active}
                    className={cn(
                      'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                      active
                        ? 'border-primary-600 bg-primary-600 text-white'
                        : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50',
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end border-t border-gray-200 pt-4">
            <Button onClick={handleSave} isLoading={isSaving} disabled={!isDirty}>
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
