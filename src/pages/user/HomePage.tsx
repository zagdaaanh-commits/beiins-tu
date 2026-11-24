import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from '../../components/common/Modal';
import { SampleBadge } from '../../components/common/SampleBadge';
import { SpeakChineseButton } from '../../components/common/SpeakChineseButton';
import { TonePinyin } from '../../components/common/TonePinyin';
import { useAppStore } from '../../context/AppStoreContext';
import {
  PRICING_PLANS,
  SAMPLE_TESTIMONIALS,
} from '../../data/mockData';

const HERO_SAMPLE_PHRASES = [
  {
    id: 'greet',
    tag: 'Мэндчилгээ',
    hanzi: '你好！',
    pinyin: 'Nǐ hǎo!',
    mongolian: 'Сайн байна уу!',
    note: 'Хамгийн эхний өдөр тутмын мэндчилгээ',
  },
  {
    id: 'thanks',
    tag: 'Талархал',
    hanzi: '谢谢你',
    pinyin: 'Xiè xie nǐ',
    mongolian: 'Танд баярлалаа',
    note: 'Хөнгөн өнгөтэй эелдэг талархлын үг',
  },
  {
    id: 'cheer',
    tag: 'Урам зориг',
    hanzi: '一起加油！',
    pinyin: 'Yì qǐ jiā yóu!',
    mongolian: 'Хамтдаа хичээцгээе!',
    note: 'Шинэ хэл сурахад өдөр бүр урам өгөх хэллэг',
  },
];

