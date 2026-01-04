import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  math: '📐',
  science: '🔬',
  english: '📚',
  nepali: '📖',
  social: '🌍',
  computer: '💻',
};

export function useSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: async (): Promise<SubjectWithCounts[]> => {
      const { data: subjects, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');

      if (error) throw error;

      // For now, return subjects with 0 counts (will be dynamic when user is assigned to a class)
      return (subjects || []).map(subject => ({
        id: subject.code, // Use code as ID for backward compatibility
        name: subject.name,
        name_nepali: subject.name_nepali,
        code: subject.code,
        icon: subjectIcons[subject.code] || '📘',
        color: subject.code, // Uses code for color class
        pendingHomework: 0,
        pendingNotes: 0,
        upcomingTests: 0,
      }));
    },
  });
}

export function useSubjectByCode(code: string) {
  return useQuery({
    queryKey: ['subject', code],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('code', code)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) return null;

      return {
        id: data.code,
        name: data.name,
        nameNepali: data.name_nepali || '',
        code: data.code,
        icon: subjectIcons[data.code] || '📘',
        color: data.code,
        description: data.description,
      };
    },
    enabled: !!code,
  });
}
