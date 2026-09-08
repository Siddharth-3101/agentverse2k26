import React from 'react';
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

  // Pending applications for Coding Club
  const pendingApplications = notifications.filter(n => n.status === 'PENDING');

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fadeIn">
      {/* Welcome Hero Section (Matching CampusVerse Student Dashboard Hero Card) */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold mb-3 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            AgentVerse Faculty
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Good afternoon, {teacher.name.split(' ')[0]} 👋
          </h1>
          <p className="text-indigo-200/90 text-sm max-w-xl leading-relaxed">
            Manage your club, review student applications, and track your club activities.
          </p>
        </div>
      </div>

      {/* 4 Summary Cards (Matching CampusVerse Student Dashboard Card Styles) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: My Club */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              My Club
            </span>
            <div className="text-xl font-bold text-slate-900 mb-1">
              {teacher.club}
            </div>
            <p className="text-xs text-slate-500">
              Assigned Club Mentor
            </p>
          </div>
          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer">
            <span>View club</span>
            <span className="ml-1">→</span>
          </div>
        </div>

        {/* Card 2: Total Members */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Total Members
            </span>
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {club.totalMembers}
            </div>
          </div>
          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-600">
            <span>↑ 8 this month</span>
          </div>
        </div>

        {/* Card 3: Pending Applications */}
        <div 
          id="cardPendingApplications"
          onClick={() => setActiveTab('notifications')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between cursor-pointer group"
        >
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Pending Applications
            </span>
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {pendingCount}
            </div>
          </div>
          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
            <span>Review</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </div>
        </div>

        {/* Card 4: Upcoming Activities */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Upcoming Activities
            </span>
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {club.upcomingActivities.length}
            </div>
          </div>
          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-500">
            <span>This month</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Applications Queue & Club Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Pending Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Pending Applications for {teacher.club}
              </h2>
              <p className="text-xs text-slate-500">
                Students who applied to join your club.
              </p>
            </div>
            <button
              type="button"
              id="dashboardViewAllNotifsBtn"
              onClick={() => setActiveTab('notifications')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              View all notifications ({unreadCount} unread)
            </button>
          </div>

          {pendingApplications.length > 0 ? (
            <div className="space-y-3">
              {pendingApplications.slice(0, 3).map(app => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-indigo-200 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {app.studentName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">
                          {app.studentName}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                          {app.studentId}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {app.department} • {app.yearOfStudy}
                      </p>
                      <p className="text-xs text-slate-600 line-clamp-1 mt-1.5 italic">
                        "{app.reason}"
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openApplicationReview(app)}
                    className="self-end sm:self-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5 flex-shrink-0"
                  >
                    <span>Review Application</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 font-bold">
                ✓
              </div>
              <h3 className="text-sm font-bold text-slate-800">All applications processed!</h3>
              <p className="text-xs text-slate-500 mt-1">
                There are no pending applications for {teacher.club} at this moment.
              </p>
            </div>
          )}
        </div>

        {/* Right Col: Club Activities */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Upcoming Club Activities
            </h2>
            <p className="text-xs text-slate-500">
              Scheduled events for {teacher.club}.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            {club.upcomingActivities.map(act => (
              <div key={act.id} className="pb-3.5 border-b border-slate-100 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-600">
                    {act.type}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {act.date}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-800">{act.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {act.venue}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100/80">
            <h4 className="text-xs font-bold text-indigo-900 mb-1">
              Faculty Notice
            </h4>
            <p className="text-xs text-indigo-700/90 leading-relaxed">
              Approved student memberships are updated in the student portal in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
