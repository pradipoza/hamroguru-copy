import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  MessageSquare,
  Lightbulb,
  GraduationCap,
  ChevronRight,
  BookMarked,
  Target,
  Loader2
} from 'lucide-react';
import { format, isToday } from 'date-fns';
import { useTeacherAssessments, useTeacherDailyDoses, useTeacherLessonPlans, useTeacherQueries } from '@/hooks/useTeacherData';

interface LessonPlan {
  id: string;
  classId: string;
  className: string;
  date: Date;
  topics: string[];
  studentQueries: any[];
  weakAreas: string[];
  aiRecommendation: string | null;
  status: string;
}

interface StudentQuery {
  id: string;
  studentName: string;
  query: string;
  topic: string | null;
  status: string;
  askedAt: Date;
}

interface DailyDose {
  id: string;
  title: string;
  description: string | null;
  topics: string[];
  estimatedTime: number;
  source: string | null;
  completed: boolean | null;
}

export default function LessonPlanPage() {
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);
  
  const { data: lessonPlans = [], isLoading: plansLoading } = useTeacherLessonPlans();
  const { data: queries = [], isLoading: queriesLoading } = useTeacherQueries();
  const { data: dailyDoses = [], isLoading: dosesLoading } = useTeacherDailyDoses();
  const { data: assessments = [], isLoading: assessmentsLoading } = useTeacherAssessments();
  const isLoading = plansLoading || queriesLoading || dosesLoading || assessmentsLoading;

  const todaysPlans = (lessonPlans || []).filter(p => isToday(p.date));
  const upcomingPlans = (lessonPlans || []).filter(p => p.status === 'upcoming' && !isToday(p.date));
  const pendingQueries = (queries || []).filter(q => q.status === 'pending');

  // Calculate completed doses this week
  const completedDosesThisWeek = (dailyDoses || []).filter(d => d.completed).length;
  const totalDosesThisWeek = Math.min((dailyDoses || []).length, 5);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Lesson Plans</h1>
          <p className="text-muted-foreground mt-1">
            AI-generated lesson plans based on student performance
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Calendar className="w-4 h-4 mr-1" />
          {format(new Date(), 'EEEE, MMM d')}
        </Badge>
      </div>

      <Tabs defaultValue="today" className="space-y-6">
        <TabsList>
          <TabsTrigger value="today">Today's Plans</TabsTrigger>
          <TabsTrigger value="queries">Student Queries ({pendingQueries.length})</TabsTrigger>
          <TabsTrigger value="dose">Daily Dose</TabsTrigger>
          <TabsTrigger value="assessments">My Assessments</TabsTrigger>
        </TabsList>

        {/* Today's Plans Tab */}
        <TabsContent value="today" className="space-y-6">
          {todaysPlans.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No lesson plans scheduled for today</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {todaysPlans.map((plan) => (
                <LessonPlanCard 
                  key={plan.id} 
                  plan={plan} 
                  onViewDetails={() => setSelectedPlan(plan)}
                />
              ))}
            </div>
          )}

          {/* All Upcoming Plans */}
          {upcomingPlans.length > 0 && (
            <div>
              <h2 className="text-lg font-medium mb-4">Upcoming Plans</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {upcomingPlans.slice(0, 6).map((plan) => (
                  <Card 
                    key={plan.id} 
                    className="cursor-pointer hover:border-primary/50 transition-colors" 
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {plan.className.split(' - ')[0]}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(plan.date, 'MMM d')}
                        </span>
                      </div>
                      <h3 className="font-medium text-sm mb-1">
                        {plan.topics[0] || 'No topics'}
                      </h3>
                      {plan.studentQueries.length > 0 && (
                        <p className="text-xs text-orange-600">
                          {plan.studentQueries.length} queries to address
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Student Queries Tab */}
        <TabsContent value="queries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Pending Student Queries
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingQueries.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 mx-auto text-green-500/50 mb-4" />
                  <p className="text-muted-foreground">All student queries have been addressed!</p>
                </div>
              ) : (
                pendingQueries.map((query) => (
                  <QueryCard key={query.id} query={query} />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Daily Dose Tab */}
        <TabsContent value="dose" className="space-y-6">
          {(dailyDoses || []).length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {dailyDoses.slice(0, 4).map((dose) => (
                <DailyDoseCard key={dose.id} dose={dose} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Lightbulb className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No daily doses available</p>
              </CardContent>
            </Card>
          )}

          {/* Learning Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Your Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Daily Doses Completed This Week</span>
                    <span className="text-sm font-medium">{completedDosesThisWeek}/{totalDosesThisWeek}</span>
                  </div>
                  <Progress value={totalDosesThisWeek > 0 ? (completedDosesThisWeek / totalDosesThisWeek) * 100 : 0} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Skill Assessments Passed</span>
                    <span className="text-sm font-medium">
                      {(assessments || []).filter(a => a.status === 'completed' && (a.score || 0) >= 70).length}/
                      {(assessments || []).filter(a => a.status === 'completed').length || 1}
                    </span>
                  </div>
                  <Progress 
                    value={
                      (assessments || []).filter(a => a.status === 'completed').length > 0
                        ? ((assessments || []).filter(a => a.status === 'completed' && (a.score || 0) >= 70).length / 
                           (assessments || []).filter(a => a.status === 'completed').length) * 100
                        : 0
                    } 
                    className="h-2" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assessments Tab */}
        <TabsContent value="assessments" className="space-y-4">
          {(assessments || []).length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {assessments.map((assessment) => (
                <Card key={assessment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{assessment.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {assessment.totalQuestions} questions • {assessment.duration} min
                        </p>
                      </div>
                      <Badge variant={assessment.status === 'completed' ? 'default' : 'secondary'}>
                        {assessment.status}
                      </Badge>
                    </div>
                    {assessment.status === 'completed' && assessment.score !== undefined && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Your Score</span>
                          <span className="font-semibold text-lg">{assessment.score}%</span>
                        </div>
                      </div>
                    )}
                    {assessment.status === 'upcoming' && assessment.scheduledDate && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        Scheduled: {format(assessment.scheduledDate, 'MMM d, yyyy')}
                      </div>
                    )}
                    {assessment.status !== 'completed' && (
                      <Button className="w-full mt-4" variant={assessment.status === 'available' ? 'default' : 'outline'}>
                        {assessment.status === 'available' ? 'Start Assessment' : 'View Details'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No assessments available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Lesson Plan Detail Modal */}
      {selectedPlan && (
        <LessonPlanDetail plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
      )}
    </div>
  );
}

function LessonPlanCard({ plan, onViewDetails }: { plan: LessonPlan; onViewDetails: () => void }) {
  const queryCount = plan.studentQueries.length;
  
  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{plan.className}</CardTitle>
          <Badge variant={plan.status === 'upcoming' ? 'secondary' : 'default'}>
            {plan.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Topics */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <BookMarked className="w-4 h-4" />
            Topics to Cover
          </h4>
          <div className="flex flex-wrap gap-2">
            {plan.topics.length > 0 ? (
              plan.topics.map((topic, i) => (
                <Badge key={i} variant="outline">{topic}</Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">No topics defined</span>
            )}
          </div>
        </div>

        {/* Student Queries Alert */}
        {queryCount > 0 && (
          <div className="p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium text-sm">{queryCount} student queries to address</span>
            </div>
          </div>
        )}

        {/* Weak Areas */}
        {plan.weakAreas.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Focus Areas
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {plan.weakAreas.map((area, i) => (
                <li key={i}>• {area}</li>
              ))}
            </ul>
          </div>
        )}

        {/* AI Recommendation */}
        {plan.aiRecommendation && (
          <div className="p-3 bg-primary/5 rounded-lg">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-primary mt-0.5" />
              <p className="text-sm">{plan.aiRecommendation}</p>
            </div>
          </div>
        )}

        <Button onClick={onViewDetails} className="w-full" variant="outline">
          View Full Plan
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}

function QueryCard({ query }: { query: StudentQuery }) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    addressed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    not_addressed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="font-medium">{query.studentName}</span>
          {query.topic && (
            <span className="text-muted-foreground text-sm ml-2">• {query.topic}</span>
          )}
        </div>
        <Badge className={statusColors[query.status as keyof typeof statusColors] || statusColors.pending}>
          {query.status === 'not_addressed' ? 'Not Addressed' : query.status}
        </Badge>
      </div>
      <p className="text-sm bg-muted p-3 rounded-lg mb-3">"{query.query}"</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          <Clock className="w-3 h-3 inline mr-1" />
          Asked {format(query.askedAt, 'MMM d, h:mm a')}
        </span>
        {query.status === 'pending' && (
          <Button size="sm">Mark as Addressed</Button>
        )}
        {query.status === 'not_addressed' && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <XCircle className="w-4 h-4" />
            Added to portfolio
          </div>
        )}
      </div>
    </div>
  );
}

function DailyDoseCard({ dose }: { dose: DailyDose }) {
  return (
    <Card className={dose.completed ? 'opacity-75' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{dose.title}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {dose.estimatedTime} min read {dose.source && `• ${dose.source}`}
              </p>
            </div>
          </div>
          {dose.completed && (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {dose.description && (
          <p className="text-sm text-muted-foreground">{dose.description}</p>
        )}
        {dose.topics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {dose.topics.map((topic, i) => (
              <Badge key={i} variant="outline" className="text-xs">{topic}</Badge>
            ))}
          </div>
        )}
        <Button className="w-full" variant={dose.completed ? 'outline' : 'default'}>
          {dose.completed ? 'Review Again' : 'Start Learning'}
        </Button>
      </CardContent>
    </Card>
  );
}

function LessonPlanDetail({ plan, onClose }: { plan: LessonPlan; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{plan.className}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {format(plan.date, 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Topics */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <BookMarked className="w-4 h-4" />
              Topics to Cover
            </h3>
            <div className="flex flex-wrap gap-2">
              {plan.topics.length > 0 ? (
                plan.topics.map((topic, i) => (
                  <Badge key={i} variant="secondary">{topic}</Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No topics defined</span>
              )}
            </div>
          </div>

          {/* Weak Areas */}
          {plan.weakAreas.length > 0 && (
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Class Weak Areas
              </h3>
              <ul className="space-y-2">
                {plan.weakAreas.map((area, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Recommendation */}
          {plan.aiRecommendation && (
            <div className="p-4 bg-primary/5 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-primary" />
                AI Recommendation
              </h3>
              <p className="text-sm">{plan.aiRecommendation}</p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button>Mark as Completed</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
