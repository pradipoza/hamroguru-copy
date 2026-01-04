import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      const { data: teacherProfile, error: teacherError } = await supabase
        .from('teacher_profiles')
        .select('*, schools(*)')
        .eq('user_id', user.id)
        .maybeSingle();

      if (teacherError) throw teacherError;

      return {
        ...profile,
        teacherDetails: teacherProfile,
      };
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

      // Get class assignments for this teacher
      const { data: assignments, error: assignmentError } = await supabase
        .from('teacher_class_assignments')
        .select(`
          id,
          class_id,
          subject_id,
          classes(id, grade, section),
          subjects(id, name, code)
        `)
        .eq('teacher_id', user.id);

      if (assignmentError) throw assignmentError;

      // For each class, calculate metrics
      const classesWithMetrics = await Promise.all(
        (assignments || []).map(async (assignment) => {
          const classData = assignment.classes as any;
          const subjectData = assignment.subjects as any;

          // Get student count for this class
          const { count: studentCount } = await supabase
            .from('student_profiles')
            .select('*', { count: 'exact', head: true })
            .eq('class_id', assignment.class_id);

          // Get pending submissions for this class
          const { data: homeworkAssignments } = await supabase
            .from('homework_assignments')
            .select('id')
            .eq('class_id', assignment.class_id)
            .eq('teacher_id', user.id);

          let pendingCount = 0;
          let totalScore = 0;
          let scoredCount = 0;

          if (homeworkAssignments && homeworkAssignments.length > 0) {
            const assignmentIds = homeworkAssignments.map(a => a.id);
            
            const { count: pending } = await supabase
              .from('homework_submissions')
              .select('*', { count: 'exact', head: true })
              .in('assignment_id', assignmentIds)
              .eq('status', 'submitted');

            pendingCount = pending || 0;

            // Get average score
            const { data: scores } = await supabase
              .from('homework_submissions')
              .select('score')
              .in('assignment_id', assignmentIds)
              .not('score', 'is', null);

            if (scores && scores.length > 0) {
              totalScore = scores.reduce((sum, s) => sum + (s.score || 0), 0);
              scoredCount = scores.length;
            }
          }

          return {
            id: assignment.id,
            classId: assignment.class_id,
            className: `Grade ${classData?.grade}${classData?.section} - ${subjectData?.name}`,
            grade: classData?.grade || 0,
            section: classData?.section || '',
            subjectId: assignment.subject_id,
            subjectName: subjectData?.name || '',
            subjectCode: subjectData?.code || '',
            studentCount: studentCount || 0,
            pendingSubmissions: pendingCount,
            averageScore: scoredCount > 0 ? Math.round(totalScore / scoredCount) : 0,
          };
        })
      );

      return classesWithMetrics;
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

      // Get classes assigned to this teacher
      const { data: teacherClasses, error: classError } = await supabase
        .from('teacher_class_assignments')
        .select('class_id')
        .eq('teacher_id', user.id);

      if (classError) throw classError;

      const classIds = classId 
        ? [classId]
        : (teacherClasses || []).map(tc => tc.class_id);

      if (classIds.length === 0) return [];

      // Get students in these classes
      const { data: students, error: studentError } = await supabase
        .from('student_profiles')
        .select(`
          id,
          user_id,
          class_id,
          classes(grade, section),
          profiles:user_id(full_name)
        `)
        .in('class_id', classIds);

      if (studentError) throw studentError;

      // Calculate metrics for each student
      const studentsWithMetrics = await Promise.all(
        (students || []).map(async (student) => {
          const classData = student.classes as any;
          const profileData = student.profiles as any;

          // Get homework submissions
          const { data: submissions } = await supabase
            .from('homework_submissions')
            .select('score, status, submitted_at')
            .eq('student_id', student.user_id);

          const totalSubmissions = submissions?.length || 0;
          const scores = (submissions || []).filter(s => s.score !== null).map(s => s.score || 0);
          const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
          
          // Get total assignments for this class
          const { count: totalAssignments } = await supabase
            .from('homework_assignments')
            .select('*', { count: 'exact', head: true })
            .eq('class_id', student.class_id);

          const submissionRate = totalAssignments && totalAssignments > 0 
            ? Math.round((totalSubmissions / totalAssignments) * 100)
            : 0;

          const lastSubmission = submissions?.sort((a, b) => 
            new Date(b.submitted_at || 0).getTime() - new Date(a.submitted_at || 0).getTime()
          )[0];

          return {
            id: student.id,
            userId: student.user_id,
            name: profileData?.full_name || 'Unknown',
            grade: classData?.grade || 0,
            section: classData?.section || '',
            averageScore: avgScore,
            submissionRate,
            lastActive: new Date(lastSubmission?.submitted_at || Date.now() - 86400000),
          };
        })
      );

      return studentsWithMetrics.sort((a, b) => b.averageScore - a.averageScore);
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

      const { data: assignments, error } = await supabase
        .from('homework_assignments')
        .select(`
          id,
          title,
          description,
          chapter,
          class_id,
          subject_id,
          due_date,
          created_at,
          classes(grade, section),
          subjects(name, code)
        `)
        .eq('teacher_id', user.id)
        .order('due_date', { ascending: false });

      if (error) throw error;

      const assignmentsWithMetrics = await Promise.all(
        (assignments || []).map(async (assignment) => {
          const classData = assignment.classes as any;
          const subjectData = assignment.subjects as any;

          // Get student count
          const { count: studentCount } = await supabase
            .from('student_profiles')
            .select('*', { count: 'exact', head: true })
            .eq('class_id', assignment.class_id);

          // Get submissions
          const { data: submissions } = await supabase
            .from('homework_submissions')
            .select('status, score')
            .eq('assignment_id', assignment.id);

          const submittedCount = (submissions || []).filter(s => 
            ['submitted', 'checked', 'reviewed'].includes(s.status)
          ).length;
          const gradedCount = (submissions || []).filter(s => 
            ['checked', 'reviewed'].includes(s.status)
          ).length;

          return {
            id: assignment.id,
            title: assignment.title,
            description: assignment.description,
            chapter: assignment.chapter,
            classId: assignment.class_id,
            className: `Grade ${classData?.grade}${classData?.section}`,
            subjectCode: subjectData?.code || '',
            dueDate: new Date(assignment.due_date),
            createdAt: new Date(assignment.created_at),
            totalStudents: studentCount || 0,
            submittedCount,
            gradedCount,
          };
        })
      );

      return assignmentsWithMetrics;
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

      // Get assignments by this teacher
      const { data: assignments, error: assignmentError } = await supabase
        .from('homework_assignments')
        .select('id, title, subjects(code)')
        .eq('teacher_id', user.id);

      if (assignmentError) throw assignmentError;

      if (!assignments || assignments.length === 0) return [];

      const assignmentIds = assignments.map(a => a.id);
      const assignmentMap = new Map(assignments.map(a => [a.id, a]));

      // Get submissions
      let query = supabase
        .from('homework_submissions')
        .select(`
          id,
          assignment_id,
          student_id,
          submitted_at,
          status,
          score,
          ai_feedback
        `)
        .in('assignment_id', assignmentIds)
        .order('submitted_at', { ascending: false });

      if (status === 'pending_review') {
        query = query.eq('status', 'submitted');
      }

      const { data: submissions, error: submissionError } = await query;

      if (submissionError) throw submissionError;

      // Get student names
      const studentIds = [...new Set((submissions || []).map(s => s.student_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', studentIds);

      const profileMap = new Map((profiles || []).map(p => [p.id, p.full_name]));

      return (submissions || []).map(submission => {
        const assignment = assignmentMap.get(submission.assignment_id);
        const subjectData = (assignment as any)?.subjects;
        const aiFeedback = submission.ai_feedback as any;

        return {
          id: submission.id,
          assignmentId: submission.assignment_id,
          homeworkTitle: assignment?.title || 'Unknown',
          studentId: submission.student_id,
          studentName: profileMap.get(submission.student_id) || 'Unknown',
          subjectCode: subjectData?.code || '',
          submittedAt: new Date(submission.submitted_at || Date.now()),
          status: submission.status,
          score: submission.score,
          aiSuggestion: aiFeedback?.suggestion || null,
        };
      });
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

      const { data, error } = await supabase
        .from('lesson_plans')
        .select(`
          *,
          classes(grade, section),
          subjects(name, code)
        `)
        .eq('teacher_id', user.id)
        .order('date', { ascending: true });

      if (error) throw error;

      return (data || []).map(plan => {
        const classData = plan.classes as any;
        const subjectData = plan.subjects as any;

        return {
          id: plan.id,
          classId: plan.class_id,
          className: `Grade ${classData?.grade}${classData?.section} - ${subjectData?.name}`,
          subjectId: plan.subject_id,
          date: new Date(plan.date),
          topics: plan.topics || [],
          studentQueries: plan.student_queries || [],
          weakAreas: plan.weak_areas || [],
          aiRecommendation: plan.ai_recommendation,
          status: plan.status,
          completedAt: plan.completed_at ? new Date(plan.completed_at) : null,
          feedbackCollected: plan.feedback_collected,
        };
      });
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

      const { data, error } = await supabase
        .from('daily_doses')
        .select(`
          *,
          subjects(name, code)
        `)
        .eq('teacher_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      return (data || []).map(dose => {
        const subjectData = dose.subjects as any;

        return {
          id: dose.id,
          title: dose.title,
          description: dose.description,
          content: dose.content,
          topics: dose.topics || [],
          estimatedTime: dose.estimated_time || 15,
          source: dose.source,
          date: new Date(dose.date),
          completed: dose.completed,
          completedAt: dose.completed_at ? new Date(dose.completed_at) : null,
          subjectName: subjectData?.name || '',
        };
      });
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

      const { data, error } = await supabase
        .from('teacher_assessments')
        .select(`
          *,
          subjects(name, code)
        `)
        .eq('teacher_id', user.id)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;

      return (data || []).map(assessment => {
        const subjectData = assessment.subjects as any;

        return {
          id: assessment.id,
          title: assessment.title,
          subjectId: assessment.subject_id,
          subjectName: subjectData?.name || '',
          totalQuestions: assessment.total_questions || 10,
          duration: assessment.duration || 30,
          scheduledDate: assessment.scheduled_date ? new Date(assessment.scheduled_date) : null,
          completedAt: assessment.completed_at ? new Date(assessment.completed_at) : null,
          score: assessment.score,
          status: assessment.status,
        };
      });
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

      const { data, error } = await supabase
        .from('student_queries')
        .select(`
          *,
          subjects(name, code)
        `)
        .eq('teacher_id', user.id)
        .order('asked_at', { ascending: false });

      if (error) throw error;

      // Get student names
      const studentIds = [...new Set((data || []).map(q => q.student_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', studentIds);

      const profileMap = new Map((profiles || []).map(p => [p.id, p.full_name]));

      return (data || []).map(query => {
        const subjectData = query.subjects as any;

        return {
          id: query.id,
          studentId: query.student_id,
          studentName: profileMap.get(query.student_id) || 'Unknown',
          query: query.query_text,
          topic: query.topic,
          status: query.status,
          askedAt: new Date(query.asked_at || query.created_at),
          addressedAt: query.addressed_at ? new Date(query.addressed_at) : null,
          studentFeedback: query.student_feedback,
          subjectName: subjectData?.name || '',
        };
      });
    },
    enabled: !!user?.id,
  });
}