export function HomePage() {
  const [introOpen, setIntroOpen] = useState(false);
  const [heroPhraseIdx, setHeroPhraseIdx] = useState(0);
  const { lessons, courses, teachers, userProgress } = useAppStore();

  const leadTeacher = teachers[0];

  const activeHeroPhrase = HERO_SAMPLE_PHRASES[heroPhraseIdx] ?? HERO_SAMPLE_PHRASES[0];

  const publishedCourses = courses.filter((c) => c.status === 'published');
  const publishedCourseIds = new Set(publishedCourses.map((c) => c.id));
  const publishedLessons = lessons.filter(
    (l) => l.status === 'published' && publishedCourseIds.has(l.courseId)
  );
  const featuredLessons = publishedLessons.slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-5 sm:pt-8 space-y-14 sm:space-y-20">
      {/* SpeakEasy-inspired Framed Bento Hero */}
      <section className="rounded-[28px] sm:rounded-[36px] border-[3px] border-[#F5C9BE] bg-[#FDFBF7] p-5 sm:p-8 lg:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#EB5E43]">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span>Beijing Institute · Онлайн сургалт</span>
            </p>

            <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-[#1A1A1A] leading-[1.22]">
              Хятад хэлний{' '}
              <span className="relative inline-block px-3.5 py-1.5 mx-0.5">
                <span className="relative z-10">ертөнцийг</span>
                {/* Hand-drawn coral oval & underline scaled cleanly without clipping letters */}
                <svg
                  viewBox="0 0 280 96"
                  preserveAspectRatio="none"
                  fill="none"
                  className="pointer-events-none absolute -inset-x-2.5 -inset-y-1 h-[calc(100%+8px)] w-[calc(100%+20px)]"
                  aria-hidden="true"
                >
                  <path
                    d="M14 50 C10 18, 76 7, 144 9 C214 11, 268 26, 264 50 C260 73, 194 82, 120 80 C56 78, 16 66, 18 44"
                    stroke="#EB5E43"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M46 88 Q140 79 236 86"
                    stroke="#EB5E43"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{' '}
              бидэнтэй хамт нээ!
            </h1>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/lessons"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#EB5E43] px-6 py-3.5 text-sm sm:text-base font-extrabold text-white shadow-md shadow-[#EB5E43]/25 transition hover:bg-[#D44B31]"
              >
                <span>Хичээл эхлүүлэх</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={() => setIntroOpen(true)}
                className="inline-flex items-center gap-3 rounded-2xl px-2 py-2 text-sm sm:text-base font-bold text-[#1A1A1A] transition hover:text-[#EB5E43] cursor-pointer"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#1A1A1A]/20 bg-white shadow-xs">
                  <Play className="h-4 w-4 fill-[#1A1A1A] text-[#1A1A1A] ml-0.5" />
                </span>
                <span>Танилцуулга</span>
              </button>
            </div>
          </div>

          {/* Right Bento Grid matching SpeakEasy Layout */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch">
            {/* Middle Stat + Level Stack */}
            <div className="sm:col-span-5 flex flex-col gap-4">
              {/* Warm Peach Stat Card (Clean hierarchy without extra pill clutter) */}
              <div className="flex-1 rounded-3xl bg-[#FDE3C8] p-5 flex flex-col justify-between text-center items-center shadow-xs">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#EB5E43]/35 bg-white/70 text-[#EB5E43]">
                  <Users className="h-5 w-5" />
                </div>
                <div className="my-3">
                  <span className="font-display text-3xl sm:text-4xl font-black tabular-nums text-[#1A1A1A]">
                    1,200+
                  </span>
                  <p className="mt-1 text-[11px] font-extrabold uppercase tracking-wider text-[#8F4A0E]">
                    Жишээ суралцагчийн тоо
                  </p>
                  <p className="mt-2 text-xs sm:text-sm font-medium text-[#4A3B2C] leading-snug">
                    Хятад хэлийг системтэй суралцаж буй нийгэмлэг
                  </p>
                </div>
                <div className="flex -space-x-2.5 pt-1">
                  {[
                    { init: 'Б', bg: '#EB5E43' },
                    { init: 'А', bg: '#25533E' },
                    { init: 'Т', bg: '#2B5C8F' },
                    { init: 'С', bg: '#222222' },
                  ].map((av, idx) => (
                    <span
                      key={idx}
                      style={{ backgroundColor: av.bg }}
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#FDE3C8] text-xs font-bold text-white"
                    >
                      {av.init}
                    </span>
                  ))}
                </div>
              </div>

              {/* Charcoal Dark Level Card */}
              <div className="rounded-3xl bg-[#222222] p-5 text-center text-white shadow-xs">
                <div className="mt-3">
                  <span className="inline-flex items-center justify-center rounded-full bg-[#222222] px-3 py-1 text-[11px] font-bold text-[#FDE3C8]">
                    HSK 3.0 · 1–6 түвшин
                  </span>
                </div>
                <p className="mt-2 font-display text-sm font-bold text-white">
                  Анхан · Дунд · Ахисан
                </p>
                <p className="mt-0.5 text-[11px] text-white/65">
                  Пиньинь → Ханз → HSK 1–6
                </p>
              </div>
            </div>

            {/* Far-Right Interactive Beijing Institute Study Card */}
            <div className="sm:col-span-7 relative overflow-hidden rounded-3xl border border-[#E6DAC9] bg-[#F6F1E7] p-5 flex flex-col justify-between min-h-[310px] sm:min-h-[360px] shadow-xs">
              {/* Top Interactive Phrase Tabs */}
              <div className="flex items-center justify-center">
                <div className="inline-flex items-center gap-1 rounded-full bg-white/90 p-1 border border-[#EAE0D2]">
                  {HERO_SAMPLE_PHRASES.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setHeroPhraseIdx(idx)}
                      className={`rounded-full px-3 py-1 text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                        heroPhraseIdx === idx
                          ? 'bg-[#25533E] text-white'
                          : 'text-[#5C5C5C] hover:text-[#1A1A1A]'
                      }`}
                    >
                      {item.tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Center Calligraphic Hanzi Canvas */}
              <div className="my-4 rounded-2xl border border-[#EAE0D2] bg-white p-5 text-center shadow-xs space-y-2 relative">
                <p className="font-hanzi text-5xl sm:text-6xl font-bold text-[#1A1A1A] tracking-tight leading-tight">
                  {activeHeroPhrase.hanzi}
                </p>
                <p className="text-lg sm:text-xl">
                  <TonePinyin text={activeHeroPhrase.pinyin} />
                </p>
                <p className="text-sm sm:text-base font-extrabold text-[#25533E]">
                  {activeHeroPhrase.mongolian}
                </p>
                <p className="text-xs text-[#5C5C5C]">{activeHeroPhrase.note}</p>
                <div className="pt-2">
                  <SpeakChineseButton text={activeHeroPhrase.hanzi} label="Дуудлага сонсох" />
                </div>
              </div>

              {/* Bottom Instructor Attribution Bar */}
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/90 px-3.5 py-2.5 border border-[#EAE0D2]">
                <div className="flex items-center gap-2.5 min-w-0">
                  {leadTeacher?.photoUrl ? (
                    <img
                      src={leadTeacher.photoUrl}
                      alt={leadTeacher.name}
                      className="h-8 w-8 shrink-0 rounded-full object-cover border border-[#EAE0D2]"
                    />
                  ) : (
                    <span
                      style={{ backgroundColor: leadTeacher?.avatarBg ?? '#EB5E43' }}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
                    >
                      {leadTeacher?.avatarInitials ?? 'ЛС'}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-[#1A1A1A] truncate">
                      {leadTeacher ? `${leadTeacher.name} багш` : 'Л. Сарангэрэл багш'}
                    </p>
                    <p className="text-[11px] text-[#5C5C5C] truncate">
                      Жишээ хичээл · 4 өнгө &amp; Ханз
                    </p>
                  </div>
                </div>
                <Link
                  to="/lessons/lesson-1"
                  className="shrink-0 text-xs font-extrabold text-[#EB5E43] hover:underline"
                >
                  Үзэх →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist 3-Level Overview */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#EB5E43]">
              Сургалтын бүтэц
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-black text-[#1A1A1A]">
              Анхан · Дунд · Ахисан шат
            </h2>
          </div>
          <Link
            to="/chinese"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#25533E] hover:text-[#EB5E43]"
          >
            <span>Дэлгэрэнгүй</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Анхан шат',
              hanzi: '你好 · 拼音',
              desc: 'Пиньинь, 4 өнгө, мэндчилгээ ба суурь яриа (HSK 1–2).',
              bg: 'bg-[#FAF4EA]',
              accent: 'text-[#EB5E43]',
              to: '/lessons?level=Анхан шат',
            },
            {
              title: 'Дунд шат',
              hanzi: '日常会话',
              desc: 'Өдөр тутмын яриа, хоол, аялал ба дүрэм (HSK 3–4).',
              bg: 'bg-[#FDE3C8]/55',
              accent: 'text-[#25533E]',
              to: '/lessons?level=Дунд шат',
            },
            {
              title: 'Ахисан шат',
              hanzi: '流利表达',
              desc: 'Нийлмэл өгүүлбэр, эх уншлага ба чөлөөт яриа (HSK 5–6).',
              bg: 'bg-[#EEF4F0]',
              accent: 'text-[#25533E]',
              to: '/lessons?level=Ахисан шат',
            },
          ].map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className={`group rounded-3xl p-6 transition hover:-translate-y-0.5 hover:shadow-md ${item.bg}`}
            >
              <p className={`font-hanzi text-lg font-bold ${item.accent}`}>
                {item.hanzi}
              </p>
              <h3 className="mt-2 font-display text-xl font-extrabold text-[#1A1A1A] group-hover:text-[#EB5E43]">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm text-[#5C5C5C] leading-relaxed">
                {item.desc}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-[#25533E]">
                Хичээл үзэх <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Published Lessons */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#25533E]">
              Онцлох хичээлүүд
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-black text-[#1A1A1A]">
              Шинэ видео хичээлүүд
            </h2>
          </div>
          <Link
            to="/lessons"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF4EA] px-4 py-2 text-sm font-bold text-[#1A1A1A] hover:bg-[#FDE3C8]"
          >
            <span>Бүх хичээл ({publishedLessons.length})</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredLessons.map((lesson) => {
            const isCompleted = userProgress.completedLessonIds.includes(lesson.id);
            const course = courses.find((c) => c.id === lesson.courseId);
            return (
              <Link
                key={lesson.id}
                to={`/lessons/${lesson.id}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-[#EAE0D2] bg-white shadow-xs transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-video overflow-hidden bg-[#FAF4EA]">
                  <img
                    src={lesson.thumbnailUrl}
                    alt={lesson.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  {isCompleted && (
                    <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-[#25533E] px-2.5 py-0.5 text-[11px] font-bold text-white">
                      <CheckCircle2 className="h-3 w-3" /> Дууссан
                    </span>
                  )}
                  <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                    <Clock className="h-3 w-3" /> {lesson.duration}
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <p className="text-[11px] font-bold text-[#EB5E43]">
                      {course?.level ?? 'Анхан шат'}
                    </p>
                    <p className="mt-1 font-hanzi text-sm font-bold text-[#25533E]">
                      {lesson.chineseTitle}
                    </p>
                    <h3 className="mt-1 font-display text-base font-extrabold text-[#1A1A1A] line-clamp-2 group-hover:text-[#EB5E43]">
                      {lesson.title}
                    </h3>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#F3ECE1] pt-3 text-xs font-semibold text-[#5C5C5C]">
                    <span>{lesson.hanziLines.length} өгүүлбэр</span>
                    <span className="text-[#EB5E43] font-bold">Үзэх →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Deep Forest Green HSK 3.0 Banner */}
      <section className="rounded-[32px] bg-[#25533E] p-6 sm:p-10 text-white shadow-sm overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EB5E43] px-3 py-1 text-xs font-bold text-white">
              <Award className="h-3.5 w-3.5" />
              <span>HSK 3.0 Шинэ стандарт</span>
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-black leading-tight">
              HSK 3.0: Анхан, Дунд, Ахисан (1–6 түвшин)
            </h2>
            <p className="text-sm sm:text-base text-white/80 max-w-xl leading-relaxed">
              Түвшин бүрийн үгийн тоо, таних ба бичих ханзны албан ёсны шаардлагыг хараарай.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                to="/hsk"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#FDE3C8] px-5 py-3 text-sm font-extrabold text-[#1A1A1A] transition hover:bg-white"
              >
                <span>HSK 3.0 хүснэгт харах</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
            {[
              { lvl: 'HSK 1–2 · Анхан', words: '300 → 500 үг', desc: '371 таних ханз · 100 бичих ханз' },
              { lvl: 'HSK 3–4 · Дунд', words: '1,000 → 2,000 үг', desc: '1,096 таних ханз · 400 бичих ханз' },
              { lvl: 'HSK 5–6 · Ахисан', words: '3,600 → 5,400 үг', desc: '1,940 таних ханз · 700 бичих ханз' },
            ].map((card) => (
              <div
                key={card.lvl}
                className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-base font-extrabold text-[#FDE3C8]">
                    {card.lvl}
                  </span>
                  <span className="text-xs font-bold text-white/85 tabular-nums">{card.words}</span>
                </div>
                <p className="mt-1 text-xs text-white/80 tabular-nums">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Testimonials & Pricing Preview */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-2xl font-black text-[#1A1A1A]">
              Суралцагчдын сэтгэгдэл
            </h2>
            <SampleBadge variant="sample" label="Жишээ сэтгэгдэл" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SAMPLE_TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="rounded-3xl border border-[#EAE0D2] bg-white p-4 sm:p-5 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-0.5 text-[#EB5E43]">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} className="h-3.5 w-3.5 fill-[#EB5E43]" />
                    ))}
                  </div>
                  <p className="mt-3 text-xs sm:text-sm text-[#3F3F3F] leading-relaxed">
                    “{t.quote}”
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2.5 border-t border-[#F4EDE2] pt-3">
                  <span
                    style={{ backgroundColor: t.avatarBg }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  >
                    {t.avatarInitials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-[#1A1A1A] truncate">
                      {t.studentName}
                    </p>
                    <p className="text-[11px] text-[#5C5C5C] truncate">{t.levelLabel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Pricing Summary Box */}
        <div className="lg:col-span-5 rounded-3xl border-2 border-[#F5C9BE] bg-[#FAF4EA] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#EB5E43]">
                Эрхийн багц
              </span>
              <SampleBadge variant="sample" label="Жишээ үнэ" />
            </div>
            <h3 className="mt-2 font-display text-2xl font-black text-[#1A1A1A]">
              Суралцах эрхийн багц
            </h3>
            <p className="mt-1.5 text-sm text-[#5C5C5C]">
              Сарын болон жилийн багцын жишээ үнэ (бодит төлбөр холбогдоогүй).
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white p-3.5 border border-[#EAE0D2]">
                <p className="text-xs font-bold text-[#5C5C5C]">Сарын эрх</p>
                <p className="mt-1 font-display text-xl font-black text-[#1A1A1A]">
                  {PRICING_PLANS.monthly.priceFormatted}
                </p>
                <p className="text-[11px] text-[#5C5C5C]">сар бүр · Жишээ</p>
              </div>
              <div className="rounded-2xl bg-[#25533E] p-3.5 text-white">
                <p className="text-xs font-bold text-[#FDE3C8]">Жилийн эрх</p>
                <p className="mt-1 font-display text-xl font-black">
                  {PRICING_PLANS.yearly.priceFormatted}
                </p>
                <p className="text-[11px] text-[#FDE3C8]">2 сар үнэгүй · Жишээ</p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              to="/pricing"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#EB5E43] px-4 py-3 text-sm font-extrabold text-white hover:bg-[#D44B31]"
            >
              <span>Багцууд харьцуулах</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/my-learning"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D9CFC1] bg-white px-4 py-3 text-sm font-bold text-[#1A1A1A] hover:bg-[#FDE3C8]/50"
            >
              <BookOpen className="h-4 w-4 text-[#25533E]" />
              <span>Явц</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Intro Video Preview Modal */}
      <Modal
        open={introOpen}
        onClose={() => setIntroOpen(false)}
        title="Beijing Institute — Сургалтын танилцуулга (Жишээ)"
        maxWidthClass="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#25533E] p-6 text-white text-center space-y-3">
            <SampleBadge variant="sample" label="Танилцуулга видео загвар" />
            <p className="font-hanzi text-3xl sm:text-4xl font-bold text-[#FDE3C8]">
              欢迎来到 Beijing Institute！
            </p>
            <p className="text-sm font-semibold text-white/85">
              Huān yíng lái dào Beijing Institute! — Бээжин Институтэд тавтай морил!
            </p>
            <div className="pt-1">
              <SpeakChineseButton
                text="欢迎来到北京学院，一起学汉语吧！"
                label="Жишээ мэндчилгээ сонсох"
                size="md"
              />
            </div>
          </div>
          <p className="text-sm text-[#5C5C5C] leading-relaxed">
            Энэхүү UI прототип дээр та <strong className="text-[#1A1A1A]">Анхан → Дунд → HSK</strong> хичээлүүдийг видео, ханз, 4 өнгөний пиньинь болон монгол тайлбартайгаар туршиж үзэхээс гадна <strong className="text-[#25533E]">Админ хэсгээс</strong> шинэ хичээл нэмж шалгах боломжтой.
          </p>
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => setIntroOpen(false)}
              className="rounded-xl border border-[#E5DDD0] bg-white px-4 py-2 text-sm font-bold text-[#1A1A1A] cursor-pointer"
            >
              Хаах
            </button>
            <Link
              to="/lessons/lesson-1"
              onClick={() => setIntroOpen(false)}
              className="rounded-xl bg-[#EB5E43] px-5 py-2 text-sm font-extrabold text-white hover:bg-[#D44B31]"
            >
              Эхний хичээл рүү орох →
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}
