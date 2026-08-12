import { useId, useRef, type ChangeEvent } from 'react';
import { UploadCloud, FileCheck2, X } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface FileUploadProps {
  label?: string;
  hint?: string;
  accept?: string;
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  className?: string;
}

/**
 * Simulated file upload — the file never leaves the browser. It is kept as local
 * state so the UI can behave realistically before a real upload endpoint exists.
 */
export function FileUpload({ label, hint, accept, value, onChange, error, className }: FileUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.files?.[0] ?? null);
  };

  const clear = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {value ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-primary-200 bg-primary-50 px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2 text-sm text-primary-800">
            <FileCheck2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{value.name}</span>
          </div>
          <button type="button" onClick={clear} className="shrink-0 rounded p-1 text-primary-600 hover:bg-primary-100" aria-label="Remove file">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center transition-colors hover:border-primary-400 hover:bg-primary-50/40',
            error && 'border-red-300',
          )}
        >
          <UploadCloud className="h-6 w-6 text-gray-400" aria-hidden="true" />
          <span className="text-sm font-medium text-gray-600">Click to upload a file</span>
          {hint && <span className="text-xs text-gray-400">{hint}</span>}
          <input ref={inputRef} id={inputId} type="file" accept={accept} className="sr-only" onChange={handleChange} />
        </label>
      )}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
