import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileFormProps {
  initialData?: {
    name: string;
    email: string;
    bio: string;
    status: string;
    photoUrl?: string;
  };
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState(
    initialData || {
      name: "Иван Иванов",
      email: "ivan.ivanov@example.com",
      bio: "Формирую полезные привычки день за днём.",
      status: "Сосредоточен на росте",
      photoUrl: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile updated:", formData);
    toast({
      title: "Профиль обновлён",
      description: "Ваш профиль был успешно обновлён.",
    });
  };

  const handlePhotoUpload = () => {
    console.log("Photo upload clicked");
    toast({
      title: "Функция скоро появится",
      description: "Загрузка фотографий будет доступна в полной версии.",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 md:col-span-1">
          <div className="space-y-4">
            <div className="flex flex-col items-center text-center">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-primary">
                  <AvatarImage src={formData.photoUrl} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                    {formData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handlePhotoUpload}
                  data-testid="button-upload-photo"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <h3 className="text-xl font-semibold mt-4" data-testid="text-profile-name">
                {formData.name}
              </h3>
              <p className="text-sm text-muted-foreground" data-testid="text-profile-email">
                {formData.email}
              </p>
            </div>

            <div className="pt-4 border-t">
              <Label htmlFor="status" className="text-sm font-medium">
                Пользовательский статус
              </Label>
              <Input
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                placeholder="О чём вы думаете?"
                className="mt-2"
                maxLength={100}
                data-testid="input-status"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.status.length}/100
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 md:col-span-2">
          <h3 className="text-xl font-semibold mb-6">Информация профиля</h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Полное имя</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ваше полное имя"
                data-testid="input-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="ваш.email@example.com"
                data-testid="input-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">О себе</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Расскажите о себе..."
                className="resize-none min-h-[120px]"
                data-testid="input-bio"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                data-testid="button-cancel-profile"
              >
                Отмена
              </Button>
              <Button type="submit" className="gap-2" data-testid="button-save-profile">
                <Save className="w-4 h-4" />
                Сохранить изменения
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </form>
  );
}
