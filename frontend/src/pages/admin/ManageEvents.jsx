import React, { useState } from 'react';

const INITIAL_EVENTS = [
  { id: 1, title: 'Tejas India Hackathon 2026', club: 'Government Engineering College', category: 'Hackathons', status: 'Published', date: 'Sep 20 - Sep 22' },
  { id: 2, title: 'Code Clash 2026', club: 'Coding Club, DCRUST', category: 'Competitions', status: 'Published', date: 'Oct 02, 2026' },
  { id: 3, title: 'AI & Generative Vision Workshop', club: 'Robotics Society, DTU', category: 'Workshops', status: 'Published', date: 'Sep 24 - Sep 25' },
  { id: 4, title: 'Quantum Computing Intro Session', club: 'Quantum Hub', category: 'Workshops', status: 'Pending Review', date: 'Oct 15, 2026' }
];

const ManageEvents = () => {
  const [events, setEvents] = useState(INITIAL_EVENTS);

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Manage Campus Events
        </h1>
        <p className="text-xs text-slate-500 mt-1">Review, approve, and schedule collegiate competitions and workshops.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-5">Event Title</th>
              <th className="py-3.5 px-5">Host Organizer</th>
              <th className="py-3.5 px-5">Category</th>
              <th className="py-3.5 px-5">Schedule</th>
              <th className="py-3.5 px-5">Status</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.map(e => (
              <tr key={e.id} className="hover:bg-slate-50/70 transition">
                <td className="py-4 px-5 font-bold text-slate-900 text-sm">{e.title}</td>
                <td className="py-4 px-5 text-slate-600 font-medium">{e.club}</td>
                <td className="py-4 px-5">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-semibold text-[11px]">
                    {e.category}
                  </span>
                </td>
                <td className="py-4 px-5 text-slate-600">{e.date}</td>
                <td className="py-4 px-5">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    e.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {e.status}
                  </span>
                </td>
                <td className="py-4 px-5 text-right">
                  <button className="px-3 py-1 bg-blue-50 text-[#1c4980] hover:bg-blue-100 font-bold rounded-lg text-xs transition">
                    Edit Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageEvents;
