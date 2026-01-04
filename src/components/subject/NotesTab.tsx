import { Subject } from '@/lib/types';
import { useNotesBySubject } from '@/hooks/useStudentData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CheckCircle2, Upload, Loader2 } from 'lucide-react';

interface NotesTabProps {
  subject: Subject;
}

export function NotesTab({ subject }: NotesTabProps) {
  const { data: notes, isLoading } = useNotesBySubject(subject.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <Card className="p-8 text-center">
        <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
        <p className="text-muted-foreground">No notes to track yet.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Notes will appear here when assigned by your teacher.
        </p>
      </Card>
    );
  }

  const completed = notes.filter(n => n.isCompleted).length;
  const progress = (completed / notes.length) * 100;

  // Group notes by chapter
  const groupedNotes = notes.reduce((acc, note) => {
    if (!acc[note.chapter]) {
      acc[note.chapter] = [];
    }
    acc[note.chapter].push(note);
    return acc;
  }, {} as Record<string, typeof notes>);

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Notes Progress</span>
            <span className="text-sm text-muted-foreground">
              {completed}/{notes.length} completed
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Notes by Chapter */}
      {Object.entries(groupedNotes).map(([chapter, chapterNotes]) => (
        <div key={chapter}>
          <h3 className="font-medium text-sm text-muted-foreground mb-3">{chapter}</h3>
          <div className="space-y-2">
            {chapterNotes.map((note) => (
              <Card key={note.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        note.isCompleted ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'
                      }`}>
                        {note.isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <BookOpen className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{note.topic}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {note.verified && (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </Badge>
                      )}
                      {!note.isCompleted && (
                        <Button size="sm" variant="outline" className="gap-1">
                          <Upload className="w-3 h-3" />
                          Upload
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
