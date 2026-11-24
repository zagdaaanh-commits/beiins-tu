import {
  ArrowRight,
  Award,
  Bookmark,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  Flame,
  GraduationCap,
  Play,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SampleBadge } from '../../components/common/SampleBadge';
import { SpeakChineseButton } from '../../components/common/SpeakChineseButton';
import { TonePinyin } from '../../components/common/TonePinyin';
import { useAppStore } from '../../context/AppStoreContext';

export function MyLearningPage() {
  const { courses, lessons, userProgress, toggleSaveVocab } = useAppStore();
  const [showPinyin, setShowPinyin] = useState(true);

  const publishedCourses = useMemo(
    () => courses.filter((c) => c.status === 'published'),
    [courses]
  );
  const publishedCourseIds = useMemo(
    () => new Set(publishedCourses.map((c) => c.id)),
    [publishedCourses]
  );
  const publishedLessons = useMemo(
    () => lessons.filter((l) => l.status === 'published' && publishedCourseIds.has(l.courseId)),
    [lessons, publishedCourseIds]
  );

  const completedPublishedCount = publishedLessons.filter((l) =>
    userProgress.completedLessonIds.includes(l.id)
  ).length;
  const overallPercent =
    publishedLessons.length > 0
      ? Math.round((completedPublishedCount / publishedLessons.length) * 100)
      : 0;

  const resumeLesson =
    publishedLessons.find((l) => l.id === userProgress.lastWatchedLessonId) ?? publishedLessons[0];

  const savedVocabItems = useMemo(() => {
    const allVocab = lessons.flatMap((l) =>
      l.vocabulary.map((v) => ({ ...v, lessonId: l.id, lessonTitle: l.title }))
    );
    return allVocab.filter((v) => userProgress.savedVocabIds.includes(v.id));
  }, [lessons, userProgress.savedVocabIds]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 sm:pt-10 space-y-10">
      {/* Prototype Learner Banner */}
      <section className="rounded-[28px] border border-[#EAE0D2] bg-[#FAF4EA] p-5 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#25533E] font-display text-xl font-black text-[#FDE3C8]">
            БА
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl sm:text-3xl font-black text-[#1A1A1A]">
                Б. Анужин
              </h1>
              <SampleBadge variant="sample" label="Жишээ суралцагч" />
            </div>
            <p className="mt-1 text-xs sm:text-sm text-[#5C5C5C]">
              Нэвтрэх систем холбогдоогүй UI прототип · Таны хийсэн өөрчлөлт хөтөч дээр хадгалагдана.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5DDD0] bg-white px-4 py-3 flex items-center justify-between md:justify-end gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#5C5C5C]">
              Одоогийн жишээ эрх
            </p>
            <p className="text-sm font-extrabold text-[#25533E]">
              {userProgress.activeDemoPlan} · <span className="font-medium text-[#5C5C5C]">{userProgress.demoPlanExpiry}</span>
            </p>
          </div>
          <Link
            to="/pricing"
            className="rounded-xl bg-[#EB5E43] px-3.5 py-2 text-xs font-extrabold text-white hover:bg-[#D44B31] shrink-0"
          >
            Багц харах
          </Link>
        </div>
      </section>

      {/* 4 Bento KPI Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl bg-[#FDE3C8] p-5 space-y-2">
          <div className="flex items-center justify-between">
            <GraduationCap className="h-5 w-5 text-[#EB5E43]" />
            <SampleBadge variant="sample" />
          </div>
          <p className="font-display text-3xl sm:text-4xl font-black text-[#1A1A1A]">
            {overallPercent}%
          </p>
          <p className="text-xs font-bold text-[#4A3B2C]">Нийт суралцсан явц</p>
        </div>

        <div className="rounded-3xl bg-[#25533E] p-5 text-white space-y-2">
          <div className="flex items-center justify-between">
            <CheckCircle2 className="h-5 w-5 text-[#FDE3C8]" />
            <span className="text-[11px] font-bold text-white/75">Амьд тоо</span>
          </div>
          <p className="font-display text-3xl sm:text-4xl font-black">
            {completedPublishedCount}
            <span className="text-lg font-bold text-white/70">/{publishedLessons.length}</span>
          </p>
          <p className="text-xs font-semibold text-white/85">Дуусгасан хичээл</p>
        </div>

        <div className="rounded-3xl border border-[#EAE0D2] bg-white p-5 space-y-2">
          <div className="flex items-center justify-between">
            <Flame className="h-5 w-5 text-[#EB5E43]" />
            <SampleBadge variant="sample" />
          </div>
          <p className="font-display text-3xl sm:text-4xl font-black text-[#1A1A1A]">
            {userProgress.streakDays} өдөр
          </p>
          <p className="text-xs font-bold text-[#5C5C5C]">Дараалсан цуврал</p>
        </div>

        <div className="rounded-3xl bg-[#222222] p-5 text-white space-y-2">
          <div className="flex items-center justify-between">
            <Bookmark className="h-5 w-5 text-[#FDE3C8]" />
            <span className="text-[11px] font-bold text-white/70">Сан</span>
          </div>
          <p className="font-display text-3xl sm:text-4xl font-black text-[#FDE3C8]">
            {savedVocabItems.length} үг
          </p>
          <p className="text-xs font-semibold text-white/80">Хадгалсан ханз</p>
        </div>
      </section>

      {/* Continue Watching & Course Progress */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-display text-xl font-black text-[#1A1A1A]">
            Үргэлжлүүлэн үзэх
          </h2>
          {resumeLesson ? (
            <div className="overflow-hidden rounded-3xl border border-[#EAE0D2] bg-white shadow-xs">
              <div className="relative aspect-video bg-[#FAF4EA]">
                <img
                  src={resumeLesson.thumbnailUrl}
                  alt={resumeLesson.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-black/75 px-3 py-1 text-xs font-bold text-white">
                  {userProgress.watchPercentByLesson[resumeLesson.id] ?? 0}% үзсэн
                </span>
              </div>
              <div className="p-5 space-y-3">
                <p className="font-hanzi text-base font-bold text-[#25533E]">
                  {resumeLesson.chineseTitle}
                </p>
                <h3 className="font-display text-lg font-extrabold text-[#1A1A1A]">
                  {resumeLesson.title}
                </h3>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#EFE7DB]">
                  <div
                    className="h-full rounded-full bg-[#EB5E43]"
                    style={{
                      width: `${userProgress.watchPercentByLesson[resumeLesson.id] ?? 15}%`,
                    }}
                  />
                </div>
                <Link
                  to={`/lessons/${resumeLesson.id}`}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#EB5E43] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#D44B31]"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>Хичээлээ үргэлжлүүлэх</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-[#EAE0D2] bg-white p-6 text-sm text-[#5C5C5C]">
              Одоогоор нийтлэгдсэн хичээл алга байна.
            </div>
          )}
        </div>

        {/* Per-course progress */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-black text-[#1A1A1A]">
              Миний курсийн явц
            </h2>
            <Link to="/lessons" className="text-xs font-extrabold text-[#EB5E43] hover:underline">
              Бүх хичээл →
            </Link>
          </div>

          <div className="space-y-3">
            {publishedCourses.map((course) => {
              const cLessons = publishedLessons.filter((l) => l.courseId === course.id);
              const cDone = cLessons.filter((l) =>
                userProgress.completedLessonIds.includes(l.id)
              ).length;
              const pct = cLessons.length > 0 ? Math.round((cDone / cLessons.length) * 100) : 0;

              return (
                <div
                  key={course.id}
                  className="rounded-3xl border border-[#EAE0D2] bg-white p-4 sm:p-5 space-y-3 shadow-xs"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[#FAF4EA] px-2.5 py-0.5 text-[11px] font-bold text-[#25533E]">
                          {course.level}
                        </span>
                        <span className="font-hanzi text-xs font-bold text-[#EB5E43]">
                          {course.chineseSubtitle}
                        </span>
                      </div>
                      <h3 className="mt-1 font-display text-base sm:text-lg font-extrabold text-[#1A1A1A]">
                        {course.title}
                      </h3>
                    </div>
                    <span className="font-display text-lg font-black text-[#25533E]">
                      {pct}%
                    </span>
                  </div>

                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#EFE7DB]">
                    <div
                      className="h-full rounded-full bg-[#25533E] transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#5C5C5C] font-semibold">
                    <span>
                      {cDone} / {cLessons.length} хичээл дууссан
                    </span>
                    <Link
                      to={`/lessons?level=${encodeURIComponent(course.level)}`}
                      className="inline-flex items-center gap-1 font-bold text-[#25533E] hover:text-[#EB5E43]"
                    >
                      <span>Курс рүү орох</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Saved Vocabulary Bank */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-[#1A1A1A] flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#EB5E43]" />
              <span>Хадгалсан ханз ба үгийн сан</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#5C5C5C]">
              Хичээл үзэх явцдаа “Хадгалах” дарсан үгс энд цугларна.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowPinyin((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E5DDD0] bg-white px-3.5 py-1.5 text-xs font-bold text-[#1A1A1A] cursor-pointer"
          >
            {showPinyin ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            <span>Пиньинь {showPinyin ? 'харуулах' : 'нуусан'}</span>
          </button>
        </div>

        {savedVocabItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#D6CEC2] bg-white p-8 text-center space-y-3">
            <Award className="h-8 w-8 text-[#EB5E43] mx-auto" />
            <p className="text-sm font-bold text-[#1A1A1A]">
              Та одоогоор ханз хадгалаагүй байна.
            </p>
            <Link
              to="/lessons/lesson-1"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#25533E] px-4 py-2 text-xs font-bold text-white"
            >
              Хичээл үзэж ханз хадгалах →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedVocabItems.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-[#EAE0D2] bg-white p-4 sm:p-5 flex flex-col justify-between shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-hanzi text-2xl font-bold text-[#1A1A1A]">
                        {item.hanzi}
                      </span>
                      {showPinyin && <TonePinyin text={item.pinyin} className="text-sm" />}
                    </div>
                    <p className="mt-1 text-sm font-bold text-[#25533E]">{item.mongolian}</p>
                    <p className="mt-0.5 text-[11px] text-[#5C5C5C]">
                      {item.partOfSpeech} · {item.strokes} зураас
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSaveVocab(item.id)}
                    aria-label="Хадгалсан үг устгах"
                    className="rounded-xl p-2 text-[#8E8578] hover:bg-red-50 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-[#F4EDE2] flex items-center justify-between gap-2">
                  <SpeakChineseButton text={item.hanzi} label="Сонсох" />
                  <Link
                    to={`/lessons/${item.lessonId}`}
                    className="text-[11px] font-bold text-[#EB5E43] truncate hover:underline"
                  >
                    Хичээл рүү →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
