import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import HabitCard from "@/components/HabitCard";
import HabitModal, { HabitFormData } from "@/components/HabitModal";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/hooks/use-toast";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Habit {
  id: string;
  name: string;
  description?: string;
  category?: string;
  last7Days: boolean[];
  isCompletedToday: boolean;
}

export default function Dashboard() {
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "1",
      name: "Утренняя зарядка",
      description: "30 минут кардио или силовых тренировок",
      category: "Здоровье",
      last7Days: [true, true, false, true, true, true, false],
      isCompletedToday: false,
    },
    {
      id: "2",
      name: "Читать 20 минут",
      description: "Читать любую книгу или статью для расширения знаний",
      category: "Обучение",
      last7Days: [true, true, true, true, true, true, true],
      isCompletedToday: true,
    },
    {
      id: "3",
      name: "Медитация",
      description: "10 минут медитации осознанности",
      category: "Осознанность",
      last7Days: [false, true, true, false, true, true, true],
      isCompletedToday: false,
    },
    {
      id: "4",
      name: "Выпить 8 стаканов воды",
      category: "Здоровье",
      last7Days: [true, false, true, true, true, false, true],
      isCompletedToday: true,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleToggleComplete = (id: string) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id
          ? { ...habit, isCompletedToday: !habit.isCompletedToday }
          : habit
      )
    );

    const habit = habits.find((h) => h.id === id);
    if (habit && !habit.isCompletedToday) {
      toast({
        title: "Отлично!",
        description: `"${habit.name}" отмечено как выполненное на сегодня.`,
      });
    }
  };

  const handleEdit = (id: string) => {
    setEditingHabit(id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const habit = habits.find((h) => h.id === id);
    if (habit) {
      setDeletingHabit({ id: habit.id, name: habit.name });
    }
  };

  const confirmDelete = () => {
    if (deletingHabit) {
      setHabits((prev) => prev.filter((h) => h.id !== deletingHabit.id));
      toast({
        title: "Привычка удалена",
        description: `"${deletingHabit.name}" была удалена.`,
        variant: "destructive",
      });
      setDeletingHabit(null);
    }
  };

  const handleSaveHabit = (data: HabitFormData) => {
    if (editingHabit) {
      setHabits((prev) =>
        prev.map((habit) =>
          habit.id === editingHabit
            ? { ...habit, name: data.name, description: data.description, category: data.category }
            : habit
        )
      );
      toast({
        title: "Привычка обновлена",
        description: "Ваши изменения сохранены.",
      });
    } else {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: data.name,
        description: data.description,
        category: data.category,
        last7Days: [false, false, false, false, false, false, false],
        isCompletedToday: false,
      };
      setHabits((prev) => [...prev, newHabit]);
      toast({
        title: "Привычка создана",
        description: `"${data.name}" добавлена в ваши привычки.`,
      });
    }
    setEditingHabit(null);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(habits);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setHabits(items);
  };

  const openCreateModal = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  if (habits.length === 0) {
    return (
      <ProtectedRoute>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState onAddHabit={openCreateModal} />
          <HabitModal
            open={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingHabit(null);
            }}
            onSave={handleSaveHabit}
            mode="create"
          />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">
            Мои привычки
          </h1>
          <p className="text-muted-foreground" data-testid="text-page-description">
            Отслеживайте свой ежедневный прогресс и формируйте устойчивые привычки
          </p>
        </div>
        <Button onClick={openCreateModal} className="gap-2" data-testid="button-add-habit">
          <Plus className="w-5 h-5" />
          Добавить привычку
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="habits">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {habits.map((habit, index) => (
                <Draggable key={habit.id} draggableId={habit.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <HabitCard
                        {...habit}
                        onToggleComplete={handleToggleComplete}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isDragging={snapshot.isDragging}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <HabitModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingHabit(null);
        }}
        onSave={handleSaveHabit}
        mode={editingHabit ? "edit" : "create"}
        initialData={
          editingHabit
            ? (() => {
                const habit = habits.find((h) => h.id === editingHabit);
                if (!habit) return undefined;
                return {
                  name: habit.name,
                  description: habit.description || "",
                  category: habit.category || "",
                  startDate: new Date().toISOString().split("T")[0],
                  reminderTime: "",
                };
              })()
            : undefined
        }
      />

      <DeleteConfirmDialog
        open={!!deletingHabit}
        onClose={() => setDeletingHabit(null)}
        onConfirm={confirmDelete}
        habitName={deletingHabit?.name || ""}
      />
      </div>
    </ProtectedRoute>
  );
}
