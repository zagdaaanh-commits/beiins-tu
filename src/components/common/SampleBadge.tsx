interface SampleBadgeProps {
  variant?: 'sample' | 'sample-data' | 'draft' | 'published' | 'free';
  label?: string;
  className?: string;
}

const STYLE_MAP: Record<NonNullable<SampleBadgeProps['variant']>, { bg: string; text: string }> = {
  sample: {
    bg: 'bg-[#FDE3C8] text-[#8F4A0E] border border-[#F3CAA0]',
    text: 'Жишээ',
  },
  'sample-data': {
    bg: 'bg-[#FDE3C8]/90 text-[#7A3E0A] border border-[#F0C295]',
    text: 'Жишээ өгөгдөл',
  },
  draft: {
    bg: 'bg-amber-100 text-amber-900 border border-amber-300',
    text: 'Ноорог',
  },
  published: {
    bg: 'bg-emerald-100 text-[#1B3F2F] border border-emerald-300',
    text: 'Нийтлэгдсэн',
  },
  free: {
    bg: 'bg-[#25533E]/10 text-[#25533E] border border-[#25533E]/25',
    text: 'Үнэгүй үзэх',
  },
};

export function SampleBadge({ variant = 'sample', label, className = '' }: SampleBadgeProps) {
  const cfg = STYLE_MAP[variant];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide whitespace-nowrap ${cfg.bg} ${className}`}
    >
      {label ?? cfg.text}
    </span>
  );
}
