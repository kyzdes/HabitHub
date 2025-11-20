import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { GripVertical, Pencil, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { useCategories } from "@/contexts/CategoryContext";

interface HabitCardProps {
  id: string;
  name: string;
  description?: string;
  category?: string;
  last7Days: boolean[];
  isCompletedToday: boolean;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}

export default function HabitCard({
  id,
  name,
  description,
  category,
  last7Days,
  isCompletedToday,
  onToggleComplete,
  onEdit,
  onDelete,
  isDragging = false,
}: HabitCardProps) {
  const { getCategoryColor } = useCategories();
  const [showActions, setShowActions] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleComplete = () => {
    if (!isCompletedToday) {
      setIsAnimating(true);
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#48bb78', '#38a169'],
      });
      setTimeout(() => setIsAnimating(false), 600);
    }
    onToggleComplete(id);
  };

  const getCategoryColorClass = (colorId: string): string => {
    const colorMap: Record<string, string> = {
      "chart-1": "bg-chart-1/20 text-chart-1 border-chart-1/30",
      "chart-2": "bg-chart-2/20 text-chart-2 border-chart-2/30",
      "chart-3": "bg-chart-3/20 text-chart-3 border-chart-3/30",
      "chart-4": "bg-chart-4/20 text-chart-4 border-chart-4/30",
      "chart-5": "bg-chart-5/20 text-chart-5 border-chart-5/30",
      "primary": "bg-primary/20 text-primary border-primary/30",
      "destructive": "bg-destructive/20 text-destructive border-destructive/30",
    };
    return colorMap[colorId] || colorMap["chart-1"];
  };

  const categoryColorId = category ? getCategoryColor(category) : "";
  const categoryColor = categoryColorId ? getCategoryColorClass(categoryColorId) : "";

  return (
    <Card
      className={cn(
        "group p-6 transition-all duration-200 hover-elevate",
        isDragging && "opacity-50 rotate-2",
        isAnimating && "ring-2 ring-primary/50 scale-[1.02]"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      data-testid={`card-habit-${id}`}
    >
      <div className="flex items-start gap-4">
        <div className="cursor-grab active:cursor-grabbing text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold mb-1 truncate" data-testid={`text-habit-name-${id}`}>
                {name}
              </h3>
              {description && (
                <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-habit-description-${id}`}>
                  {description}
                </p>
              )}
              {category && (
                <span
                  className={cn(
                    "inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full border",
                    categoryColor
                  )}
                  data-testid={`badge-category-${id}`}
                >
                  {category}
                </span>
              )}
            </div>

            <div
              className={cn(
                "flex items-center gap-2 transition-opacity",
                showActions ? "opacity-100" : "opacity-0 md:opacity-0"
              )}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(id)}
                data-testid={`button-edit-${id}`}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(id)}
                data-testid={`button-delete-${id}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Последние 7 дней:</span>
              <div className="flex items-center gap-1">
                {last7Days.map((completed, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                      completed
                        ? "bg-primary border-primary"
                        : "border-border"
                    )}
                    data-testid={`status-day-${index}-${id}`}
                  >
                    {completed && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-foreground" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <span className="text-sm font-medium">Сегодня</span>
              <Checkbox
                checked={isCompletedToday}
                onCheckedChange={handleComplete}
                className="w-12 h-12 sm:w-11 sm:h-11 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                data-testid={`checkbox-complete-${id}`}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
