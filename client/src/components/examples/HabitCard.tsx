import HabitCard from '../HabitCard';

export default function HabitCardExample() {
  const handleToggle = (id: string) => {
    console.log('Toggle complete:', id);
  };

  const handleEdit = (id: string) => {
    console.log('Edit habit:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete habit:', id);
  };

  return (
    <div className="p-6 space-y-4">
      <HabitCard
        id="1"
        name="Morning Exercise"
        description="30 minutes of cardio or strength training"
        category="Health"
        last7Days={[true, true, false, true, true, true, false]}
        isCompletedToday={false}
        onToggleComplete={handleToggle}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      <HabitCard
        id="2"
        name="Read for 20 minutes"
        description="Read any book or article"
        category="Learning"
        last7Days={[true, true, true, true, true, true, true]}
        isCompletedToday={true}
        onToggleComplete={handleToggle}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
