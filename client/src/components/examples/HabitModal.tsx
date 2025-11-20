import { useState } from 'react';
import HabitModal, { HabitFormData } from '../HabitModal';
import { Button } from '@/components/ui/button';

export default function HabitModalExample() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  const handleSave = (data: HabitFormData) => {
    console.log('Saved habit:', data);
  };

  const openCreateModal = () => {
    setMode('create');
    setOpen(true);
  };

  const openEditModal = () => {
    setMode('edit');
    setOpen(true);
  };

  return (
    <div className="p-6 space-y-4">
      <Button onClick={openCreateModal}>Open Create Modal</Button>
      <Button onClick={openEditModal} variant="secondary">Open Edit Modal</Button>
      
      <HabitModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        mode={mode}
        initialData={mode === 'edit' ? {
          name: 'Morning Exercise',
          description: '30 minutes of cardio',
          category: 'Health',
          startDate: '2025-01-01',
          reminderTime: '07:00'
        } : undefined}
      />
    </div>
  );
}
