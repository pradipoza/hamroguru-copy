import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PendingTask } from '@/lib/types';
import { subjects } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Clock, FileText, BookOpen, ClipboardCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PendingTasksListProps {
  tasks: PendingTask[];
}

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

export function PendingTasksList({ tasks }: PendingTasksListProps) {
  if (tasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pending Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <ClipboardCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>All caught up! No pending tasks.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Pending Tasks
          <Badge variant="secondary" className="ml-auto">{tasks.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.slice(0, 6).map((task) => {
          const subject = subjects.find((s) => s.id === task.subjectId);
          const Icon = taskIcons[task.type];

          return (
            <Link
              key={task.id}
              to={`/subject/${task.subjectId}?tab=${task.type === 'test' ? 'tests' : task.type}`}
              className="block"
            >
              <div
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border transition-colors hover:bg-accent',
                  task.isOverdue && 'border-destructive/50 bg-destructive/5'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center text-white',
                  `bg-subject-${subject?.color}`
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{task.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{subject?.name}</span>
                    <span>•</span>
                    <span>{taskLabels[task.type]}</span>
                  </div>
                </div>
                <div className={cn(
                  'text-xs text-right whitespace-nowrap',
                  task.isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'
                )}>
                  {formatDueDate(task.dueDate, task.isOverdue)}
                </div>
              </div>
            </Link>
          );
        })}
        {tasks.length > 6 && (
          <p className="text-center text-sm text-muted-foreground pt-2">
            +{tasks.length - 6} more tasks
          </p>
        )}
      </CardContent>
    </Card>
  );
}