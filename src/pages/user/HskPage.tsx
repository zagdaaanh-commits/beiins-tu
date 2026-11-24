import { Award } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HSK_30_LEVELS } from '../../data/mockData';
import type { HskLevelGroup } from '../../types';

const HSK_30_STAGES: Array<{
  id: HskLevelGroup;
  title: string;
  stageName: string;
  vocab: string;
  chars: string;
  summary: string;
}> = [
  {
    id: 'HSK 1–2',
    title: 'HSK 1–2',
    stageName: 'Анхан шат',
    vocab: '300 → 500 үг',
    chars: '371 таних · 100 бичих ханз',
    summary: 'Пиньинь, өдөр тутмын энгийн харилцаа, үндсэн ханз бичиж унших.',
  },
  {
    id: 'HSK 3–4',
    title: 'HSK 3–4',
    stageName: 'Дунд шат',
    vocab: '1,000 → 2,000 үг',
    chars: '1,096 таних · 400 бичих ханз',
    summary: 'Сургууль, ажил, чөлөөт яриа болон богино эх уншиж дүгнэх.',
  },
  {
    id: 'HSK 5–6',
    title: 'HSK 5–6',
    stageName: 'Ахисан шат',
    vocab: '3,600 → 5,400 үг',
    chars: '1,940 таних · 700 бичих ханз',
    summary: 'Мэдээ, нийтлэл унших, дэлгэрэнгүй эсээ бичих, чөлөөт орчуулга.',
  },
];

export function HskPage() {
  const [selectedStage, setSelectedStage] = useState<HskLevelGroup | 'Бүгд'>('Бүгд');

  const visibleLevels = useMemo(() => {
    if (selectedStage === 'Бүгд') return HSK_30_LEVELS;
    return HSK_30_LEVELS.filter((row) => row.stage === selectedStage);
  }, [selectedStage]);

  const handleSelectStage = (stage: HskLevelGroup | 'Бүгд') => {
    setSelectedStage(stage);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 sm:pt-10 space-y-12">
      {/* Minimal Forest Green Header */}
      <section className="rounded-[28px] bg-[#25533E] p-6 sm:p-10 text-white">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#FDE3C8]">
          <Award className="h-4 w-4" />
          <span>HSK 3.0 Стандарт</span>
        </div>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-black">
          HSK 3.0 (1–6 түвшин) ба үгийн тоо
        </h1>
        <p className="mt-2 max-w-xl text-sm sm:text-base text-white/80">
          Анхан (1–2), Дунд (3–4), Ахисан (5–6) түвшний HSK 3.0 стандартын үг болон ханзны шаардлага.
        </p>

        {/* Stage Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {(['Бүгд', 'HSK 1–2', 'HSK 3–4', 'HSK 5–6'] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => handleSelectStage(lvl)}
              className={`rounded-2xl px-4 py-2 text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                selectedStage === lvl
                  ? 'bg-[#FDE3C8] text-[#1A1A1A]'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {lvl === 'Бүгд' ? 'Бүх түвшин (1–6)' : lvl}
            </button>
          ))}
        </div>
      </section>

      {/* 3 Minimal Stage Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {HSK_30_STAGES.map((g) => (
          <div
            key={g.id}
            className={`rounded-3xl border p-6 transition ${
              selectedStage === g.id
                ? 'border-[#EB5E43] bg-[#FDE3C8]/35'
                : 'border-[#EAE0D2] bg-white'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#EB5E43]">
                {g.stageName}
              </span>
              <span className="rounded-full bg-[#FAF4EA] px-2.5 py-0.5 text-xs font-bold text-[#25533E] tabular-nums">
                {g.vocab}
              </span>
            </div>
            <h2 className="mt-2 font-display text-2xl font-black text-[#1A1A1A]">
              {g.title}
            </h2>
            <p className="mt-1.5 text-xs font-bold text-[#25533E] tabular-nums">{g.chars}</p>
            <p className="mt-2 text-xs sm:text-sm text-[#5C5C5C] leading-relaxed">
              {g.summary}
            </p>
            <div className="mt-4 pt-3 border-t border-[#F0E8DC] flex justify-end">
              <Link
                to={`/lessons?level=${encodeURIComponent(g.stageName)}`}
                className="text-xs font-extrabold text-[#EB5E43] hover:underline"
              >
                Хичээл үзэх →
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* HSK 3.0 Official Vocabulary & Hanzi Table (HSK 1–6) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-xl sm:text-2xl font-black text-[#1A1A1A]">
            HSK 3.0 Түвшин бүрийн шаардлага
          </h2>
          <span className="text-xs font-semibold text-[#5C5C5C]">HSK 1–6</span>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-[#EAE0D2] bg-white shadow-xs">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-[#EFE6DA] bg-[#FAF4EA] text-xs font-extrabold text-[#1A1A1A]">
                <th className="p-4">Түвшин</th>
                <th className="p-4">Ангилал</th>
                <th className="p-4 text-right">Нийт үг</th>
                <th className="p-4 text-right">Шинэ үг</th>
                <th className="p-4 text-right">Таних ханз</th>
                <th className="p-4 text-right">Бичих ханз</th>
                <th className="p-4">Гол чадвар</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EDE2] text-xs sm:text-sm">
              {visibleLevels.map((row) => (
                <tr key={row.level} className="hover:bg-[#FDFBF7]">
                  <td className="p-4 font-display font-black text-[#25533E] whitespace-nowrap">
                    {row.level}
                  </td>
                  <td className="p-4 text-xs font-bold text-[#EB5E43] whitespace-nowrap">
                    {row.stageLabel}
                  </td>
                  <td className="p-4 text-right font-extrabold tabular-nums text-[#1A1A1A]">
                    {row.vocabTotal.toLocaleString()}
                  </td>
                  <td className="p-4 text-right tabular-nums text-[#5C5C5C]">
                    +{row.vocabNew.toLocaleString()}
                  </td>
                  <td className="p-4 text-right tabular-nums font-semibold text-[#1A1A1A]">
                    {row.charsRead.toLocaleString()}
                  </td>
                  <td className="p-4 text-right tabular-nums text-[#5C5C5C]">
                    {row.charsWrite === 0 ? '—' : row.charsWrite.toLocaleString()}
                  </td>
                  <td className="p-4 text-xs text-[#5C5C5C]">{row.focusMn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
