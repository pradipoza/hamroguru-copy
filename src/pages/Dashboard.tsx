import { Link } from 'react-router-dom';
import { ChevronRight, Clock, FileText, BookOpen, ClipboardCheck, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockPendingTasks, mockStudentProfile, mockSubjects } from '@/lib/demoMockData';
import { SubjectCard } from '@/components/dashboard/SubjectCard';
import { Card } from '@/components/ui/card';

const taskIcons = {
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
  const profile = mockStudentProfile;
  const subjects = mockSubjects;
  const subjectsLoading = false;
  const pendingTasks = mockPendingTasks;
  const tasksLoading = false;

  const displayTasks = pendingTasks?.slice(0, 4) || [];
  const remainingTasks = (pendingTasks?.length || 0) - 4;

  const firstName = profile?.full_name?.split(' ')[0] || 'Student';

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Welcome Section */}
      <section className="mb-8">
        <h1 className="text-xl font-semibold text-foreground">
          Welcome back, {firstName}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {tasksLoading ? (
            'Loading tasks...'
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
        {subjectsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : subjects && subjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <SubjectCard 
                key={subject.id} 
                subject={{
                  id: subject.code as 'math' | 'science' | 'english' | 'nepali' | 'social' | 'computer',
                  name: subject.name,
                  nameNepali: subject.nameNepali || '',
                  teacher: subject.teacher,
                  icon: subject.icon,
                  color: subject.code as 'math' | 'science' | 'english' | 'nepali' | 'social' | 'computer',
                  pendingHomework: subject.pendingHomework,
                  pendingNotes: subject.pendingNotes,
                  upcomingTests: subject.upcomingTests,
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
      {!tasksLoading && pendingTasks && pendingTasks.length > 0 && (
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
            {displayTasks.map((task) => {
              const Icon = taskIcons[task.type];
              const colorClass = subjectColors[task.subjectCode] || 'bg-primary';

              return (
                <Link
                  key={task.id}
                  to={`/subject/${task.subjectCode}?tab=${task.type === 'test' ? 'tests' : task.type}`}
                  className="block"
                >
                  <div
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg border bg-card transition-colors hover:bg-accent/50',
                      task.isOverdue && 'border-destructive/30'
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
                      <p className="text-xs text-muted-foreground">{task.subjectName}</p>
                    </div>
                    <span className={cn(
                      'text-xs whitespace-nowrap',
                      task.isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'
                    )}>
                      {formatDueDate(task.dueDate, task.isOverdue)}
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
