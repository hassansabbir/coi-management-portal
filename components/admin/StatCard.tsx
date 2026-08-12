import React from 'react';
import { Card } from '@/components/shared/Card';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, className = '' }) => {
  return (
    <Card className={`p-6 ${className}`}>
      <span className="text-sm font-semibold text-slate-500 tracking-tight">{title}</span>
      <div className="text-3xl font-extrabold text-slate-900 mt-2 mb-1">{value}</div>
      <span className="text-xs text-slate-400 font-normal">{subtitle}</span>
    </Card>
  );
};
