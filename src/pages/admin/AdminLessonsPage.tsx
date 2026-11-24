import { Edit3, Eye, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SampleBadge } from '../../components/common/SampleBadge';
import { useAppStore } from '../../context/AppStoreContext';

export function AdminLessonsPage() {
  const { courses, lessons, setLessonStatus, deleteLesson } = useAppStore();
  const [query, setQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('Бүгд');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lessons.filter((l) => {
      if (courseFilter !== 'Бүгд' && l.courseId !== courseFilter) return false;
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      if (!q) return true;
      return (
        l.title.toLowerCase().includes(q) ||
        l.chineseTitle.toLowerCase().includes(q)
      );
    });
  }, [lessons, query, courseFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-[#1A1A1A]">
            Хичээлүүдийн жагсаалт
          </h1>
          <p className="mt-1 text-sm text-[#5C5C5C]">
            Нийт {lessons.length} хичээл ({lessons.filter((l) => l.status === 'published').length} нийтлэгдсэн · {lessons.filter((l) => l.status === 'draft').length} ноорог)
          </p>
        </div>

        <Link
          to="/admin/lessons/new"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#EB5E43] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#D44B31] shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Шинэ хичээл үүсгэх</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-3xl border border-[#EAE0D2] bg-white p-4 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 text-[#8E8578] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Хичээлийн нэр эсвэл ханзаар хайх..."
            className="w-full rounded-2xl border border-[#E5DDD0] bg-[#FDFBF7] pl-10 pr-4 py-2.5 text-sm"
          />
        </div>

        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          aria-label="Курсээр шүүх"
          className="rounded-2xl border border-[#E5DDD0] bg-[#FDFBF7] px-3.5 py-2.5 text-sm font-semibold"
        >
          <option value="Бүгд">Бүх курс</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>

        <div className="inline-flex rounded-2xl border border-[#E5DDD0] bg-[#FDFBF7] p-1">
          {[
            { id: 'all' as const, label: 'Бүгд' },
            { id: 'published' as const, label: 'Нийтлэгдсэн' },
            { id: 'draft' as const, label: 'Ноорог' },
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStatusFilter(s.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer ${
                statusFilter === s.id ? 'bg-[#25533E] text-white' : 'text-[#5C5C5C]'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive List */}
      <div className="space-y-3">
        {filtered.map((lesson) => {
          const course = courses.find((c) => c.id === lesson.courseId);

          return (
            <div
              key={lesson.id}
              className="rounded-3xl border border-[#EAE0D2] bg-white p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs"
            >
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                <img
                  src={lesson.thumbnailUrl}
                  alt={lesson.title}
                  className="h-16 w-24 shrink-0 rounded-2xl object-cover border border-[#EAE0D2]"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <SampleBadge variant={lesson.status === 'published' ? 'published' : 'draft'} />
                    {lesson.isFreePreview && <SampleBadge variant="free" />}
                    <span className="text-[11px] font-bold text-[#5C5C5C] truncate">
                      {course?.title}
                    </span>
                  </div>
                  <h2 className="mt-1 font-display text-base font-extrabold text-[#1A1A1A]">
                    {lesson.title}
                  </h2>
                  <p className="text-xs text-[#5C5C5C]">
                    <span className="font-hanzi font-bold text-[#25533E] mr-2">
                      {lesson.chineseTitle}
                    </span>
                    · {lesson.duration} · {lesson.hanziLines.length} ханз мөр · {lesson.attachments.length} хавсралт
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setLessonStatus(
                      lesson.id,
                      lesson.status === 'published' ? 'draft' : 'published'
                    )
                  }
                  className={`rounded-xl px-3.5 py-2 text-xs font-extrabold cursor-pointer ${
                    lesson.status === 'published'
                      ? 'bg-amber-100 text-amber-950 hover:bg-amber-200'
                      : 'bg-[#25533E] text-white hover:bg-[#1B3F2F]'
                  }`}
                >
                  {lesson.status === 'published' ? 'Ноорог болгох' : 'Нийтлэх'}
                </button>
                <Link
                  to={`/lessons/${lesson.id}`}
                  className="inline-flex items-center gap-1 rounded-xl border border-[#E5DDD0] bg-[#FDFBF7] px-3 py-2 text-xs font-bold text-[#25533E] hover:bg-[#FAF4EA]"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Харах</span>
                </Link>
                <Link
                  to={`/admin/lessons/${lesson.id}/edit`}
                  className="inline-flex items-center gap-1 rounded-xl border border-[#E5DDD0] bg-white px-3 py-2 text-xs font-bold text-[#1A1A1A] hover:bg-[#FAF4EA]"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Засах</span>
                </Link>
                <button
                  type="button"
                  onClick={() => deleteLesson(lesson.id)}
                  title="Устгах"
                  className="rounded-xl border border-red-200 bg-red-50 p-2 text-red-700 hover:bg-red-100 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-3xl border border-dashed border-[#D6CEC2] bg-white p-10 text-center text-sm text-[#5C5C5C]">
            Шүүлтүүрт тохирох хичээл олдсонгүй.
          </div>
        )}
      </div>
    </div>
  );
}
