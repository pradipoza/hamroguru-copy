import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProfileData } from '@/services/teacher.api';
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
  MessageSquare,
  Briefcase,
  GraduationCap,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { TeacherProfile, ClassAssignment } from '@/lib/types';

const TeacherProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['teacherProfile'],
    queryFn: getProfileData,
  });

  const { profile: teacherProfile, assignments } = (data || {}) as { profile: TeacherProfile, assignments: ClassAssignment[] };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (isError || !teacherProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-destructive" />
          <p className="text-muted-foreground">Could not load teacher profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {teacherProfile.fullName?.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold">{teacherProfile.fullName}</h1>
              </div>
              <p className="text-muted-foreground">
                {teacherProfile.qualification} • {teacherProfile.yearsExperience} years experience
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-sm font-medium mr-2">Subjects:</span>
                {teacherProfile.subjectsTaught?.map((spec, i) => (
                  <Badge key={i} variant="outline">{spec}</Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-sm font-medium mr-2">Classes:</span>
                {assignments?.map((a, i) => (
                  <Badge key={i} variant="secondary">{`Grade ${a.class.grade}${a.class.section} - ${a.subject.name}`}</Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{teacherProfile.doseStats.completionRate.toFixed(0)}%</div>
                <div className="text-xs text-muted-foreground">Dose Rate</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{assessmentStats.avgScore.toFixed(0)}%</div>
                <div className="text-xs text-muted-foreground">Asmt Avg</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Overview - Visible to Governing Bodies */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Teacher Portfolio
            <Badge variant="outline" className="ml-2 text-xs">Visible to Administration</Badge>
          </CardTitle>
          <CardDescription>Performance metrics tracked for evaluation by governing bodies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {portfolioMetrics.map((metric, i) => (
              <div key={i} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{metric.category}</span>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="text-xl font-bold">
                  {metric.value}{metric.maxValue ? `/${metric.maxValue}` : ''}
                  {metric.maxValue === 100 && '%'}
                </div>
                <div className="text-xs text-muted-foreground">{metric.metric}</div>
              </div>
            ))}
          </div>

          {/* Portfolio Issues */}
          {portfolioIssues.length > 0 && (
            <div className="mt-4 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <h4 className="font-medium text-destructive flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4" />
                Accountability Issues ({portfolioIssues.length})
              </h4>
              <div className="space-y-2">
                {portfolioIssues.map((issue) => (
                  <div key={issue.id} className="text-sm p-2 bg-background rounded border">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">{issue.studentName}:</span> {issue.query}
                      </div>
                      <Badge variant={issue.status === 'not_addressed' ? 'destructive' : 'secondary'}>
                        {issue.studentFeedback || issue.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Asked: {format(issue.askedAt, 'PP')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="daily-dose">Daily Dose</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="queries">Student Queries</TabsTrigger>
          <TabsTrigger value="lessons">Lesson Plans</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Daily Dose
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completed</span>
                    <span className="font-medium">{doseStats.completed}/{doseStats.total - doseStats.pending}</span>
                  </div>
                  <Progress value={doseStats.completionRate} />
                  <div className="text-xs text-muted-foreground">
                    {doseStats.skipped} skipped • {doseStats.pending} pending
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4" />
                  Assessments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Score</span>
                    <span className="font-medium">{assessmentStats.avgScore.toFixed(0)}%</span>
                  </div>
                  <Progress value={assessmentStats.avgScore} />
                  <div className="text-xs text-muted-foreground">
                    {assessmentStats.completed} completed • {assessmentStats.missed} missed
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Student Queries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Addressed</span>
                    <span className="font-medium">{queryStats.addressed}/{queryStats.total - queryStats.pending}</span>
                  </div>
                  <Progress value={(queryStats.addressed / (queryStats.total - queryStats.pending)) * 100} />
                  <div className="flex gap-2 text-xs">
                    <span className="text-destructive">{queryStats.notAddressed} unaddressed</span>
                    <span className="text-yellow-600">{queryStats.stillConfused} confused</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Lesson Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completed</span>
                    <span className="font-medium">{lessonStats.completed}/{lessonStats.total}</span>
                  </div>
                  <Progress value={(lessonStats.completed / lessonStats.total) * 100} />
                  <div className="text-xs text-muted-foreground">
                    Avg feedback: {lessonStats.avgFeedback.toFixed(1)}/5
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pending Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {doseStats.pending > 0 && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Brain className="w-4 h-4 text-primary" />
                      <span>{doseStats.pending} Daily Dose pending</span>
                    </div>
                  )}
                  {queryStats.pending > 0 && (
                    <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                      <MessageSquare className="w-4 h-4 text-yellow-600" />
                      <span>{queryStats.pending} Student queries to address</span>
                    </div>
                  )}
                  {queryStats.notAddressed > 0 && (
                    <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded border border-destructive/20">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                      <span>{queryStats.notAddressed} Unaddressed queries (in portfolio)</span>
                    </div>
                  )}
                  {assessmentStats.upcoming > 0 && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <ClipboardCheck className="w-4 h-4 text-primary" />
                      <span>{assessmentStats.upcoming} Assessment upcoming</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assessmentHistory
                    .filter(a => a.status === 'completed')
                    .slice(0, 3)
                    .map((asmt) => (
                      <div key={asmt.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <div className="font-medium text-sm">{asmt.title}</div>
                          <div className="text-xs text-muted-foreground">{format(asmt.date, 'PP')}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{asmt.score}%</span>
                          {getPerformanceBadge(asmt.performanceLevel)}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Daily Dose Tab */}
        <TabsContent value="daily-dose">
          <Card>
            <CardHeader>
              <CardTitle>Daily Dose History</CardTitle>
              <CardDescription>Personalized learning content based on student needs</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {dailyDoseHistory.map((dose) => (
                    <div key={dose.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-medium">{dose.title}</div>
                          <div className="text-sm text-muted-foreground">{dose.source}</div>
                        </div>
                        {getStatusBadge(dose.status)}
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Assigned: {format(dose.assignedDate, 'PP')}</span>
                        <span>{dose.estimatedTime} min read</span>
                        {dose.completedAt && <span>Completed: {format(dose.completedAt, 'PP')}</span>}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {dose.topics.map((topic, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{topic}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assessments Tab */}
        <TabsContent value="assessments">
          <Card>
            <CardHeader>
              <CardTitle>Assessment History</CardTitle>
              <CardDescription>Skill assessments to ensure teaching competency</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {assessmentHistory.map((asmt) => (
                    <div key={asmt.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-medium">{asmt.title}</div>
                          <div className="text-sm text-muted-foreground">{format(asmt.date, 'PPP')}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {asmt.score !== undefined && (
                            <Badge variant="secondary" className="text-lg px-3">
                              {asmt.score}%
                            </Badge>
                          )}
                          {getPerformanceBadge(asmt.performanceLevel)}
                          {getStatusBadge(asmt.status)}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {asmt.topics.map((topic, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{topic}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Student Queries Tab */}
        <TabsContent value="queries">
          <Card>
            <CardHeader>
              <CardTitle>Student Query Resolution</CardTitle>
              <CardDescription>Track how student queries from AI tutor are addressed in class</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {queryAddressHistory.map((query) => (
                    <div key={query.id} className={`p-4 border rounded-lg space-y-2 ${query.addedToPortfolio ? 'border-destructive/50 bg-destructive/5' : ''}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-medium">{query.studentName}</div>
                          <div className="text-sm">{query.query}</div>
                          <div className="text-xs text-muted-foreground">{query.topic}</div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {getStatusBadge(query.status)}
                          {query.studentFeedback && (
                            <Badge variant={query.studentFeedback === 'understood' ? 'default' : 'destructive'} className="text-xs">
                              Student: {query.studentFeedback.replace('_', ' ')}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Asked: {format(query.askedAt, 'PP')}</span>
                        {query.addressedAt && <span>Addressed: {format(query.addressedAt, 'PP')}</span>}
                      </div>
                      {query.addedToPortfolio && (
                        <div className="text-xs text-destructive flex items-center gap-1 mt-1">
                          <AlertTriangle className="w-3 h-3" />
                          Added to portfolio for review
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lesson Plans Tab */}
        <TabsContent value="lessons">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Plan History</CardTitle>
              <CardDescription>Track completion and effectiveness of daily lesson plans</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {lessonPlanHistory.map((lp) => (
                    <div key={lp.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-medium">{lp.className}</div>
                          <div className="text-sm text-muted-foreground">{format(lp.date, 'PPPP')}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {lp.feedbackScore && (
                            <Badge variant="secondary" className="gap-1">
                              <Award className="w-3 h-3" />
                              {lp.feedbackScore}/5
                            </Badge>
                          )}
                          {getStatusBadge(lp.status)}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Planned:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {lp.topicsPlanned.map((t, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{t}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Covered:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {lp.topicsCovered.length > 0 ? lp.topicsCovered.map((t, i) => (
                              <Badge key={i} variant="default" className="text-xs">{t}</Badge>
                            )) : <span className="text-xs text-destructive">None</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Queries assigned: {lp.queriesAssigned}</span>
                        <span>Queries addressed: {lp.queriesAddressed}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherProfilePage;
