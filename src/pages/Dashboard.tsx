import { Link } from 'react-router-dom';
import { ChevronRight, Clock, FileText, BookOpen, ClipboardCheck, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '@/services/student.api';
import { SubjectCard } from '@/components/dashboard/SubjectCard';
import { Card } from '@/components/ui/card';

const taskIcons: { [key: string]: React.ElementType } = {
  homework: FileText,
  notes: BookOpen,
  test: ClipboardCheck,
};

const subjectColors: Record<string, string> = {
  math: 'bg-subject-math',
  science: 'bg-subject-science',
  english: 'bg-subject-english',
  nepali: 'bg-subject-nepali',
  social: 'bg-subject-social',
  computer: 'bg-subject-computer',
};

function formatDueDate(date: Date, isOverdue: boolean): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (isOverdue) {
    const overdueDays = Math.abs(days);
    return overdueDays === 0 ? 'Today' : `${overdueDays}d overdue`;
  }
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `${days}d`;
}

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
  });

  const { profile, subjects, pendingTasks } = data || {};

  const displayTasks = pendingTasks?.slice(0, 4) || [];
  const remainingTasks = (pendingTasks?.length || 0) - 4;

  const firstName = profile?.fullName?.split(' ')[0] || 'Student';

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Welcome Section */}
      <section className="mb-8">
        <h1 className="text-xl font-semibold text-foreground">
          Welcome back, {firstName}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isLoading ? (
            'Loading your dashboard...'
          ) : isError ? (
            'Could not load your tasks.'
          ) : pendingTasks && pendingTasks.length > 0 ? (
            `You have ${pendingTasks.length} pending task${pendingTasks.length > 1 ? 's' : ''}`
          ) : (
            'You\'re all caught up!'
          )}
        </p>
      </section>

      {/* Subject Cards */}
      <section className="mb-8">
        <h2 className="text-sm font-medium text-muted-foreground mb-4">Your Classes</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <Card className="p-8 text-center">
            <p className="text-destructive">Failed to load subjects.</p>
          </Card>
        ) : subjects && subjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject: any) => (
              <SubjectCard 
                key={subject.id} 
                subject={{
                  id: subject.code as 'math' | 'science' | 'english' | 'nepali' | 'social' | 'computer',
                  name: subject.name,
                  nameNepali: subject.nameNepali || '',
                  teacherName: subject.teacherName || null,
                  icon: subject.icon,
                  color: (subject.color || subject.code) as 'math' | 'science' | 'english' | 'nepali' | 'social' | 'computer',
                  pendingHomework: subject.pendingHomework || 0,
                  pendingNotes: subject.pendingNotes || 0,
                  upcomingTests: subject.upcomingTests || 0,
                  classGrade: subject.classGrade || null,
                  classSection: subject.classSection || null,
                  studentCount: subject.studentCount || 0,
                }} 
              />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No subjects available yet.</p>
          </Card>
        )}
      </section>

      {/* Pending Tasks Preview */}
      {!isLoading && !isError && pendingTasks && pendingTasks.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-medium text-muted-foreground">Due Soon</h2>
            </div>
            {pendingTasks.length > 4 && (
              <Link 
                to="/tasks" 
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View all
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
          <div className="space-y-2">
            {displayTasks.map((task: any) => {
              // Assuming all tasks are homework for now
              const Icon = taskIcons['homework'];
              const subject = subjects.find((s: any) => s.name === task.subject);
              const subjectCode = subject?.code || 'general';
              const colorClass = subjectColors[subjectCode] || 'bg-primary';
              const dueDate = new Date(task.dueDate);
              const isOverdue = dueDate < new Date();

              return (
                <Link
                  key={task.id}
                  to={`/subject/${subjectCode}?tab=homework`}
                  className="block"
                >
                  <div
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg border bg-card transition-colors hover:bg-accent/50',
                      isOverdue && 'border-destructive/30'
                    )}
                  >
                    <div className={cn(
                      'w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0',
                      colorClass
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.subject}</p>
                    </div>
                    <span className={cn(
                      'text-xs whitespace-nowrap',
                      isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'
                    )}>
                      {formatDueDate(dueDate, isOverdue)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          {remainingTasks > 0 && (
            <Link 
              to="/tasks"
              className="block mt-3 text-center text-sm text-muted-foreground hover:text-foreground"
            >
              +{remainingTasks} more task{remainingTasks > 1 ? 's' : ''}
            </Link>
          )}
        </section>
      )}
    </div>
  );
}
