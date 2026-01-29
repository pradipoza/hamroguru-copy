import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Award, Target, BookOpen, Loader2 } from 'lucide-react';
import { useStudentProgress } from '@/hooks/useStudentData';
import { formatDistanceToNow } from 'date-fns';

export default function ProgressPage() {
  const { data, isLoading, isError } = useStudentProgress();

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center text-muted-foreground">
        Unable to load progress right now.
      </div>
    );
  }

  const { 
    overallProgress, 
    completedAssignments, 
    totalAssignments, 
    streakDays, 
    totalPoints, 
    subjectProgress, 
    recentActivity 
  } = data;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">My Progress</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your academic performance
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{overallProgress}%</p>
                <p className="text-xs text-muted-foreground">Overall</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{completedAssignments}/{totalAssignments}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{streakDays}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{totalPoints}</p>
                <p className="text-xs text-muted-foreground">Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Subject Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subjectProgress.map((subject) => (
            <div key={subject.subject} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span>{subject.icon}</span>
                  <span className="font-medium">{subject.subject}</span>
                </div>
                <span className="text-muted-foreground">{subject.progress}%</span>
              </div>
              <Progress value={subject.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.subject}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
