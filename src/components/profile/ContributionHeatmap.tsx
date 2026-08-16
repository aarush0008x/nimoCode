import React from 'react';

interface ContributionHeatmapProps {
  heatmapData: Record<string, number>;
}

export const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({ heatmapData }) => {
  const dates = Object.keys(heatmapData).sort();
  const weeks: { date: string; count: number }[][] = [];
  let currentWeek: { date: string; count: number }[] = [];

  dates.forEach((d, idx) => {
    currentWeek.push({ date: d, count: heatmapData[d] || 0 });
    if (currentWeek.length === 7 || idx === dates.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const getColor = (count: number) => {
    if (count === 0) return 'bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50';
    if (count <= 2) return 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/40';
    if (count <= 5) return 'bg-emerald-600 text-white border border-emerald-500';
    return 'bg-emerald-400 text-neutral-950 font-bold border border-white';
  };

  const totalSubmissions = Object.values(heatmapData).reduce((a, b) => a + b, 0);

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Submission Activity</h3>
          <p className="text-xs text-neutral-400 mt-0.5">{totalSubmissions} submissions in the past year</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-xs bg-neutral-200 dark:bg-neutral-800" />
          <span className="w-2.5 h-2.5 rounded-xs bg-emerald-900/40" />
          <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600" />
          <span className="w-2.5 h-2.5 rounded-xs bg-emerald-400" />
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1.5 min-w-[700px]">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5">
              {week.map(day => (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.count} submissions`}
                  className={`w-3.5 h-3.5 rounded-xs transition-transform hover:scale-125 cursor-pointer ${getColor(
                    day.count
                  )}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
