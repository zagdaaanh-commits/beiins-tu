import { Edit3, ImagePlus, Plus, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { SampleBadge } from '../../components/common/SampleBadge';
import { useAppStore } from '../../context/AppStoreContext';
import type { Teacher } from '../../types';

const AVATAR_COLORS = ['#EB5E43', '#25533E', '#2B5C8F', '#222222', '#B87414'];

function computeInitials(name: string): string {
  const parts = name.trim().split(/[\s.]+/).filter(Boolean);
  if (parts.length === 0) return 'БГ';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function AdminTeachersPage() {
  const { teachers, saveTeacher, deleteTeacher, showToast } = useAppStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [chineseName, setChineseName] = useState('');
  const [role, setRole] = useState('Анхан шат · Дуудлага');
  const [specialty, setSpecialty] = useState('HSK 1–2');
  const [experience, setExperience] = useState('5 жил');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [avatarBg, setAvatarBg] = useState('#25533E');

  const openNewModal = () => {
    setEditingId(undefined);
    setName('');
    setChineseName('');
    setRole('Анхан шат · Дуудлага');
    setSpecialty('HSK 1–2');
    setExperience('5 жил');
    setBio('');
    setPhotoUrl('');
    setAvatarBg('#25533E');
    setModalOpen(true);
  };

  const openEditModal = (teacher: Teacher) => {
    setEditingId(teacher.id);
    setName(teacher.name);
    setChineseName(teacher.chineseName);
    setRole(teacher.role);
    setSpecialty(teacher.specialty);
    setExperience(teacher.experience);
    setBio(teacher.bio);
    setPhotoUrl(teacher.photoUrl ?? '');
    setAvatarBg(teacher.avatarBg);
    setModalOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      // Resize large images gracefully via canvas so localStorage stays lightweight
      const img = new Image();
      img.onload = () => {
        const maxDim = 480;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setPhotoUrl(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          setPhotoUrl(reader.result as string);
        }
      };
      img.onerror = () => setPhotoUrl(reader.result as string);
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Багшийн нэрийг оруулна уу.', 'warning');
      return;
    }
    saveTeacher({
      id: editingId,
      name: name.trim(),
      chineseName: chineseName.trim() || '老师',
      role: role.trim() || 'Хятад хэлний багш',
      specialty: specialty.trim() || 'HSK 1–2',
      experience: experience.trim() || '5 жил',
      bio: bio.trim() || 'Хятад хэлний багш.',
      photoUrl: photoUrl.trim(),
      avatarInitials: computeInitials(name),
      avatarBg,
      isSample: true,
    });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-[#1A1A1A]">
            Багш нар ({teachers.length})
          </h1>
          <p className="mt-1 text-sm text-[#5C5C5C]">
            Шинэ багш нэмэх, зураг оруулах болон засахад хэрэглэгчийн хэсэгт шууд шинэчлэгдэнэ.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewModal}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#EB5E43] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#D44B31] cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Шинэ багш нэмэх</span>
        </button>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="rounded-3xl border border-[#EAE0D2] bg-white p-5 flex flex-col justify-between shadow-xs space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  {teacher.photoUrl ? (
                    <img
                      src={teacher.photoUrl}
                      alt={teacher.name}
                      className="h-16 w-16 shrink-0 rounded-2xl object-cover border border-[#EAE0D2]"
                    />
                  ) : (
                    <span
                      style={{ backgroundColor: teacher.avatarBg }}
                      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl font-display text-lg font-black text-white"
                    >
                      {teacher.avatarInitials}
                    </span>
                  )}
                  <div className="min-w-0">
                    <h2 className="font-display text-lg font-extrabold text-[#1A1A1A] truncate">
                      {teacher.name}
                    </h2>
                    <p className="font-hanzi text-sm font-bold text-[#EB5E43]">
                      {teacher.chineseName}
                    </p>
                    <p className="text-xs font-semibold text-[#25533E] truncate">
                      {teacher.role}
                    </p>
                  </div>
                </div>
                <SampleBadge variant="sample" label={teacher.specialty} />
              </div>

              <p className="mt-3 text-xs text-[#5C5C5C] leading-relaxed">
                {teacher.bio}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-[#F4EDE2] pt-3">
              <span className="text-[11px] font-semibold text-[#5C5C5C]">
                {teacher.experience}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(teacher)}
                  className="inline-flex items-center gap-1 rounded-xl border border-[#E5DDD0] bg-[#FDFBF7] px-3 py-1.5 text-xs font-bold text-[#1A1A1A] hover:bg-[#FAF4EA] cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Засах</span>
                </button>
                <button
                  type="button"
                  onClick={() => deleteTeacher(teacher.id)}
                  title="Устгах"
                  className="rounded-xl border border-red-200 bg-red-50 p-1.5 text-red-700 hover:bg-red-100 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Teacher Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Багшийн мэдээлэл засах' : 'Шинэ багш нэмэх'}
        maxWidthClass="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Teacher Photo Upload Section */}
          <div className="rounded-2xl border border-[#EAE0D2] bg-white p-4 space-y-3">
            <div className="flex items-center gap-4">
              {photoUrl ? (
                <div className="relative shrink-0">
                  <img
                    src={photoUrl}
                    alt="Багшийн зураг"
                    className="h-20 w-20 rounded-2xl object-cover border border-[#EAE0D2]"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    aria-label="Зураг арилгах"
                    className="absolute -right-2 -top-2 rounded-full bg-[#1A1A1A] p-1 text-white shadow cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <span
                  style={{ backgroundColor: avatarBg }}
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl font-display text-xl font-black text-white"
                >
                  {computeInitials(name)}
                </span>
              )}

              <div className="flex-1 space-y-2">
                <p className="text-xs font-extrabold text-[#1A1A1A]">Багшийн зураг</p>
                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex items-center gap-1.5 rounded-xl bg-[#25533E] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#1B3F2F] cursor-pointer">
                    <ImagePlus className="h-3.5 w-3.5" />
                    <span>Зураг оруулах</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {!photoUrl && (
                    <div className="flex items-center gap-1.5">
                      {AVATAR_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setAvatarBg(c)}
                          style={{ backgroundColor: c }}
                          aria-label={`Өнгө ${c}`}
                          className={`h-6 w-6 rounded-full cursor-pointer transition ${
                            avatarBg === c ? 'ring-2 ring-offset-2 ring-[#1A1A1A]' : 'opacity-75'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="Эсвэл зургийн URL хаяг оруулна уу..."
                  className="w-full rounded-xl border border-[#E5DDD0] bg-[#FDFBF7] px-3 py-1.5 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                Багшийн нэр (Монгол) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Жишээ: Д. Энхтуяа"
                className="w-full rounded-xl border border-[#E5DDD0] bg-white px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                Хятад нэр
              </label>
              <input
                type="text"
                value={chineseName}
                onChange={(e) => setChineseName(e.target.value)}
                placeholder="王老师"
                className="w-full rounded-xl border border-[#E5DDD0] bg-white px-3.5 py-2.5 text-sm font-hanzi"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Чиглэл</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Анхан шат · Дуудлага"
                className="w-full rounded-xl border border-[#E5DDD0] bg-white px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Түвшин</label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full rounded-xl border border-[#E5DDD0] bg-white px-3.5 py-2.5 text-sm font-semibold"
              >
                <option value="HSK 1–2">HSK 1–2</option>
                <option value="HSK 3–4">HSK 3–4</option>
                <option value="HSK 5–6">HSK 5–6</option>
                <option value="HSK 1–6">HSK 1–6</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Туршлага</label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="5 жил"
                className="w-full rounded-xl border border-[#E5DDD0] bg-white px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
              Товч танилцуулга
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Багшийн туршлага, заах арга барил..."
              className="w-full rounded-xl border border-[#E5DDD0] bg-white px-3.5 py-2.5 text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-xl border border-[#E5DDD0] bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-[#1A1A1A] cursor-pointer"
            >
              Цуцлах
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#25533E] px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white hover:bg-[#1B3F2F] cursor-pointer"
            >
              Хадгалах
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
