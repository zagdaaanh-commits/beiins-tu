import {
  AlertCircle,
  Check,
  CreditCard,
  Minus,
  QrCode,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { SampleBadge } from '../../components/common/SampleBadge';
import { useAppStore } from '../../context/AppStoreContext';
import { PRICING_PLANS } from '../../data/mockData';
import type { MembershipPlanType } from '../../types';

const COMPARISON_ROWS = [
  {
    feature: 'Үнэгүй танилцах хичээлүүд',
    free: true,
    monthly: true,
    yearly: true,
  },
  {
    feature: 'Анхан · Дунд · Ахисан шатны бүх видео хичээл',
    free: false,
    monthly: true,
    yearly: true,
  },
  {
    feature: 'Ханз, 4 өнгөний Пиньинь, Монгол үгчилсэн задаргаа',
    free: true,
    monthly: true,
    yearly: true,
  },
  {
    feature: 'HSK 3.0 үгийн сангийн хүснэгт',
    free: 'Хязгаарлагдмал',
    monthly: true,
    yearly: true,
  },
  {
    feature: 'PDF дасгал, ханз бичгийн дэвтэр татах',
    free: false,
    monthly: true,
    yearly: true,
  },
  {
    feature: 'Жилийн урамшуулал (2 сар үнэгүй · ₮200,000 хэмнэлт)',
    free: false,
    monthly: false,
    yearly: true,
  },
];

export function PricingPage() {
  const { userProgress, activateDemoPlan } = useAppStore();
  const [checkoutPlan, setCheckoutPlan] = useState<MembershipPlanType | null>(null);

  const selectedPlanInfo =
    checkoutPlan === 'Жилийн эрх' ? PRICING_PLANS.yearly : PRICING_PLANS.monthly;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 sm:pt-10 space-y-12">
      {/* Prototype Disclaimer Notice */}
      <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-amber-950">
        <div className="flex items-center gap-2.5">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
          <span>
            <strong>Жишээ үнийн багц (UI Прототип):</strong> Бодит төлбөрийн систем (QPay / Карт) одоогоор холбогдоогүй бөгөөд зөвхөн загвар дэлгэцийг харуулж байна.
          </span>
        </div>
        <SampleBadge variant="sample" label="Жишээ үнэ" />
      </div>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDE3C8] px-3.5 py-1 text-xs font-extrabold text-[#1A1A1A]">
          <Sparkles className="h-3.5 w-3.5 text-[#EB5E43]" />
          <span>Beijing Institute · Суралцах эрх</span>
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-[#1A1A1A]">
          Танд тохирох сургалтын багцаа сонгоорой
        </h1>
        <p className="text-sm sm:text-base text-[#5C5C5C]">
          Сарын болон жилийн багцын алинаар нь ч бүх түвшний видео, ханз-пиньинь тайлбар, HSK дасгал болон хавсралт материалд бүрэн хандана.
        </p>
      </div>

      {/* Pricing Cards: Monthly 100,000 MNT vs Yearly 1,000,000 MNT */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch">
        {/* Monthly Plan */}
        <div className="rounded-[32px] border border-[#EAE0D2] bg-white p-6 sm:p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-[#FAF4EA] px-3 py-1 text-xs font-extrabold text-[#25533E]">
                {PRICING_PLANS.monthly.badge}
              </span>
              <SampleBadge variant="sample" label="Жишээ үнэ" />
            </div>

            <h2 className="mt-4 font-display text-2xl font-black text-[#1A1A1A]">
              {PRICING_PLANS.monthly.name}
            </h2>
            <p className="mt-1.5 text-sm text-[#5C5C5C]">
              {PRICING_PLANS.monthly.description}
            </p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-display text-4xl sm:text-5xl font-black tabular-nums text-[#1A1A1A]">
                {PRICING_PLANS.monthly.priceFormatted}
              </span>
              <span className="text-sm font-bold text-[#5C5C5C]">
                {PRICING_PLANS.monthly.periodLabel}
              </span>
            </div>

            <ul className="mt-6 space-y-3 text-sm text-[#3F3F3F]">
              {[
                'Бүх түвшний видео хичээл үзэх',
                'Ханз, 4 өнгөний Пиньинь, Монгол тайлбар',
                'HSK 3.0 хүснэгт ба хавсралт материал',
                'Сарын хугацаатай уян хатан сунгалт',
              ].map((feat) => (
                <li key={feat} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[#25533E] shrink-0 mt-1" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setCheckoutPlan('Сарын эрх')}
            className="mt-8 w-full rounded-2xl border-2 border-[#25533E] bg-white py-3.5 text-sm font-extrabold text-[#25533E] transition hover:bg-[#25533E] hover:text-white cursor-pointer"
          >
            {userProgress.activeDemoPlan === 'Сарын эрх'
              ? 'Одоогийн жишээ багц · Загвар харах'
              : 'Сарын эрх сонгох (₮100,000)'}
          </button>
        </div>

        {/* Yearly Plan */}
        <div className="rounded-[32px] border-2 border-[#25533E] bg-[#25533E] p-6 sm:p-8 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#EB5E43]/25" />

          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-[#EB5E43] px-3 py-1 text-xs font-extrabold text-white">
                {PRICING_PLANS.yearly.savingsBadge}
              </span>
              <SampleBadge variant="sample" label="Жишээ үнэ" />
            </div>

            <h2 className="mt-4 font-display text-2xl font-black text-white">
              {PRICING_PLANS.yearly.name}
            </h2>
            <p className="mt-1.5 text-sm text-white/80">
              {PRICING_PLANS.yearly.description}
            </p>

            <div className="mt-6 flex flex-wrap items-baseline gap-2">
              <span className="font-display text-4xl sm:text-5xl font-black tabular-nums text-[#FDE3C8]">
                {PRICING_PLANS.yearly.priceFormatted}
              </span>
              <span className="text-sm font-bold text-white/80">
                {PRICING_PLANS.yearly.periodLabel}
              </span>
            </div>
            <p className="mt-1 text-xs font-semibold text-[#FDE3C8]">
              Сарын дундаж ≈ {PRICING_PLANS.yearly.monthlyEquivalent} (12 сарын оронд 10 сарын үнэ)
            </p>

            <ul className="mt-6 space-y-3 text-sm text-white/90">
              {[
                'Сарын багцын бүх эрх + 12 сарын хандалт',
                'Шинээр нэмэгдэх бүх курс, хичээл үнэгүй орно',
                'HSK 3.0 бэлтгэл болон бүх PDF хавсралт',
                'Жилийн дүнгээр ₮200,000 хэмнэлт',
              ].map((feat) => (
                <li key={feat} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[#FDE3C8] shrink-0 mt-1" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setCheckoutPlan('Жилийн эрх')}
            className="mt-8 w-full rounded-2xl bg-[#EB5E43] py-3.5 text-sm font-extrabold text-white shadow-md transition hover:bg-[#D44B31] cursor-pointer"
          >
            {userProgress.activeDemoPlan === 'Жилийн эрх'
              ? 'Одоогийн жишээ багц · Загвар харах'
              : 'Жилийн эрх сонгох (₮1,000,000)'}
          </button>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section id="compare" className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-2xl font-black text-[#1A1A1A]">
            Багцад юу багтах вэ?
          </h2>
          <SampleBadge variant="sample" />
        </div>

        <div className="overflow-x-auto rounded-3xl border border-[#EAE0D2] bg-white shadow-xs">
          <table className="w-full text-left border-collapse min-w-[540px]">
            <thead>
              <tr className="border-b border-[#EFE6DA] bg-[#FAF4EA] text-xs font-extrabold text-[#1A1A1A]">
                <th className="p-4">Боломжууд</th>
                <th className="p-4 text-center">Үнэгүй</th>
                <th className="p-4 text-center">Сарын (₮100,000)</th>
                <th className="p-4 text-center text-[#25533E]">Жилийн (₮1,000,000)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EDE2] text-xs sm:text-sm">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.feature}>
                  <td className="p-4 font-semibold text-[#1A1A1A]">{row.feature}</td>
                  {[row.free, row.monthly, row.yearly].map((val, idx) => (
                    <td key={idx} className="p-4 text-center">
                      {val === true ? (
                        <Check className="h-4 w-4 text-[#25533E] mx-auto" />
                      ) : val === false ? (
                        <Minus className="h-4 w-4 text-[#C5BCB0] mx-auto" />
                      ) : (
                        <span className="text-xs font-semibold text-[#8F4A0E]">{val}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Prototype Payment UI Modal (NO Real Payment) */}
      <Modal
        open={Boolean(checkoutPlan)}
        onClose={() => setCheckoutPlan(null)}
        title={`Төлбөрийн загвар (₮) — ${selectedPlanInfo.name}`}
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-3.5 text-xs text-amber-950 font-semibold leading-relaxed">
            Анхаар: Энэ бол зөвхөн UI прототип загвар юм. Бодит төлбөрийн гүйлгээ, данс холболт хийгдэхгүй.
          </div>

          <div className="rounded-2xl border border-[#EAE0D2] bg-white p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#5C5C5C]">Сонгосон жишээ багц</p>
              <p className="font-display text-lg font-black text-[#1A1A1A]">
                {selectedPlanInfo.name}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-xl font-black text-[#EB5E43]">
                {selectedPlanInfo.priceFormatted}
              </p>
              <p className="text-[11px] text-[#5C5C5C]">Жишээ дүн</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#EAE0D2] bg-[#FAF4EA] p-4 text-center space-y-2">
              <QrCode className="h-12 w-12 text-[#25533E] mx-auto" />
              <p className="text-xs font-extrabold text-[#1A1A1A]">QPay (UI Загвар)</p>
              <p className="text-[11px] text-[#5C5C5C]">QR код уншуулах хэсгийн байрлал</p>
            </div>
            <div className="rounded-2xl border border-[#EAE0D2] bg-[#FAF4EA] p-4 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#1A1A1A]">
                <CreditCard className="h-4 w-4 text-[#EB5E43]" />
                <span>Банкны шилжүүлэг (Жишээ)</span>
              </div>
              <p className="text-[11px] text-[#5C5C5C]">
                Банк: Жишээ Банк · 5000-0000-XXXX
              </p>
              <p className="text-[11px] text-[#5C5C5C]">
                Гүйлгээний утга: BEIJING-DEMO
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCheckoutPlan(null)}
              className="rounded-xl border border-[#E5DDD0] bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-[#1A1A1A] cursor-pointer"
            >
              Буцах
            </button>
            <button
              type="button"
              onClick={() => {
                if (checkoutPlan) activateDemoPlan(checkoutPlan);
                setCheckoutPlan(null);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#25533E] px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white hover:bg-[#1B3F2F] cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Жишээ эрх идэвхжүүлж турших</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
