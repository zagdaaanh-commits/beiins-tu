import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileEdit,
  FolderKanban,
  GraduationCap,
  Plus,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SampleBadge } from '../../components/common/SampleBadge';
import { useAppStore } from '../../context/AppStoreContext';

export function AdminDashboardPage() {
  const { courses, lessons, teachers, members, setLessonStatus } = useAppStore();

  const publishedLessons = lessons.filter((l) => l.status === 'published');
  const draftLessons = lessons.filter((l) => l.status === 'draft');
  const activeMembers = members.filter((m) => m.status === 'Идэвхтэй');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-black text-[#1A1A1A]">
              Админ хянах самбар
            </h1>
            <SampleBadge variant="sample" label="UI Прототип" />
          </div>
          <p className="mt-1 text-sm text-[#5C5C5C]">
            Курс, хичээл, багш нар болон жишээ гишүүдийн эрхийг удирдах хэсэг.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/admin/teachers"
            className="inline-flex items-center gap-1.5 rounded-2xl border border-[#D9CFC1] bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-[#1A1A1A] hover:bg-[#FAF4EA]"
          >
            <GraduationCap className="h-4 w-4 text-[#25533E]" />
            <span>Багш нэмэх</span>
          </Link>
          <Link
            to="/admin/lessons/new"
            className="inline-flex items-center gap-1.5 rounded-2xl bg-[#EB5E43] px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white hover:bg-[#D44B31]"
          >
            <Plus className="h-4 w-4" />
            <span>Шинэ хичээл үүсгэх</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-[#EAE0D2] bg-white p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[#25533E]">
            <FolderKanban className="h-5 w-5" />
            <span className="text-[11px] font-bold bg-[#FAF4EA] px-2 py-0.5 rounded-full">
              3 түвшин
            </span>
          </div>
          <p className="font-display text-3xl font-black text-[#1A1A1A]">{courses.length}</p>
          <p className="text-xs font-bold text-[#5C5C5C]">Нийт курс</p>
        </div>

        <div className="rounded-3xl bg-[#25533E] p-5 text-white space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <CheckCircle2 className="h-5 w-5 text-[#FDE3C8]" />
            <span className="text-[11px] font-bold text-[#FDE3C8]">Сайтад буй</span>
          </div>
          <p className="font-display text-3xl font-black">{publishedLessons.length}</p>
          <p className="text-xs font-semibold text-white/85">Нийтлэгдсэн хичээл</p>
        </div>

        <div className="rounded-3xl bg-[#FDE3C8] p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <FileEdit className="h-5 w-5 text-[#EB5E43]" />
            <SampleBadge variant="draft" />
          </div>
          <p className="font-display text-3xl font-black text-[#1A1A1A]">{draftLessons.length}</p>
          <p className="text-xs font-bold text-[#4A3B2C]">Ноорог хичээл</p>
        </div>

        <div className="rounded-3xl border border-[#EAE0D2] bg-white p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <Users className="h-5 w-5 text-[#EB5E43]" />
            <SampleBadge variant="sample" />
          </div>
          <p className="font-display text-3xl font-black text-[#1A1A1A]">{activeMembers.length}</p>
          <p className="text-xs font-bold text-[#5C5C5C]">Идэвхтэй гишүүн</p>
        </div>
      </div>

      {/* Drafts + Teachers + Memberships */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          {/* Drafts Queue */}
          <section className="rounded-3xl border border-[#EAE0D2] bg-white p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-extrabold text-[#1A1A1A]">
                  Ноорог хичээлүүд ({draftLessons.length})
                </h2>
                <p className="text-xs text-[#5C5C5C]">
                  “Нийтлэх” дарснаар хэрэглэгчийн хичээлийн сан руу шууд орно.
                </p>
              </div>
              <Link
                to="/admin/lessons"
                className="text-xs font-extrabold text-[#25533E] hover:text-[#EB5E43]"
              >
                Бүгд ({lessons.length}) →
              </Link>
            </div>

            {draftLessons.length === 0 ? (
              <div className="rounded-2xl bg-[#FAF4EA] p-6 text-center text-sm text-[#5C5C5C]">
                Бүх хичээл нийтлэгдсэн байна.
              </div>
            ) : (
              <div className="space-y-3">
                {draftLessons.map((lesson) => {
                  const course = courses.find((c) => c.id === lesson.courseId);
                  return (
                    <div
                      key={lesson.id}
                      className="rounded-2xl border border-[#EFE6DA] bg-[#FDFBF7] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <SampleBadge variant="draft" />
                          <span className="text-[11px] font-bold text-[#5C5C5C] truncate">
                            {course?.title}
                          </span>
                        </div>
                        <p className="mt-1 font-display text-sm font-extrabold text-[#1A1A1A] truncate">
                          {lesson.title}
                        </p>
                        <p className="font-hanzi text-xs text-[#25533E]">{lesson.chineseTitle}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          to={`/admin/lessons/${lesson.id}/edit`}
                          className="rounded-xl border border-[#E5DDD0] bg-white px-3 py-1.5 text-xs font-bold text-[#1A1A1A] hover:bg-[#FAF4EA]"
                        >
                          Засах
                        </Link>
                        <button
                          type="button"
                          onClick={() => setLessonStatus(lesson.id, 'published')}
                          className="rounded-xl bg-[#25533E] px-3 py-1.5 text-xs font-extrabold text-white hover:bg-[#1B3F2F] cursor-pointer"
                        >
                          Нийтлэх
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Teachers Quick Card */}
          <section className="rounded-3xl border border-[#EAE0D2] bg-white p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-[#25533E]" />
                <h2 className="font-display text-lg font-extrabold text-[#1A1A1A]">
                  Багш нар ({teachers.length})
                </h2>
              </div>
              <Link
                to="/admin/teachers"
                className="text-xs font-extrabold text-[#EB5E43] hover:underline"
              >
                Удирдах / Зураг нэмэх →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {teachers.slice(0, 6).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 rounded-2xl border border-[#F0E8DC] bg-[#FDFBF7] p-3"
                >
                  {t.photoUrl ? (
                    <img
                      src={t.photoUrl}
                      alt={t.name}
                      className="h-10 w-10 shrink-0 rounded-xl object-cover border border-[#EAE0D2]"
                    />
                  ) : (
                    <span
                      style={{ backgroundColor: t.avatarBg }}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold text-white"
                    >
                      {t.avatarInitials}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-[#1A1A1A] truncate">{t.name}</p>
                    <p className="text-[11px] text-[#5C5C5C] truncate">{t.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Quick Membership Summary */}
        <section className="lg:col-span-5 rounded-3xl border border-[#EAE0D2] bg-white p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg font-extrabold text-[#1A1A1A]">
                Эрхийн төлөв
              </h2>
              <SampleBadge variant="sample" />
            </div>
            <Link
              to="/admin/memberships"
              className="text-xs font-extrabold text-[#EB5E43] hover:underline"
            >
              Дэлгэрэнгүй →
            </Link>
          </div>

          <div className="space-y-2.5">
            {members.slice(0, 5).map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between gap-2 rounded-2xl bg-[#FDFBF7] border border-[#F0E8DC] px-3.5 py-2.5"
              >
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-[#1A1A1A] truncate">{m.fullName}</p>
                  <p className="text-[11px] text-[#5C5C5C]">
                    {m.plan} · {m.priceLabel}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold shrink-0 ${
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
            ))}
          </div>

          <Link
            to="/admin/memberships"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FAF4EA] py-2.5 text-xs font-extrabold text-[#25533E] hover:bg-[#FDE3C8]"
          >
            <BookOpen className="h-4 w-4" />
            <span>Бүх жишээ гишүүдийг харах</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      </div>
    </div>
  );
}
