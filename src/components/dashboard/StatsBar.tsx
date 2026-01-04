import { Card, CardContent } from '@/components/ui/card';
import { Student } from '@/lib/types';
import { Flame, Trophy, Target } from 'lucide-react';

interface StatsBarProps {
  student: Student;
  totalPendingTasks: number;
}

export function StatsBar({ student, totalPendingTasks }: StatsBarProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-200">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold">{student.streakDays}</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-yellow-200">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold">{student.totalPoints.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Points</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-200">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold">{totalPendingTasks}</p>
            <p className="text-sm text-muted-foreground">Tasks Due</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}