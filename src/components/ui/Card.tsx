import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export function Card({ children, className = '', padding = true }: CardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm ${padding ? 'p-5' : ''} ${className}`}>
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBg?: string;
  trend?: { value: string; positive: boolean };
}

export function StatCard({ title, value, icon, iconBg = 'bg-cyan-50 dark:bg-cyan-900/20', trend }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <p className={`mt-1 text-xs font-medium ${trend.positive ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend.positive ? '▲' : '▼'} {trend.value}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconBg}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
