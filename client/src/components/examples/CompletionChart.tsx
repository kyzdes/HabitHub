import CompletionChart from '../CompletionChart';

export default function CompletionChartExample() {
  const mockData = Array.from({ length: 14 }, (_, i) => ({
    date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toISOString(),
    completions: Math.floor(Math.random() * 10) + 2,
  }));

  return (
    <div className="p-6">
      <CompletionChart data={mockData} />
    </div>
  );
}
