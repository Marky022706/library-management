import { CheckCircle2, Info, XCircle } from 'lucide-react';
import { useToast, type ToastVariant } from '../../context/ToastContext';
import { cn } from '../../utils/cn';

const ICONS: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const BORDER_CLASSES: Record<ToastVariant, string> = {
  success: 'border-l-primary-600',
  error: 'border-l-red-600',
  info: 'border-l-blue-600',
};

const ICON_CLASSES: Record<ToastVariant, string> = {
  success: 'text-primary-600',
  error: 'text-red-600',
  info: 'text-blue-600',
};

export function ToastViewport() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2" role="status" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.variant];
        return (
          <div
            key={toast.id}
            className={cn(
              'flex items-start gap-3 rounded-xl border-l-4 bg-white p-4 shadow-lg',
              BORDER_CLASSES[toast.variant],
            )}
          >
            <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', ICON_CLASSES[toast.variant])} aria-hidden="true" />
            <p className="flex-1 text-sm text-ink">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-muted hover:text-ink"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
