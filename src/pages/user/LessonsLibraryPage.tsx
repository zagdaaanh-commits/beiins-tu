import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  LayoutGrid,
  ListTree,
  Play,
  Search,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SampleBadge } from '../../components/common/SampleBadge';
import { useAppStore } from '../../context/AppStoreContext';
import type { CourseLevel } from '../../types';

const LEVEL_FILTERS: Array<'Бүгд' | CourseLevel> = [
  'Бүгд',
  'Анхан шат',
  'Дунд шат',
  'Ахисан шат',
];

export function LessonsLibraryPage() {
  const [searchParams] = useSearchParams();
  const initialLevelParam = searchParams.get('level');

  const { courses, lessons, userProgress } = useAppStore();
  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>(initialLevelParam || 'Бүгд');
  const [viewMode, setViewMode] = useState<'courses' | 'grid'>('courses');
  const [collapsedCourses, setCollapsedCourses] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialLevelParam) {
      setLevelFilter(initialLevelParam);
    }
  }, [initialLevelParam]);

  const publishedCourses = useMemo(
    () => courses.filter((c) => c.status === 'published'),
    [courses]
  );

  const publishedCourseMap = useMemo(
    () => new Map(publishedCourses.map((c) => [c.id, c])),
    [publishedCourses]
  );

  const filteredLessons = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lessons.filter((lesson) => {
      if (lesson.status !== 'published') return false;
      const course = publishedCourseMap.get(lesson.courseId);
      if (!course) return false;

      if (levelFilter !== 'Бүгд' && course.level !== levelFilter) return false;

      if (!q) return true;
      const inTitle = lesson.title.toLowerCase().includes(q);
      const inChinese = lesson.chineseTitle.toLowerCase().includes(q);
      const inSummary = lesson.summary.toLowerCase().includes(q);
      const inCourse = course.title.toLowerCase().includes(q);
      const inHanziLines = lesson.hanziLines.some(
        (h) =>
          h.hanzi.toLowerCase().includes(q) ||
          h.pinyin.toLowerCase().includes(q) ||
          h.mongolian.toLowerCase().includes(q)
      );
      return inTitle || inChinese || inSummary || inCourse || inHanziLines;
    });
  }, [lessons, publishedCourseMap, levelFilter, query]);

  const lastWatchedLesson = useMemo(
    () =>
      lessons.find(
        (l) =>
          l.id === userProgress.lastWatchedLessonId &&
          l.status === 'published' &&
          publishedCourseMap.has(l.courseId)
      ) ?? lessons.find((l) => l.status === 'published' && publishedCourseMap.has(l.courseId)),
    [lessons, userProgress.lastWatchedLessonId, publishedCourseMap]
  );

  const toggleCourseFold = (courseId: string) => {
    setCollapsedCourses((prev) => ({ ...prev, [courseId]: !prev[courseId] }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 sm:pt-10 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#EB5E43]">
            Хичээлийн сан
          </span>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-black text-[#1A1A1A]">
            Хичээлийн сан
          </h1>
          <p className="mt-1 text-sm text-[#5C5C5C]">
            Түвшингээр ангилсан {filteredLessons.length} хичээл.
          </p>
        </div>

        {/* View Toggle */}
        <div className="inline-flex rounded-2xl border border-[#E5DDD0] bg-white p-1 self-start">
          <button
            type="button"
            onClick={() => setViewMode('courses')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold cursor-pointer transition ${
              viewMode === 'courses' ? 'bg-[#25533E] text-white' : 'text-[#5C5C5C] hover:text-[#1A1A1A]'
            }`}
          >
            <ListTree className="h-4 w-4" />
            <span>Курсээр харах</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold cursor-pointer transition ${
              viewMode === 'grid' ? 'bg-[#25533E] text-white' : 'text-[#5C5C5C] hover:text-[#1A1A1A]'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span>Картаар харах</span>
          </button>
        </div>
      </div>

      {/* Continue Watching Bar */}
      {lastWatchedLesson && (
        <div className="rounded-3xl border border-[#F3D5C9] bg-[#FDE3C8]/65 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="hidden sm:flex h-14 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#E6C6A4] bg-white">
              <img
                src={lastWatchedLesson.thumbnailUrl}
                alt={lastWatchedLesson.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#EB5E43]">
                Үргэлжлүүлэн үзэх · {userProgress.watchPercentByLesson[lastWatchedLesson.id] ?? 0}% үзсэн
              </p>
              <h2 className="font-display text-base sm:text-lg font-extrabold text-[#1A1A1A] truncate">
                {lastWatchedLesson.title}
              </h2>
              <p className="font-hanzi text-xs sm:text-sm font-bold text-[#25533E] truncate">
                {lastWatchedLesson.chineseTitle}
              </p>
            </div>
          </div>
          <Link
            to={`/lessons/${lastWatchedLesson.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#EB5E43] px-5 py-3 text-sm font-extrabold text-white shadow-xs hover:bg-[#D44B31] shrink-0"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>Үргэлжлүүлэх</span>
          </Link>
        </div>
      )}

      {/* Clean Search + 4 Level Pills */}
      <div className="rounded-3xl border border-[#EAE0D2] bg-white p-4 sm:p-5 space-y-4 shadow-xs">
        <div className="relative">
          <Search className="h-4 w-4 text-[#8E8578] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Монгол нэр, ханз (你好) эсвэл пиньинээр (duō shao) хайх..."
            className="w-full rounded-2xl border border-[#E5DDD0] bg-[#FDFBF7] pl-10 pr-4 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#8E8578] focus:border-[#25533E] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {LEVEL_FILTERS.map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setLevelFilter(lvl)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                levelFilter === lvl
                  ? 'bg-[#EB5E43] text-white'
                  : 'bg-[#FAF4EA] text-[#5C5C5C] hover:bg-[#FDE3C8] hover:text-[#1A1A1A]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredLessons.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#D6CEC2] bg-white p-10 text-center space-y-3">
          <BookOpen className="h-10 w-10 text-[#EB5E43] mx-auto" />
          <h3 className="font-display text-lg font-extrabold text-[#1A1A1A]">
            Тохирох хичээл олдсонгүй
          </h3>
          <p className="text-sm text-[#5C5C5C]">
            Хайлтын үг эсвэл түвшний шүүлтүүрээ өөрчлөөд дахин оролдоно уу.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setLevelFilter('Бүгд');
            }}
            className="rounded-xl bg-[#25533E] px-4 py-2 text-xs font-bold text-white cursor-pointer"
          >
            Шүүлтүүр цэвэрлэх
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLessons.map((lesson) => {
            const course = publishedCourseMap.get(lesson.courseId);
            const isCompleted = userProgress.completedLessonIds.includes(lesson.id);
            return (
              <Link
                key={lesson.id}
                to={`/lessons/${lesson.id}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-[#EAE0D2] bg-white shadow-xs transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-video bg-[#FAF4EA] overflow-hidden">
                  <img
                    src={lesson.thumbnailUrl}
                    alt={lesson.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {lesson.isFreePreview && <SampleBadge variant="free" />}
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#25533E] px-2.5 py-0.5 text-[11px] font-bold text-white">
                        <CheckCircle2 className="h-3 w-3" /> Дууссан
                      </span>
                    )}
                  </div>
                  <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                    <Clock className="h-3 w-3" /> {lesson.duration}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <span className="text-[11px] font-bold text-[#EB5E43]">
                      {course?.level}
                    </span>
                    <p className="mt-1 font-hanzi text-base font-bold text-[#25533E]">
                      {lesson.chineseTitle}
                    </p>
                    <h3 className="mt-1 font-display text-base font-extrabold text-[#1A1A1A] group-hover:text-[#EB5E43]">
                      {lesson.title}
                    </h3>
                    <p className="mt-2 text-xs text-[#5C5C5C] line-clamp-2 leading-relaxed">
                      {lesson.summary}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#F4EDE2] flex items-center justify-between text-xs font-bold">
                    <span className="text-[#5C5C5C]">
                      {lesson.hanziLines.length} өгүүлбэр · {lesson.attachments.length} хавсралт
                    </span>
                    <span className="text-[#EB5E43]">Үзэх →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* Course Grouped View (Directly Course -> Lessons, no Chapters) */
        <div className="space-y-6">
          {publishedCourses.map((course) => {
            const courseLessons = filteredLessons
              .filter((l) => l.courseId === course.id)
              .sort((a, b) => a.order - b.order);
            if (courseLessons.length === 0) return null;

            const isCollapsed = !!collapsedCourses[course.id];
            const completedInCourse = courseLessons.filter((l) =>
              userProgress.completedLessonIds.includes(l.id)
            ).length;

            return (
              <section
                key={course.id}
                className="overflow-hidden rounded-3xl border border-[#EAE0D2] bg-white shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleCourseFold(course.id)}
                  className="w-full text-left bg-[#FAF4EA] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#F7EFE2] transition"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="h-16 w-24 shrink-0 rounded-2xl object-cover border border-[#E5DDD0]"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#25533E] px-2.5 py-0.5 text-[11px] font-bold text-white">
                          {course.level}
                        </span>
                        <span className="font-hanzi text-xs sm:text-sm font-bold text-[#EB5E43]">
                          {course.chineseSubtitle}
                        </span>
                      </div>
                      <h2 className="mt-1 font-display text-lg sm:text-xl font-black text-[#1A1A1A]">
                        {course.title}
                      </h2>
                      <p className="mt-1 text-xs text-[#5C5C5C]">
                        {course.instructorName} · {completedInCourse}/{courseLessons.length} хичээл дууссан
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center text-xs font-bold text-[#25533E]">
                    <span>{isCollapsed ? 'Дэлгэх' : 'Хураах'}</span>
                    {isCollapsed ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
                  </div>
                </button>

                {!isCollapsed && (
                  <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {courseLessons.map((lesson) => {
                      const isCompleted = userProgress.completedLessonIds.includes(lesson.id);
                      return (
                        <Link
                          key={lesson.id}
                          to={`/lessons/${lesson.id}`}
                          className="group flex items-center justify-between gap-3 rounded-2xl border border-[#EAE0D2] bg-[#FDFBF7] p-3.5 transition hover:border-[#EB5E43] hover:bg-white"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-sm ${
                                isCompleted
                                  ? 'bg-[#25533E] text-white'
                                  : 'bg-[#FDE3C8] text-[#1A1A1A] group-hover:bg-[#EB5E43] group-hover:text-white'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="h-5 w-5" />
                              ) : (
                                <Play className="h-4 w-4 ml-0.5" />
                              )}
                            </span>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-hanzi text-xs font-bold text-[#25533E]">
                                  {lesson.chineseTitle}
                                </span>
                                {lesson.isFreePreview && <SampleBadge variant="free" />}
                              </div>
                              <p className="text-sm font-extrabold text-[#1A1A1A] truncate group-hover:text-[#EB5E43]">
                                {lesson.title}
                              </p>
                              <p className="text-[11px] text-[#5C5C5C]">
                                {lesson.duration} · {lesson.hanziLines.length} өгүүлбэр · {lesson.vocabulary.length} шинэ үг
                              </p>
                            </div>
                          </div>
                          <span className="shrink-0 text-xs font-extrabold text-[#EB5E43]">
                            Үзэх →
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
