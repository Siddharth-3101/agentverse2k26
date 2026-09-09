import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, ChevronDown, Menu, Search, CheckCheck, ExternalLink, UserCheck, Shield, GraduationCap, School, X, CalendarDays, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getNotificationsByUserId, markNotificationAsRead } from '../../services/notificationService';
import { getEvents } from '../../services/eventService';
import { getClubs } from '../../services/clubService';

export default function TopNavbar({ onMenu }) {
  const { user, loginAs } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // --- Search state ---
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const searchDebounceRef = useRef(null);

  const fetchNotifs = () => {
    if (user?.id) {
      getNotificationsByUserId(user.id)
        .then((res) => {
          const list = res?.data || res;
          if (Array.isArray(list)) {
            setNotifications(list);
          }
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 10000); // Polling every 10s for new applications
    return () => clearInterval(interval);
  }, [user?.id]);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search across events + clubs
  const handleSearchInput = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }
    setIsSearchOpen(true);
    setIsSearching(true);
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const lower = q.toLowerCase();
        const [evtRes, clubRes] = await Promise.allSettled([getEvents(), getClubs()]);
        const evts = (evtRes.status === 'fulfilled' ? (evtRes.value?.data || evtRes.value) : []) || [];
        const clubs = (clubRes.status === 'fulfilled' ? (clubRes.value?.data || clubRes.value) : []) || [];

        const matchedEvts = Array.isArray(evts)
          ? evts.filter(e => e.title?.toLowerCase().includes(lower) || e.category?.toLowerCase().includes(lower)).slice(0, 4).map(e => ({ type: 'event', id: e.id, label: e.title, sub: e.category || 'Event', route: '/events' }))
          : [];
        const matchedClubs = Array.isArray(clubs)
          ? clubs.filter(c => c.name?.toLowerCase().includes(lower) || c.category?.toLowerCase().includes(lower)).slice(0, 3).map(c => ({ type: 'club', id: c.id, label: c.name, sub: c.category || 'Club', route: '/clubs' }))
          : [];

        setSearchResults([...matchedEvts, ...matchedClubs]);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/events?q=${encodeURIComponent(searchQuery.trim())}`);
    }
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };


  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 1, read: true } : n))
      );
    } catch (err) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 1, read: true } : n))
      );
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read && !n.read).length;

  const displayName = user?.name || user?.full_name || 'Student';
  const displayMeta = user?.role === 'TEACHER' 
    ? (user?.department || 'Faculty Mentor') 
    : (user?.role === 'ADMIN' ? 'Campus Admin' : `${user?.dept || user?.department || 'CSE'} · ${user?.year || `${user?.year_of_study || 3}rd Year`}`);
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="topbar relative">
      <button className="menu-button" onClick={onMenu} aria-label="Open menu">
        <Menu size={20} />
      </button>

      {/* Live Search */}
      <div className="relative" ref={searchRef}>
        <label className="search">
          <Search size={19} />
          <input
            placeholder="Search events, clubs..."
            value={searchQuery}
            onChange={handleSearchInput}
            onKeyDown={handleSearchKeyDown}
            onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
            autoComplete="off"
          />
          {searchQuery && (
            <button
              type="button"
              className="p-1 text-slate-400 hover:text-slate-700 transition"
              onClick={() => { setSearchQuery(''); setSearchResults([]); setIsSearchOpen(false); }}
            >
              <X size={15} />
            </button>
          )}
        </label>

        {isSearchOpen && (
          <div className="absolute left-0 top-full mt-2 w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-fadeIn">
            <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Search Results</span>
              {isSearching && <span className="text-[10px] text-indigo-500 font-bold animate-pulse">Searching…</span>}
            </div>
            {searchResults.length === 0 && !isSearching ? (
              <div className="p-5 text-center text-slate-500 text-xs">
                <span className="text-2xl block mb-1">🔍</span>
                No results for "<span className="font-bold">{searchQuery}</span>"
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                {searchResults.map((result, idx) => (
                  <button
                    key={`${result.type}-${result.id}-${idx}`}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 transition flex items-center gap-3"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                      navigate(result.route);
                    }}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${result.type === 'event' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                      {result.type === 'event' ? <CalendarDays size={15} /> : <Users size={15} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-slate-900 truncate">{result.label}</div>
                      <div className="text-[11px] text-slate-500">{result.sub}</div>
                    </div>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase shrink-0 ${result.type === 'event' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {result.type}
                    </span>
                  </button>
                ))}
              </div>
            )}
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500">
              Press <kbd className="bg-white border border-slate-200 px-1 py-0.5 rounded text-[10px] font-mono">Enter</kbd> to search all events
            </div>
          </div>
        )}
      </div>


      <div className="top-actions flex items-center gap-3">
        {/* Real-time Notifications Bell with Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            className="notification relative p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
            title="Notifications"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Popover */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-fadeIn">
              <div className="p-4 bg-gradient-to-r from-[#1c4980] to-[#2563eb] text-white flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm flex items-center gap-2">
                    <span>🔔 Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {unreadCount} New
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-blue-100 mt-0.5">
                    Live updates for {displayName} ({user?.role})
                  </p>
                </div>
                {user?.role === 'TEACHER' && (
                  <button
                    onClick={() => {
                      setIsNotifOpen(false);
                      navigate('/teacher/notifications');
                    }}
                    className="text-xs bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1"
                  >
                    Review <ExternalLink size={12} />
                  </button>
                )}
              </div>

              {/* Notification Items List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-xs">
                    <span className="text-2xl block mb-1">🎉</span>
                    <span>No notifications right now. You're all caught up!</span>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const isUnread = !notif.is_read && !notif.read;
                    return (
                      <div
                        key={notif.id}
                        className={`p-3.5 text-xs transition hover:bg-slate-50 flex items-start justify-between gap-3 ${
                          isUnread ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                                notif.type === 'APPLICATION' || notif.type === 'application'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-indigo-100 text-indigo-800'
                              }`}
                            >
                              {notif.type || 'NOTICE'}
                            </span>
                            <span className="text-slate-800 font-bold truncate">
                              {notif.title || 'Club Update'}
                            </span>
                          </div>

                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            {notif.message}
                          </p>

                          <span className="text-[10px] text-slate-400 block">
                            {notif.created_at ? new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                          </span>
                        </div>

                        {isUnread && (
                          <button
                            onClick={(e) => handleMarkAsRead(notif.id, e)}
                            title="Mark as read"
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded-lg shrink-0 mt-1"
                          >
                            <CheckCheck size={15} />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {user?.role === 'TEACHER' && (
                <div className="p-2.5 bg-slate-50 text-center border-t border-slate-100">
                  <button
                    onClick={() => {
                      setIsNotifOpen(false);
                      navigate('/teacher/notifications');
                    }}
                    className="text-xs font-bold text-[#1c4980] hover:underline"
                  >
                    View All Applications & Notifications →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile & Easy Persona Switcher Dropdown */}
        <div className="relative" ref={profileRef}>
          <div
            className="flex items-center gap-3 cursor-pointer p-1.5 rounded-xl hover:bg-slate-100 transition"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          >
            <div className="avatar">{initial}</div>
            <div className="user-meta hidden sm:block">
              <b>{displayName}</b>
              <small>{displayMeta}</small>
            </div>
            <ChevronDown className="chevron text-slate-400" size={17} />
          </div>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-fadeIn text-xs">
              <div className="p-3.5 bg-slate-50 border-b border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Logged In As</span>
                <div className="font-extrabold text-slate-900 mt-0.5">{displayName}</div>
                <div className="text-slate-500 text-[11px]">{user?.email}</div>
              </div>

              {/* Persona Quick Switcher */}
              <div className="p-2 space-y-1">
                <span className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Switch User Account
                </span>

                <button
                  onClick={() => {
                    loginAs('STUDENT');
                    setIsProfileMenuOpen(false);
                    navigate('/dashboard');
                  }}
                  className={`w-full text-left p-2 rounded-xl flex items-center gap-2.5 transition ${
                    user?.id === 2 ? 'bg-blue-50 text-[#1c4980] font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <GraduationCap size={16} className="text-blue-600 shrink-0" />
                  <div>
                    <div className="font-bold">Siddharth G</div>
                    <div className="text-[10px] text-slate-400">President (AI & Coding Society)</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    loginAs('STUDENT_SANJAY');
                    setIsProfileMenuOpen(false);
                    navigate('/dashboard');
                  }}
                  className={`w-full text-left p-2 rounded-xl flex items-center gap-2.5 transition ${
                    user?.id === 1 ? 'bg-blue-50 text-[#1c4980] font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <GraduationCap size={16} className="text-purple-600 shrink-0" />
                  <div>
                    <div className="font-bold">Sanjay Krishna</div>
                    <div className="text-[10px] text-slate-400">Vice President (Coding Club)</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    loginAs('STUDENT_SANKARI');
                    setIsProfileMenuOpen(false);
                    navigate('/dashboard');
                  }}
                  className={`w-full text-left p-2 rounded-xl flex items-center gap-2.5 transition ${
                    user?.id === 3 ? 'bg-blue-50 text-[#1c4980] font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <GraduationCap size={16} className="text-pink-600 shrink-0" />
                  <div>
                    <div className="font-bold">Sankari G</div>
                    <div className="text-[10px] text-slate-400">President (Resonance Music)</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    loginAs('TEACHER');
                    setIsProfileMenuOpen(false);
                    navigate('/teacher/dashboard');
                  }}
                  className={`w-full text-left p-2 rounded-xl flex items-center gap-2.5 transition ${
                    user?.role === 'TEACHER' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <School size={16} className="text-indigo-600 shrink-0" />
                  <div>
                    <div className="font-bold">Dr. A. K. Gupta</div>
                    <div className="text-[10px] text-slate-400">Faculty Mentor (CSE)</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    loginAs('ADMIN');
                    setIsProfileMenuOpen(false);
                    navigate('/admin/dashboard');
                  }}
                  className={`w-full text-left p-2 rounded-xl flex items-center gap-2.5 transition ${
                    user?.role === 'ADMIN' ? 'bg-amber-50 text-amber-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Shield size={16} className="text-amber-600 shrink-0" />
                  <div>
                    <div className="font-bold">Campus Administrator</div>
                    <div className="text-[10px] text-slate-400">Admin Privileges</div>
                  </div>
                </button>
              </div>

              <div className="p-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    navigate(user?.role === 'TEACHER' ? '/teacher/profile' : '/profile');
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition flex items-center gap-2"
                >
                  <UserCheck size={14} />
                  <span>View Full Profile</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
