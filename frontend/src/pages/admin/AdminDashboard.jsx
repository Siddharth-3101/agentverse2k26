import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-amber-100 text-xs font-bold mb-3">
            <span>⚡ Institutional Administrator</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Campus Administration & Governance
          </h1>
          <p className="text-amber-100/90 text-sm max-w-xl">
            Oversee all collegiate societies, audit faculty assignments, approve event schedules, and manage user permissions.
          </p>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Registered Students</span>
          <div className="text-2xl font-black text-slate-900 mt-1">1,480</div>
          <span className="text-[11px] text-emerald-600 font-bold">+120 this month</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Approved Clubs</span>
          <div className="text-2xl font-black text-amber-600 mt-1">24</div>
          <span className="text-[11px] text-slate-500 font-medium">Across 8 departments</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Live Events</span>
          <div className="text-2xl font-black text-[#1c4980] mt-1">18</div>
          <span className="text-[11px] text-blue-600 font-bold">5 pending review</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Faculty Mentors</span>
          <div className="text-2xl font-black text-purple-600 mt-1">32</div>
          <span className="text-[11px] text-purple-700 font-bold">100% Assigned</span>
        </div>
      </div>

      {/* Admin Quick Action Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <NavLink
          to="/admin/clubs"
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition block group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition">
            🏢
          </div>
          <h3 className="font-extrabold text-base text-slate-900 group-hover:text-amber-700 transition">
            Manage Clubs & Societies
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Approve new club registrations, allocate budgets, and assign faculty mentors.
          </p>
        </NavLink>

        <NavLink
          to="/admin/events"
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition block group"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1c4980] flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition">
            📅
          </div>
          <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#1c4980] transition">
            Manage Campus Events
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Review hackathons, quizzes, and workshops submitted by student leads.
          </p>
        </NavLink>

        <NavLink
          to="/admin/users"
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-300 transition block group"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition">
            👥
          </div>
          <h3 className="font-extrabold text-base text-slate-900 group-hover:text-purple-700 transition">
            Manage Users & Roles
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Assign teacher mentor permissions, student officer roles, and department rosters.
          </p>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminDashboard;
