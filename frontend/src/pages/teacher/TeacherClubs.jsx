import React, { useState, useEffect } from 'react';
import { useTeacherNotifications } from '../../context/teacherNotificationContext';
import { getClubs } from '../../services/clubService';

const TeacherClubs = () => {
  const { teacher, club } = useTeacherNotifications();
  const [liveClub, setLiveClub] = useState(null);

  useEffect(() => {
    getClubs()
      .then((res) => {
        const clubs = res?.data || res;
        if (Array.isArray(clubs) && clubs.length > 0) {
          // Match by teacher mentor id or club id
          const found = clubs.find((c) => c.mentor_teacher_id === teacher.id || c.id === teacher.club_id || c.name === teacher.club);
          if (found) {
            setLiveClub(found);
          } else {
            setLiveClub(clubs[0]);
          }
        }
      })
      .catch((e) => console.warn('[TeacherClubs fetch notice]:', e.message));
  }, [teacher]);

  const clubDetails = {
    name: liveClub?.name || teacher.club || 'Agentic AI & Coding Society',
    category: liveClub?.category || 'Technical & Innovation',
    established: '2023',
    totalMembers: liveClub?.member_count || liveClub?.total_members || club.totalMembers || 42,
    activeProjects: 6,
    mentor: liveClub?.mentor_name || teacher.name || 'Dr. A. K. Gupta',
    department: liveClub?.department || teacher.department || 'Computer Science & Engineering',
    lead: `${liveClub?.president_name || 'Siddharth G'} (President)`,
    vicePresident: `${liveClub?.vp_name || 'Sanjay Krishna'} (Vice President)`,
    budget: '₹75,000 / Semester',
    upcomingEvents: club.upcomingActivities || []
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1c4980] via-[#1e3a8a] to-[#2563eb] rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-bold mb-3">
            <span>🛡️ Faculty Mentorship</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            {clubDetails.name} — Mentored Club Overview
          </h1>
          <p className="text-blue-100/90 text-sm max-w-xl">
            Monitor membership growth, approve club activities, and guide executive student coordinators.
          </p>
        </div>
      </div>

      {/* 4 Metrics Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Members</span>
          <div className="text-2xl font-black text-[#1c4980] mt-1">{clubDetails.totalMembers}</div>
          <span className="text-[11px] text-emerald-600 font-bold">+14 this month</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Projects</span>
          <div className="text-2xl font-black text-indigo-600 mt-1">{clubDetails.activeProjects}</div>
          <span className="text-[11px] text-slate-500 font-medium">In development</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Allocated Budget</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{clubDetails.budget}</div>
          <span className="text-[11px] text-emerald-700 font-bold">Approved</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Upcoming Events</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{clubDetails.upcomingEvents.length}</div>
          <span className="text-[11px] text-amber-700 font-bold">Scheduled</span>
        </div>
      </div>

      {/* Club Executive Leadership & Mentorship Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mentor & Leadership Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Faculty Mentor & Student Leadership
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-blue-50/70 rounded-xl border border-blue-100">
              <div>
                <span className="font-extrabold text-[#1c4980] block text-sm">{clubDetails.mentor}</span>
                <span className="text-slate-500">Official Club Faculty Mentor • {clubDetails.department}</span>
              </div>
              <span className="px-2.5 py-1 bg-[#1c4980] text-white rounded-full font-bold text-[10px]">
                Faculty Lead
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="font-bold text-slate-800 block text-sm">{clubDetails.lead}</span>
                <span className="text-slate-500">Club President</span>
              </div>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px]">
                President
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="font-bold text-slate-800 block text-sm">{clubDetails.vicePresident}</span>
                <span className="text-slate-500">Vice President</span>
              </div>
              <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full font-bold text-[10px]">
                Vice President
              </span>
            </div>
          </div>
        </div>

        {/* Upcoming Club Activities */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Scheduled Club Activities
          </h2>
          <div className="space-y-3">
            {clubDetails.upcomingEvents.map((act) => (
              <div
                key={act.id}
                className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    📍 {act.venue} • 🗓️ {act.date}
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-lg border border-indigo-100 shrink-0">
                  {act.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherClubs;

