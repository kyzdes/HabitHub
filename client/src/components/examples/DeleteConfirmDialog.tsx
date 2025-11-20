import { useState } from 'react';
import DeleteConfirmDialog from '../DeleteConfirmDialog';
import { Button } from '@/components/ui/button';

export default function DeleteConfirmDialogExample() {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    console.log('Habit deleted');
    setOpen(false);
  };

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)} variant="destructive">
        Delete Habit
      </Button>
      
      <DeleteConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        habitName="Morning Exercise"
      />
    </div>
  );
}
