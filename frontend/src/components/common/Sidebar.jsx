import React, { useState } from 'react';

const Sidebar = ({ activePage = 'events', onNavigate = () => {} }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userRole, setUserRole] = useState('STUDENT'); // 'STUDENT' | 'TEACHER' | 'ADMIN'

  // Navigation Items Grouping
  const studentNavItems = [
    { id: 'events', label: 'All Events', icon: '🏆', badge: 'New' },
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'clubs', label: 'All Clubs', icon: '♣️' },
    { id: 'my-club', label: 'My Club', icon: '🛡️' },
    { id: 'certificates', label: 'Certificates', icon: '🎓' },
    { id: 'profile', label: 'Profile & Portfolio', icon: '👤' }
  ];

  const teacherNavItems = [
    { id: 'teacher-dashboard', label: 'Teacher Overview', icon: '📊' },
    { id: 'teacher-clubs', label: 'My Managed Clubs', icon: '💼' },
    { id: 'teacher-leaderboard', label: 'Leaderboard', icon: '🥇' },
    { id: 'teacher-notifications', label: 'Notifications', icon: '🔔', badge: '3' }
  ];

  const adminNavItems = [
    { id: 'admin-dashboard', label: 'Admin Overview', icon: '⚙️' },
    { id: 'manage-clubs', label: 'Manage Clubs', icon: '🏢' },
    { id: 'manage-users', label: 'Manage Users', icon: '👥' },
    { id: 'manage-events', label: 'Manage Events', icon: '📅' }
  ];

  return (
    <>
      {/* Mobile Top Bar with Hamburger */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <div className="bg-[#1c4980] text-white p-1.5 rounded-lg font-extrabold text-sm">
            AV
          </div>
          <span className="font-extrabold text-slate-900 text-lg">AgentVerse</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
        >
          {isMobileOpen ? (
            <span className="text-xl font-bold">✕</span>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Overlay Backdrop for Mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
        ></div>
      )}

      {/* Permanent Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-6">
          
          {/* Top Brand Logo */}
          <div className="flex items-center justify-between pt-1 px-2">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-tr from-[#1c4980] to-[#2563eb] text-white p-2 rounded-xl shadow-md font-black text-lg w-10 h-10 flex items-center justify-center">
                AV
              </div>
              <div>
                <h1 className="font-black text-xl text-[#1c4980] tracking-tight leading-none">
                  AgentVerse
                </h1>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                  Campus Platform
                </span>
              </div>
            </div>
          </div>

          {/* Viewing Mode Selector Card (Unstop Style) */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              You're viewing as
            </label>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="w-full bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1c4980]"
            >
              <option value="STUDENT">🎓 Student / Talent</option>
              <option value="TEACHER">👨‍🏫 Teacher / Mentor</option>
              <option value="ADMIN">⚡ Teacher + Admin</option>
            </select>
          </div>

          {/* Quick Create Action Button */}
          <button
            onClick={() => onNavigate('events')}
            className="w-full py-2.5 bg-[#1c4980] hover:bg-blue-900 text-white rounded-xl font-extrabold text-xs tracking-wide shadow-md shadow-blue-900/10 transition flex items-center justify-center space-x-2"
          >
            <span className="text-base">+</span>
            <span>Participate in Event</span>
          </button>

          {/* Student Navigation Menu */}
          <div className="space-y-1">
            <div className="px-3 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
              Student Navigation
            </div>
            {studentNavItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-[#1c4980] border-l-4 border-[#1c4980] shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-[#1c4980] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Teacher Navigation Menu */}
          {(userRole === 'TEACHER' || userRole === 'ADMIN') && (
            <div className="space-y-1 pt-4 border-t border-slate-100">
              <div className="px-3 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                Teacher Features
              </div>
              {teacherNavItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMobileOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-900 border-l-4 border-indigo-700 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Admin Navigation Menu */}
          {userRole === 'ADMIN' && (
            <div className="space-y-1 pt-4 border-t border-slate-100">
              <div className="px-3 text-[11px] font-extrabold text-amber-600 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Admin Controls</span>
                <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-black">
                  ADMIN
                </span>
              </div>
              {adminNavItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMobileOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-amber-50 text-amber-900 border-l-4 border-amber-600 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

        </div>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                S
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-extrabold text-slate-800 truncate">
                  Siddharth
                </div>
                <div className="text-[10px] text-slate-500 truncate font-semibold">
                  siddharth@campus.edu
                </div>
              </div>
            </div>
            <button
              title="Logout"
              onClick={() => onNavigate('login')}
              className="text-slate-400 hover:text-red-600 transition p-1 text-xs font-bold"
            >
              🚪
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
