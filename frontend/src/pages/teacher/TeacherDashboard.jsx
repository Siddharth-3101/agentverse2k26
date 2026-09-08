import React, { useState } from 'react';
import { useTeacherNotifications } from '../../context/teacherNotificationContext';

const TeacherDashboard = () => {
  const {
    teacher,
    club,
    notifications,
    pendingCount,
    unreadCount,
    setActiveTab,
    openApplicationReview
  } = useTeacherNotifications();

  const [activeTimeframe, setActiveTimeframe] = useState('monthly');

  // Analytics mock data for Coding Club
  const membershipTrend = [
    { month: 'Jan', members: 72 },
    { month: 'Feb', members: 80 },
    { month: 'Mar', members: 88 },
    { month: 'Apr', members: 95 },
    { month: 'May', members: 102 },
    { month: 'Jun', members: 108 },
    { month: 'Jul', members: 114 },
    { month: 'Aug', members: 120 },
    { month: 'Sep', members: 128 }
  ];

  const departmentBreakdown = [
    { dept: 'Computer Science & Eng', count: 68, percentage: 53, color: 'bg-indigo-600' },
    { dept: 'Information Technology', count: 32, percentage: 25, color: 'bg-purple-600' },
    { dept: 'Electronics & Comm', count: 18, percentage: 14, color: 'bg-blue-500' },
    { dept: 'Mechanical & Other', count: 10, percentage: 8, color: 'bg-emerald-500' }
  ];

  const eventParticipation = [
    { title: 'Spring CodeSprint 2026', type: 'Hackathon', registered: 94, capacity: 100, fillRate: 94 },
    { title: 'System Design & Microservices', type: 'Workshop', registered: 76, capacity: 80, fillRate: 95 },
    { title: 'Open Source Mentorship Circle', type: 'Meetup', registered: 52, capacity: 60, fillRate: 87 }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fadeIn pb-12">
      {/* 1. Header Greeting & Single Mentored Club Badge */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-indigo-900 to-purple-950 p-6 sm:p-8 text-white shadow-xl border border-indigo-800/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-bold mb-3 border border-white/15">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              MENTOR OF: {teacher.club.toUpperCase()}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
              Good afternoon, {teacher.name.split(' ')[0]} 👋
            </h1>

            <p className="text-indigo-200/90 text-sm max-w-xl leading-relaxed">
              Overview of your club's activity, membership growth, and student participation.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:px-6 text-center sm:text-left flex items-center gap-4 flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
              CC
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-300 block">
                Assigned Mentor
              </span>
              <span className="text-base font-bold text-white block">
                {teacher.club}
              </span>
              <span className="text-[11px] text-indigo-200">
                1 Teacher → 1 Club
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Club Analytics Section Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Club Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time performance and engagement metrics for {teacher.club}
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600 border border-slate-200/60">
          <button
            onClick={() => setActiveTimeframe('monthly')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTimeframe === 'monthly' ? 'bg-white text-indigo-600 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setActiveTimeframe('yearly')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTimeframe === 'yearly' ? 'bg-white text-indigo-600 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            This Year
          </button>
        </div>
      </div>

      {/* 3. 4 Polished Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Members */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Members
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">
            {club.totalMembers}
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Total Active</span>
            <span className="font-bold text-emerald-600">↑ +8 this month</span>
          </div>
        </div>

        {/* Card 2: Applications */}
        <div 
          id="cardPendingApplications"
          onClick={() => setActiveTab('notifications')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Applications
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">
            {pendingCount}
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
            <span>Pending Review</span>
            <span className="group-hover:translate-x-1 transition-transform">Review →</span>
          </div>
        </div>

        {/* Card 3: Events */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Events
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">
            {club.upcomingActivities.length}
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Upcoming Events</span>
            <span className="font-semibold text-slate-700">This Month</span>
          </div>
        </div>

        {/* Card 4: Activities */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Activities
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">
            12
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Activities</span>
            <span className="font-semibold text-slate-700">This Year</span>
          </div>
        </div>
      </div>

      {/* 4. Club Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Membership Growth Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Membership Growth Trend
              </h3>
              <p className="text-xs text-slate-500">
                Active student members in {teacher.club} over time
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 w-fit">
              +77.7% Annual Growth
            </span>
          </div>

          {/* Visual SVG Bar Chart */}
          <div className="pt-4">
            <div className="h-56 flex items-end gap-3 sm:gap-4 justify-between px-2 pb-2">
              {membershipTrend.map((item, index) => {
                const maxVal = 140;
                const heightPercent = Math.round((item.members / maxVal) * 100);
                const isLatest = index === membershipTrend.length - 1;

                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.members}
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[36px] rounded-t-xl transition-all duration-300 relative ${
                        isLatest
                          ? 'bg-gradient-to-t from-indigo-600 to-indigo-500 shadow-md shadow-indigo-100'
                          : 'bg-indigo-100 group-hover:bg-indigo-300'
                      }`}
                    ></div>
                    <span className={`text-xs font-semibold ${isLatest ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Departmental Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Department Distribution
            </h3>
            <p className="text-xs text-slate-500">
              Student members by department
            </p>
          </div>

          <div className="space-y-4">
            {departmentBreakdown.map(item => (
              <div key={item.dept} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700 truncate">{item.dept}</span>
                  <span className="text-slate-900 font-bold">{item.count} ({item.percentage}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${item.percentage}%` }}
                    className={`h-full rounded-full ${item.color}`}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Primary Focus: Computer Science</span>
            <span className="font-bold text-indigo-600">128 Total</span>
          </div>
        </div>
      </div>

      {/* 5. Event & Activity Participation Rate */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Event Participation & Capacity
            </h3>
            <p className="text-xs text-slate-500">
              Registered student participation for upcoming {teacher.club} events
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Avg Fill Rate: 92%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {eventParticipation.map(evt => (
            <div key={evt.title} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                  {evt.type}
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  {evt.fillRate}% Full
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">{evt.title}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  {evt.registered} / {evt.capacity} students registered
                </p>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  style={{ width: `${evt.fillRate}%` }}
                  className="h-full rounded-full bg-indigo-600"
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
