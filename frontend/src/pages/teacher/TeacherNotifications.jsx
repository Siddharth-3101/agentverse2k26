import React from 'react';
import { useTeacherNotifications } from '../../context/teacherNotificationContext';
import NotificationCard from '../../components/teacher/NotificationCard';
import ApplicationCard from '../../components/teacher/ApplicationCard';

const TeacherNotifications = () => {
  const {
    notifications,
    unreadCount,
    selectedApplication,
    setSelectedApplication,
    notificationFilter,
    setNotificationFilter,
    markAllAsRead,
    openApplicationReview,
    updateApplicationStatus
  } = useTeacherNotifications();

  // If viewing a selected application, show Application Review UI
  if (selectedApplication) {
    return (
      <ApplicationCard
        application={selectedApplication}
        onBack={() => setSelectedApplication(null)}
        onStatusChange={updateApplicationStatus}
      />
    );
  }

  // Filter logic
  const filteredNotifications = notifications.filter(n => {
    if (notificationFilter === 'unread') return !n.read;
    if (notificationFilter === 'applications') return n.type === 'application';
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Notifications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Stay updated with student applications related to your club.
          </p>
          {unreadCount > 0 && (
            <span id="unreadCountPill" className="inline-block text-xs font-bold text-indigo-600 mt-2">
              {unreadCount} unread notifications
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            id="markAllAsReadBtn"
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors duration-150 self-start sm:self-auto border border-indigo-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs Header (CampusVerse pill style) */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2">
          {[
            { key: 'all', label: 'All', id: 'filter-all' },
            { key: 'unread', label: 'Unread', id: 'filter-unread' },
            { key: 'applications', label: 'Applications', id: 'filter-applications' }
          ].map(tab => (
            <button
              key={tab.key}
              id={tab.id}
              onClick={() => setNotificationFilter(tab.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                notificationFilter === tab.key
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
              {tab.key === 'unread' && unreadCount > 0 && (
                <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                  notificationFilter === tab.key ? 'bg-white/30 text-white' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
          Showing {filteredNotifications.length} {filteredNotifications.length === 1 ? 'notification' : 'notifications'}
        </span>
      </div>

      {/* Notification Cards List or Empty State */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-3.5" id="notificationsListContainer">
          {filteredNotifications.map(notification => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onClick={openApplicationReview}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl p-12 border border-slate-200/80 text-center max-w-md mx-auto my-8 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            No notifications
          </h3>
          <p className="text-sm text-slate-500 mb-1">
            You're all caught up!
          </p>
          <p className="text-xs text-slate-400">
            New student applications will appear here.
          </p>
          {notificationFilter !== 'all' && (
            <button
              type="button"
              onClick={() => setNotificationFilter('all')}
              className="mt-4 px-4 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors"
            >
              Show all notifications
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherNotifications;
