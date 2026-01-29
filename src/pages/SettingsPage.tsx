import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { User, Bell, Moon, Globe, LogOut } from 'lucide-react';
import { useStudentProfile } from '@/hooks/useStudentData';

export default function SettingsPage() {
  const { data: profile } = useStudentProfile();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account preferences
        </p>
      </div>

      {/* Profile Card */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-xl font-medium">
              {profile?.fullName?.charAt(0) || 'S'}
            </div>
            <div>
              <p className="font-medium text-foreground">{profile?.fullName || 'Student'}</p>
              <p className="text-sm text-muted-foreground">
                Grade {profile?.grade}-{profile?.section} • {profile?.schoolName || 'School'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="notifications" className="text-sm font-normal">
                Push Notifications
              </Label>
            </div>
            <Switch id="notifications" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="dark-mode" className="text-sm font-normal">
                Dark Mode
              </Label>
            </div>
            <Switch id="dark-mode" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="language" className="text-sm font-normal">
                Nepali Language
              </Label>
            </div>
            <Switch id="language" />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="p-4">
          <Button variant="outline" className="w-full text-destructive hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
