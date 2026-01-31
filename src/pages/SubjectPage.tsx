import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSubjectByCode } from '@/services/subject.api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AITutorTab } from '@/components/subject/AITutorTab';
import { HomeworkTab } from '@/components/subject/HomeworkTab';
import { NotesTab } from '@/components/subject/NotesTab';
import { TestsTab } from '@/components/subject/TestsTab';
import { ResourcesTab } from '@/components/subject/ResourcesTab';
import { cn } from '@/lib/utils';
import { SCHOOL_PROFILE } from '@/lib/schoolConfig';
import { 
  ArrowLeft, 
  Bot, 
  FileText, 
  BookOpen, 
  ClipboardCheck, 
  Library,
  GraduationCap,
  Loader2
} from 'lucide-react';
import subjectTexture from '@/assets/subject-texture.jpg';

// Color overlays with gradients
const colorOverlays: Record<string, string> = {
  math: 'from-blue-600/90 via-blue-500/85 to-blue-700/90',
  science: 'from-emerald-600/90 via-teal-500/85 to-emerald-700/90',
  english: 'from-violet-600/90 via-purple-500/85 to-violet-700/90',
  nepali: 'from-orange-600/90 via-amber-500/85 to-orange-700/90',
  social: 'from-cyan-600/90 via-sky-500/85 to-cyan-700/90',
  computer: 'from-fuchsia-600/90 via-pink-500/85 to-fuchsia-700/90',
};

const tabs = [
  { id: 'tutor', label: 'AI Tutor', icon: Bot },
  { id: 'homework', label: 'Homework', icon: FileText },
  { id: 'notes', label: 'Notes', icon: BookOpen },
  { id: 'tests', label: 'Tests', icon: ClipboardCheck },
  { id: 'resources', label: 'Resources', icon: Library },
];

export default function SubjectPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: subject, isLoading, isError } = useQuery({
    queryKey: ['subject', subjectId],
    queryFn: () => getSubjectByCode(subjectId!),
    enabled: !!subjectId,
    staleTime: 10 * 60 * 1000, // 10 minutes minimum
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (isError || !subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Subject not found</h1>
          <Link to="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  const currentTab = searchParams.get('tab') || 'tutor';

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  // Create a compatible subject object for the tabs
  const subjectForTabs = {
    id: subject.code as 'math' | 'science' | 'english' | 'nepali' | 'social' | 'computer',
    code: subject.code,
    name: subject.name,
    nameNepali: subject.nameNepali,
    teacher: subject.teacherName || '',
    icon: subject.icon,
    color: subject.code as 'math' | 'science' | 'english' | 'nepali' | 'social' | 'computer',
    pendingHomework: 0,
    pendingNotes: 0,
    upcomingTests: 0,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Subject Banner - Full width, rounded bottom corners, no gaps */}
      <header className="relative rounded-b-2xl overflow-hidden">
        {/* Background texture image */}
        <img 
          src={subjectTexture} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Color overlay */}
        <div className={cn('absolute inset-0 bg-gradient-to-br', colorOverlays[subject.code] || 'from-primary/90 to-primary/80')} />
        
        {/* Top navigation */}
        <div className="relative px-4 py-4">
          <div className="flex items-center justify-between text-white">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-semibold">{SCHOOL_PROFILE.name}</span>
            </div>
          </div>
        </div>
        
        {/* Subject Info */}
        <div className="relative px-4 pb-6">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{subject.icon}</span>
            <div className="text-white">
              <h1 className="text-2xl font-bold">{subject.name}</h1>
              <p className="text-white/80">{subject.nameNepali}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <main className="container max-w-6xl mx-auto px-4 py-6">
        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <TabsList className="w-full justify-start h-auto p-1 bg-muted/50 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 px-4 py-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="mt-6">
            <TabsContent value="tutor" className="m-0">
              <AITutorTab subject={subjectForTabs} />
            </TabsContent>
            <TabsContent value="homework" className="m-0">
              <HomeworkTab subject={subjectForTabs} />
            </TabsContent>
            <TabsContent value="notes" className="m-0">
              <NotesTab subject={subjectForTabs} />
            </TabsContent>
            <TabsContent value="tests" className="m-0">
              <TestsTab subject={subjectForTabs} />
            </TabsContent>
            <TabsContent value="resources" className="m-0">
              <ResourcesTab subject={subjectForTabs} />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
