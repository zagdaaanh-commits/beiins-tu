import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { useAppStore } from '../../context/AppStoreContext';

export function ToastContainer() {
  const { toasts, dismissToast } = useAppStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2rem)]">
      {toasts.map((toast) => {
        const Icon =
          toast.type === 'warning'
            ? AlertTriangle
            : toast.type === 'info'
              ? Info
              : CheckCircle2;
        const style =
          toast.type === 'warning'
            ? 'border-amber-300 bg-amber-50 text-amber-950'
            : toast.type === 'info'
              ? 'border-[#25533E]/30 bg-[#FDFBF7] text-[#1A1A1A]'
              : 'border-emerald-300 bg-emerald-50 text-emerald-950';
        const iconColor =
          toast.type === 'warning'
            ? 'text-amber-600'
            : toast.type === 'info'
              ? 'text-[#25533E]'
              : 'text-emerald-600';

        return (
          <div
            key={toast.id}
            className={`flex items-start gap-2.5 rounded-2xl border p-3.5 shadow-lg ${style}`}
          >
            <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${iconColor}`} />
            <p className="text-xs sm:text-sm font-medium leading-snug flex-1">
              {toast.message}
            </p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Хаах"
              className="rounded-lg p-1 opacity-60 hover:opacity-100 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
