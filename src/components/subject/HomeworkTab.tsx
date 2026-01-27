import { Subject } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { getHomeworkForSubject } from '@/services/subject.api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface HomeworkTabProps {
  subject: Subject;
}

const statusConfig = {
  pending: { label: 'Pending', variant: 'outline' as const, icon: Clock },
  submitted: { label: 'Submitted', variant: 'secondary' as const, icon: FileText },
  checked: { label: 'Checked', variant: 'default' as const, icon: CheckCircle2 },
  reviewed: { label: 'Reviewed', variant: 'default' as const, icon: CheckCircle2 },
  late: { label: 'Late', variant: 'destructive' as const, icon: AlertCircle },
  missed: { label: 'Missed', variant: 'destructive' as const, icon: AlertCircle },
};

function HomeworkCard({ homework }: { homework: any }) {
  const config = statusConfig[homework.status as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;
  const dueDate = new Date(homework.dueDate);
  const isOverdue = homework.status === 'pending' && dueDate < new Date();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm">{homework.title}</h4>
            {homework.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {homework.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              {homework.chapter && <span>{homework.chapter}</span>}
            </div>
          </div>
          <Badge variant={config.variant} className="gap-1 shrink-0">
            <Icon className="w-3 h-3" />
            {config.label}
          </Badge>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-muted-foreground">
            {isOverdue ? (
              <span className="text-destructive font-medium">
                Overdue by {formatDistanceToNow(dueDate)}
              </span>
            ) : (
              <span>Due {format(dueDate, 'MMM d, yyyy')}</span>
            )}
          </div>
          {homework.status === 'pending' && (
            <Button size="sm" variant="outline">
              Submit
            </Button>
          )}
          {homework.score !== null && typeof homework.score !== 'undefined' && (
            <Badge variant="secondary">{homework.score} marks</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function HomeworkTab({ subject }: HomeworkTabProps) {
  const { data: homework, isLoading, isError } = useQuery({
    queryKey: ['homework', subject.id],
    queryFn: () => getHomeworkForSubject(subject.id),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !homework) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-destructive" />
        <p className="text-muted-foreground">Could not load homework assignments.</p>
      </Card>
    );
  }

  const pending = homework.filter((hw: any) => hw.status === 'pending');
  const completed = homework.filter((hw: any) => hw.status !== 'pending');

  if (homework.length === 0) {
    return (
      <Card className="p-8 text-center">
        <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
        <p className="text-muted-foreground">No homework assignments yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-3">
            Pending ({pending.length})
          </h3>
          <div className="space-y-3">
            {pending.map((hw: any) => (
              <HomeworkCard key={hw.id} homework={hw} />
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-3">
            Completed ({completed.length})
          </h3>
          <div className="space-y-3">
            {completed.map((hw: any) => (
              <HomeworkCard key={hw.id} homework={hw} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
