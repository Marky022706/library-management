import { CalendarCheck, Clock, UserCheck, Users } from 'lucide-react';
import { StatCard } from '../dashboard/StatCard';
import { formatDuration } from '../../utils/date';

interface AttendanceStatsProps {
  todaysAttendance: number;
  currentlyInsideCount: number;
  totalVisitors: number;
  avgVisitMinutes: number;
}

export function AttendanceStats({ todaysAttendance, currentlyInsideCount, totalVisitors, avgVisitMinutes }: AttendanceStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard icon={CalendarCheck} label="Today's Attendance" value={todaysAttendance} tone="green" />
      <StatCard icon={UserCheck} label="Currently Inside" value={currentlyInsideCount} tone="blue" />
      <StatCard icon={Users} label="Total Visitors" value={totalVisitors} tone="purple" />
      <StatCard icon={Clock} label="Avg. Visit Time" value={formatDuration(avgVisitMinutes)} tone="amber" />
    </div>
  );
}
