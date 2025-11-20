import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCategories } from "@/contexts/CategoryContext";
import CategoryModal from "@/components/CategoryModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CategorySettings() {
  const { categories, addCategory, deleteCategory } = useCategories();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleAddCategory = (category: { name: string; color: string }) => {
    const exists = categories.some(
      (cat) => cat.name.toLowerCase() === category.name.toLowerCase()
    );

    if (exists) {
      toast({
        title: "Категория уже существует",
        description: `Категория с названием "${category.name}" уже существует.`,
        variant: "destructive",
      });
      return;
    }

    addCategory(category);
    toast({
      title: "Категория добавлена",
      description: `"${category.name}" добавлена в ваши категории.`,
    });
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeletingCategory({ id, name });
  };

  const confirmDelete = () => {
    if (deletingCategory) {
      const success = deleteCategory(deletingCategory.id);
      if (success) {
        toast({
          title: "Категория удалена",
          description: `"${deletingCategory.name}" была удалена.`,
        });
      }
      setDeletingCategory(null);
    }
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

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">
            Настройки категорий
          </h1>
          <p className="text-muted-foreground" data-testid="text-page-description">
            Управляйте категориями ваших привычек
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="gap-2"
          data-testid="button-add-category"
        >
          <Plus className="w-5 h-5" />
          Добавить категорию
        </Button>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Ваши категории</h2>
        
        {categories.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Категорий пока нет. Создайте свою первую категорию, чтобы начать.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 rounded-lg border hover-elevate"
                data-testid={`card-category-${category.id}`}
              >
                <Badge
                  className={cn(
                    "text-base px-4 py-2",
                    getCategoryColorClass(category.color)
                  )}
                  data-testid={`badge-category-${category.id}`}
                >
                  {category.name}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteClick(category.id, category.name)}
                  data-testid={`button-delete-${category.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <CategoryModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddCategory}
      />

      <AlertDialog
        open={!!deletingCategory}
        onOpenChange={(newOpen) => {
          if (!newOpen) {
            setDeletingCategory(null);
          }
        }}
      >
        <AlertDialogContent data-testid="dialog-delete-category">
          <AlertDialogHeader>
            <AlertDialogTitle data-testid="text-delete-title">
              Удалить категорию?
            </AlertDialogTitle>
            <AlertDialogDescription data-testid="text-delete-description">
              Вы уверены, что хотите удалить категорию "
              <strong>{deletingCategory?.name}</strong>"? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Удалить категорию
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </ProtectedRoute>
  );
}
