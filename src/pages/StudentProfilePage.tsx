import { useState } from 'react';
import { 
  User, 
  BookOpen, 
  ClipboardCheck, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Calendar,
  Clock,
  Target,
  Brain,
  Award,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Flame
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { subjects } from '@/lib/mockData';
import {
  studentProfile,
  homeworkHistory,
  testHistory,
  noteHistory,
  learningInsights,
  recentActivity,
  getHomeworkStats,
  getTestStats,
  getNoteStats,
} from '@/lib/studentProfileData';

const StudentProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const hwStats = getHomeworkStats();
  const testStats = getTestStats();
  const noteStats = getNoteStats();

  const getSubjectName = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.name || subjectId;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
      checked: { variant: 'default', icon: <CheckCircle2 className="w-3 h-3" /> },
      verified: { variant: 'default', icon: <CheckCircle2 className="w-3 h-3" /> },
      completed: { variant: 'default', icon: <CheckCircle2 className="w-3 h-3" /> },
      submitted: { variant: 'secondary', icon: <Clock className="w-3 h-3" /> },
      pending: { variant: 'outline', icon: <Clock className="w-3 h-3" /> },
      late: { variant: 'destructive', icon: <AlertCircle className="w-3 h-3" /> },
      missed: { variant: 'destructive', icon: <XCircle className="w-3 h-3" /> },
      upcoming: { variant: 'secondary', icon: <Calendar className="w-3 h-3" /> },
    };
    const config = variants[status] || { variant: 'outline', icon: null };
    return (
      <Badge variant={config.variant} className="gap-1">
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'declining') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {studentProfile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold">{studentProfile.name}</h1>
                <Badge variant="secondary" className="gap-1">
                  <Flame className="w-3 h-3 text-orange-500" />
                  {studentProfile.streakDays} day streak
                </Badge>
                <Badge variant="outline">{studentProfile.totalPoints} points</Badge>
              </div>
              <p className="text-muted-foreground">
                Grade {studentProfile.grade}, Section {studentProfile.section} • {studentProfile.school}
              </p>
              <div className="flex gap-4 text-sm text-muted-foreground flex-wrap">
                <span>{studentProfile.email}</span>
                <span>{studentProfile.phone}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{hwStats.avgScore.toFixed(0)}%</div>
                <div className="text-xs text-muted-foreground">HW Avg</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{testStats.avgScore.toFixed(0)}%</div>
                <div className="text-xs text-muted-foreground">Test Avg</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Profile Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Learning Profile
          </CardTitle>
          <CardDescription>Personalized learning information for AI tutoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Learning Style</div>
              <div className="font-medium capitalize">{studentProfile.learningStyle}</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Intelligence Level</div>
              <div className="font-medium capitalize">{studentProfile.intelligenceLevel.replace('_', ' ')}</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Preferred Study Time</div>
              <div className="font-medium">{studentProfile.preferredStudyTime}</div>
            </div>
            <div className="p-4 border rounded-lg col-span-1 md:col-span-2 lg:col-span-1">
              <div className="text-sm text-muted-foreground mb-1">Study Goal</div>
              <div className="font-medium text-sm">{studentProfile.studyGoal}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="homework">Homework</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Homework
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completed</span>
                    <span className="font-medium">{hwStats.completed}/{hwStats.total}</span>
                  </div>
                  <Progress value={(hwStats.completed / hwStats.total) * 100} />
                  <div className="flex gap-2 text-xs">
                    <span className="text-destructive">{hwStats.missed} missed</span>
                    <span className="text-yellow-600">{hwStats.late} late</span>
                    <span className="text-muted-foreground">{hwStats.pending} pending</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4" />
                  Unit Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completed</span>
                    <span className="font-medium">{testStats.completed}/{testStats.total}</span>
                  </div>
                  <Progress value={(testStats.completed / testStats.total) * 100} />
                  <div className="text-xs text-muted-foreground">
                    {testStats.upcoming} upcoming • Avg: {testStats.avgScore.toFixed(0)}%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Verified</span>
                    <span className="font-medium">{noteStats.verified}/{noteStats.total}</span>
                  </div>
                  <Progress value={(noteStats.verified / noteStats.total) * 100} />
                  <div className="text-xs text-muted-foreground">
                    {noteStats.completed} completed • {noteStats.pending} pending
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {activity.type === 'homework_submitted' && <BookOpen className="w-4 h-4 text-primary" />}
                      {activity.type === 'test_completed' && <ClipboardCheck className="w-4 h-4 text-primary" />}
                      {activity.type === 'note_verified' && <FileText className="w-4 h-4 text-primary" />}
                      {activity.type === 'tutor_session' && <Brain className="w-4 h-4 text-primary" />}
                      {activity.type === 'resource_accessed' && <Target className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm">{activity.description}</div>
                      <div className="text-xs text-muted-foreground">{format(activity.date, 'PPp')}</div>
                    </div>
                    {activity.subjectId && (
                      <Badge variant="outline" className="text-xs">
                        {getSubjectName(activity.subjectId)}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Homework Tab */}
        <TabsContent value="homework">
          <Card>
            <CardHeader>
              <CardTitle>Homework History</CardTitle>
              <CardDescription>Complete record of all homework assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {homeworkHistory.map((hw) => (
                    <div key={hw.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-medium">{hw.title}</div>
                          <div className="text-sm text-muted-foreground">{getSubjectName(hw.subjectId)}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {hw.score !== undefined && (
                            <Badge variant="secondary">{hw.score}/{hw.maxScore}</Badge>
                          )}
                          {getStatusBadge(hw.status)}
                        </div>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Assigned: {format(hw.assignedDate, 'PP')}</span>
                        <span>Due: {format(hw.dueDate, 'PP')}</span>
                        {hw.submittedAt && <span>Submitted: {format(hw.submittedAt, 'PP')}</span>}
                      </div>
                      {hw.feedback && (
                        <div className="text-sm p-2 bg-muted rounded mt-2">
                          <span className="font-medium">AI Feedback:</span> {hw.feedback}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tests Tab */}
        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle>Test History</CardTitle>
              <CardDescription>Unit tests, quizzes, and terminal exams</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {testHistory.map((test) => (
                    <div key={test.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-medium">{test.title}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            {getSubjectName(test.subjectId)}
                            <Badge variant="outline" className="text-xs capitalize">
                              {test.type.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {test.score !== undefined && (
                            <Badge variant="secondary" className="text-lg px-3">
                              {test.score}/{test.maxScore}
                            </Badge>
                          )}
                          {getStatusBadge(test.status)}
                        </div>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Date: {format(test.date, 'PPP')}</span>
                        <span>Duration: {test.duration} mins</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {test.topicsAssessed.map((topic, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Notes Status</CardTitle>
              <CardDescription>Chapter-wise notes completion and verification</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {noteHistory.map((note) => (
                    <div key={note.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-medium">{note.topic}</div>
                          <div className="text-sm text-muted-foreground">
                            {note.chapter} • {getSubjectName(note.subjectId)}
                          </div>
                        </div>
                        {getStatusBadge(note.status)}
                      </div>
                      {note.completeness !== undefined && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Completeness</span>
                            <span>{note.completeness}%</span>
                          </div>
                          <Progress value={note.completeness} className="h-2" />
                        </div>
                      )}
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        {note.submittedAt && <span>Submitted: {format(note.submittedAt, 'PP')}</span>}
                        {note.verifiedAt && <span>Verified: {format(note.verifiedAt, 'PP')}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights">
          <div className="space-y-4">
            {learningInsights.map((insight) => (
              <Card key={insight.subjectId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{getSubjectName(insight.subjectId)}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(insight.progressTrend)}
                      <span className="text-sm capitalize">{insight.progressTrend}</span>
                      <Badge variant={
                        insight.engagementLevel === 'high' ? 'default' :
                        insight.engagementLevel === 'medium' ? 'secondary' : 'outline'
                      }>
                        {insight.engagementLevel} engagement
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-green-600 mb-2 flex items-center gap-1">
                        <Award className="w-4 h-4" /> Strengths
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {insight.strengths.map((s, i) => (
                          <Badge key={i} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-red-600 mb-2 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> Weaknesses
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {insight.weaknesses.map((w, i) => (
                          <Badge key={i} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            {w}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-600 mb-2 flex items-center gap-1">
                        <Target className="w-4 h-4" /> Focus Topics
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {insight.topicsToFocus.map((t, i) => (
                          <Badge key={i} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-purple-600 mb-2 flex items-center gap-1">
                        <BookOpen className="w-4 h-4" /> Recommended Resources
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {insight.recommendedResources.map((r, i) => (
                          <Badge key={i} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {r}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentProfilePage;
