import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from './components/common/ToastContainer';
import { AdminLayout } from './components/layout/AdminLayout';
import { UserLayout } from './components/layout/UserLayout';
import { AppStoreProvider } from './context/AppStoreContext';
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminLessonEditorPage } from './pages/admin/AdminLessonEditorPage';
import { AdminLessonsPage } from './pages/admin/AdminLessonsPage';
import { AdminMembershipsPage } from './pages/admin/AdminMembershipsPage';
import { AdminTeachersPage } from './pages/admin/AdminTeachersPage';
import { LoginPage } from './pages/auth/LoginPage';
import { ChineseOverviewPage } from './pages/user/ChineseOverviewPage';
import { ContactPage } from './pages/user/ContactPage';
import { HomePage } from './pages/user/HomePage';
import { HskPage } from './pages/user/HskPage';
import { LessonPlayerPage } from './pages/user/LessonPlayerPage';
import { LessonsLibraryPage } from './pages/user/LessonsLibraryPage';
import { MyLearningPage } from './pages/user/MyLearningPage';
import { PricingPage } from './pages/user/PricingPage';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
}

export function App() {
  return (
    <AppStoreProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Full-screen Beijing City Login Entry */}
          <Route path="/" element={<LoginPage />} />

          {/* User Portal */}
          <Route element={<UserLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/chinese" element={<ChineseOverviewPage />} />
            <Route path="/lessons" element={<LessonsLibraryPage />} />
            <Route path="/lessons/:lessonId" element={<LessonPlayerPage />} />
            <Route path="/my-learning" element={<MyLearningPage />} />
            <Route path="/hsk" element={<HskPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Admin Portal */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="courses" element={<AdminCoursesPage />} />
            <Route path="lessons" element={<AdminLessonsPage />} />
            <Route path="lessons/new" element={<AdminLessonEditorPage />} />
            <Route path="lessons/:lessonId/edit" element={<AdminLessonEditorPage />} />
            <Route path="teachers" element={<AdminTeachersPage />} />
            <Route path="memberships" element={<AdminMembershipsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </AppStoreProvider>
  );
}

export default App;
