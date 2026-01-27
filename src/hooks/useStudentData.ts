import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from './useAuth';

export interface PendingTask {
  id: string;
  type: 'homework' | 'notes' | 'test';
  subjectCode: string;
  subjectName: string;
  title: string;
  dueDate: Date;
  isOverdue: boolean;
}

export function useStudentProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['student-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await api.get('/student/profile');
      return data;
    },
    enabled: !!user,
  });
}

export function usePendingTasks() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['pending-tasks', user?.id],
    queryFn: async (): Promise<PendingTask[]> => {
      if (!user) return [];
      const { data } = await api.get('/student/pending-tasks');
      return (data || []).map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate),
      }));
    },
    enabled: !!user,
  });
}

export function useHomeworkBySubject(subjectCode: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['homework', subjectCode, user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await api.get(`/subjects/${subjectCode}/homework`);
      return (data || []).map((assignment: any) => ({
        ...assignment,
        dueDate: new Date(assignment.dueDate),
        assignedDate: new Date(assignment.assignedDate),
        submittedAt: assignment.submittedAt ? new Date(assignment.submittedAt) : undefined,
      }));
    },
    enabled: !!user && !!subjectCode,
  });
}

export function useNotesBySubject(subjectCode: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['notes', subjectCode, user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await api.get(`/subjects/${subjectCode}/notes`);
      return (data || []).map((note: any) => ({
        ...note,
        submittedAt: note.submittedAt ? new Date(note.submittedAt) : undefined,
      }));
    },
    enabled: !!user && !!subjectCode,
  });
}

export function useTestsBySubject(subjectCode: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tests', subjectCode, user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await api.get(`/subjects/${subjectCode}/tests`);
      return (data || []).map((test: any) => ({
        ...test,
        scheduledDate: test.scheduledDate ? new Date(test.scheduledDate) : undefined,
        completedAt: test.completedAt ? new Date(test.completedAt) : undefined,
      }));
    },
    enabled: !!user && !!subjectCode,
  });
}

export function useResourcesBySubject(subjectCode: string) {
  return useQuery({
    queryKey: ['resources', subjectCode],
    queryFn: async () => {
      const { data } = await api.get(`/subjects/${subjectCode}/resources`);
      return data || [];
    },
    enabled: !!subjectCode,
  });
}
