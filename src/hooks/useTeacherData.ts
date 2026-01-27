import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from './useAuth';

export interface TeacherClass {
  id: string;
  classId: string;
  className: string;
  grade: number;
  section: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  studentCount: number;
  pendingSubmissions: number;
  averageScore: number;
}

export interface TeacherStudent {
  id: string;
  userId: string;
  name: string;
  grade: number;
  section: string;
  averageScore: number;
  submissionRate: number;
  lastActive: Date;
}

export interface TeacherSubmission {
  id: string;
  assignmentId: string;
  homeworkTitle: string;
  studentId: string;
  studentName: string;
  subjectCode: string;
  submittedAt: Date;
  status: string;
  score: number | null;
  aiSuggestion: string | null;
}

export interface TeacherAssignment {
  id: string;
  title: string;
  description: string | null;
  chapter: string | null;
  classId: string;
  className: string;
  subjectCode: string;
  dueDate: Date;
  createdAt: Date;
  totalStudents: number;
  submittedCount: number;
  gradedCount: number;
}

export function useTeacherProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['teacherProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await api.get('/teacher/profile');
      return data;
    },
    enabled: !!user?.id,
  });
}

export function useTeacherClasses() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['teacherClasses', user?.id],
    queryFn: async (): Promise<TeacherClass[]> => {
      if (!user?.id) return [];
      const { data } = await api.get('/teacher/classes');
      return data || [];
    },
    enabled: !!user?.id,
  });
}

export function useTeacherStudents(classId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['teacherStudents', user?.id, classId],
    queryFn: async (): Promise<TeacherStudent[]> => {
      if (!user?.id) return [];
      const url = classId ? `/teacher/students?classId=${classId}` : '/teacher/students';
      const { data } = await api.get(url);
      return (data || []).map((student: any) => ({
        ...student,
        lastActive: new Date(student.lastActive),
      }));
    },
    enabled: !!user?.id,
  });
}

export function useTeacherAssignments() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['teacherAssignments', user?.id],
    queryFn: async (): Promise<TeacherAssignment[]> => {
      if (!user?.id) return [];
      const { data } = await api.get('/teacher/assignments');
      return (data || []).map((assignment: any) => ({
        ...assignment,
        dueDate: new Date(assignment.dueDate),
        createdAt: new Date(assignment.createdAt),
      }));
    },
    enabled: !!user?.id,
  });
}

export function useTeacherSubmissions(status?: 'pending_review' | 'all') {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['teacherSubmissions', user?.id, status],
    queryFn: async (): Promise<TeacherSubmission[]> => {
      if (!user?.id) return [];
      const url = status ? `/teacher/submissions?status=${status}` : '/teacher/submissions';
      const { data } = await api.get(url);
      return (data || []).map((submission: any) => ({
        ...submission,
        submittedAt: new Date(submission.submittedAt),
      }));
    },
    enabled: !!user?.id,
  });
}

export function useTeacherLessonPlans() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['teacherLessonPlans', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await api.get('/teacher/lesson-plans');
      return (data || []).map((plan: any) => ({
        ...plan,
        date: new Date(plan.date),
        completedAt: plan.completedAt ? new Date(plan.completedAt) : null,
      }));
    },
    enabled: !!user?.id,
  });
}

export function useTeacherDailyDoses() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['teacherDailyDoses', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await api.get('/teacher/daily-doses');
      return (data || []).map((dose: any) => ({
        ...dose,
        date: new Date(dose.date),
        completedAt: dose.completedAt ? new Date(dose.completedAt) : null,
      }));
    },
    enabled: !!user?.id,
  });
}

export function useTeacherAssessments() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['teacherAssessments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await api.get('/teacher/assessments');
      return (data || []).map((assessment: any) => ({
        ...assessment,
        scheduledDate: assessment.scheduledDate ? new Date(assessment.scheduledDate) : null,
        completedAt: assessment.completedAt ? new Date(assessment.completedAt) : null,
      }));
    },
    enabled: !!user?.id,
  });
}

export function useTeacherQueries() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['teacherQueries', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await api.get('/teacher/queries');
      return (data || []).map((query: any) => ({
        ...query,
        askedAt: new Date(query.askedAt),
        addressedAt: query.addressedAt ? new Date(query.addressedAt) : null,
      }));
    },
    enabled: !!user?.id,
  });
}
