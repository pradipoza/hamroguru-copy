import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Plus, Sparkles, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { mockAssignments, mockSubmissionsToGrade, mockTeacherClasses } from '@/lib/demoMockData';

export default function AssignmentsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const assignments = mockAssignments;
  const submissions = mockSubmissionsToGrade;
  const classes = mockTeacherClasses;
  const isLoading = false;

  const activeAssignments = (assignments || []).filter(a => a.dueDate > new Date());
  const pastAssignments = (assignments || []).filter(a => a.dueDate <= new Date());
  const pendingSubmissions = submissions || [];

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Assignments</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage assignments across all your classes
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g., Chapter 3 Practice Problems" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {(classes || []).map((c) => (
                      <SelectItem key={c.id} value={c.classId}>
                        {c.className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="chapter">Chapter</Label>
                <Input id="chapter" placeholder="e.g., Chapter 3: Quadratic Equations" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the assignment..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateOpen(false)}>
                  Create Assignment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="gap-2">
            <Clock className="w-4 h-4" />
            Active ({activeAssignments.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-2">
            <Sparkles className="w-4 h-4" />
            To Grade ({pendingSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Past ({pastAssignments.length})
          </TabsTrigger>
        </TabsList>

        {/* Active Assignments */}
        <TabsContent value="active" className="space-y-4">
          {activeAssignments.length > 0 ? (
            activeAssignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{assignment.title}</h3>
                        <Badge variant="secondary">{assignment.className}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{assignment.chapter}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {assignment.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Due {format(assignment.dueDate, 'MMM d, yyyy')} • 
                        Created {formatDistanceToNow(assignment.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-2xl font-semibold">
                        {assignment.submittedCount}/{assignment.totalStudents}
                      </p>
                      <p className="text-sm text-muted-foreground">submitted</p>
                      <div className="flex gap-2 mt-3">
                        {assignment.submittedCount - assignment.gradedCount > 0 && (
                          <Badge variant="outline">
                            {assignment.submittedCount - assignment.gradedCount} to grade
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={(assignment.submittedCount / assignment.totalStudents) * 100} 
                    className="h-2 mt-4" 
                  />
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No active assignments
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Pending Grading */}
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Submissions to Grade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingSubmissions.length > 0 ? (
                pendingSubmissions.map((submission) => (
                  <div 
                    key={submission.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                        {submission.studentName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{submission.studentName}</p>
                        <p className="text-sm text-muted-foreground">{submission.homeworkTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          Submitted {formatDistanceToNow(submission.submittedAt, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {submission.aiSuggestion && (
                        <div className="hidden md:block max-w-xs">
                          <Badge variant="secondary" className="gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI Suggestion
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {submission.aiSuggestion}
                          </p>
                        </div>
                      )}
                      <Button size="sm">Grade</Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No submissions pending review! 🎉
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Past Assignments */}
        <TabsContent value="past" className="space-y-4">
          {pastAssignments.length > 0 ? (
            pastAssignments.map((assignment) => (
              <Card key={assignment.id} className="opacity-75">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{assignment.title}</h3>
                        <Badge variant="outline">{assignment.className}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{assignment.chapter}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Due date was {format(assignment.dueDate, 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {assignment.gradedCount}/{assignment.submittedCount}
                      </p>
                      <p className="text-sm text-muted-foreground">graded</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No past assignments yet
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
