import React from 'react';
import { ArrowLeft, Construction } from 'lucide-react';

export default function PlaceholderPage({ onBack = () => {} }) {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <section className="placeholder text-center py-16">
        <Construction size={38} className="mx-auto text-indigo-600 mb-4" />
        <span className="eyebrow block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">STUDENT PORTAL</span>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Module Under Development</h1>
        <p className="text-slate-500 text-sm mb-6">This module is ready for the next phase. Your dashboard is available now.</p>
        <button className="button primary inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold" onClick={onBack}>
          <ArrowLeft size={17} /> Back to dashboard
        </button>
      </section>
    </div>
  );
}
