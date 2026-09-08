import React from 'react';

const statusStyles = {
  PARTIALLY_APPLIED: 'bg-amber-100 text-amber-800 border-amber-200',
  OPEN: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  CLOSED: 'bg-rose-100 text-rose-800 border-rose-200',
  ACCEPTED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  DECLINED: 'bg-rose-100 text-rose-800 border-rose-200',
  PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
};

const statusLabels = {
  PARTIALLY_APPLIED: 'In Progress',
  OPEN: 'Open',
  CLOSED: 'Closed',
  ACCEPTED: 'Accepted',
  DECLINED: 'Declined',
  PENDING: 'Pending',
};

export default function Badge({ status, text }) {
  const style = statusStyles[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  const label = text || statusLabels[status] || status || 'Active';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
      {label}
    </span>
  );
}
