import { useState } from "react";
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
import { cn } from "@/lib/utils";

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (category: { name: string; color: string }) => void;
}

const AVAILABLE_COLORS = [
  { id: "chart-1", name: "Зелёный", class: "bg-chart-1" },
  { id: "chart-2", name: "Янтарный", class: "bg-chart-2" },
  { id: "chart-3", name: "Синий", class: "bg-chart-3" },
  { id: "chart-4", name: "Фиолетовый", class: "bg-chart-4" },
  { id: "chart-5", name: "Розовый", class: "bg-chart-5" },
  { id: "primary", name: "Основной", class: "bg-primary" },
  { id: "destructive", name: "Красный", class: "bg-destructive" },
];

export default function CategoryModal({ open, onClose, onSave }: CategoryModalProps) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState("chart-1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({ name: name.trim(), color: selectedColor });
      handleClose();
    }
  };

  const handleClose = () => {
    setName("");
    setSelectedColor("chart-1");
    onClose();
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      handleClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="modal-category">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle data-testid="text-modal-title">Добавить новую категорию</DialogTitle>
            <DialogDescription>
              Создайте пользовательскую категорию для организации ваших привычек.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="categoryName">
                Название категории <span className="text-destructive">*</span>
              </Label>
              <Input
                id="categoryName"
                placeholder="например, Фитнес, Чтение, Работа"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                data-testid="input-category-name"
              />
            </div>

            <div className="space-y-2">
              <Label>Выберите цвет</Label>
              <div className="grid grid-cols-7 gap-3">
                {AVAILABLE_COLORS.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColor(color.id)}
                    className={cn(
                      "w-10 h-10 rounded-lg transition-all hover-elevate",
                      color.class,
                      selectedColor === color.id && "ring-2 ring-ring ring-offset-2"
                    )}
                    title={color.name}
                    data-testid={`button-color-${color.id}`}
                  />
                ))}
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
            <Button type="submit" disabled={!name.trim()} data-testid="button-save">
              Добавить категорию
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
