import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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

      const { data, error } = await supabase
        .from('student_profiles')
        .select(`
          *,
          class:classes(
            id,
            grade,
            section,
            school:schools(name)
          )
        `)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
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

      const now = new Date();
      const tasks: PendingTask[] = [];

      // Get student's class
      const { data: studentProfile } = await supabase
        .from('student_profiles')
        .select('class_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!studentProfile?.class_id) {
        return [];
      }

      // Get pending homework assignments
      const { data: assignments } = await supabase
        .from('homework_assignments')
        .select(`
          id,
          title,
          due_date,
          subject:subjects(name, code)
        `)
        .eq('class_id', studentProfile.class_id)
        .gte('due_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      // Get user's submissions
      const { data: submissions } = await supabase
        .from('homework_submissions')
        .select('assignment_id')
        .eq('student_id', user.id);

      const submittedIds = new Set(submissions?.map(s => s.assignment_id) || []);

      assignments?.forEach(assignment => {
        if (!submittedIds.has(assignment.id)) {
          const dueDate = new Date(assignment.due_date);
          tasks.push({
            id: assignment.id,
            type: 'homework',
            subjectCode: (assignment.subject as any)?.code || '',
            subjectName: (assignment.subject as any)?.name || '',
            title: assignment.title,
            dueDate,
            isOverdue: dueDate < now,
          });
        }
      });

      // Get pending notes
      const { data: notes } = await supabase
        .from('student_notes')
        .select(`
          id,
          topic,
          subject:subjects(name, code)
        `)
        .eq('student_id', user.id)
        .eq('status', 'pending');

      notes?.forEach(note => {
        tasks.push({
          id: note.id,
          type: 'notes',
          subjectCode: (note.subject as any)?.code || '',
          subjectName: (note.subject as any)?.name || '',
          title: note.topic,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          isOverdue: false,
        });
      });

      // Get upcoming tests
      const { data: tests } = await supabase
        .from('tests')
        .select(`
          id,
          title,
          scheduled_date,
          subject:subjects(name, code)
        `)
        .eq('class_id', studentProfile.class_id)
        .in('status', ['upcoming', 'available']);

      tests?.forEach(test => {
        tasks.push({
          id: test.id,
          type: 'test',
          subjectCode: (test.subject as any)?.code || '',
          subjectName: (test.subject as any)?.name || '',
          title: test.title,
          dueDate: test.scheduled_date ? new Date(test.scheduled_date) : new Date(),
          isOverdue: false,
        });
      });

      // Sort: overdue first, then by due date
      return tasks.sort((a, b) => {
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;
        return a.dueDate.getTime() - b.dueDate.getTime();
      });
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

      // Get subject ID
      const { data: subject } = await supabase
        .from('subjects')
        .select('id')
        .eq('code', subjectCode)
        .single();

      if (!subject) return [];

      // Get student's class
      const { data: studentProfile } = await supabase
        .from('student_profiles')
        .select('class_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!studentProfile?.class_id) return [];

      // Get assignments with submissions
      const { data: assignments } = await supabase
        .from('homework_assignments')
        .select(`
          *,
          submissions:homework_submissions(*)
        `)
        .eq('subject_id', subject.id)
        .eq('class_id', studentProfile.class_id)
        .order('due_date', { ascending: false });

      return (assignments || []).map(assignment => {
        const userSubmission = assignment.submissions?.find(
          (s: any) => s.student_id === user.id
        );

        return {
          id: assignment.id,
          subjectId: subjectCode,
          title: assignment.title,
          description: assignment.description || '',
          chapter: assignment.chapter || '',
          dueDate: new Date(assignment.due_date),
          assignedDate: new Date(assignment.created_at),
          status: userSubmission?.status || 'pending',
          score: userSubmission?.score,
          feedback: userSubmission?.teacher_feedback,
          submittedAt: userSubmission?.submitted_at ? new Date(userSubmission.submitted_at) : undefined,
        };
      });
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

      const { data: subject } = await supabase
        .from('subjects')
        .select('id')
        .eq('code', subjectCode)
        .single();

      if (!subject) return [];

      const { data: notes } = await supabase
        .from('student_notes')
        .select('*')
        .eq('subject_id', subject.id)
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });

      return (notes || []).map(note => ({
        id: note.id,
        subjectId: subjectCode,
        chapter: note.chapter,
        topic: note.topic,
        isCompleted: note.status !== 'pending',
        submittedAt: note.created_at ? new Date(note.created_at) : undefined,
        verified: note.status === 'verified',
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

      const { data: subject } = await supabase
        .from('subjects')
        .select('id')
        .eq('code', subjectCode)
        .single();

      if (!subject) return [];

      const { data: studentProfile } = await supabase
        .from('student_profiles')
        .select('class_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!studentProfile?.class_id) return [];

      const { data: tests } = await supabase
        .from('tests')
        .select(`
          *,
          results:test_results(*)
        `)
        .eq('subject_id', subject.id)
        .eq('class_id', studentProfile.class_id)
        .order('scheduled_date', { ascending: true });

      return (tests || []).map(test => {
        const userResult = test.results?.find((r: any) => r.student_id === user.id);

        return {
          id: test.id,
          subjectId: subjectCode,
          title: test.title,
          chapter: test.chapter || '',
          totalQuestions: test.total_questions,
          duration: test.duration,
          scheduledDate: test.scheduled_date ? new Date(test.scheduled_date) : undefined,
          completedAt: userResult?.completed_at ? new Date(userResult.completed_at) : undefined,
          score: userResult?.score,
          totalMarks: test.total_marks,
          status: userResult ? 'completed' : test.status,
        };
      });
    },
    enabled: !!user && !!subjectCode,
  });
}

export function useResourcesBySubject(subjectCode: string) {
  return useQuery({
    queryKey: ['resources', subjectCode],
    queryFn: async () => {
      const { data: subject } = await supabase
        .from('subjects')
        .select('id')
        .eq('code', subjectCode)
        .single();

      if (!subject) return [];

      const { data: resources } = await supabase
        .from('resources')
        .select('*')
        .eq('subject_id', subject.id)
        .order('created_at', { ascending: false });

      return (resources || []).map(resource => ({
        id: resource.id,
        subjectId: subjectCode,
        chapter: resource.chapter || '',
        title: resource.title,
        type: resource.type as 'video' | 'pdf' | 'notes' | 'practice',
        url: resource.url || '#',
        isBookmarked: resource.is_bookmarked,
        recommended: resource.recommended,
      }));
    },
    enabled: !!subjectCode,
  });
}
