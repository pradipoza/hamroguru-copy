import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { AppLayout } from "./components/layout/AppLayout";
import { TeacherLayout } from "./components/layout/TeacherLayout";
import Dashboard from "./pages/Dashboard";
import SubjectPage from "./pages/SubjectPage";
import PendingTasksPage from "./pages/PendingTasksPage";
import ConsultantPage from "./pages/ConsultantPage";
import ProgressPage from "./pages/ProgressPage";
import SettingsPage from "./pages/SettingsPage";
import StudentProfilePage from "./pages/StudentProfilePage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

// Teacher Pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import ClassesPage from "./pages/teacher/ClassesPage";
import ClassDetailPage from "./pages/teacher/ClassDetailPage";
import AssignmentsPage from "./pages/teacher/AssignmentsPage";
import StudentProgressPage from "./pages/teacher/StudentProgressPage";
import TeacherSettingsPage from "./pages/teacher/TeacherSettingsPage";
import LessonPlanPage from "./pages/teacher/LessonPlanPage";
import TeacherProfilePage from "./pages/teacher/TeacherProfilePage";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect to appropriate dashboard based on role
    if (role === 'teacher') {
      return <Navigate to="/teacher" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth Route */}
      <Route path="/auth" element={user ? <Navigate to={role === 'teacher' ? '/teacher' : '/'} replace /> : <AuthPage />} />

      {/* Student Routes */}
      <Route path="/" element={<ProtectedRoute allowedRoles={['student', 'admin']}><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/subject/:subjectId" element={<ProtectedRoute allowedRoles={['student', 'admin']}><AppLayout><SubjectPage /></AppLayout></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute allowedRoles={['student', 'admin']}><AppLayout><PendingTasksPage /></AppLayout></ProtectedRoute>} />
      <Route path="/consultant" element={<ProtectedRoute allowedRoles={['student', 'admin']}><AppLayout><ConsultantPage /></AppLayout></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute allowedRoles={['student', 'admin']}><AppLayout><ProgressPage /></AppLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute allowedRoles={['student', 'admin']}><AppLayout><StudentProfilePage /></AppLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute allowedRoles={['student', 'admin']}><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />

      {/* Teacher Routes */}
      <Route path="/teacher" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><TeacherLayout><TeacherDashboard /></TeacherLayout></ProtectedRoute>} />
      <Route path="/teacher/lesson-plans" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><TeacherLayout><LessonPlanPage /></TeacherLayout></ProtectedRoute>} />
      <Route path="/teacher/classes" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><TeacherLayout><ClassesPage /></TeacherLayout></ProtectedRoute>} />
      <Route path="/teacher/class/:classId" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><TeacherLayout><ClassDetailPage /></TeacherLayout></ProtectedRoute>} />
      <Route path="/teacher/assignments" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><TeacherLayout><AssignmentsPage /></TeacherLayout></ProtectedRoute>} />
      <Route path="/teacher/students" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><TeacherLayout><StudentProgressPage /></TeacherLayout></ProtectedRoute>} />
      <Route path="/teacher/profile" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><TeacherLayout><TeacherProfilePage /></TeacherLayout></ProtectedRoute>} />
      <Route path="/teacher/settings" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><TeacherLayout><TeacherSettingsPage /></TeacherLayout></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
