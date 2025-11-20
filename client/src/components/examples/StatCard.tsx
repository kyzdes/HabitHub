import StatCard from '../StatCard';
import { Target, Flame, TrendingUp, Award } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Habits"
        value={12}
        icon={Target}
        trend={{ value: 20, isPositive: true }}
      />
      <StatCard
        title="Current Streak"
        value="7 days"
        icon={Flame}
        trend={{ value: 15, isPositive: true }}
      />
      <StatCard
        title="Completion Rate"
        value="85%"
        icon={TrendingUp}
        trend={{ value: 5, isPositive: true }}
      />
      <StatCard
        title="Best Streak"
        value="21 days"
        icon={Award}
      />
    </div>
  );
}
