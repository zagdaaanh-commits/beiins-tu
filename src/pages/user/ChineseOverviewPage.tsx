import { ArrowRight, BookOpen, CheckCircle2, GraduationCap, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SampleBadge } from '../../components/common/SampleBadge';
import { SpeakChineseButton } from '../../components/common/SpeakChineseButton';
import { TonePinyin } from '../../components/common/TonePinyin';
import { useAppStore } from '../../context/AppStoreContext';

const LEVELS = [
  {
    id: 'beginner',
    title: 'Анхан шат',
    chinese: '初级汉语 (HSK 1–2)',
    duration: 'Жишээ хөтөлбөр',
    hanziGoal: '300 → 500 үг',
    filterQuery: 'Анхан шат',
    highlights: [
      'Пиньинь цагаан толгой ба 4 өнгөний дуудлага',
      'Мэндчилгээ, тоо, өдөр тутмын энгийн харилцан яриа',
      '371 таних, 100 бичих үндсэн ханз',
    ],
  },
  {
    id: 'intermediate',
    title: 'Дунд шат',
    chinese: '中级汉语 (HSK 3–4)',
    duration: 'Жишээ хөтөлбөр',
    hanziGoal: '1,000 → 2,000 үг',
    filterQuery: 'Дунд шат',
    highlights: [
      'Зоогийн газар, метро, аялал ба амьд харилцан яриа',
      'Нийлмэл өгүүлбэр ба цагийн нөхцөл (了, 过, 正在)',
      '1,096 таних, 400 бичих ханз',
    ],
  },
  {
    id: 'advanced',
    title: 'Ахисан шат',
    chinese: '高级汉语 (HSK 5–6)',
    duration: 'Жишээ хөтөлбөр',
    hanziGoal: '3,600 → 5,400 үг',
    filterQuery: 'Ахисан шат',
    highlights: [
      'Нийтлэл, эрдэм шинжилгээний эх уншиж дүгнэх',
      'Хятадын хэлц үг (成语) ба чөлөөт ярианы найруулга',
      '1,940 таних, 700 бичих ханз',
    ],
  },
];

const FOUR_TONES = [
  {
    tone: 1,
    name: '1-р өнгө (Тэгш өндөр)',
    mark: 'ā (55)',
    exampleHanzi: '妈',
    examplePinyin: 'mā',
    meaning: 'Ээж',
    color: '#EB5E43',
    tip: 'Дуу хоолойгоо өндөр түвшинд огт өөрчлөхгүй тэгш барина.',
    svgPath: 'M12 22 L108 22',
  },
  {
    tone: 2,
    name: '2-р өнгө (Өгсөх)',
    mark: 'á (35)',
    exampleHanzi: '麻',
    examplePinyin: 'má',
    meaning: 'Олс / Бадайрах',
    color: '#25533E',
    tip: 'Асууж гайхах аястай адилаар дундаас дээш огцом өгсүүлж дуудна.',
    svgPath: 'M12 52 Q56 44 108 20',
  },
  {
    tone: 3,
    name: '3-р өнгө (Буугаад өгсөх)',
    mark: 'ǎ (214)',
    exampleHanzi: '马',
    examplePinyin: 'mǎ',
    meaning: 'Морь',
    color: '#B87414',
    tip: 'Доош гүн бууж зөөлөн хоолойгоор эргэж дээшлүүлнэ.',
    svgPath: 'M12 42 Q52 68 108 26',
  },
  {
    tone: 4,
    name: '4-р өнгө (Огцом унах)',
    mark: 'à (51)',
    exampleHanzi: '骂',
    examplePinyin: 'mà',
    meaning: 'Загнах',
    color: '#2B5C8F',
    tip: 'Дээрээс доош богино бөгөөд эрс шийдэмгий унагаж хэлнэ.',
    svgPath: 'M12 20 L108 60',
  },
];

