import {
  ArrowLeft,
  Eye,
  FilePlus2,
  ImagePlus,
  Plus,
  Save,
  Send,
  Trash2,
  Video,
} from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SampleBadge } from '../../components/common/SampleBadge';
import { TonePinyin } from '../../components/common/TonePinyin';
import { useAppStore } from '../../context/AppStoreContext';
import { BRAND_IMAGES } from '../../data/mockData';
import type {
  Attachment,
  AttachmentType,
  HanziLine,
  PublishStatus,
  VocabItem,
} from '../../types';

const SAMPLE_VIDEO_PRESETS = [
  { label: 'Жишээ: 4 өнгө & Пиньинь видео', value: 'demo://tones-pinyin' },
  { label: 'Жишээ: Харилцан ярианы видео', value: 'demo://greetings' },
  { label: 'Жишээ: HSK шалгалтын тайлбар видео', value: 'demo://hsk-grammar' },
];

const PRESET_THUMBS = [
  { label: 'Анхан шат', url: BRAND_IMAGES.courseBeginner },
  { label: 'Дунд шат', url: BRAND_IMAGES.courseIntermediate },
  { label: 'HSK бэлтгэл', url: BRAND_IMAGES.courseHsk },
];

export function AdminLessonEditorPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { courses, lessons, saveLesson, showToast } = useAppStore();

  const existing = lessons.find((l) => l.id === lessonId);
  const isEditing = Boolean(existing);

  const [courseId, setCourseId] = useState(existing?.courseId ?? courses[0]?.id ?? 'course-1');

  const [title, setTitle] = useState(existing?.title ?? '');
  const [chineseTitle, setChineseTitle] = useState(existing?.chineseTitle ?? '');
  const [duration, setDuration] = useState(existing?.duration ?? '12:00');
  const [isFreePreview, setIsFreePreview] = useState<boolean>(existing?.isFreePreview ?? false);
  const [summary, setSummary] = useState(existing?.summary ?? '');
  const [thumbnailUrl, setThumbnailUrl] = useState(
    existing?.thumbnailUrl ?? BRAND_IMAGES.courseBeginner
  );
  const [videoUrl, setVideoUrl] = useState(existing?.videoUrl ?? 'demo://greetings');

  const [hanziLines, setHanziLines] = useState<HanziLine[]>(
    existing?.hanziLines ?? [
      {
        id: `hl-${Date.now()}`,
        speaker: 'Жишээ',
        hanzi: '你好，欢迎学习汉语！',
        pinyin: 'Nǐ hǎo, huān yíng xué xí Hàn yǔ!',
        mongolian: 'Сайн байна уу, хятад хэл сурахад тавтай морил!',
        grammarNote: 'Энд дүрмийн болон соёлын тайлбар бичнэ.',
      },
    ]
  );

  const [vocabulary, setVocabulary] = useState<VocabItem[]>(
    existing?.vocabulary ?? [
      {
        id: `voc-${Date.now()}`,
        hanzi: '学习',
        pinyin: 'xué xí',
        mongolian: 'Суралцах',
        partOfSpeech: 'Үйл үг',
        strokes: 11,
      },
    ]
  );

  const [attachments, setAttachments] = useState<Attachment[]>(existing?.attachments ?? []);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setThumbnailUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    setVideoUrl(blobUrl);
    showToast(`Локал видео файл урьдчилан харахад бэлтгэгдлээ: ${file.name}`, 'info');
  };

  const handleAttachmentFileMock = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    setAttachments((prev) => [
      ...prev,
      {
        id: `att-${Date.now()}`,
        title: file.name,
        type: file.name.endsWith('.mp3') ? 'Аудио' : 'PDF',
        sizeLabel: `${sizeMb} MB (Прототип)`,
        url: '#uploaded-mock',
        previewNote: `Админаас хавсаргасан файл: ${file.name}`,
      },
    ]);
  };

  const handleAddHanziLine = () => {
    setHanziLines((prev) => [
      ...prev,
      {
        id: `hl-${Date.now()}-${prev.length}`,
        speaker: `Өгүүлбэр ${prev.length + 1}`,
        hanzi: '',
        pinyin: '',
        mongolian: '',
        grammarNote: '',
      },
    ]);
  };

  const handleAddVocab = () => {
    setVocabulary((prev) => [
      ...prev,
      {
        id: `voc-${Date.now()}-${prev.length}`,
        hanzi: '',
        pinyin: '',
        mongolian: '',
        partOfSpeech: 'Нэр үг',
        strokes: 8,
      },
    ]);
  };

  const handleAddEmptyAttachment = () => {
    setAttachments((prev) => [
      ...prev,
      {
        id: `att-${Date.now()}-${prev.length}`,
        title: 'Шинэ дасгалын хуудас.pdf',
        type: 'PDF',
        sizeLabel: '1.0 MB (Жишээ)',
        url: '#sample-file',
        previewNote: 'Дасгалын тайлбар.',
      },
    ]);
  };

  const handleSave = (targetStatus: PublishStatus) => {
    if (!title.trim()) {
      showToast('Хичээлийн монгол гарчгийг оруулна уу.', 'warning');
      return;
    }
    const order =
      existing?.order ?? lessons.filter((l) => l.courseId === courseId).length + 1;

    const saved = saveLesson({
      id: existing?.id,
      courseId,
      order,
      title: title.trim(),
      chineseTitle: chineseTitle.trim() || '新课程',
      duration: duration.trim() || '12:00',
      durationSec: existing?.durationSec ?? 720,
      isFreePreview,
      status: targetStatus,
      thumbnailUrl: thumbnailUrl.trim() || BRAND_IMAGES.courseBeginner,
      videoUrl: videoUrl.trim() || 'demo://greetings',
      summary: summary.trim() || 'Хичээлийн тайлбар.',
      hanziLines: hanziLines.filter((h) => h.hanzi.trim() || h.mongolian.trim()),
      vocabulary: vocabulary.filter((v) => v.hanzi.trim() || v.mongolian.trim()),
      attachments,
    });

    navigate(`/admin/lessons/${saved.id}/edit`, { replace: true });
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE0D2] pb-4">
        <div>
          <Link
            to="/admin/lessons"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#25533E] hover:text-[#EB5E43]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Хичээлийн жагсаалт руу буцах</span>
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-black text-[#1A1A1A]">
              {isEditing ? 'Хичээл засах' : 'Шинэ хичээл үүсгэх'}
            </h1>
            {existing && (
              <SampleBadge variant={existing.status === 'published' ? 'published' : 'draft'} />
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {existing && (
            <Link
              to={`/lessons/${existing.id}`}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-[#E5DDD0] bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-[#25533E] hover:bg-[#FAF4EA]"
            >
              <Eye className="h-4 w-4" />
              <span>Урьдчилан харах</span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => handleSave('draft')}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-amber-300 bg-amber-100 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-amber-950 hover:bg-amber-200 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Ноорог хадгалах</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave('published')}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-[#25533E] px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white hover:bg-[#1B3F2F] cursor-pointer"
          >
            <Send className="h-4 w-4" />
            <span>Нийтлэх</span>
          </button>
        </div>
      </div>

      {/* Main Editor + Live Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 space-y-6">
          {/* Basic Info */}
          <section className="rounded-3xl border border-[#EAE0D2] bg-white p-5 sm:p-6 space-y-4 shadow-xs">
            <h2 className="font-display text-lg font-extrabold text-[#1A1A1A]">
              1. Үндсэн мэдээлэл
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Курс *</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full rounded-xl border border-[#E5DDD0] bg-[#FDFBF7] px-3.5 py-2.5 text-sm font-semibold"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.level} — {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  Үргэлжлэх хугацаа
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="14:30"
                  className="w-full rounded-xl border border-[#E5DDD0] bg-[#FDFBF7] px-3.5 py-2.5 text-sm"
                />
              </div>
              <label className="flex items-center gap-2.5 rounded-xl border border-[#E5DDD0] bg-[#FAF4EA] px-3.5 py-2.5 text-xs font-bold text-[#1A1A1A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFreePreview}
                  onChange={(e) => setIsFreePreview(e.target.checked)}
                  className="h-4 w-4 accent-[#25533E]"
                />
                <span>Үнэгүй танилцуулах хичээл</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  Хичээлийн нэр (Монгол) *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Жишээ: Зочид буудалд өрөө захиалах"
                  className="w-full rounded-xl border border-[#E5DDD0] bg-[#FDFBF7] px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  Хятад гарчиг (Ханз)
                </label>
                <input
                  type="text"
                  value={chineseTitle}
                  onChange={(e) => setChineseTitle(e.target.value)}
                  placeholder="预订酒店房间"
                  className="w-full rounded-xl border border-[#E5DDD0] bg-[#FDFBF7] px-3.5 py-2.5 text-sm font-hanzi"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                Товч тайлбар
              </label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Энэ хичээлээр юу сурах тухай..."
                className="w-full rounded-xl border border-[#E5DDD0] bg-[#FDFBF7] px-3.5 py-2.5 text-sm"
              />
            </div>
          </section>

          {/* Video & Cover Image */}
          <section className="rounded-3xl border border-[#EAE0D2] bg-white p-5 sm:p-6 space-y-5 shadow-xs">
            <h2 className="font-display text-lg font-extrabold text-[#1A1A1A]">
              2. Видео ба Нүүр зураг нэмэх
            </h2>

            {/* Video */}
            <div className="rounded-2xl border border-[#EFE6DA] bg-[#FDFBF7] p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-extrabold text-[#1A1A1A] flex items-center gap-1.5">
                  <Video className="h-4 w-4 text-[#EB5E43]" />
                  <span>Видео эх сурвалж</span>
                </span>
                <label className="rounded-xl bg-[#25533E] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#1B3F2F] cursor-pointer">
                  <span>Видео файл оруулах (Preview)</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_VIDEO_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setVideoUrl(p.value)}
                    className={`rounded-xl border px-3 py-1 text-xs font-bold cursor-pointer ${
                      videoUrl === p.value
                        ? 'border-[#EB5E43] bg-[#FDE3C8] text-[#1A1A1A]'
                        : 'border-[#E5DDD0] bg-white text-[#5C5C5C]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Видео холбоос (https://... эсвэл demo://...)"
                className="w-full rounded-xl border border-[#E5DDD0] bg-white px-3.5 py-2 text-xs"
              />
            </div>

            {/* Cover Image */}
            <div className="rounded-2xl border border-[#EFE6DA] bg-[#FDFBF7] p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-extrabold text-[#1A1A1A] flex items-center gap-1.5">
                  <ImagePlus className="h-4 w-4 text-[#25533E]" />
                  <span>Нүүр зураг</span>
                </span>
                <label className="rounded-xl bg-[#FAF4EA] border border-[#E5DDD0] px-3 py-1.5 text-xs font-bold text-[#1A1A1A] hover:bg-[#FDE3C8] cursor-pointer">
                  <span>Зураг сонгох (Upload)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {PRESET_THUMBS.map((t) => (
                  <button
                    key={t.url}
                    type="button"
                    onClick={() => setThumbnailUrl(t.url)}
                    className={`rounded-xl border px-3 py-1 text-xs font-bold cursor-pointer ${
                      thumbnailUrl === t.url
                        ? 'border-[#25533E] bg-[#25533E] text-white'
                        : 'border-[#E5DDD0] bg-white text-[#5C5C5C]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="Нүүр зургийн холбоос..."
                className="w-full rounded-xl border border-[#E5DDD0] bg-white px-3.5 py-2 text-xs"
              />
            </div>
          </section>

          {/* Hanzi / Pinyin / Mongolian Lines */}
          <section className="rounded-3xl border border-[#EAE0D2] bg-white p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-lg font-extrabold text-[#1A1A1A]">
                3. Ханз · Пиньинь · Монгол тайлбар ({hanziLines.length})
              </h2>
              <button
                type="button"
                onClick={handleAddHanziLine}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#25533E] px-3.5 py-2 text-xs font-bold text-white cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Өгүүлбэр нэмэх</span>
              </button>
            </div>

            <div className="space-y-4">
              {hanziLines.map((line, idx) => (
                <div
                  key={line.id}
                  className="rounded-2xl border border-[#EFE6DA] bg-[#FDFBF7] p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#EB5E43]">
                      Мөр #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setHanziLines((prev) => prev.filter((item) => item.id !== line.id))
                      }
                      className="rounded-lg p-1 text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={line.hanzi}
                      onChange={(e) =>
                        setHanziLines((prev) =>
                          prev.map((it) =>
                            it.id === line.id ? { ...it, hanzi: e.target.value } : it
                          )
                        )
                      }
                      placeholder="Ханз (Жишээ: 你好)"
                      className="rounded-xl border border-[#E5DDD0] bg-white px-3 py-2 text-sm font-hanzi"
                    />
                    <input
                      type="text"
                      value={line.pinyin}
                      onChange={(e) =>
                        setHanziLines((prev) =>
                          prev.map((it) =>
                            it.id === line.id ? { ...it, pinyin: e.target.value } : it
                          )
                        )
                      }
                      placeholder="Пиньинь (Жишээ: Nǐ hǎo)"
                      className="rounded-xl border border-[#E5DDD0] bg-white px-3 py-2 text-sm font-pinyin"
                    />
                  </div>
                  <input
                    type="text"
                    value={line.mongolian}
                    onChange={(e) =>
                      setHanziLines((prev) =>
                        prev.map((it) =>
                          it.id === line.id ? { ...it, mongolian: e.target.value } : it
                        )
                      )
                    }
                    placeholder="Монгол орчуулга"
                    className="w-full rounded-xl border border-[#E5DDD0] bg-white px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={line.grammarNote ?? ''}
                    onChange={(e) =>
                      setHanziLines((prev) =>
                        prev.map((it) =>
                          it.id === line.id ? { ...it, grammarNote: e.target.value } : it
                        )
                      )
                    }
                    placeholder="Дүрмийн / соёлын нэмэлт тайлбар (сонголтоор)"
                    className="w-full rounded-xl border border-[#E5DDD0] bg-white px-3 py-2 text-xs"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Vocabulary */}
          <section className="rounded-3xl border border-[#EAE0D2] bg-white p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-lg font-extrabold text-[#1A1A1A]">
                4. Шинэ үгийн сан ({vocabulary.length})
              </h2>
              <button
                type="button"
                onClick={handleAddVocab}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#FAF4EA] border border-[#E5DDD0] px-3.5 py-2 text-xs font-bold text-[#1A1A1A] cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Үг нэмэх</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {vocabulary.map((voc) => (
                <div
                  key={voc.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center rounded-2xl border border-[#EFE6DA] bg-[#FDFBF7] p-3"
                >
                  <input
                    type="text"
                    value={voc.hanzi}
                    onChange={(e) =>
                      setVocabulary((prev) =>
                        prev.map((v) => (v.id === voc.id ? { ...v, hanzi: e.target.value } : v))
                      )
                    }
                    placeholder="Ханз"
                    className="sm:col-span-3 rounded-xl border border-[#E5DDD0] bg-white px-3 py-2 text-sm font-hanzi"
                  />
                  <input
                    type="text"
                    value={voc.pinyin}
                    onChange={(e) =>
                      setVocabulary((prev) =>
                        prev.map((v) => (v.id === voc.id ? { ...v, pinyin: e.target.value } : v))
                      )
                    }
                    placeholder="Пиньинь"
                    className="sm:col-span-3 rounded-xl border border-[#E5DDD0] bg-white px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={voc.mongolian}
                    onChange={(e) =>
                      setVocabulary((prev) =>
                        prev.map((v) =>
                          v.id === voc.id ? { ...v, mongolian: e.target.value } : v
                        )
                      )
                    }
                    placeholder="Монгол утга"
                    className="sm:col-span-5 rounded-xl border border-[#E5DDD0] bg-white px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setVocabulary((prev) => prev.filter((v) => v.id !== voc.id))}
                    className="sm:col-span-1 justify-self-end rounded-lg p-1.5 text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Attachments */}
          <section className="rounded-3xl border border-[#EAE0D2] bg-white p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-lg font-extrabold text-[#1A1A1A]">
                5. Хавсралт материал нэмэх ({attachments.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                <label className="inline-flex items-center gap-1.5 rounded-xl bg-[#FAF4EA] border border-[#E5DDD0] px-3 py-2 text-xs font-bold text-[#1A1A1A] cursor-pointer">
                  <FilePlus2 className="h-3.5 w-3.5 text-[#EB5E43]" />
                  <span>Файл сонгох</span>
                  <input type="file" onChange={handleAttachmentFileMock} className="hidden" />
                </label>
                <button
                  type="button"
                  onClick={handleAddEmptyAttachment}
                  className="inline-flex items-center gap-1 rounded-xl bg-[#25533E] px-3 py-2 text-xs font-bold text-white cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Мөр нэмэх</span>
                </button>
              </div>
            </div>

            {attachments.length === 0 ? (
              <p className="text-xs text-[#5C5C5C]">Хавсралт материал нэмээгүй байна.</p>
            ) : (
              <div className="space-y-2.5">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center rounded-2xl border border-[#EFE6DA] bg-[#FDFBF7] p-3"
                  >
                    <input
                      type="text"
                      value={att.title}
                      onChange={(e) =>
                        setAttachments((prev) =>
                          prev.map((a) => (a.id === att.id ? { ...a, title: e.target.value } : a))
                        )
                      }
                      placeholder="Файлын нэр"
                      className="sm:col-span-6 rounded-xl border border-[#E5DDD0] bg-white px-3 py-2 text-xs font-bold"
                    />
                    <select
                      value={att.type}
                      onChange={(e) =>
                        setAttachments((prev) =>
                          prev.map((a) =>
                            a.id === att.id
                              ? { ...a, type: e.target.value as AttachmentType }
                              : a
                          )
                        )
                      }
                      className="sm:col-span-3 rounded-xl border border-[#E5DDD0] bg-white px-2.5 py-2 text-xs font-semibold"
                    >
                      <option value="PDF">PDF</option>
                      <option value="Ханз дэвтэр">Ханз дэвтэр</option>
                      <option value="Аудио">Аудио</option>
                      <option value="Дасгал">Дасгал</option>
                    </select>
                    <input
                      type="text"
                      value={att.sizeLabel}
                      onChange={(e) =>
                        setAttachments((prev) =>
                          prev.map((a) =>
                            a.id === att.id ? { ...a, sizeLabel: e.target.value } : a
                          )
                        )
                      }
                      placeholder="1.2 MB"
                      className="sm:col-span-2 rounded-xl border border-[#E5DDD0] bg-white px-2.5 py-2 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setAttachments((prev) => prev.filter((a) => a.id !== att.id))
                      }
                      className="sm:col-span-1 justify-self-end rounded-lg p-1.5 text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Live Student View Preview */}
        <aside className="xl:col-span-4 xl:sticky xl:top-24 rounded-3xl border border-[#EAE0D2] bg-white p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#25533E]">
              Хэрэглэгчид харагдах байдал
            </span>
            <SampleBadge variant="sample" label="Live Preview" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#EAE0D2] bg-[#FAF4EA]">
            <img
              src={thumbnailUrl}
              alt="Хичээлийн нүүр"
              className="aspect-video w-full object-cover"
            />
            <div className="p-3.5 space-y-1">
              <p className="font-hanzi text-sm font-bold text-[#EB5E43]">
                {chineseTitle || '新课程'}
              </p>
              <p className="font-display text-base font-extrabold text-[#1A1A1A]">
                {title || 'Хичээлийн гарчиг...'}
              </p>
              <p className="text-[11px] text-[#5C5C5C]">
                {duration} · {courses.find((c) => c.id === courseId)?.level ?? ''}
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            <p className="text-xs font-extrabold text-[#1A1A1A]">Ханз & Пиньинь жишээ:</p>
            {hanziLines.slice(0, 2).map((line) => (
              <div
                key={line.id}
                className="rounded-2xl border border-[#EFE6DA] bg-[#FDFBF7] p-3 space-y-1"
              >
                <p className="font-hanzi text-lg font-bold text-[#1A1A1A]">
                  {line.hanzi || '—'}
                </p>
                <p className="text-xs">
                  <TonePinyin text={line.pinyin || ''} />
                </p>
                <p className="text-xs font-semibold text-[#25533E]">
                  {line.mongolian || 'Монгол тайлбар'}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
