import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, ClipboardCheck, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTeacherClasses } from '@/hooks/useTeacherData';

export default function ClassesPage() {
  const { data: classes, isLoading } = useTeacherClasses();

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Your Classes</h1>
        <p className="text-muted-foreground mt-1">
          Manage and view all your assigned classes
        </p>
      </div>

      {classes && classes.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((classInfo) => (
            <Link 
              key={classInfo.id} 
              to={`/teacher/class/${classInfo.classId}`}
              className="block group"
            >
              <Card className="h-full hover:border-primary/50 transition-all">
                <div className={`h-2 rounded-t-lg bg-subject-${classInfo.subjectCode}`} />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {classInfo.className}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {classInfo.subjectName}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      Grade {classInfo.grade}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>Students</span>
                      </div>
                      <span className="font-medium">{classInfo.studentCount}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="w-4 h-4" />
                        <span>Average Score</span>
                      </div>
                      <span className="font-medium">{classInfo.averageScore}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ClipboardCheck className="w-4 h-4" />
                        <span>Pending Review</span>
                      </div>
                      {classInfo.pendingSubmissions > 0 ? (
                        <Badge variant="destructive" className="text-xs">
                          {classInfo.pendingSubmissions}
                        </Badge>
                      ) : (
                        <span className="text-sm text-success">All reviewed</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No classes assigned yet.</p>
        </Card>
      )}
    </div>
  );
}
