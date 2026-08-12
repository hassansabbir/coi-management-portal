import React from 'react';
import { Activity } from '@/types';
import { Card } from '@/components/shared/Card';

interface RecentActivityFeedProps {
  activities: Activity[];
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ activities }) => {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-800">Recent Activity</h2>
      </div>

      <div className="divide-y divide-slate-100">
        {activities.map((activity) => (
          <div key={activity.id} className="px-6 py-3.5 hover:bg-slate-50/70 transition-colors">
            <h3 className="text-sm font-bold text-slate-900 leading-tight">{activity.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{activity.clientName}</p>
            <p className="text-xs text-slate-600 font-medium mt-0.5">{activity.action}</p>
            <p className="text-[11px] text-slate-400 mt-1">{activity.date}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
