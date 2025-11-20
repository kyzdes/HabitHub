import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WeeklyHeatmapProps {
  data: {
    date: string;
    completions: number;
  }[];
}

const days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const weeks = 4;

export default function WeeklyHeatmap({ data }: WeeklyHeatmapProps) {
  const getIntensity = (completions: number): string => {
    if (completions === 0) return "bg-border";
    if (completions <= 2) return "bg-primary/20";
    if (completions <= 4) return "bg-primary/40";
    if (completions <= 6) return "bg-primary/60";
    return "bg-primary";
  };

  return (
    <Card className="p-6" data-testid="card-heatmap">
      <h3 className="text-xl font-semibold mb-6">Недельная активность</h3>
      
      <div className="space-y-2">
        {days.map((day, dayIndex) => (
          <div key={day} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-8">{day}</span>
            <div className="flex gap-1.5">
              {Array.from({ length: weeks }).map((_, weekIndex) => {
                const dataIndex = dayIndex + weekIndex * 7;
                const completions = data[dataIndex]?.completions || 0;
                return (
                  <div
                    key={weekIndex}
                    className={cn(
                      "w-10 h-10 rounded-md transition-colors hover:ring-2 hover:ring-primary/50",
                      getIntensity(completions)
                    )}
                    title={`${completions} выполнений`}
                    data-testid={`heatmap-cell-${dayIndex}-${weekIndex}`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-6">
        <span className="text-xs text-muted-foreground">Меньше</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded-sm bg-border" />
          <div className="w-4 h-4 rounded-sm bg-primary/20" />
          <div className="w-4 h-4 rounded-sm bg-primary/40" />
          <div className="w-4 h-4 rounded-sm bg-primary/60" />
          <div className="w-4 h-4 rounded-sm bg-primary" />
        </div>
        <span className="text-xs text-muted-foreground">Больше</span>
      </div>
    </Card>
  );
}
