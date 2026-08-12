import React from 'react';
import Link from 'next/link';
import { Client } from '@/types';
import { Card } from '@/components/shared/Card';
import { Avatar } from '@/components/shared/Avatar';

interface RecentClientsListProps {
  clients: Client[];
}

export const RecentClientsList: React.FC<RecentClientsListProps> = ({ clients }) => {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-800">Recent Clients</h2>
        <Link
          href="/admin/clients"
          className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {clients.slice(0, 5).map((client) => (
          <div
            key={client.id}
            className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50/70 transition-colors"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <Avatar initials={client.avatarInitials} size="md" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate leading-tight">
                  {client.contactName}
                </p>
                <p className="text-xs text-slate-500 truncate mt-0.5">{client.businessName}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 shrink-0">
              <span className="text-xs text-slate-500 font-normal">
                {client.certificateCount} certs
              </span>
              <Link
                href={`/admin/clients/${client.id}`}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors px-2 py-1 rounded-md hover:bg-teal-50"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
