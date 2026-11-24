import {
  Award,
  BookOpen,
  Compass,
  CreditCard,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAppStore } from '../../context/AppStoreContext';
import { BrandLogo } from '../common/BrandLogo';

const PRIMARY_NAV = [
  { to: '/home', label: 'Нүүр', end: true },
  { to: '/chinese', label: 'Хятад хэл' },
  { to: '/lessons', label: 'Хичээл' },
  { to: '/hsk', label: 'HSK 3.0' },
  { to: '/contact', label: 'Холбоо барих' },
];

export function UserLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userProgress, lessons } = useAppStore();

  const publishedCount = lessons.filter((l) => l.status === 'published').length;
  const completedCount = userProgress.completedLessonIds.filter((id) =>
    lessons.some((l) => l.id === id && l.status === 'published')
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1A1A1A]">
      {/* Slim Top Prototype Banner */}
      <div className="bg-[#25533E] text-white border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-1.5 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-[#EB5E43] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Прототип
            </span>
            <span className="truncate text-white/90">
              <strong className="font-semibold text-[#FDE3C8]">Жишээ өгөгдөл</strong>
            </span>
          </div>
          <Link
            to="/admin"
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-[#FDE3C8] transition hover:bg-white/25"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span className="sm:hidden">Админ →</span>
            <span className="hidden sm:inline">Админы хэсэг →</span>
          </Link>
        </div>
      </div>

      {/* Minimal Header (Single "Эрх авах" CTA) */}
      <header className="sticky top-0 z-40 border-b border-[#EFE5D8] bg-[#FDFBF7]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <BrandLogo to="/home" />

          {/* Desktop 5-item nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Үндсэн цэс">
            {PRIMARY_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition ${
                    isActive
                      ? 'bg-[#FDE3C8]/85 text-[#1A1A1A]'
                      : 'text-[#5C5C5C] hover:bg-[#FAF4EA] hover:text-[#1A1A1A]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions: My Progress + Single Pricing CTA + Back to Login */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink
              to="/my-learning"
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                  isActive
                    ? 'border-[#EB5E43] bg-[#EB5E43]/10 text-[#EB5E43]'
                    : 'border-[#E5DDD0] bg-white text-[#1A1A1A] hover:border-[#25533E]'
                }`
              }
            >
              <GraduationCap className="h-4 w-4 text-[#EB5E43]" />
              <span>Явц</span>
              <span className="tabular-nums rounded-full bg-[#FDE3C8] px-1.5 py-0.5 text-[11px] font-extrabold text-[#1A1A1A]">
                {completedCount}/{publishedCount}
              </span>
            </NavLink>

            <Link
              to="/pricing"
              className="inline-flex items-center rounded-xl bg-[#25533E] px-4 py-2.5 text-sm font-bold text-white whitespace-nowrap shadow-sm transition hover:bg-[#1B3F2F]"
            >
              Эрх авах
            </Link>

            <Link
              to="/"
              title="Нэвтрэх хуудас руу буцах"
              aria-label="Нэвтрэх хуудас руу буцах"
              className="inline-flex items-center justify-center rounded-xl border border-[#E5DDD0] bg-white p-2.5 text-[#5C5C5C] hover:border-[#EB5E43] hover:text-[#EB5E43] transition"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Цэс нээх"
            className="inline-flex lg:hidden items-center justify-center rounded-xl border border-[#E5DDD0] bg-white p-2 text-[#1A1A1A] hover:bg-[#FAF4EA] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EFE5D8] bg-[#FDFBF7] px-4 py-4 shadow-lg">
            <nav className="grid grid-cols-2 gap-2">
              {PRIMARY_NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-2xl px-3.5 py-2.5 text-sm font-bold transition ${
                      isActive
                        ? 'bg-[#EB5E43] text-white'
                        : 'bg-[#FAF4EA] text-[#1A1A1A] hover:bg-[#FDE3C8]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <NavLink
                to="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-3.5 py-2.5 text-sm font-bold transition ${
                    isActive
                      ? 'bg-[#25533E] text-white'
                      : 'bg-[#25533E]/10 text-[#25533E]'
                  }`
                }
              >
                Эрх авах
              </NavLink>
              <NavLink
                to="/my-learning"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-3.5 py-2.5 text-sm font-bold tabular-nums transition ${
                    isActive
                      ? 'bg-[#25533E] text-white'
                      : 'bg-[#FDE3C8]/70 text-[#1A1A1A]'
                  }`
                }
              >
                Миний явц ({completedCount}/{publishedCount})
              </NavLink>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-2xl border border-[#E5DDD0] bg-white px-3.5 py-2.5 text-sm font-bold text-[#5C5C5C]"
              >
                Нэвтрэх дэлгэц
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="col-span-2 rounded-2xl border border-[#25533E]/30 bg-white px-3.5 py-2.5 text-sm font-bold text-[#25533E]"
              >
                Админы хэсэг →
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Minimal Footer */}
      <footer className="bg-[#25533E] text-white pt-10 pb-24 md:pb-10 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4 space-y-3">
              <BrandLogo to="/home" variant="dark" subtitle="Хятад хэлний онлайн сургалт" />
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-xs">
                Ханз, пиньинь болон монгол тайлбартай цэгцтэй сургалт.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
              <div>
                <h4 className="font-display font-bold text-[#FDE3C8] mb-2.5">Сургалт</h4>
                <ul className="space-y-2 text-white/80 text-xs">
                  <li><Link to="/chinese" className="hover:text-white">Анхан шат</Link></li>
                  <li><Link to="/chinese" className="hover:text-white">Дунд шат</Link></li>
                  <li><Link to="/chinese" className="hover:text-white">Ахисан шат</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-display font-bold text-[#FDE3C8] mb-2.5">Хичээл</h4>
                <ul className="space-y-2 text-white/80 text-xs">
                  <li><Link to="/lessons" className="hover:text-white">Хичээлийн сан</Link></li>
                  <li><Link to="/my-learning" className="hover:text-white">Миний явц</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-display font-bold text-[#FDE3C8] mb-2.5">HSK 3.0 &amp; Эрх</h4>
                <ul className="space-y-2 text-white/80 text-xs">
                  <li><Link to="/hsk" className="hover:text-white">HSK 3.0 түвшин</Link></li>
                  <li><Link to="/pricing" className="hover:text-white">Сарын · ₮100,000</Link></li>
                  <li><Link to="/pricing" className="hover:text-white">Жилийн · ₮1,000,000</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-display font-bold text-[#FDE3C8] mb-2.5">Бусад</h4>
                <ul className="space-y-2 text-white/80 text-xs">
                  <li><Link to="/contact" className="hover:text-white">Холбоо барих</Link></li>
                  <li><Link to="/" className="hover:text-white">Нэвтрэх хуудас</Link></li>
                  <li><Link to="/admin" className="text-[#FDE3C8] font-bold hover:underline">Админы хэсэг</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/15 pt-5 text-xs text-white/70">
            <p>© 2026 Beijing Institute (UI Прототип · Жишээ).</p>
            <p>Бодит төлбөр болон нэвтрэлт холбогдоогүй.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Navigation */}
      <nav
        aria-label="Гар утасны доод цэс"
        className="fixed bottom-0 inset-x-0 z-40 grid grid-cols-5 border-t border-[#E6DCD0] bg-[#FDFBF7]/95 backdrop-blur-md md:hidden"
      >
        {[
          { to: '/home', label: 'Нүүр', icon: Home, end: true },
          { to: '/lessons', label: 'Хичээл', icon: BookOpen },
          { to: '/hsk', label: 'HSK 3.0', icon: Award },
          { to: '/my-learning', label: 'Явц', icon: Compass },
          { to: '/pricing', label: 'Эрх', icon: CreditCard },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-bold transition ${
                  isActive ? 'text-[#EB5E43]' : 'text-[#5C5C5C]'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
