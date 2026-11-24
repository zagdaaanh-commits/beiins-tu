import React, { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_PERSISTED_STATE } from '../data/mockData';
import type {
  AppPersistedState,
  Course,
  Lesson,
  MemberRecord,
  MembershipPlanType,
  MembershipStatus,
  PublishStatus,
  Teacher,
  ToastItem,
  UserProgress,
} from '../types';

const STORAGE_KEY = 'beijing_institute_proto_v4';

interface AppStoreContextValue extends AppPersistedState {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastItem['type']) => void;
  dismissToast: (id: string) => void;
  resetDemoData: () => void;

  // Course CRUD
  saveCourse: (courseData: Omit<Course, 'id' | 'updatedAt'> & { id?: string }) => Course;
  deleteCourse: (courseId: string) => void;
  setCourseStatus: (courseId: string, status: PublishStatus) => void;

  // Lesson CRUD
  saveLesson: (lessonData: Omit<Lesson, 'id' | 'updatedAt'> & { id?: string }) => Lesson;
  deleteLesson: (lessonId: string) => void;
  setLessonStatus: (lessonId: string, status: PublishStatus) => void;

  // Teacher CRUD
  saveTeacher: (teacherData: Omit<Teacher, 'id'> & { id?: string }) => Teacher;
  deleteTeacher: (teacherId: string) => void;

  // Membership demo status
  updateMemberStatus: (memberId: string, status: MembershipStatus, plan?: MembershipPlanType) => void;

  // Learner progress
  toggleLessonComplete: (lessonId: string) => void;
  setLastWatchedLesson: (lessonId: string, percent?: number) => void;
  toggleSaveVocab: (vocabId: string) => void;
  activateDemoPlan: (plan: MembershipPlanType) => void;
}

const AppStoreContext = createContext<AppStoreContextValue | null>(null);