export function ChineseOverviewPage() {
  const [activeLevelId, setActiveLevelId] = useState<string>('beginner');
  const { teachers } = useAppStore();
  const activeLevel = LEVELS.find((l) => l.id === activeLevelId) ?? LEVELS[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 sm:pt-10 space-y-14">
      {/* Header */}
      <section className="rounded-[28px] border border-[#EAE0D2] bg-[#FAF4EA] p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <SampleBadge variant="sample" label="Хөтөлбөрийн танилцуулга" />
          <span className="text-xs font-bold text-[#25533E]">Анхан → Дунд → Ахисан</span>
        </div>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl font-black text-[#1A1A1A]">
          Хятад хэлний сургалтын шатлал
        </h1>
        <p className="mt-2 max-w-2xl text-sm sm:text-base text-[#5C5C5C] leading-relaxed">
          Beijing Institute-ийн хөтөлбөр нь монгол суралцагчийн сэтгэхүйн онцлогт тааруулан дуудлага, ханз бичиг болон амьд харилцан яриаг тэнцвэртэй хөгжүүлэх зорилготой.
        </p>

        {/* Level Switcher */}
        <div className="mt-6 flex flex-wrap gap-2">
          {LEVELS.map((lvl) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => setActiveLevelId(lvl.id)}
              className={`rounded-2xl px-4 py-2.5 text-sm font-extrabold transition cursor-pointer ${
                activeLevelId === lvl.id
                  ? 'bg-[#EB5E43] text-white shadow-sm'
                  : 'bg-white text-[#1A1A1A] border border-[#E5DDD0] hover:bg-[#FDE3C8]/60'
              }`}
            >
              {lvl.title}
            </button>
          ))}
        </div>

        {/* Selected Level Card */}
        <div className="mt-6 rounded-3xl border border-[#EAE0D2] bg-white p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-hanzi text-xl font-bold text-[#25533E]">
                {activeLevel.chinese}
              </span>
              <span className="rounded-full bg-[#FDE3C8] px-3 py-0.5 text-xs font-bold text-[#1A1A1A]">
                {activeLevel.duration}
              </span>
              <span className="rounded-full bg-[#EEF4F0] px-3 py-0.5 text-xs font-bold text-[#25533E]">
                Зорилтот үг: {activeLevel.hanziGoal}
              </span>
            </div>

            <h2 className="font-display text-2xl font-black text-[#1A1A1A]">
              {activeLevel.title} — Юу сурах вэ?
            </h2>

            <ul className="space-y-2.5">
              {activeLevel.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm text-[#3F3F3F]">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#25533E] mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3 rounded-2xl bg-[#FAF4EA] p-5 border border-[#EFE4D6]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#5C5C5C]">
              <BookOpen className="h-4 w-4 text-[#EB5E43]" />
              <span>Холбогдох видео хичээлүүд</span>
            </div>
            <p className="text-xs text-[#5C5C5C] leading-relaxed">
              Хичээлийн сан руу орж энэ түвшний бүх видео болон ханз-пиньинь дасгалыг үзнэ үү.
            </p>
            <Link
              to={`/lessons?level=${encodeURIComponent(activeLevel.filterQuery)}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25533E] px-4 py-3 text-sm font-extrabold text-white hover:bg-[#1B3F2F]"
            >
              <span>Хичээлүүдийг шүүж үзэх</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Tones Interactive Lab */}
      <section id="tones" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#EB5E43]">
              <Sparkles className="h-3.5 w-3.5" /> Дуудлага ба үгийн сан
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-black text-[#1A1A1A]">
              Хятад хэлний 4 өнгөний (声调) визуал тайлбар
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5C5C5C] max-w-md">
            Үе бүрийн өнгийг дарж туршилтын дуудлагаар сонсоорой. Манай бүх хичээлд энэ 4 өнгөөр ялгах систем ашиглагддаг.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FOUR_TONES.map((t) => (
            <div
              key={t.tone}
              className="rounded-3xl border border-[#EAE0D2] bg-white p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    style={{ backgroundColor: `${t.color}18`, color: t.color }}
                    className="rounded-full px-2.5 py-0.5 text-xs font-extrabold"
                  >
                    {t.mark}
                  </span>
                  <SpeakChineseButton text={t.exampleHanzi} label="Сонсох" />
                </div>

                <h3 className="mt-3 font-display text-base font-extrabold text-[#1A1A1A]">
                  {t.name}
                </h3>

                {/* Pitch Contour SVG */}
                <div className="my-3 rounded-2xl bg-[#FAF4EA] p-3">
                  <svg viewBox="0 0 120 75" className="w-full h-16" aria-hidden="true">
                    <line x1="10" y1="20" x2="110" y2="20" stroke="#E2D8C8" strokeDasharray="3 3" />
                    <line x1="10" y1="40" x2="110" y2="40" stroke="#E2D8C8" strokeDasharray="3 3" />
                    <line x1="10" y1="60" x2="110" y2="60" stroke="#E2D8C8" strokeDasharray="3 3" />
                    <path
                      d={t.svgPath}
                      fill="none"
                      stroke={t.color}
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="flex items-baseline gap-2.5">
                  <span className="font-hanzi text-3xl font-bold text-[#1A1A1A]">
                    {t.exampleHanzi}
                  </span>
                  <TonePinyin text={t.examplePinyin} className="text-lg" />
                  <span className="text-sm font-semibold text-[#5C5C5C]">— {t.meaning}</span>
                </div>
              </div>

              <p className="mt-3 border-t border-[#F4EDE2] pt-3 text-xs text-[#5C5C5C] leading-relaxed">
                {t.tip}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Sample Teachers */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#25533E]">
                Багш нар
              </span>
              <SampleBadge variant="sample" label="Жишээ багш" />
            </div>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-black text-[#1A1A1A]">
              Танилцуулга багш нарын баг
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="rounded-3xl border border-[#EAE0D2] bg-white p-5 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  {teacher.photoUrl ? (
                    <img
                      src={teacher.photoUrl}
                      alt={teacher.name}
                      className="h-14 w-14 rounded-2xl object-cover border border-[#EAE0D2]"
                    />
                  ) : (
                    <span
                      style={{ backgroundColor: teacher.avatarBg }}
                      className="flex h-14 w-14 items-center justify-center rounded-2xl font-display text-base font-black text-white"
                    >
                      {teacher.avatarInitials}
                    </span>
                  )}
                  <SampleBadge variant="sample" label={teacher.specialty || 'Багш'} />
                </div>
                <h3 className="mt-4 font-display text-lg font-extrabold text-[#1A1A1A]">
                  {teacher.name}
                </h3>
                <p className="font-hanzi text-sm font-bold text-[#EB5E43]">
                  {teacher.chineseName}
                </p>
                <p className="mt-1 text-xs font-semibold text-[#25533E]">{teacher.role}</p>
                <p className="mt-2.5 text-xs text-[#5C5C5C] leading-relaxed">{teacher.bio}</p>
              </div>

              <div className="mt-4 border-t border-[#F4EDE2] pt-3 flex items-center justify-between text-[11px] font-semibold text-[#5C5C5C]">
                <span className="inline-flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5 text-[#25533E]" />
                  {teacher.experience}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
