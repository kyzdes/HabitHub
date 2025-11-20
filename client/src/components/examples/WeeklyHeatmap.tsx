import WeeklyHeatmap from '../WeeklyHeatmap';

export default function WeeklyHeatmapExample() {
  const mockData = Array.from({ length: 28 }, (_, i) => ({
    date: new Date(Date.now() - (27 - i) * 24 * 60 * 60 * 1000).toISOString(),
    completions: Math.floor(Math.random() * 8),
  }));

  return (
    <div className="p-6">
      <WeeklyHeatmap data={mockData} />
    </div>
  );
}
