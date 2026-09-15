interface Bar {
  label: string;
  value: number;
}

export default function ClayBarChart({ bars, accent = 'primary' }: { bars: Bar[]; accent?: 'primary' | 'secondary' | 'success' }) {
  const max = Math.max(...bars.map((b) => b.value), 1);
  const colorVar = accent === 'primary' ? 'var(--clay-primary)' : accent === 'secondary' ? 'var(--clay-secondary)' : 'var(--clay-success)';

  return (
    <div className="flex h-40 items-end gap-2">
      {bars.map((bar, i) => {
        const heightPct = Math.max((bar.value / max) * 100, 4);
        return (
          <div key={i} className="group flex flex-1 flex-col items-center gap-2">
            <div className="relative flex h-32 w-full items-end justify-center">
              <div
                className="w-full rounded-xl transition-all"
                style={{
                  height: `${heightPct}%`,
                  background: colorVar,
                  boxShadow: '3px 3px 6px var(--clay-shadow-dark), -3px -3px 6px var(--clay-shadow-light)',
                }}
                title={`₱${bar.value.toFixed(2)}`}
              />
            </div>
            <span className="text-[10px] font-semibold text-clay-textFaint">{bar.label}</span>
          </div>
        );
      })}
    </div>
  );
}
