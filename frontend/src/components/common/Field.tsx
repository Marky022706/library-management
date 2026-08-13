import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
}

/** Labeled form-field wrapper with a consistent inline validation-error slot. */
export function Field({ label, htmlFor, error, children, required }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClasses =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100';
