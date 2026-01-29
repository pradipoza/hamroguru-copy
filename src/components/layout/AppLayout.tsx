import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Menu } from 'lucide-react';
import { useStudentProfile } from '@/hooks/useStudentData';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { data: profile } = useStudentProfile();
  const displayName = profile?.fullName || 'Student';
  const initials = displayName.charAt(0);
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header - Elevated and professional */}
          <header className="h-14 bg-card backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-40 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Menu className="w-5 h-5 text-muted-foreground" />
              </SidebarTrigger>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">{displayName}</p>
                <p className="text-xs text-muted-foreground">
                  {profile?.grade ? `Grade ${profile.grade}-${profile.section}` : 'Student'}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-sm font-medium text-primary-foreground shadow-sm">
                {initials}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