function loadPersistedState(): AppPersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PERSISTED_STATE;
    const parsed = JSON.parse(raw) as Partial<AppPersistedState>;
    if (!parsed.courses || !parsed.lessons || !parsed.teachers || !parsed.members || !parsed.userProgress) {
      return INITIAL_PERSISTED_STATE;
    }
    return {
      courses: parsed.courses,
      lessons: parsed.lessons,
      teachers: parsed.teachers,
      members: parsed.members,
      userProgress: parsed.userProgress,
    };
  } catch {
    return INITIAL_PERSISTED_STATE;
  }
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppPersistedState>(() => loadPersistedState());
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors (e.g. large uploaded images)
    }
  }, [state]);

  const showToast = (message: string, type: ToastItem['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const resetDemoData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setState(INITIAL_PERSISTED_STATE);
    showToast('Анхны жишээ өгөгдөл амжилттай сэргээгдлээ.', 'info');
  };

  const saveCourse: AppStoreContextValue['saveCourse'] = (courseData) => {
    const updatedAt = todayIso();
    if (courseData.id) {
      const existing = state.courses.find((c) => c.id === courseData.id);
      const updated: Course = {
        ...(existing ?? {
          id: courseData.id,
          title: '',
          chineseSubtitle: '',
          level: 'Анхан шат',
          description: '',
          instructorName: '',
          thumbnailUrl: '',
          status: 'draft',
          updatedAt,
        }),
        ...courseData,
        id: courseData.id,
        updatedAt,
      };
      setState((prev) => ({
        ...prev,
        courses: prev.courses.map((c) => (c.id === updated.id ? updated : c)),
      }));
      showToast(
        updated.status === 'published'
          ? `“${updated.title}” курс хадгалагдаж нийтлэгдлээ.`
          : `“${updated.title}” курс ноорог хэлбэрээр хадгалагдлаа.`
      );
      return updated;
    }

    const created: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
      updatedAt,
    };
    setState((prev) => ({
      ...prev,
      courses: [created, ...prev.courses],
    }));
    showToast(
      created.status === 'published'
        ? `Шинэ курс үүсгэж нийтлэлээ.`
        : `Шинэ курс нооргоор хадгалагдлаа.`
    );
    return created;
  };

  const deleteCourse = (courseId: string) => {
    setState((prev) => ({
      ...prev,
      courses: prev.courses.filter((c) => c.id !== courseId),
      lessons: prev.lessons.filter((l) => l.courseId !== courseId),
    }));
    showToast('Курс болон доторх хичээлүүд устгагдлаа.', 'warning');
  };

  const setCourseStatus = (courseId: string, status: PublishStatus) => {
    setState((prev) => ({
      ...prev,
      courses: prev.courses.map((c) =>
        c.id === courseId ? { ...c, status, updatedAt: todayIso() } : c
      ),
    }));
    showToast(
      status === 'published'
        ? 'Курс нийтлэгдлээ — хэрэглэгчийн хэсэгт харагдаж эхэллээ.'
        : 'Курсийг ноорог төлөв рүү шилжүүллээ.',
      'info'
    );
  };

  const saveLesson: AppStoreContextValue['saveLesson'] = (lessonData) => {
    const updatedAt = todayIso();
    if (lessonData.id) {
      const updated: Lesson = {
        ...lessonData,
        id: lessonData.id,
        updatedAt,
      };
      setState((prev) => ({
        ...prev,
        lessons: prev.lessons.map((l) => (l.id === updated.id ? updated : l)),
      }));
      showToast(
        updated.status === 'published'
          ? `“${updated.title}” хичээл нийтлэгдлээ.`
          : `“${updated.title}” ноорог хэлбэрээр хадгалагдлаа.`
      );
      return updated;
    }

    const created: Lesson = {
      ...lessonData,
      id: `lesson-${Date.now()}`,
      updatedAt,
    };
    setState((prev) => ({
      ...prev,
      lessons: [...prev.lessons, created],
    }));
    showToast(
      created.status === 'published'
        ? `Шинэ хичээл нийтлэгдлээ — Хэрэглэгчийн санд нэмэгдлээ.`
        : `Шинэ хичээл нооргоор хадгалагдлаа.`
    );
    return created;
  };

  const deleteLesson = (lessonId: string) => {
    setState((prev) => ({
      ...prev,
      lessons: prev.lessons.filter((l) => l.id !== lessonId),
    }));
    showToast('Хичээл устгагдлаа.', 'warning');
  };

  const setLessonStatus = (lessonId: string, status: PublishStatus) => {
    setState((prev) => ({
      ...prev,
      lessons: prev.lessons.map((l) =>
        l.id === lessonId ? { ...l, status, updatedAt: todayIso() } : l
      ),
    }));
    showToast(
      status === 'published'
        ? 'Хичээл нийтлэгдлээ! Одоо хэрэглэгчийн хичээлийн санд харагдана.'
        : 'Хичээлийг ноорог руу шилжүүллээ.',
      'info'
    );
  };

  const saveTeacher: AppStoreContextValue['saveTeacher'] = (teacherData) => {
    if (teacherData.id) {
      const existing = state.teachers.find((t) => t.id === teacherData.id);
      const updated: Teacher = {
        ...(existing ?? {
          id: teacherData.id,
          name: '',
          chineseName: '',
          role: '',
          experience: '',
          bio: '',
          specialty: '',
          avatarInitials: 'БГ',
          avatarBg: '#25533E',
        }),
        ...teacherData,
        id: teacherData.id,
      };
      setState((prev) => ({
        ...prev,
        teachers: prev.teachers.map((t) => (t.id === updated.id ? updated : t)),
      }));
      showToast(`“${updated.name}” багшийн мэдээлэл шинэчлэгдлээ.`);
      return updated;
    }

    const created: Teacher = {
      ...teacherData,
      id: `teacher-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      teachers: [...prev.teachers, created],
    }));
    showToast(`“${created.name}” багш амжилттай нэмэгдлээ.`);
    return created;
  };

  const deleteTeacher = (teacherId: string) => {
    setState((prev) => ({
      ...prev,
      teachers: prev.teachers.filter((t) => t.id !== teacherId),
    }));
    showToast('Багш жагсаалтаас устгагдлаа.', 'warning');
  };

  const updateMemberStatus = (
    memberId: string,
    status: MembershipStatus,
    plan?: MembershipPlanType
  ) => {
    setState((prev) => ({
      ...prev,
      members: prev.members.map((m) => {
        if (m.id !== memberId) return m;
        const nextPlan = plan ?? m.plan;
        const priceLabel =
          nextPlan === 'Сарын эрх'
            ? '₮100,000 / сар'
            : nextPlan === 'Жилийн эрх'
              ? '₮1,000,000 / жил'
              : '₮0 (Туршилт)';
        return { ...m, status, plan: nextPlan, priceLabel };
      }),
    }));
    showToast('Жишээ хэрэглэгчийн эрхийн төлөв шинэчлэгдлээ.', 'info');
  };

  const toggleLessonComplete = (lessonId: string) => {
    setState((prev) => {
      const exists = prev.userProgress.completedLessonIds.includes(lessonId);
      const completedLessonIds = exists
        ? prev.userProgress.completedLessonIds.filter((id) => id !== lessonId)
        : [...prev.userProgress.completedLessonIds, lessonId];
      const watchPercentByLesson = {
        ...prev.userProgress.watchPercentByLesson,
        [lessonId]: exists ? 60 : 100,
      };
      return {
        ...prev,
        userProgress: {
          ...prev.userProgress,
          completedLessonIds,
          watchPercentByLesson,
        },
      };
    });
    const wasCompleted = state.userProgress.completedLessonIds.includes(lessonId);
    showToast(
      wasCompleted
        ? 'Хичээл дууссан төлөвийг цуцаллаа.'
        : 'Баяр хүргэе! Хичээл дууссанд тооцогдож таны явцад хадгалагдлаа.'
    );
  };

  const setLastWatchedLesson = (lessonId: string, percent?: number) => {
    setState((prev) => {
      const currentPct = prev.userProgress.watchPercentByLesson[lessonId] ?? 0;
      const nextPct = percent !== undefined ? Math.max(currentPct, percent) : Math.max(currentPct, 10);
      return {
        ...prev,
        userProgress: {
          ...prev.userProgress,
          lastWatchedLessonId: lessonId,
          watchPercentByLesson: {
            ...prev.userProgress.watchPercentByLesson,
            [lessonId]: Math.min(100, nextPct),
          },
        },
      };
    });
  };

  const toggleSaveVocab = (vocabId: string) => {
    const alreadySaved = state.userProgress.savedVocabIds.includes(vocabId);
    setState((prev) => ({
      ...prev,
      userProgress: {
        ...prev.userProgress,
        savedVocabIds: alreadySaved
          ? prev.userProgress.savedVocabIds.filter((id) => id !== vocabId)
          : [...prev.userProgress.savedVocabIds, vocabId],
      },
    }));
    showToast(
      alreadySaved ? 'Үгийг хадгалсан сангаас хаслаа.' : 'Шинэ ханзыг “Миний явц” хэсэгт хадгаллаа.',
      alreadySaved ? 'info' : 'success'
    );
  };

  const activateDemoPlan = (plan: MembershipPlanType) => {
    const demoPlanExpiry =
      plan === 'Жилийн эрх'
        ? '2027-11-22 (Жишээ)'
        : plan === 'Сарын эрх'
          ? '2026-12-22 (Жишээ)'
          : 'Туршилтын эрх';
    setState((prev) => ({
      ...prev,
      userProgress: {
        ...prev.userProgress,
        activeDemoPlan: plan,
        demoPlanExpiry,
      },
    }));
    showToast(`Прототип дээр “${plan}” төлөв туршилтаар идэвхжлээ (бодит төлбөр хийгдээгүй).`, 'info');
  };

  return (
    <AppStoreContext.Provider
      value={{
        ...state,
        toasts,
        showToast,
        dismissToast,
        resetDemoData,
        saveCourse,
        deleteCourse,
        setCourseStatus,
        saveLesson,
        deleteLesson,
        setLessonStatus,
        saveTeacher,
        deleteTeacher,
        updateMemberStatus,
        toggleLessonComplete,
        setLastWatchedLesson,
        toggleSaveVocab,
        activateDemoPlan,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore(): AppStoreContextValue {
  const ctx = useContext(AppStoreContext);
  if (!ctx) {
    throw new Error('useAppStore must be used inside AppStoreProvider');
  }
  return ctx;
}

export type { MemberRecord, UserProgress };
