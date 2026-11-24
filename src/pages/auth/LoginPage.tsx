import { ArrowRight, LogIn, ShieldCheck, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrandLogo } from '../../components/common/BrandLogo';
import { PasswordInput } from '../../components/ui/password-input';
import { useAppStore } from '../../context/AppStoreContext';
import { BRAND_IMAGES } from '../../data/mockData';

export function LoginPage() {
  const navigate = useNavigate();
  const { showToast } = useAppStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('anujin.sample@example.mn');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      mode === 'login'
        ? 'Тавтай морил! Прототип горимоор нэвтэрлээ.'
        : 'Бүртгэл загвар горимоор амжилттай үүслээ.',
      'info'
    );
    navigate('/home');
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#193026]">
      {/* Full-bleed Beijing City Skyline */}
      <img
        src={BRAND_IMAGES.beijingCity}
        alt="Бээжин хотын төрх"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#14110F]/75 via-[#1A1512]/25 to-[#14110F]/50"
      />

      {/* Minimal Top Bar */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6 pt-5 pb-3">
        <BrandLogo to="/" variant="dark" subtitle="Хятад хэлний онлайн сургалт" />
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-[#FDE3C8] backdrop-blur-md transition hover:bg-white/25"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Админ →</span>
        </Link>
      </header>

      {/* Center Content: Clean Minimal Editorial Title + Right Floating Login Card */}
      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Minimal Beijing Headline */}
          <div className="md:col-span-6 text-white space-y-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#FDE3C8]">
              Бээжин · Онлайн академи
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-black leading-[1.15] tracking-tight drop-shadow-sm">
              Хятад хэлийг цэгцтэй, орчин үеийн аргаар.
            </h1>
            <p className="text-sm sm:text-base text-white/85 max-w-md leading-relaxed">
              Анхан · Дунд · Ахисан · HSK 3.0 стандарт хөтөлбөр.
            </p>
          </div>

          {/* Right Floating Login Card */}
          <div className="md:col-span-6 lg:col-span-5 lg:col-start-8">
            <div className="rounded-[28px] border border-white/50 bg-[#FDFBF7]/96 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-5">
              {/* 2-Tab Switcher */}
              <div className="grid grid-cols-2 rounded-2xl bg-[#FAF4EA] p-1 border border-[#EAE0D2]">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`rounded-xl py-2.5 text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                    mode === 'login'
                      ? 'bg-[#25533E] text-white shadow-xs'
                      : 'text-[#5C5C5C] hover:text-[#1A1A1A]'
                  }`}
                >
                  Нэвтрэх
                </button>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className={`rounded-xl py-2.5 text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                    mode === 'register'
                      ? 'bg-[#25533E] text-white shadow-xs'
                      : 'text-[#5C5C5C] hover:text-[#1A1A1A]'
                  }`}
                >
                  Бүртгүүлэх
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label
                      htmlFor="login-fullname"
                      className="block text-xs font-bold text-[#1A1A1A] mb-1.5"
                    >
                      Нэр
                    </label>
                    <input
                      id="login-fullname"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Б. Анужин"
                      className="w-full h-12 rounded-2xl border border-[#E5DDD0] bg-[#FAF4EA] px-4 text-sm text-[#1A1A1A] placeholder:text-[#8E8578] focus:border-[#25533E] focus:bg-white focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-xs font-bold text-[#1A1A1A] mb-1.5"
                  >
                    Имэйл эсвэл Утас
                  </label>
                  <input
                    id="login-email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.mn"
                    className="w-full h-12 rounded-2xl border border-[#E5DDD0] bg-[#FAF4EA] px-4 text-sm text-[#1A1A1A] placeholder:text-[#8E8578] focus:border-[#25533E] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className={mode === 'register' ? 'pb-11' : 'pb-0'}>
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-bold text-[#1A1A1A] mb-1.5"
                  >
                    Нууц үг
                  </label>
                  <PasswordInput
                    id="login-password"
                    name="password"
                    autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                    placeholder="Нууц үгээ оруулна уу"
                    value={password}
                    onChange={setPassword}
                    strength={mode === 'register'}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#EB5E43] py-3.5 text-sm font-extrabold text-white shadow-md shadow-[#EB5E43]/25 transition hover:bg-[#D44B31] cursor-pointer"
                >
                  {mode === 'login' ? (
                    <>
                      <LogIn className="h-4 w-4" />
                      <span>Нэвтрэх</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      <span>Бүртгүүлэх</span>
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center justify-between gap-2 border-t border-[#EAE0D2] pt-4 text-xs">
                <span className="text-[#8E8578]">UI Прототип · Жишээ</span>
                <Link
                  to="/home"
                  className="inline-flex items-center gap-1 font-extrabold text-[#25533E] hover:text-[#EB5E43]"
                >
                  <span>Зочноор үзэх</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Quiet Bottom Footer */}
      <footer className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 pb-5 pt-2 text-[11px] text-white/70 flex flex-wrap items-center justify-between gap-2">
        <span>© 2026 Beijing Institute · UI Прототип</span>
        <span>Бодит нэвтрэлт ба төлбөр холбогдоогүй</span>
      </footer>
    </div>
  );
}
