export type CourseLevel = 'Анхан шат' | 'Дунд шат' | 'Ахисан шат';

export type PublishStatus = 'draft' | 'published';

export interface HanziToken {
  hanzi: string;
  pinyin: string;
  meaning: string;
}

export interface HanziLine {
  id: string;
  speaker?: string;
  hanzi: string;
  pinyin: string;
  mongolian: string;
  grammarNote?: string;
  literalBreakdown?: HanziToken[];
  timestampSec?: number;
}

export interface VocabItem {
  id: string;
  hanzi: string;
  pinyin: string;
  mongolian: string;
  partOfSpeech: string;
  strokes: number;
  exampleHanzi?: string;
  examplePinyin?: string;
  exampleMn?: string;
}

export type AttachmentType = 'PDF' | 'Ханз дэвтэр' | 'Аудио' | 'Дасгал';

export interface Attachment {
  id: string;
  title: string;
  type: AttachmentType;
  sizeLabel: string;
  url: string;
  previewNote?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  order: number;
  title: string;
  chineseTitle: string;
  duration: string;
  durationSec: number;
  isFreePreview: boolean;
  status: PublishStatus;
  thumbnailUrl: string;
  videoUrl: string;
  summary: string;
  hanziLines: HanziLine[];
  vocabulary: VocabItem[];
  attachments: Attachment[];
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  chineseSubtitle: string;
  level: CourseLevel;
  description: string;
  instructorName: string;
  thumbnailUrl: string;
  status: PublishStatus;
  updatedAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  chineseName: string;
  role: string;
  experience: string;
  bio: string;
  specialty: string;
  photoUrl?: string;
  avatarInitials: string;
  avatarBg: string;
  isSample?: boolean;
}

export interface Testimonial {
  id: string;
  studentName: string;
  levelLabel: string;
  quote: string;
  rating: number;
  avatarInitials: string;
  avatarBg: string;
  isSample: true;
}

export type HskLevelGroup = 'HSK 1–2' | 'HSK 3–4' | 'HSK 5–6';

export interface Hsk30LevelRow {
  level: string;
  stage: HskLevelGroup;
  stageLabel: string;
  vocabTotal: number;
  vocabNew: number;
  charsRead: number;
  charsWrite: number;
  focusMn: string;
}

export interface FlashcardItem {
  id: string;
  levelGroup: HskLevelGroup;
  hanzi: string;
  pinyin: string;
  mongolian: string;
  exampleHanzi: string;
  exampleMn: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export type MembershipPlanType = 'Сарын эрх' | 'Жилийн эрх' | 'Үнэгүй';
export type MembershipStatus = 'Идэвхтэй' | 'Дуусах дөхсөн' | 'Хугацаа дууссан';

export interface MemberRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  plan: MembershipPlanType;
  priceLabel: string;
  status: MembershipStatus;
  startDate: string;
  endDate: string;
  progressPercent: number;
  completedLessonsCount: number;
  lastActive: string;
  paymentMethodMock: string;
  isSample: true;
}

export interface UserProgress {
  completedLessonIds: string[];
  lastWatchedLessonId: string;
  watchPercentByLesson: Record<string, number>;
  savedVocabIds: string[];
  streakDays: number;
  activeDemoPlan: MembershipPlanType;
  demoPlanExpiry: string;
}

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

export interface AppPersistedState {
  courses: Course[];
  lessons: Lesson[];
  teachers: Teacher[];
  members: MemberRecord[];
  userProgress: UserProgress;
}
