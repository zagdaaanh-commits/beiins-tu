import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  Layers,
  Palette,
  Paperclip,
  Play,
  Type,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Modal } from '../../components/common/Modal';
import { SampleBadge } from '../../components/common/SampleBadge';
import { SpeakChineseButton } from '../../components/common/SpeakChineseButton';
import { TonePinyin } from '../../components/common/TonePinyin';
import { VideoPlayerMock } from '../../components/common/VideoPlayerMock';
import { useAppStore } from '../../context/AppStoreContext';
import type { Attachment } from '../../types';

type HanziSize = 'sm' | 'md' | 'lg';
type MobileTab = 'hanzi' | 'vocab' | 'attachments' | 'playlist';

export function LessonPlayerPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const {
    courses,
    lessons,
    userProgress,
    toggleLessonComplete,
    setLastWatchedLesson,
    toggleSaveVocab,
  } = useAppStore();

  const [showPinyin, setShowPinyin] = useState(true);
  const [colorizeTones, setColorizeTones] = useState(true);
  const [hanziSize, setHanziSize] = useState<HanziSize>('md');
  const [mobileTab, setMobileTab] = useState<MobileTab>('hanzi');
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);

  const lesson = lessons.find((l) => l.id === lessonId);
  const course = courses.find((c) => c.id === lesson?.courseId);

  const courseLessons = useMemo(() => {
    if (!lesson) return [];
    return lessons
      .filter((l) => l.courseId === lesson.courseId && (l.status === 'published' || l.id === lesson.id))
      .sort((a, b) => a.order - b.order);
  }, [lesson, lessons]);

  const currentIndex = courseLessons.findIndex((l) => l.id === lesson?.id);
  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < courseLessons.length - 1
      ? courseLessons[currentIndex + 1]
      : null;

  useEffect(() => {
    if (lesson && lesson.status === 'published') {
      setLastWatchedLesson(lesson.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id]);

  const handleWatchProgress = useCallback(
    (percent: number) => {
      if (lesson) {
        setLastWatchedLesson(lesson.id, percent);
      }
    },
    [lesson, setLastWatchedLesson]
  );

  if (!lesson) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
        <h1 className="font-display text-2xl font-black text-[#1A1A1A]">
          Хичээл олдсонгүй
        </h1>
        <p className="text-sm text-[#5C5C5C]">
          Таны хайсан хичээл устгагдсан эсвэл хаяг буруу байна.
        </p>
        <Link
          to="/lessons"
          className="inline-flex items-center gap-2 rounded-2xl bg-[#EB5E43] px-5 py-3 text-sm font-extrabold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Хичээлийн сан руу буцах</span>
        </Link>
      </div>
    );
  }

  const isCompleted = userProgress.completedLessonIds.includes(lesson.id);
  const hanziSizeClass =
    hanziSize === 'lg'
      ? 'text-3xl sm:text-4xl'
      : hanziSize === 'sm'
        ? 'text-xl sm:text-2xl'
        : 'text-2xl sm:text-3xl';

  const playlistPanel = (
    <div className="rounded-3xl border border-[#EAE0D2] bg-white p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between gap-2 border-b border-[#F0E8DC] pb-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#25533E]">
            Хичээлийн жагсаалт
          </p>
          <h3 className="font-display text-base font-extrabold text-[#1A1A1A] line-clamp-1">
            {course?.title ?? 'Курс'}
          </h3>
        </div>
        <span className="rounded-full bg-[#FAF4EA] px-2.5 py-1 text-xs font-bold text-[#1A1A1A]">
          {courseLessons.length} хичээл
        </span>
      </div>

      <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
        {courseLessons.map((item) => {
          const active = item.id === lesson.id;
          const done = userProgress.completedLessonIds.includes(item.id);
          return (
            <Link
              key={item.id}
              to={`/lessons/${item.id}`}
              className={`flex items-center gap-3 rounded-2xl p-3 transition border ${
                active
                  ? 'border-[#EB5E43] bg-[#FDE3C8]/50'
                  : 'border-transparent bg-[#FDFBF7] hover:border-[#EAE0D2] hover:bg-white'
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                  done
                    ? 'bg-[#25533E] text-white'
                    : active
                      ? 'bg-[#EB5E43] text-white'
                      : 'bg-[#EAE0D2]/70 text-[#1A1A1A]'
                }`}
              >
                {done ? <CheckCircle2 className="h-4 w-4" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-hanzi text-xs font-bold text-[#25533E] truncate">
                  {item.chineseTitle}
                </p>
                <p className="text-xs font-bold text-[#1A1A1A] truncate">
                  {item.title}
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#5C5C5C] shrink-0">
                {item.duration}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-5 sm:pt-8 space-y-6">
      {/* Draft Preview Notice if opened from Admin */}
      {lesson.status === 'draft' && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs sm:text-sm text-amber-950">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              <strong>Ноорог урьдчилан харах горим:</strong> Энэ хичээл одоогоор “Ноорог” төлөвтэй тул энгийн хэрэглэгчийн санд харагдахгүй.
            </span>
          </div>
          <Link
            to={`/admin/lessons/${lesson.id}/edit`}
            className="rounded-xl bg-amber-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-800"
          >
            Админ засвар руу буцах
          </Link>
        </div>
      )}

      {/* Breadcrumb & Completion Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <Link
            to="/lessons"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#25533E] hover:text-[#EB5E43]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Хичээлийн сан руу буцах</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-hanzi text-base sm:text-lg font-bold text-[#EB5E43]">
              {lesson.chineseTitle}
            </span>
            <SampleBadge variant="sample" />
            {lesson.isFreePreview && <SampleBadge variant="free" />}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-[#1A1A1A]">
            {lesson.title}
          </h1>
        </div>

        <button
          type="button"
          onClick={() => toggleLessonComplete(lesson.id)}
          className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-extrabold transition cursor-pointer shrink-0 ${
            isCompleted
              ? 'bg-[#25533E] text-white shadow-sm hover:bg-[#1B3F2F]'
              : 'border-2 border-[#25533E] bg-white text-[#25533E] hover:bg-[#FAF4EA]'
          }`}
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>{isCompleted ? 'Хичээл дууссан ✓' : 'Хичээл дуусгалаа'}</span>
        </button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Video Player + Interactive Hanzi/Pinyin/Mongolian Content */}
        <div className="lg:col-span-8 space-y-6">
          <VideoPlayerMock
            title={lesson.title}
            chineseTitle={lesson.chineseTitle}
            thumbnailUrl={lesson.thumbnailUrl}
            videoUrl={lesson.videoUrl}
            durationLabel={lesson.duration}
            durationSec={lesson.durationSec}
            hanziLines={lesson.hanziLines}
            showPinyin={showPinyin}
            colorizeTones={colorizeTones}
            onProgressUpdate={handleWatchProgress}
          />

          {/* Mobile Section Tabs */}
          <div className="lg:hidden grid grid-cols-4 gap-1.5 rounded-2xl bg-[#FAF4EA] p-1.5 border border-[#EAE0D2]">
            {[
              { id: 'hanzi' as const, label: 'Ханз & Тайлбар' },
              { id: 'vocab' as const, label: `Үгийн сан (${lesson.vocabulary.length})` },
              { id: 'attachments' as const, label: `Хавсралт (${lesson.attachments.length})` },
              { id: 'playlist' as const, label: 'Жагсаалт' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMobileTab(tab.id)}
                className={`rounded-xl py-2 px-1 text-[11px] font-bold transition cursor-pointer ${
                  mobileTab === tab.id ? 'bg-[#25533E] text-white' : 'text-[#5C5C5C]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Mobile Playlist View */}
          {mobileTab === 'playlist' && <div className="lg:hidden">{playlistPanel}</div>}

          {/* Hanzi + Pinyin + Mongolian Breakdown Section */}
          <section
            className={`space-y-4 ${mobileTab !== 'hanzi' ? 'hidden lg:block' : 'block'}`}
          >
            {/* Interactive Typography & Learning Controls */}
            <div className="rounded-3xl border border-[#EAE0D2] bg-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-extrabold text-[#1A1A1A]">
                  Ханз, Пиньинь ба Монгол тайлбар
                </h2>
                <p className="text-xs text-[#5C5C5C]">
                  {lesson.summary}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinyin((v) => !v)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border cursor-pointer transition ${
                    showPinyin
                      ? 'border-[#25533E] bg-[#25533E] text-white'
                      : 'border-[#E5DDD0] bg-[#FDFBF7] text-[#1A1A1A]'
                  }`}
                >
                  {showPinyin ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  <span>Пиньинь {showPinyin ? 'асаалттай' : 'нуусан'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setColorizeTones((v) => !v)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border cursor-pointer transition ${
                    colorizeTones
                      ? 'border-[#EB5E43] bg-[#EB5E43]/10 text-[#EB5E43]'
                      : 'border-[#E5DDD0] bg-[#FDFBF7] text-[#5C5C5C]'
                  }`}
                >
                  <Palette className="h-3.5 w-3.5" />
                  <span>4 өнгө</span>
                </button>

                <div className="inline-flex items-center gap-1 rounded-full border border-[#E5DDD0] bg-[#FAF4EA] p-0.5">
                  <Type className="h-3.5 w-3.5 text-[#5C5C5C] ml-2" />
                  {(
                    [
                      { id: 'sm', label: 'Жижиг' },
                      { id: 'md', label: 'Дунд' },
                      { id: 'lg', label: 'Том' },
                    ] as const
                  ).map((sz) => (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => setHanziSize(sz.id)}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold cursor-pointer ${
                        hanziSize === sz.id
                          ? 'bg-white text-[#1A1A1A] shadow-xs'
                          : 'text-[#5C5C5C]'
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tone Legend */}
            {showPinyin && colorizeTones && (
              <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-[#FAF4EA] px-4 py-2 text-[11px] font-bold">
                <span className="text-[#5C5C5C]">Өнгөний тэмдэг:</span>
                <span className="tone-1">1-р өнгө (mā)</span>
                <span className="tone-2">2-р өнгө (má)</span>
                <span className="tone-3">3-р өнгө (mǎ)</span>
                <span className="tone-4">4-р өнгө (mà)</span>
                <span className="tone-0">Хөнгөн (ma)</span>
              </div>
            )}

            {/* Hanzi Sentence Breakdown Cards */}
            <div className="space-y-3">
              {lesson.hanziLines.map((line, idx) => (
                <article
                  key={line.id}
                  className="rounded-3xl border border-[#EAE0D2] bg-white p-5 sm:p-6 shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 text-xs font-extrabold text-[#25533E]">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FDE3C8] text-[#1A1A1A]">
                        {idx + 1}
                      </span>
                      {line.speaker && <span>{line.speaker}</span>}
                    </span>
                    <SpeakChineseButton text={line.hanzi} label="Дуудлага сонсох" />
                  </div>

                  {/* Hanzi + Pinyin + Mongolian */}
                  <div className="space-y-1.5">
                    <p className={`font-hanzi font-bold text-[#1A1A1A] leading-snug ${hanziSizeClass}`}>
                      {line.hanzi}
                    </p>
                    {showPinyin && (
                      <p className="text-base sm:text-lg">
                        <TonePinyin text={line.pinyin} colorize={colorizeTones} />
                      </p>
                    )}
                    <p className="text-sm sm:text-base font-bold text-[#25533E]">
                      {line.mongolian}
                    </p>
                  </div>

                  {/* Literal Breakdown Pills */}
                  {line.literalBreakdown && line.literalBreakdown.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {line.literalBreakdown.map((tok, tIdx) => (
                        <div
                          key={tIdx}
                          className="rounded-xl border border-[#EFE6DA] bg-[#FDFBF7] px-2.5 py-1.5 text-center"
                        >
                          <p className="font-hanzi text-sm font-bold text-[#1A1A1A]">
                            {tok.hanzi}
                          </p>
                          {showPinyin && (
                            <p className="text-[11px]">
                              <TonePinyin text={tok.pinyin} colorize={colorizeTones} />
                            </p>
                          )}
                          <p className="text-[11px] font-medium text-[#5C5C5C]">
                            {tok.meaning}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Mongolian Grammar Note */}
                  {line.grammarNote && (
                    <div className="rounded-2xl bg-[#FAF4EA] px-3.5 py-2.5 text-xs text-[#3F3F3F] leading-relaxed border-l-4 border-[#EB5E43]">
                      <strong className="text-[#1A1A1A]">Монгол тайлбар: </strong>
                      {line.grammarNote}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>

          {/* Vocabulary Grid */}
          <section
            className={`space-y-3 ${mobileTab !== 'vocab' ? 'hidden lg:block' : 'block'}`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#1A1A1A] flex items-center gap-2">
                <Layers className="h-5 w-5 text-[#EB5E43]" />
                <span>Шинэ ханз ба үгийн сан ({lesson.vocabulary.length})</span>
              </h2>
            </div>

            {lesson.vocabulary.length === 0 ? (
              <p className="rounded-2xl border border-[#EAE0D2] bg-white p-4 text-sm text-[#5C5C5C]">
                Энэ хичээлд нэмэлт үгийн сан бүртгээгүй байна.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lesson.vocabulary.map((vocab) => {
                  const saved = userProgress.savedVocabIds.includes(vocab.id);
                  return (
                    <div
                      key={vocab.id}
                      className="rounded-3xl border border-[#EAE0D2] bg-white p-4 flex flex-col justify-between shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-baseline gap-2.5">
                            <span className="font-hanzi text-2xl font-bold text-[#1A1A1A]">
                              {vocab.hanzi}
                            </span>
                            {showPinyin && (
                              <TonePinyin text={vocab.pinyin} colorize={colorizeTones} className="text-sm" />
                            )}
                          </div>
                          <p className="mt-1 text-sm font-bold text-[#25533E]">
                            {vocab.mongolian}
                          </p>
                          <p className="mt-0.5 text-[11px] text-[#5C5C5C]">
                            {vocab.partOfSpeech} · {vocab.strokes} зураас
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleSaveVocab(vocab.id)}
                          className={`rounded-xl px-2.5 py-1.5 text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition ${
                            saved
                              ? 'bg-[#25533E] text-white'
                              : 'bg-[#FAF4EA] text-[#1A1A1A] hover:bg-[#FDE3C8]'
                          }`}
                        >
                          {saved ? (
                            <>
                              <BookmarkCheck className="h-3.5 w-3.5" />
                              <span>Хадгалсан</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="h-3.5 w-3.5" />
                              <span>Хадгалах</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-[#F4EDE2]">
                        <SpeakChineseButton text={vocab.hanzi} label="Сонсох" />
                        {vocab.exampleHanzi && (
                          <span className="font-hanzi text-xs text-[#5C5C5C] truncate ml-2">
                            {vocab.exampleHanzi}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Attachments */}
          <section
            className={`space-y-3 ${mobileTab !== 'attachments' ? 'hidden lg:block' : 'block'}`}
          >
            <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#1A1A1A] flex items-center gap-2">
              <Paperclip className="h-5 w-5 text-[#25533E]" />
              <span>Хавсралт материал ({lesson.attachments.length})</span>
            </h2>

            {lesson.attachments.length === 0 ? (
              <p className="rounded-2xl border border-[#EAE0D2] bg-white p-4 text-sm text-[#5C5C5C]">
                Энэ хичээлд хавсралт материал одоогоор нэмээгүй байна.
              </p>
            ) : (
              <div className="space-y-2.5">
                {lesson.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="rounded-2xl border border-[#EAE0D2] bg-white p-4 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FDE3C8] text-[#EB5E43]">
                        <FileText className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-[#1A1A1A] truncate">
                          {att.title}
                        </p>
                        <p className="text-xs text-[#5C5C5C]">
                          {att.type} · {att.sizeLabel}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewAttachment(att)}
                      className="rounded-xl bg-[#FAF4EA] px-3.5 py-2 text-xs font-bold text-[#25533E] hover:bg-[#25533E] hover:text-white transition cursor-pointer"
                    >
                      Харах (Прототип)
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Previous / Next Lesson Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#EAE0D2]">
            {prevLesson ? (
              <Link
                to={`/lessons/${prevLesson.id}`}
                className="inline-flex items-center gap-2 rounded-2xl border border-[#E5DDD0] bg-white px-4 py-3 text-xs sm:text-sm font-bold text-[#1A1A1A] hover:bg-[#FAF4EA]"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="truncate max-w-[200px]">{prevLesson.title}</span>
              </Link>
            ) : (
              <div />
            )}
            {nextLesson && (
              <Link
                to={`/lessons/${nextLesson.id}`}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#EB5E43] px-5 py-3 text-xs sm:text-sm font-extrabold text-white hover:bg-[#D44B31]"
              >
                <span className="truncate max-w-[200px]">Дараах: {nextLesson.title}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Right Desktop Playlist Sidebar */}
        <aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-24">
          {playlistPanel}
        </aside>
      </div>

      {/* Attachment Preview Modal */}
      <Modal
        open={!!previewAttachment}
        onClose={() => setPreviewAttachment(null)}
        title={previewAttachment?.title ?? 'Хавсралт материал'}
      >
        {previewAttachment && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <SampleBadge variant="sample" label="Жишээ хавсралт" />
              <span className="text-xs font-bold text-[#25533E]">
                {previewAttachment.type} · {previewAttachment.sizeLabel}
              </span>
            </div>
            <div className="rounded-2xl border border-[#EAE0D2] bg-white p-5 space-y-2">
              <p className="text-sm font-bold text-[#1A1A1A]">Материалын агуулга:</p>
              <p className="text-sm text-[#5C5C5C] leading-relaxed">
                {previewAttachment.previewNote ||
                  'Энэхүү жишээ хавсралт нь суралцагчийн дасгал, ханз бичих хуудас эсвэл аудио файл татах хэсгийг харуулна.'}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewAttachment(null)}
                className="rounded-xl bg-[#25533E] px-5 py-2.5 text-sm font-bold text-white cursor-pointer"
              >
                Ойлголоо
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
