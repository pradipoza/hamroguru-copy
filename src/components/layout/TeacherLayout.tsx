import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { TeacherSidebar } from './TeacherSidebar';
import { Menu } from 'lucide-react';
import { useTeacherProfile } from '@/hooks/useTeacherData';

interface TeacherLayoutProps {
  children: React.ReactNode;
}

export function TeacherLayout({ children }: TeacherLayoutProps) {
  const { data: profileData } = useTeacherProfile();
  const displayName = profileData?.profile?.fullName || 'Teacher';
  const initials = displayName.charAt(0);
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <TeacherSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="p-2 hover:bg-accent rounded-lg">
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground">
                  {profileData?.profile?.subjectsTaught?.[0] || 'Teacher'}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                {initials}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
