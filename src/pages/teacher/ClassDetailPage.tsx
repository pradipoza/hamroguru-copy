import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Users, 
  ClipboardList, 
  TrendingUp, 
  BookOpen,
  Sparkles,
  AlertTriangle,
  Star,
  Loader2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export default function ClassDetailPage() {
  const { classId } = useParams();
  const { user } = useAuth();

  // Fetch class info
  const { data: classInfo, isLoading: classLoading } = useQuery({
    queryKey: ['classDetail', classId],
    queryFn: async () => {
      const { data: classData, error } = await supabase
        .from('classes')
        .select('*, schools(name)')
        .eq('id', classId)
        .maybeSingle();

      if (error) throw error;
      if (!classData) return null;

      // Get subject for this teacher's assignment
      const { data: assignment } = await supabase
        .from('teacher_class_assignments')
        .select('subjects(name, code)')
        .eq('class_id', classId)
        .eq('teacher_id', user?.id)
        .maybeSingle();

      const subjectData = (assignment as any)?.subjects;

      return {
        id: classData.id,
        name: `Grade ${classData.grade}${classData.section}`,
        grade: classData.grade,
        section: classData.section,
        subjectName: subjectData?.name || 'Unknown',
        subjectCode: subjectData?.code || '',
      };
    },
    enabled: !!classId && !!user?.id,
  });

  // Fetch students
  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ['classStudents', classId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_profiles')
        .select(`
          id,
          user_id,
          profiles:user_id(full_name)
        `)
        .eq('class_id', classId);

      if (error) throw error;

      // Get submission stats for each student
      const studentsWithStats = await Promise.all(
        (data || []).map(async (student) => {
          const profileData = student.profiles as any;

          const { data: submissions } = await supabase
            .from('homework_submissions')
            .select('score, status, submitted_at')
            .eq('student_id', student.user_id);

          const scores = (submissions || []).filter(s => s.score !== null).map(s => s.score || 0);
          const avgScore = scores.length > 0 
            ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
            : 0;

          const totalSubmissions = submissions?.length || 0;
          const { count: totalAssignments } = await supabase
            .from('homework_assignments')
            .select('*', { count: 'exact', head: true })
            .eq('class_id', classId);

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
            averageScore: avgScore,
            submissionRate,
            lastActive: new Date(lastSubmission?.submitted_at || Date.now() - 86400000),
          };
        })
      );

      return studentsWithStats.sort((a, b) => b.averageScore - a.averageScore);
    },
    enabled: !!classId,
  });

  // Fetch assignments
  const { data: assignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ['classAssignments', classId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homework_assignments')
        .select('*')
        .eq('class_id', classId)
        .eq('teacher_id', user?.id)
        .order('due_date', { ascending: false });

      if (error) throw error;

      const assignmentsWithStats = await Promise.all(
        (data || []).map(async (assignment) => {
          const { count: studentCount } = await supabase
            .from('student_profiles')
            .select('*', { count: 'exact', head: true })
            .eq('class_id', classId);

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
            chapter: assignment.chapter,
            dueDate: new Date(assignment.due_date),
            totalStudents: studentCount || 0,
            submittedCount,
            gradedCount,
          };
        })
      );

      return assignmentsWithStats;
    },
    enabled: !!classId && !!user?.id,
  });

  // Fetch pending submissions
  const { data: pendingSubmissions } = useQuery({
    queryKey: ['classPendingSubmissions', classId, user?.id],
    queryFn: async () => {
      const { data: assignmentIds } = await supabase
        .from('homework_assignments')
        .select('id, title')
        .eq('class_id', classId)
        .eq('teacher_id', user?.id);

      if (!assignmentIds || assignmentIds.length === 0) return [];

      const ids = assignmentIds.map(a => a.id);
      const assignmentMap = new Map(assignmentIds.map(a => [a.id, a.title]));

      const { data: submissions, error } = await supabase
        .from('homework_submissions')
        .select('*, profiles:student_id(full_name)')
        .in('assignment_id', ids)
        .eq('status', 'submitted');

      if (error) throw error;

      return (submissions || []).map(s => ({
        id: s.id,
        studentName: (s.profiles as any)?.full_name || 'Unknown',
        homeworkTitle: assignmentMap.get(s.assignment_id) || 'Unknown',
        aiSuggestion: (s.ai_feedback as any)?.suggestion || null,
      }));
    },
    enabled: !!classId && !!user?.id,
  });

  const isLoading = classLoading || studentsLoading || assignmentsLoading;

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!classInfo) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Class not found</p>
        <Button asChild className="mt-4">
          <Link to="/teacher/classes">Back to Classes</Link>
        </Button>
      </div>
    );
  }

  const studentCount = students?.length || 0;
  const avgScore = students && students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + s.averageScore, 0) / students.length)
    : 0;
  const pendingCount = pendingSubmissions?.length || 0;
  const topPerformers = (students || []).filter(s => s.averageScore >= 85);
  const needsAttention = (students || []).filter(s => s.averageScore < 65 && s.averageScore > 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/teacher/classes">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">{classInfo.name}</h1>
          <p className="text-muted-foreground">{classInfo.subjectName} • {studentCount} students</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{studentCount}</p>
              <p className="text-xs text-muted-foreground">Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{avgScore}%</p>
              <p className="text-xs text-muted-foreground">Average</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{assignments?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Assignments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students" className="gap-2">
            <Users className="w-4 h-4" />
            Students
          </TabsTrigger>
          <TabsTrigger value="assignments" className="gap-2">
            <ClipboardList className="w-4 h-4" />
            Assignments
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Student Roster</CardTitle>
            </CardHeader>
            <CardContent>
              {students && students.length > 0 ? (
                <div className="space-y-2">
                  {students.map((student) => (
                    <div 
                      key={student.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{student.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Last active {formatDistanceToNow(student.lastActive, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{student.averageScore}%</p>
                          <p className="text-xs text-muted-foreground">Average</p>
                        </div>
                        <div className="w-20">
                          <Progress value={student.submissionRate} className="h-2" />
                          <p className="text-xs text-muted-foreground text-right mt-1">
                            {student.submissionRate}% submitted
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No students in this class
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Assignments</CardTitle>
                <Button size="sm">Create Assignment</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {assignments && assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <div 
                    key={assignment.id}
                    className="p-4 rounded-lg border border-border"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{assignment.title}</h4>
                        <p className="text-sm text-muted-foreground">{assignment.chapter}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Due {formatDistanceToNow(assignment.dueDate, { addSuffix: true })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">
                          {assignment.submittedCount}/{assignment.totalStudents}
                        </p>
                        <p className="text-xs text-muted-foreground">submitted</p>
                        {assignment.gradedCount < assignment.submittedCount && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            {assignment.submittedCount - assignment.gradedCount} to grade
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Progress 
                      value={(assignment.submittedCount / assignment.totalStudents) * 100} 
                      className="h-2 mt-3" 
                    />
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No assignments yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Pending Submissions */}
          {pendingSubmissions && pendingSubmissions.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Pending Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {pendingSubmissions.map((submission) => (
                  <div 
                    key={submission.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="font-medium text-sm">{submission.studentName}</p>
                      <p className="text-xs text-muted-foreground">{submission.homeworkTitle}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {submission.aiSuggestion && (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <Sparkles className="w-3 h-3" />
                          AI
                        </Badge>
                      )}
                      <Button size="sm" variant="outline">Grade</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Top Performers */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-warning" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topPerformers.length > 0 ? (
                  <div className="space-y-2">
                    {topPerformers.slice(0, 5).map((student, index) => (
                      <div 
                        key={student.id}
                        className="flex items-center gap-3 p-2 rounded-lg bg-success/5"
                      >
                        <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center text-xs font-medium text-success">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium">{student.name}</span>
                        <span className="ml-auto text-sm text-muted-foreground">{student.averageScore}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No top performers yet
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Needs Attention */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  Needs Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                {needsAttention.length > 0 ? (
                  <div className="space-y-2">
                    {needsAttention.map((student) => (
                      <div 
                        key={student.id}
                        className="flex items-center gap-3 p-2 rounded-lg bg-destructive/5"
                      >
                        <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center">
                          <AlertTriangle className="w-3 h-3 text-destructive" />
                        </div>
                        <span className="text-sm font-medium">{student.name}</span>
                        <span className="ml-auto text-sm text-muted-foreground">{student.averageScore}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    All students are on track! 🎉
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Class Performance Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Average Score</span>
                    <span className="text-lg font-semibold">{avgScore}%</span>
                  </div>
                  <Progress value={avgScore} className="h-3" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Top Performer Rate</span>
                    <span className="text-lg font-semibold">
                      {studentCount > 0 ? Math.round((topPerformers.length / studentCount) * 100) : 0}%
                    </span>
                  </div>
                  <Progress 
                    value={studentCount > 0 ? (topPerformers.length / studentCount) * 100 : 0} 
                    className="h-3" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
