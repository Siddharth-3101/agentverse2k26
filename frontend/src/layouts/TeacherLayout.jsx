import React, { useState } from 'react';
import { useTeacherNotifications } from '../context/teacherNotificationContext';
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import TeacherNotifications from '../pages/teacher/TeacherNotifications';
import TeacherProfile from '../pages/teacher/TeacherProfile';

const TeacherLayout = () => {
  const {
    teacher,
    unreadCount,
    activeTab,
    setActiveTab,
    selectedApplication,
    setSelectedApplication
  } = useTeacherNotifications();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setSelectedApplication(null);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of AgentVerse Faculty Portal?')) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    }
  };

  const getHeaderTitle = () => {
    if (activeTab === 'dashboard') return 'Teacher Dashboard';
    if (activeTab === 'notifications') {
      return selectedApplication ? 'Application Review' : 'Notifications';
    }
    if (activeTab === 'profile') return 'My Profile';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex flex-1">
        {/* ============================================================
            TEACHER SIDEBAR (CampusVerse Design Language)
            Contains ONLY:
            - C CampusVerse
            - ▦ Dashboard
            - ♧ Notifications
            - ♙ Profile
           ============================================================ */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
            isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
        >
          {/* Logo & Branding: C CampusVerse */}
          <div className="h-18 px-6 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white font-extrabold text-lg shadow-sm shadow-indigo-100">
                A
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  AgentVerse
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Faculty Portal
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              aria-label="Close navigation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Items (STRICTLY ONLY: Dashboard, Notifications, Profile) */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {/* 1. Dashboard */}
            <button
              type="button"
              id="navSidebarDashboard"
              onClick={() => handleNavClick('dashboard')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-150 ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-600 border border-indigo-100/80 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <svg className={`w-5 h-5 ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Dashboard</span>
            </button>

            {/* 2. Notifications */}
            <button
              type="button"
              id="navSidebarNotifications"
              onClick={() => handleNavClick('notifications')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-150 ${
                activeTab === 'notifications'
                  ? 'bg-indigo-50 text-indigo-600 border border-indigo-100/80 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <svg className={`w-5 h-5 ${activeTab === 'notifications' ? 'text-indigo-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span>Notifications</span>
              </div>
              {unreadCount > 0 && (
                <span id="sidebarNotificationBadge" className="px-2 py-0.5 text-xs font-bold rounded-full bg-indigo-600 text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* 3. Profile */}
            <button
              type="button"
              id="navSidebarProfile"
              onClick={() => handleNavClick('profile')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-150 ${
                activeTab === 'profile'
                  ? 'bg-indigo-50 text-indigo-600 border border-indigo-100/80 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <svg className={`w-5 h-5 ${activeTab === 'profile' ? 'text-indigo-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profile</span>
            </button>
          </nav>

          {/* Visually Separated Logout Action at Bottom of Sidebar */}
          <div className="p-4 border-t border-slate-100 mt-auto">
            <button
              type="button"
              id="navSidebarLogout"
              onClick={handleLogout}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all border border-transparent hover:border-rose-100"
            >
              <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* ============================================================
            MAIN CONTENT AREA
           ============================================================ */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* ============================================================
              CLEAN TOP HEADER (CampusVerse Style)
              Rules:
              - DO NOT put Notifications in the header.
              - DO NOT put Profile in the header.
              - Notifications & Profile exist ONLY in sidebar.
             ============================================================ */}
          <header className="h-18 bg-white border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
            <div className="flex items-center gap-3">
              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
                aria-label="Open navigation menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-slate-400 hidden sm:inline">AgentVerse</span>
                <span className="text-slate-300 hidden sm:inline">/</span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
                  {getHeaderTitle()}
                </h2>
              </div>
            </div>

            {/* Clean Header Right: Mentor badge only */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200/60 hidden sm:inline-block">
                Mentor: {teacher.club}
              </span>
            </div>
          </header>

          {/* Main Workspace Body */}
          <main className="flex-1 p-6 sm:p-8 lg:p-10">
            {activeTab === 'dashboard' && <TeacherDashboard />}
            {activeTab === 'notifications' && <TeacherNotifications />}
            {activeTab === 'profile' && <TeacherProfile />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default TeacherLayout;


