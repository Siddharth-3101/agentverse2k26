import React, { useState } from 'react';

const LEADERBOARD_DATA = [
  {
    rank: 1,
    name: 'Coding Club',
    category: 'Technical & Coding',
    points: 4850,
    members: 128,
    events: 14,
    mentor: 'John Teacher',
    growth: '+28%',
    badge: '🥇 Gold Tier'
  },
  {
    rank: 2,
    name: 'Robotics & AI Society',
    category: 'Hardware & AI',
    points: 4420,
    members: 110,
    events: 11,
    mentor: 'Dr. Ramesh Nair',
    growth: '+22%',
    badge: '🥈 Silver Tier'
  },
  {
    rank: 3,
    name: 'Cyber Security Club',
    category: 'Security & Forensics',
    points: 3950,
    members: 95,
    events: 9,
    mentor: 'Prof. Anjali Roy',
    growth: '+18%',
    badge: '🥉 Bronze Tier'
  },
  {
    rank: 4,
    name: 'Design & UX Guild',
    category: 'Creative Design',
    points: 3200,
    members: 84,
    events: 7,
    mentor: 'Dr. Preeti Sen',
    growth: '+15%',
    badge: 'Elite'
  },
  {
    rank: 5,
    name: 'Literary & Debating Society',
    category: 'Cultural & Literary',
    points: 2900,
    members: 76,
    events: 6,
    mentor: 'Prof. S. K. Verma',
    growth: '+12%',
    badge: 'Active'
  },
  {
    rank: 6,
    name: 'Entrepreneurship Cell (E-Cell)',
    category: 'Startups & Business',
    points: 2750,
    members: 68,
    events: 5,
    mentor: 'Dr. Vivek Mishra',
    growth: '+10%',
    badge: 'Active'
  }
];

const TeacherLeaderboard = () => {
  const [filter, setFilter] = useState('all');

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1c4980] via-[#1e3a8a] to-[#2563eb] rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-bold mb-3">
            <span>🏆 Inter-Club Standings</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Campus Club Performance Leaderboard
          </h1>
          <p className="text-blue-100/90 text-sm max-w-xl">
            Real-time rankings based on student participation, hackathon hostings, and workshop achievements.
          </p>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Rank 2 - Silver */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col items-center text-center order-2 md:order-1">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl mb-3 shadow-inner">
            🥈
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Rank #2
          </span>
          <h3 className="font-extrabold text-base text-slate-900 mt-1">
            {LEADERBOARD_DATA[1].name}
          </h3>
          <span className="text-xs text-slate-500 font-semibold">{LEADERBOARD_DATA[1].category}</span>
          <div className="mt-4 px-4 py-1.5 bg-slate-100 text-slate-800 rounded-xl font-black text-sm">
            {LEADERBOARD_DATA[1].points.toLocaleString()} pts
          </div>
        </div>

        {/* Rank 1 - Gold */}
        <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl p-6 border-2 border-amber-300 shadow-md flex flex-col items-center text-center order-1 md:order-2 transform md:-translate-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-white flex items-center justify-center text-3xl mb-3 shadow-lg shadow-amber-500/20">
            👑
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-0.5 rounded-full">
            🏆 Top Performer #1
          </span>
          <h3 className="font-extrabold text-lg text-slate-900 mt-1.5">
            {LEADERBOARD_DATA[0].name}
          </h3>
          <span className="text-xs text-amber-900 font-semibold">{LEADERBOARD_DATA[0].category}</span>
          <div className="mt-4 px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-black text-base shadow-sm">
            {LEADERBOARD_DATA[0].points.toLocaleString()} pts
          </div>
        </div>

        {/* Rank 3 - Bronze */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col items-center text-center order-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl mb-3 shadow-inner">
            🥉
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Rank #3
          </span>
          <h3 className="font-extrabold text-base text-slate-900 mt-1">
            {LEADERBOARD_DATA[2].name}
          </h3>
          <span className="text-xs text-slate-500 font-semibold">{LEADERBOARD_DATA[2].category}</span>
          <div className="mt-4 px-4 py-1.5 bg-amber-50 text-amber-900 rounded-xl font-black text-sm">
            {LEADERBOARD_DATA[2].points.toLocaleString()} pts
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Comprehensive Club Rankings</h2>
            <p className="text-xs text-slate-500 mt-0.5">Updated weekly after event verification audits</p>
          </div>
          <span className="text-xs font-bold text-slate-400">Term 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Rank</th>
                <th className="py-3.5 px-5">Club Name</th>
                <th className="py-3.5 px-5">Mentor</th>
                <th className="py-3.5 px-5">Members</th>
                <th className="py-3.5 px-5">Events Held</th>
                <th className="py-3.5 px-5">Growth</th>
                <th className="py-3.5 px-5 text-right">Activity Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {LEADERBOARD_DATA.map((c) => (
                <tr key={c.rank} className="hover:bg-slate-50/70 transition">
                  <td className="py-4 px-5 font-extrabold text-slate-700">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-black text-xs ${
                      c.rank === 1 ? 'bg-amber-100 text-amber-800' : c.rank === 2 ? 'bg-slate-200 text-slate-800' : c.rank === 3 ? 'bg-amber-50 text-amber-700' : 'text-slate-500'
                    }`}>
                      {c.rank}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="font-extrabold text-slate-900 text-sm">{c.name}</div>
                    <div className="text-[11px] text-slate-500">{c.category}</div>
                  </td>
                  <td className="py-4 px-5 text-slate-600 font-medium">{c.mentor}</td>
                  <td className="py-4 px-5 font-semibold text-slate-700">{c.members}</td>
                  <td className="py-4 px-5 font-semibold text-slate-700">{c.events}</td>
                  <td className="py-4 px-5 font-bold text-emerald-600">{c.growth}</td>
                  <td className="py-4 px-5 text-right font-black text-sm text-[#1c4980]">
                    {c.points.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherLeaderboard;
