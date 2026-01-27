import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface SubjectWithCounts {
  id: string;
  name: string;
  name_nepali: string | null;
  code: string;
  icon: string;
  color: string;
  pendingHomework: number;
  pendingNotes: number;
  upcomingTests: number;
}

const subjectIcons: Record<string, string> = {
  math: 'calculator',
  science: 'flask',
  english: 'book',
  nepali: 'book-open',
  social: 'globe',
  computer: 'laptop',
};

export function useSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: async (): Promise<SubjectWithCounts[]> => {
      const { data: subjects } = await api.get('/subjects');

      return (subjects || []).map((subject: any) => ({
        id: subject.code,
        name: subject.name,
        name_nepali: subject.name_nepali,
        code: subject.code,
        icon: subjectIcons[subject.code] || 'book',
        color: subject.code,
        pendingHomework: subject.pendingHomework || 0,
        pendingNotes: subject.pendingNotes || 0,
        upcomingTests: subject.upcomingTests || 0,
      }));
    },
  });
}

export function useSubjectByCode(code: string) {
  return useQuery({
    queryKey: ['subject', code],
    queryFn: async () => {
      const { data } = await api.get(`/subjects/${code}`);
      
      if (!data) return null;

      return {
        id: data.code,
        name: data.name,
        nameNepali: data.name_nepali || '',
        code: data.code,
        icon: subjectIcons[data.code] || 'book',
        color: data.code,
        description: data.description,
      };
    },
    enabled: !!code,
  });
}
