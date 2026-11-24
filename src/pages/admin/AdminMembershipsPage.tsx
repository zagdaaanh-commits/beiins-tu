import { AlertCircle, CreditCard, Search, ShieldCheck, UserCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { SampleBadge } from '../../components/common/SampleBadge';
import { useAppStore } from '../../context/AppStoreContext';
import type { MemberRecord, MembershipPlanType, MembershipStatus } from '../../types';

export function AdminMembershipsPage() {
  const { members, updateMemberStatus } = useAppStore();
  const [query, setQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<'Бүгд' | MembershipPlanType>('Бүгд');
  const [statusFilter, setStatusFilter] = useState<'Бүгд' | MembershipStatus>('Бүгд');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const selectedMember: MemberRecord | undefined = members.find(
    (m) => m.id === selectedMemberId
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      if (planFilter !== 'Бүгд' && m.plan !== planFilter) return false;
      if (statusFilter !== 'Бүгд' && m.status !== statusFilter) return false;
      if (!q) return true;
      return (
        m.fullName.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q)
      );
    });
  }, [members, query, planFilter, statusFilter]);

  const activeMonthlyCount = members.filter(
    (m) => m.plan === 'Сарын эрх' && m.status === 'Идэвхтэй'
  ).length;
  const activeYearlyCount = members.filter(
    (m) => m.plan === 'Жилийн эрх' && m.status === 'Идэвхтэй'
  ).length;
  const expiringCount = members.filter((m) => m.status === 'Дуусах дөхсөн').length;
  const expiredCount = members.filter((m) => m.status === 'Хугацаа дууссан').length;

  return (
    <div className="space-y-6">
      {/* Prototype Disclaimer */}
      <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-amber-950">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>
            <strong>Жишээ хэрэглэгчийн өгөгдөл:</strong> Бодит төлбөр ба бүртгэлийн систем холбогдоогүй тул доорх жагсаалт зөвхөн UI загвар юм.
          </span>
        </div>
        <SampleBadge variant="sample-data" />
      </div>

      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-[#1A1A1A]">
          Хэрэглэгчийн эрхийн төлөв
        </h1>
        <p className="mt-1 text-sm text-[#5C5C5C]">
          Сарын эрх (₮100,000) болон Жилийн эрх (₮1,000,000) эзэмшигч жишээ хэрэглэгчдийн төлөвийг хянах хэсэг.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-[#EAE0D2] bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <CreditCard className="h-4 w-4 text-[#EB5E43]" />
            <SampleBadge variant="sample" />
          </div>
          <p className="mt-2 font-display text-2xl sm:text-3xl font-black text-[#1A1A1A]">
            {activeMonthlyCount}
          </p>
          <p className="text-xs font-bold text-[#5C5C5C]">Идэвхтэй сарын (₮100,000)</p>
        </div>

        <div className="rounded-3xl bg-[#25533E] p-4 sm:p-5 text-white">
          <div className="flex items-center justify-between">
            <ShieldCheck className="h-4 w-4 text-[#FDE3C8]" />
            <SampleBadge variant="sample" />
          </div>
          <p className="mt-2 font-display text-2xl sm:text-3xl font-black">
            {activeYearlyCount}
          </p>
          <p className="text-xs font-semibold text-white/85">Идэвхтэй жилийн (₮1,000,000)</p>
        </div>

        <div className="rounded-3xl bg-amber-50 border border-amber-200 p-4 sm:p-5">
          <p className="text-xs font-bold text-amber-800">Дуусах дөхсөн</p>
          <p className="mt-2 font-display text-2xl sm:text-3xl font-black text-amber-950">
            {expiringCount}
          </p>
          <p className="text-[11px] text-amber-800">7 хоног дотор сунгах (Жишээ)</p>
        </div>

        <div className="rounded-3xl bg-red-50 border border-red-200 p-4 sm:p-5">
          <p className="text-xs font-bold text-red-800">Хугацаа дууссан</p>
          <p className="mt-2 font-display text-2xl sm:text-3xl font-black text-red-950">
            {expiredCount}
          </p>
          <p className="text-[11px] text-red-800">Эрх идэвхгүй (Жишээ)</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-3xl border border-[#EAE0D2] bg-white p-4 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 text-[#8E8578] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Нэр, имэйл эсвэл утсаар хайх..."
            className="w-full rounded-2xl border border-[#E5DDD0] bg-[#FDFBF7] pl-10 pr-4 py-2.5 text-sm"
          />
        </div>

        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value as 'Бүгд' | MembershipPlanType)}
          aria-label="Багцаар шүүх"
          className="rounded-2xl border border-[#E5DDD0] bg-[#FDFBF7] px-3.5 py-2.5 text-sm font-semibold"
        >
          <option value="Бүгд">Бүх багц</option>
          <option value="Сарын эрх">Сарын эрх (₮100,000)</option>
          <option value="Жилийн эрх">Жилийн эрх (₮1,000,000)</option>
          <option value="Үнэгүй">Үнэгүй</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'Бүгд' | MembershipStatus)}
          aria-label="Төлөвөөр шүүх"
          className="rounded-2xl border border-[#E5DDD0] bg-[#FDFBF7] px-3.5 py-2.5 text-sm font-semibold"
        >
          <option value="Бүгд">Бүх төлөв</option>
          <option value="Идэвхтэй">Идэвхтэй</option>
          <option value="Дуусах дөхсөн">Дуусах дөхсөн</option>
          <option value="Хугацаа дууссан">Хугацаа дууссан</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-3xl border border-[#EAE0D2] bg-white shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#EFE6DA] bg-[#FAF4EA] text-xs font-extrabold text-[#1A1A1A]">
              <th className="p-4">Суралцагч (Жишээ)</th>
              <th className="p-4">Эрхийн багц</th>
              <th className="p-4">Төлөв</th>
              <th className="p-4">Хугацаа</th>
              <th className="p-4">Суралцсан явц</th>
              <th className="p-4 text-right">Үйлдэл</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F4EDE2] text-sm">
            {filtered.map((m) => (
              <tr key={m.id} className="hover:bg-[#FDFBF7]">
                <td className="p-4">
                  <p className="font-extrabold text-[#1A1A1A]">{m.fullName}</p>
                  <p className="text-xs text-[#5C5C5C]">
                    {m.email} · {m.phone}
                  </p>
                </td>
                <td className="p-4">
                  <p className="font-bold text-[#1A1A1A]">{m.plan}</p>
                  <p className="text-xs text-[#5C5C5C]">{m.priceLabel}</p>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      m.status === 'Идэвхтэй'
                        ? 'bg-emerald-100 text-emerald-900'
                        : m.status === 'Дуусах дөхсөн'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {m.status}
                  </span>
                </td>
                <td className="p-4 text-xs text-[#5C5C5C]">
                  {m.startDate} → <strong className="text-[#1A1A1A]">{m.endDate}</strong>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 rounded-full bg-[#EFE7DB] overflow-hidden">
                      <div
                        className="h-full bg-[#25533E]"
                        style={{ width: `${m.progressPercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#1A1A1A]">{m.progressPercent}%</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button
                    type="button"
                    onClick={() => setSelectedMemberId(m.id)}
                    className="rounded-xl bg-[#FAF4EA] px-3 py-1.5 text-xs font-bold text-[#25533E] hover:bg-[#FDE3C8] cursor-pointer"
                  >
                    Дэлгэрэнгүй
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((m) => (
          <div
            key={m.id}
            className="rounded-3xl border border-[#EAE0D2] bg-white p-4 space-y-3 shadow-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-display text-base font-extrabold text-[#1A1A1A]">
                  {m.fullName}
                </p>
                <p className="text-xs text-[#5C5C5C]">{m.email}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                  m.status === 'Идэвхтэй'
                    ? 'bg-emerald-100 text-emerald-900'
                    : m.status === 'Дуусах дөхсөн'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-red-100 text-red-800'
                }`}
              >
                {m.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#25533E]">
                {m.plan} ({m.priceLabel})
              </span>
              <span className="text-[#5C5C5C]">Дуусах: {m.endDate}</span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedMemberId(m.id)}
              className="w-full rounded-xl bg-[#FAF4EA] py-2 text-xs font-bold text-[#1A1A1A] cursor-pointer"
            >
              Дэлгэрэнгүй харах
            </button>
          </div>
        ))}
      </div>

      {/* Member Detail Modal */}
      <Modal
        open={Boolean(selectedMember)}
        onClose={() => setSelectedMemberId(null)}
        title={selectedMember ? `${selectedMember.fullName} — Эрхийн дэлгэрэнгүй` : ''}
      >
        {selectedMember && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#25533E]">
                <UserCheck className="h-4 w-4" />
                <span>{selectedMember.paymentMethodMock}</span>
              </span>
              <SampleBadge variant="sample-data" />
            </div>

            <div className="rounded-2xl border border-[#EAE0D2] bg-white p-4 space-y-2 text-xs sm:text-sm">
              <p>
                <strong>Имэйл:</strong> {selectedMember.email}
              </p>
              <p>
                <strong>Утас:</strong> {selectedMember.phone}
              </p>
              <p>
                <strong>Багц:</strong> {selectedMember.plan} ({selectedMember.priceLabel})
              </p>
              <p>
                <strong>Хугацаа:</strong> {selectedMember.startDate} — {selectedMember.endDate}
              </p>
              <p>
                <strong>Суралцсан явц:</strong> {selectedMember.progressPercent}% ({selectedMember.completedLessonsCount} хичээл)
              </p>
              <p>
                <strong>Сүүлд орсон:</strong> {selectedMember.lastActive}
              </p>
            </div>

            <div className="rounded-2xl bg-[#FAF4EA] p-4 space-y-2">
              <p className="text-xs font-extrabold text-[#1A1A1A]">
                Прототип төлөв шалгах (Жишээ өөрчлөлт):
              </p>
              <div className="flex flex-wrap gap-2">
                {(['Идэвхтэй', 'Дуусах дөхсөн', 'Хугацаа дууссан'] as MembershipStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateMemberStatus(selectedMember.id, st)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer ${
                        selectedMember.status === st
                          ? 'bg-[#25533E] text-white'
                          : 'bg-white border border-[#E5DDD0] text-[#1A1A1A]'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedMemberId(null)}
                className="rounded-xl bg-[#EB5E43] px-5 py-2 text-xs font-extrabold text-white cursor-pointer"
              >
                Хаах
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
