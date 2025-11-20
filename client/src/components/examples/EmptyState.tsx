import EmptyState from '../EmptyState';

export default function EmptyStateExample() {
  const handleAddHabit = () => {
    console.log('Add first habit clicked');
  };

  return (
    <div className="p-6">
      <EmptyState onAddHabit={handleAddHabit} />
    </div>
  );
}
