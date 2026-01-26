import { Subject } from '@/lib/types';
import { mockMathTests } from '@/lib/demoMockData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, Clock, Calendar, Play, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface TestsTabProps {
  subject: Subject;
}

const statusConfig = {
  upcoming: { label: 'Upcoming', variant: 'secondary' as const },
  available: { label: 'Available', variant: 'default' as const },
  completed: { label: 'Completed', variant: 'outline' as const },
};

function TestCard({ test }: { test: any }) {
  const config = statusConfig[test.status as keyof typeof statusConfig] || statusConfig.upcoming;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm">{test.title}</h4>
            {test.chapter && (
              <p className="text-xs text-muted-foreground mt-1">{test.chapter}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {test.duration} mins
              </span>
              <span>{test.totalQuestions} questions</span>
              <span>{test.totalMarks} marks</span>
            </div>
          </div>
          <Badge variant={config.variant}>{config.label}</Badge>
        </div>

        <div className="flex items-center justify-between mt-4">
          {test.scheduledDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {format(new Date(test.scheduledDate), 'MMM d, yyyy')}
            </div>
          )}
          {test.status === 'available' && (
            <Button size="sm" className="gap-1">
              <Play className="w-3 h-3" />
              Start Test
            </Button>
          )}
          {test.status === 'completed' && test.score !== undefined && (
            <Badge variant="secondary" className="text-base px-3">
              {test.score}/{test.totalMarks}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function TestsTab({ subject }: TestsTabProps) {
  // For the demo, we'll show math tests for any subject.
  const tests = mockMathTests;
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!tests || tests.length === 0) {
    return (
      <Card className="p-8 text-center">
        <ClipboardCheck className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
        <p className="text-muted-foreground">No tests scheduled yet.</p>
      </Card>
    );
  }

  const available = tests.filter(t => t.status === 'available');
  const upcoming = tests.filter(t => t.status === 'upcoming');
  const completed = tests.filter(t => t.status === 'completed');

  return (
    <div className="space-y-6">
      {available.length > 0 && (
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-3">
            Available Now ({available.length})
          </h3>
          <div className="space-y-3">
            {available.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-3">
            Upcoming ({upcoming.length})
          </h3>
          <div className="space-y-3">
            {upcoming.map((test) => (
              <TestCard key={test.id} test={test} />
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
            {completed.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
