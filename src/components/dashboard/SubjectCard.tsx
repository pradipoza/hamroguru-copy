import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { SubjectSummary } from '@/lib/types';
import { cn } from '@/lib/utils';
import subjectTexture from '@/assets/subject-texture.jpg';

interface SubjectCardProps {
  subject: SubjectSummary;
}

// Color overlays with gradients
const colorOverlays: Record<string, string> = {
  math: 'from-blue-600/90 via-blue-500/85 to-blue-700/90',
  science: 'from-emerald-600/90 via-teal-500/85 to-emerald-700/90',
  english: 'from-violet-600/90 via-purple-500/85 to-violet-700/90',
  nepali: 'from-orange-600/90 via-amber-500/85 to-orange-700/90',
  social: 'from-cyan-600/90 via-sky-500/85 to-cyan-700/90',
  computer: 'from-fuchsia-600/90 via-pink-500/85 to-fuchsia-700/90',
};

// Generate initials from teacher name
function getTeacherInitials(name: string): string {
  if (!name) return '--';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function SubjectCard({ subject }: SubjectCardProps) {
  const totalPending = subject.pendingHomework + subject.pendingNotes + subject.upcomingTests;
  const initials = getTeacherInitials(subject.teacherName || '');
  const classLabel = subject.classGrade ? `Grade ${subject.classGrade}-${subject.classSection || 'A'}` : 'Class';
  const teacherLabel = subject.teacherName || 'Teacher not assigned';

  return (
    <Link to={`/subject/${subject.id}`}>
      <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer border-0 shadow-sm">
        {/* Header Banner - With background image and color overlay */}
        <div className="h-32 relative">
          {/* Background texture image */}
          <img 
            src={subjectTexture} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Color overlay */}
          <div className={cn('absolute inset-0 bg-gradient-to-br', colorOverlays[subject.color])} />
          
          {/* Subject info */}
          <div className="absolute bottom-4 left-4 right-16 z-10">
            <h3 className="text-lg font-semibold text-white truncate">{subject.name}</h3>
            <p className="text-sm text-white/80 truncate">{classLabel}</p>
          </div>

          {/* Subject icon */}
          <span className="absolute top-3 right-3 text-3xl opacity-60 z-10">{subject.icon}</span>
          
          {/* Teacher avatar - overlapping header and content */}
          <div className="absolute -bottom-6 right-4 w-14 h-14 rounded-full bg-rose-500 border-4 border-card flex items-center justify-center text-white font-bold text-lg shadow-md z-10">
            {initials}
          </div>
        </div>

        {/* Content section */}
        <div className="p-4 pt-3 min-h-[80px]">
          {/* Teacher name */}
          <p className="text-sm text-foreground font-medium mb-3">{teacherLabel}</p>
          
          {/* Pending tasks or student count */}
          <div className="flex items-center justify-between">
            {totalPending > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {subject.pendingHomework > 0 && (
                  <span className="text-xs px-2 py-0.5 bg-destructive/10 text-destructive rounded-full font-medium">
                    {subject.pendingHomework} due
                  </span>
                )}
                {subject.pendingNotes > 0 && (
                  <span className="text-xs px-2 py-0.5 bg-warning/10 text-warning rounded-full font-medium">
                    {subject.pendingNotes} notes
                  </span>
                )}
                {subject.upcomingTests > 0 && (
                  <span className="text-xs px-2 py-0.5 bg-info/10 text-info rounded-full font-medium">
                    {subject.upcomingTests} test
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">All caught up!</span>
            )}
            
            {/* Student count indicator like reference */}
            <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
              {subject.studentCount} students
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
