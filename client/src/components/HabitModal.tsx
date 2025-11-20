import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/contexts/CategoryContext";

interface HabitModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (habit: HabitFormData) => void;
  initialData?: HabitFormData;
  mode?: "create" | "edit";
}

export interface HabitFormData {
  name: string;
  description: string;
  category: string;
  startDate: string;
  reminderTime?: string;
}

export default function HabitModal({
  open,
  onClose,
  onSave,
  initialData,
  mode = "create",
}: HabitModalProps) {
  const { categories } = useCategories();
  const getDefaultFormData = (): HabitFormData => ({
    name: "",
    description: "",
    category: "",
    startDate: new Date().toISOString().split("T")[0],
    reminderTime: "",
  });

  const [formData, setFormData] = useState<HabitFormData>(
    initialData || getDefaultFormData()
  );

  useEffect(() => {
    if (open) {
      setFormData(initialData || getDefaultFormData());
    }
  }, [open, initialData]);

  const handleClose = () => {
    setFormData(getDefaultFormData());
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    handleClose();
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      handleClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg" data-testid="modal-habit">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle data-testid="text-modal-title">
              {mode === "create" ? "Создать новую привычку" : "Редактировать привычку"}
            </DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "Добавьте новую привычку для отслеживания ежедневного прогресса."
                : "Обновите данные вашей привычки."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Название привычки <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="например, Утренняя зарядка"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                data-testid="input-habit-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                placeholder="Необязательные детали об этой привычке..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="resize-none min-h-[100px]"
                data-testid="input-habit-description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Категория</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger id="category" data-testid="select-category">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Дата начала</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  data-testid="input-start-date"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminderTime">Время напоминания</Label>
                <Input
                  id="reminderTime"
                  type="time"
                  value={formData.reminderTime}
                  onChange={(e) =>
                    setFormData({ ...formData, reminderTime: e.target.value })
                  }
                  data-testid="input-reminder-time"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              data-testid="button-cancel"
            >
              Отмена
            </Button>
            <Button type="submit" data-testid="button-save">
              {mode === "create" ? "Создать привычку" : "Сохранить изменения"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
