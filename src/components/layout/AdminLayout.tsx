import {
  ArrowLeft,
  BookOpen,
  FileText,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Plus,
  RotateCcw,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAppStore } from '../../context/AppStoreContext';
import { BrandLogo } from '../common/BrandLogo';
import { SampleBadge } from '../common/SampleBadge';

const ADMIN_NAV = [
  { to: '/admin', label: 'Хянах самбар', icon: LayoutDashboard, end: true },
  { to: '/admin/courses', label: 'Курсууд', icon: FolderKanban },
  { to: '/admin/lessons', label: 'Хичээлүүд', icon: BookOpen },
  { to: '/admin/teachers', label: 'Багш нар', icon: GraduationCap },
  { to: '/admin/memberships', label: 'Хэрэглэгчийн эрх', icon: Users },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { resetDemoData, lessons } = useAppStore();

  const draftCount = lessons.filter((l) => l.status === 'draft').length;

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-[#25533E] text-white p-5">
      <div>
        <div className="pb-5 border-b border-white/15">
          <BrandLogo to="/admin" variant="dark" subtitle="Админ удирдлага (Прототип)" />
        </div>

        <div className="mt-4">
          <Link
            to="/admin/lessons/new"
            onClick={() => setSidebarOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#EB5E43] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#D44B31]"
          >
            <Plus className="h-4 w-4" />
            <span>Шинэ хичээл нэмэх</span>
          </Link>
        </div>

        <nav className="mt-6 space-y-1.5" aria-label="Админ цэс">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-white text-[#1A1A1A] shadow-sm'
                      : 'text-white/85 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </span>
                {item.to === '/admin/lessons' && draftCount > 0 && (
                  <span className="rounded-full bg-[#FDE3C8] px-2 py-0.5 text-[10px] font-extrabold text-[#1A1A1A]">
                    {draftCount} ноорог
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="space-y-2.5 border-t border-white/15 pt-4">
        <div className="rounded-2xl bg-white/10 p-3 text-xs text-white/85 leading-relaxed">
          <p className="font-bold text-[#FDE3C8] flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            Амьд прототип горим
          </p>
          <p className="mt-1">
            Энд үүсгэж <strong className="text-white">Нийтлэх</strong> дарсан хичээл хэрэглэгчийн хэсэгт шууд харагдана.
          </p>
        </div>

        <button
          type="button"
          onClick={resetDemoData}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Жишээ өгөгдөл сэргээх</span>
        </button>

        <Link
          to="/home"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FDE3C8] px-3 py-2.5 text-xs font-extrabold text-[#1A1A1A] transition hover:bg-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Хэрэглэгчийн сайт харах</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-68 shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden bg-black/45 backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="w-72 h-full relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Хаах"
              className="absolute right-3 top-3 z-10 rounded-full bg-white/15 p-1.5 text-white"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-[#EAE0D2] bg-[#FDFBF7]/95 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Админ цэс нээх"
              className="lg:hidden rounded-xl border border-[#E5DDD0] bg-white p-2 text-[#1A1A1A] cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="font-display text-sm sm:text-base font-extrabold text-[#1A1A1A]">
              Beijing Institute · Админы удирдлагын хэсэг
            </span>
            <SampleBadge variant="sample-data" className="hidden sm:inline-flex" />
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/lessons"
              className="rounded-full border border-[#E5DDD0] bg-white px-3 py-1.5 text-xs font-bold text-[#25533E] hover:bg-[#FAF4EA]"
            >
              Хичээлийн сан руу →
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
