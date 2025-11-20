import { Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAddHabit: () => void;
}

export default function EmptyState({ onAddHabit }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Target className="w-12 h-12 text-primary" />
      </div>
      
      <h2 className="text-2xl font-semibold mb-2" data-testid="text-empty-title">
        Начните формировать свои привычки
      </h2>
      
      <p className="text-muted-foreground mb-8 max-w-md" data-testid="text-empty-description">
        Создайте свою первую привычку и начните отслеживать ежедневный прогресс. Формируйте постоянство и достигайте целей день за днём.
      </p>
      
      <Button onClick={onAddHabit} size="lg" className="gap-2" data-testid="button-add-first-habit">
        <Plus className="w-5 h-5" />
        Добавить первую привычку
      </Button>
    </div>
  );
}
