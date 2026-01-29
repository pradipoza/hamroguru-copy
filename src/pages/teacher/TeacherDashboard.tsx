import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  ClipboardCheck, 
  Clock, 
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useTeacherAssignments, useTeacherClasses, useTeacherProfile, useTeacherSubmissions } from '@/hooks/useTeacherData';

export default function TeacherDashboard() {
  const { data: profileData, isLoading: profileLoading } = useTeacherProfile();
  const { data: classes = [], isLoading: classesLoading } = useTeacherClasses();
  const { data: submissions = [], isLoading: submissionsLoading } = useTeacherSubmissions('pending_review');
  const { data: assignments = [], isLoading: assignmentsLoading } = useTeacherAssignments();

  const isLoading = profileLoading || classesLoading || submissionsLoading || assignmentsLoading;
  const profile = profileData?.profile;
  const totalStudents = classes.reduce((sum, item) => sum + (item.studentCount || 0), 0);
  const totalPending = submissions.length;
  const avgScore = classes.length > 0
    ? Math.round(classes.reduce((sum, item) => sum + (item.averageScore || 0), 0) / classes.length)
    : 0;

  const upcomingDeadlines = (assignments || [])
    .filter(a => new Date(a.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const firstName = profile?.fullName?.split(' ')[0] || 'Teacher';

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Welcome back, {firstName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your classes today
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/teacher/assignments">
              <Plus className="w-4 h-4 mr-2" />
              Create Assignment
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{totalStudents}</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{totalPending}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{avgScore}%</p>
                <p className="text-sm text-muted-foreground">Class Average</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{classes?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Active Classes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Recent Submissions</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/teacher/assignments">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {(submissions || []).slice(0, 4).map((submission) => (
              <div 
                key={submission.id} 
                className="flex items-start justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{submission.studentName}</p>
                  <p className="text-xs text-muted-foreground truncate">{submission.homeworkTitle}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(submission.submittedAt, { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  {submission.aiSuggestion && (
                    <Badge variant="secondary" className="text-xs gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">Review</Badge>
                </div>
              </div>
            ))}
            {(!submissions || submissions.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No pending submissions
              </p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Upcoming Deadlines</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/teacher/assignments">
                  Manage
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingDeadlines.map((assignment) => (
              <div 
                key={assignment.id} 
                className="flex items-start justify-between p-3 rounded-lg border border-border"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{assignment.title}</p>
                  <p className="text-xs text-muted-foreground">{assignment.className}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Due {formatDistanceToNow(assignment.dueDate, { addSuffix: true })}
                  </p>
                </div>
                <div className="text-right ml-3">
                  <p className="text-sm font-medium">
                    {assignment.submittedCount}/{assignment.totalStudents}
                  </p>
                  <p className="text-xs text-muted-foreground">submitted</p>
                </div>
              </div>
            ))}
            {upcomingDeadlines.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No upcoming deadlines
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Classes Overview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Your Classes</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/teacher/classes">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {classes && classes.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((classInfo) => (
                <Link 
                  key={classInfo.id} 
                  to={`/teacher/class/${classInfo.classId}`}
                  className="block"
                >
                  <div className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{classInfo.className}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {classInfo.studentCount} students
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Avg. Score</span>
                      <span className="font-medium">{classInfo.averageScore}%</span>
                    </div>
                    {classInfo.pendingSubmissions > 0 && (
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-muted-foreground">Pending</span>
                        <Badge variant="destructive" className="text-xs">
                          {classInfo.pendingSubmissions}
                        </Badge>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No classes assigned yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
