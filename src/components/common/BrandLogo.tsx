import { Link } from 'react-router-dom';

interface BrandLogoProps {
  to?: string;
  variant?: 'light' | 'dark';
  subtitle?: string;
}

export function BrandLogo({
  to = '/',
  variant = 'light',
  subtitle = 'Хятад хэлний онлайн сургалт',
}: BrandLogoProps) {
  const isDark = variant === 'dark';

  return (
    <Link to={to} className="inline-flex items-center gap-2.5 group focus:outline-none">
      <span
        className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${
          isDark ? 'bg-white/10' : 'bg-[#FDE3C8]/75'
        }`}
      >
        <svg viewBox="0 0 36 36" className="h-7 w-7" aria-hidden="true">
          <g transform="translate(18,18)">
            {Array.from({ length: 12 }).map((_, i) => (
              <rect
                key={i}
                x="-1.35"
                y="-13.5"
                width="2.7"
                height="6.8"
                rx="1.35"
                fill={i % 2 === 0 ? '#EB5E43' : isDark ? '#FDE3C8' : '#25533E'}
                transform={`rotate(${i * 30})`}
              />
            ))}
            <circle cx="0" cy="0" r="3.4" fill="#EB5E43" />
          </g>
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-base sm:text-lg font-extrabold tracking-tight ${
            isDark ? 'text-white' : 'text-[#1A1A1A]'
          }`}
        >
          Beijing Institute
        </span>
        <span
          className={`mt-0.5 text-[10px] sm:text-[11px] font-medium ${
            isDark ? 'text-white/75' : 'text-[#5C5C5C]'
          }`}
        >
          {subtitle}
        </span>
      </span>
    </Link>
  );
}
