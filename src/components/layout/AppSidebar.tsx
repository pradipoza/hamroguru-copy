import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  ListTodo, 
  MessageCircle, 
  TrendingUp, 
  Settings,
  User,
  LogOut
} from 'lucide-react';
import logo from '@/assets/logo.png';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const menuItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Pending Tasks', url: '/tasks', icon: ListTodo },
  { title: 'Consultant', url: '/consultant', icon: MessageCircle },
  { title: 'My Progress', url: '/progress', icon: TrendingUp },
  { title: 'My Profile', url: '/profile', icon: User },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { profile, signOut } = useAuth();
  const isCollapsed = state === 'collapsed';

  const initials = profile?.fullName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <Sidebar collapsible="icon" className="border-r-0 bg-card shadow-sm">
      <SidebarHeader className="p-4 pb-3">
        <div className="flex items-center gap-3">
          <img src={logo} alt="HamroGuru" className="w-10 h-10 rounded-xl flex-shrink-0 object-contain" />
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-lg leading-tight text-foreground">HamroGuru</h1>
              <p className="text-xs text-muted-foreground">Smart Learning</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/'}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 mt-auto">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-muted/50">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-xs bg-primary text-primary-foreground font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile?.fullName || 'User'}</p>
              <p className="text-xs text-muted-foreground">Student</p>
            </div>
          )}
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
