interface StatCardProps {
  label: string;
  value: string;
  sublabel?: string;
  accent?: 'primary' | 'secondary' | 'success';
  icon?: string;
}

const accentMap = {
  primary: 'bg-clay-primary',
  secondary: 'bg-clay-secondary',
  success: 'bg-clay-success',
};

export default function StatCard({ label, value, sublabel, accent = 'primary', icon }: StatCardProps) {
  return (
    <div className="clay flex flex-col gap-3 p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-wide text-clay-textSoft">
          {label}
        </p>
        {icon && (
          <div className={`clay-sm flex h-10 w-10 items-center justify-center text-lg ${accentMap[accent]}`}>
            {icon}
          </div>
        )}
      </div>
      <p className="font-display text-3xl font-bold text-clay-text">{value}</p>
      {sublabel && <p className="text-xs font-medium text-clay-textFaint">{sublabel}</p>}
    </div>
  );
}
