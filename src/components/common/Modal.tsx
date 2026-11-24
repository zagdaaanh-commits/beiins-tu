import { X } from 'lucide-react';
import React, { useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  maxWidthClass?: string;
  children: React.ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  maxWidthClass = 'max-w-lg',
  children,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/55 p-4 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`relative max-h-[90vh] w-full ${maxWidthClass} overflow-y-auto rounded-3xl border border-[#EAE0D2] bg-[#FDFBF7] p-5 sm:p-6 shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#EAE0D2] pb-3.5">
          <h3 className="font-display text-lg sm:text-xl font-extrabold text-[#1A1A1A]">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Хаах"
            className="rounded-full p-1.5 text-[#5C5C5C] hover:bg-[#FAF4EA] hover:text-[#1A1A1A] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="pt-4">{children}</div>
      </div>
    </div>
  );
}
