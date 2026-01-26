import { mockPendingTasks } from '@/lib/demoMockData';

// Define the type based on the mock data structure for the demo
type PendingTask = typeof mockPendingTasks[0];
import { cn } from '@/lib/utils';
import { FileText, BookOpen, ClipboardCheck, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const taskIcons = {
  homework: FileText,
  notes: BookOpen,
  test: ClipboardCheck,
};

const taskLabels = {
  homework: 'Homework',
  notes: 'Notes',
  test: 'Test',
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
    return overdueDays === 0 ? 'Due today' : `${overdueDays} day${overdueDays > 1 ? 's' : ''} overdue`;
  }
  
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `Due in ${days} days`;
}

export default function PendingTasksPage() {
  const tasks = mockPendingTasks;
  const isLoading = false;
  
  const overdueTasks = tasks?.filter(t => t.isOverdue) || [];
  const upcomingTasks = tasks?.filter(t => !t.isOverdue) || [];

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Pending Tasks</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {tasks?.length || 0} task{tasks?.length !== 1 ? 's' : ''} remaining
        </p>
      </div>

      {/* Overdue Section */}
      {overdueTasks.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <h2 className="text-sm font-medium text-destructive">Overdue</h2>
          </div>
          <div className="space-y-2">
            {overdueTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Section */}
      {upcomingTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-medium text-muted-foreground">Upcoming</h2>
          </div>
          <div className="space-y-2">
            {upcomingTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {(!tasks || tasks.length === 0) && (
        <div className="text-center py-16">
          <ClipboardCheck className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-muted-foreground">All caught up! No pending tasks.</p>
        </div>
      )}
    </div>
  );
}

function TaskItem({ task }: { task: PendingTask }) {
  const Icon = taskIcons[task.type];
  const colorClass = subjectColors[task.subjectCode] || 'bg-primary';

  return (
    <Link
      to={`/subject/${task.subjectCode}?tab=${task.type === 'test' ? 'tests' : task.type}`}
      className="block"
    >
      <div
        className={cn(
          'flex items-center gap-4 p-4 rounded-lg border bg-card transition-colors hover:bg-accent/50',
          task.isOverdue && 'border-destructive/30 bg-destructive/5'
        )}
      >
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0',
          colorClass
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground">{task.title}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
            <span>{task.subjectName}</span>
            <span>•</span>
            <span>{taskLabels[task.type]}</span>
          </div>
        </div>
        <div className={cn(
          'text-xs whitespace-nowrap',
          task.isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'
        )}>
          {formatDueDate(task.dueDate, task.isOverdue)}
        </div>
      </div>
    </Link>
  );
}
