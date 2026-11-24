import { Edit3, ImagePlus, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { SampleBadge } from '../../components/common/SampleBadge';
import { useAppStore } from '../../context/AppStoreContext';
import { BRAND_IMAGES } from '../../data/mockData';
import type { Course, CourseLevel, PublishStatus } from '../../types';

const COURSE_LEVELS: CourseLevel[] = ['Анхан шат', 'Дунд шат', 'Ахисан шат'];

const PRESET_COVERS = [
  { label: 'Анхан шат', url: BRAND_IMAGES.courseBeginner },
  { label: 'Дунд шат', url: BRAND_IMAGES.courseIntermediate },
  { label: 'Ахисан шат', url: BRAND_IMAGES.courseHsk },
];

export function AdminCoursesPage() {
  const {
    courses,
    lessons,
    teachers,
    saveCourse,
    deleteCourse,
    setCourseStatus,
  } = useAppStore();

  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState('');
  const [chineseSubtitle, setChineseSubtitle] = useState('');
  const [level, setLevel] = useState<CourseLevel>('Анхан шат');
  const [description, setDescription] = useState('');
  const [instructorName, setInstructorName] = useState(
    teachers[0] ? `${teachers[0].name} багш` : 'Л. Сарангэрэл багш'
  );
  const [thumbnailUrl, setThumbnailUrl] = useState(BRAND_IMAGES.courseBeginner);

  const openNewCourseModal = () => {
    setEditingCourseId(undefined);
    setTitle('');
    setChineseSubtitle('');
    setLevel('Анхан шат');
    setDescription('');
    setInstructorName(teachers[0] ? `${teachers[0].name} багш` : 'Л. Сарангэрэл багш');
    setThumbnailUrl(BRAND_IMAGES.courseBeginner);
    setCourseModalOpen(true);
  };

  const openEditCourseModal = (course: Course) => {
    setEditingCourseId(course.id);
    setTitle(course.title);
    setChineseSubtitle(course.chineseSubtitle);
    setLevel(course.level);
    setDescription(course.description);
    setInstructorName(course.instructorName);
    setThumbnailUrl(course.thumbnailUrl);
    setCourseModalOpen(true);
  };

  const handleCourseCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSaveCourse = (status: PublishStatus) => {
    if (!title.trim()) return;
    saveCourse({
      id: editingCourseId,
      title: title.trim(),
      chineseSubtitle: chineseSubtitle.trim() || '汉语课程',
      level,
      description: description.trim() || 'Курсийн тайлбар.',
      instructorName: instructorName.trim() || 'Багш',
      thumbnailUrl: thumbnailUrl.trim() || BRAND_IMAGES.courseBeginner,
      status,
    });
    setCourseModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-[#1A1A1A]">
            Курсууд ({courses.length})
          </h1>
          <p className="mt-1 text-sm text-[#5C5C5C]">
            Анхан, Дунд, Ахисан шатны курс үүсгэх, нүүр зураг оруулах болон нийтлэх.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewCourseModal}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#EB5E43] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#D44B31] cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Шинэ курс үүсгэх</span>
        </button>
      </div>

      {/* Courses List (Clean, no nested Chapters) */}
      <div className="space-y-4">
        {courses.map((course) => {
          const courseLessonCount = lessons.filter((l) => l.courseId === course.id).length;

          return (
            <div
              key={course.id}
              className="rounded-3xl border border-[#EAE0D2] bg-white p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs"
            >
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="h-16 w-24 shrink-0 rounded-2xl object-cover border border-[#EAE0D2]"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <SampleBadge variant={course.status === 'published' ? 'published' : 'draft'} />
                    <span className="rounded-full bg-[#FAF4EA] px-2.5 py-0.5 text-[11px] font-bold text-[#25533E]">
                      {course.level}
                    </span>
                    <span className="font-hanzi text-xs font-bold text-[#EB5E43]">
                      {course.chineseSubtitle}
                    </span>
                  </div>
                  <h2 className="mt-1 font-display text-base sm:text-lg font-extrabold text-[#1A1A1A]">
                    {course.title}
                  </h2>
                  <p className="text-xs text-[#5C5C5C]">
                    {courseLessonCount} хичээл · {course.instructorName}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setCourseStatus(course.id, course.status === 'published' ? 'draft' : 'published')
                  }
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer ${
                    course.status === 'published'
                      ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                      : 'bg-[#25533E] text-white hover:bg-[#1B3F2F]'
                  }`}
                >
                  {course.status === 'published' ? 'Ноорог болгох' : 'Нийтлэх'}
                </button>
                <button
                  type="button"
                  onClick={() => openEditCourseModal(course)}
                  className="inline-flex items-center gap-1 rounded-xl border border-[#E5DDD0] bg-white px-3 py-1.5 text-xs font-bold text-[#1A1A1A] hover:bg-[#FAF4EA] cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Засах</span>
                </button>
                <button
                  type="button"
                  onClick={() => deleteCourse(course.id)}
                  className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Course Create/Edit Modal */}
      <Modal
        open={courseModalOpen}
        onClose={() => setCourseModalOpen(false)}
        title={editingCourseId ? 'Курс засах' : 'Шинэ курс үүсгэх'}
        maxWidthClass="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                Курсийн нэр (Монгол) *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Жишээ: Аяллын хятад хэл"
                className="w-full rounded-xl border border-[#E5DDD0] bg-white px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                Хятад нэр (Ханз)
              </label>
              <input
                type="text"
                value={chineseSubtitle}
                onChange={(e) => setChineseSubtitle(e.target.value)}
                placeholder="汉语初级"
                className="w-full rounded-xl border border-[#E5DDD0] bg-white px-3.5 py-2.5 text-sm font-hanzi"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Түвшин</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as CourseLevel)}
                className="w-full rounded-xl border border-[#E5DDD0] bg-white px-3.5 py-2.5 text-sm font-semibold"
              >
                {COURSE_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Багш</label>
              <select
                value={instructorName}
                onChange={(e) => setInstructorName(e.target.value)}
                className="w-full rounded-xl border border-[#E5DDD0] bg-white px-3.5 py-2.5 text-sm font-semibold"
              >
                {teachers.map((t) => {
                  const label = t.name.includes('багш') ? t.name : `${t.name} багш`;
                  return (
                    <option key={t.id} value={label}>
                      {label} ({t.specialty})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Тайлбар</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Курсийн товч агуулга..."
              className="w-full rounded-xl border border-[#E5DDD0] bg-white px-3.5 py-2.5 text-sm"
            />
          </div>

          {/* Cover Image Picker / Upload */}
          <div className="rounded-2xl border border-[#EAE0D2] bg-white p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-[#1A1A1A] flex items-center gap-1.5">
                <ImagePlus className="h-4 w-4 text-[#EB5E43]" />
                <span>Нүүр зураг нэмэх</span>
              </span>
              <label className="rounded-xl bg-[#FAF4EA] px-3 py-1.5 text-xs font-bold text-[#25533E] hover:bg-[#FDE3C8] cursor-pointer">
                <span>Компьютероос зураг сонгох</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCourseCoverUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-2">
              {PRESET_COVERS.map((preset) => (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => setThumbnailUrl(preset.url)}
                  className={`rounded-xl border px-3 py-1 text-xs font-bold cursor-pointer ${
                    thumbnailUrl === preset.url
                      ? 'border-[#EB5E43] bg-[#FDE3C8]/60 text-[#1A1A1A]'
                      : 'border-[#E5DDD0] bg-[#FDFBF7] text-[#5C5C5C]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="Зургийн URL..."
              className="w-full rounded-xl border border-[#E5DDD0] bg-[#FDFBF7] px-3 py-2 text-xs"
            />

            {thumbnailUrl && (
              <img
                src={thumbnailUrl}
                alt="Нүүр зураг урьдчилан харах"
                className="h-32 w-full rounded-xl object-cover border border-[#EAE0D2]"
              />
            )}
          </div>

          <div className="flex flex-wrap justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setCourseModalOpen(false)}
              className="rounded-xl border border-[#E5DDD0] bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-[#1A1A1A] cursor-pointer"
            >
              Цуцлах
            </button>
            <button
              type="button"
              onClick={() => handleSaveCourse('draft')}
              className="rounded-xl border border-amber-300 bg-amber-100 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-amber-950 hover:bg-amber-200 cursor-pointer"
            >
              Ноорог хадгалах
            </button>
            <button
              type="button"
              onClick={() => handleSaveCourse('published')}
              className="rounded-xl bg-[#25533E] px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white hover:bg-[#1B3F2F] cursor-pointer"
            >
              Нийтлэх
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
