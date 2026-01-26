import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Search,
  Users,
  Award,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { mockClassStudents, mockTeacherClasses } from '@/lib/demoMockData';

export default function StudentProgressPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  
  const allStudents = mockClassStudents;
  const classes = mockTeacherClasses;
  const isLoading = false;

  const filteredStudents = (allStudents || []).filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'all' || 
      classes?.find(c => c.classId === selectedClass && c.grade === student.grade && c.section === student.section);
    return matchesSearch && matchesClass;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => b.averageScore - a.averageScore);

  const topPerformers = sortedStudents.filter(s => s.averageScore >= 85);
  const needsAttention = sortedStudents.filter(s => s.averageScore < 65);
  const avgScore = filteredStudents.length > 0
    ? Math.round(filteredStudents.reduce((sum, s) => sum + s.averageScore, 0) / filteredStudents.length)
    : 0;

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
        <h1 className="text-2xl font-semibold text-foreground">Student Progress</h1>
        <p className="text-muted-foreground mt-1">
          Track and analyze student performance across your classes
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{allStudents?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Total Students</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{avgScore}%</p>
              <p className="text-xs text-muted-foreground">Average Score</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{topPerformers.length}</p>
              <p className="text-xs text-muted-foreground">Top Performers</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{needsAttention.length}</p>
              <p className="text-xs text-muted-foreground">Need Attention</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search students..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {(classes || []).map((c) => (
              <SelectItem key={c.id} value={c.classId}>
                {c.className}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Class Performance Cards */}
      {classes && classes.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          {classes.map((classInfo) => (
            <Card key={classInfo.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{classInfo.className}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Average Score</span>
                    <span className="font-medium">{classInfo.averageScore}%</span>
                  </div>
                  <Progress value={classInfo.averageScore} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Students</span>
                    <span className="font-medium">{classInfo.studentCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Student List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">All Students</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedStudents.length > 0 ? (
            <div className="space-y-2">
              {sortedStudents.map((student, index) => (
                <div 
                  key={student.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{student.name}</p>
                        {student.averageScore >= 85 && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Award className="w-3 h-3" />
                            Top
                          </Badge>
                        )}
                        {student.averageScore < 65 && (
                          <Badge variant="destructive" className="text-xs gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Attention
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Grade {student.grade}{student.section} • 
                        Last active {formatDistanceToNow(student.lastActive, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        {student.averageScore >= 75 ? (
                          <TrendingUp className="w-4 h-4 text-success" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-destructive" />
                        )}
                        <span className="text-lg font-semibold">{student.averageScore}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Average</p>
                    </div>
                    <div className="w-24 hidden sm:block">
                      <Progress value={student.submissionRate} className="h-2" />
                      <p className="text-xs text-muted-foreground text-right mt-1">
                        {student.submissionRate}% submitted
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No students found
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
