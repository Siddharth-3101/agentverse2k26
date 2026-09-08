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
    <div className="space-y-8 max-w-6xl mx-auto animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3 border border-indigo-100">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              Coding Club Notifications
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Notifications
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Stay updated with student applications related to your club.
            </p>
            {unreadCount > 0 && (
              <span id="unreadCountPill" className="inline-block text-xs font-bold text-indigo-600 mt-2 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                {unreadCount} unread notifications
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              id="markAllAsReadBtn"
              onClick={markAllAsRead}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all duration-150 border border-indigo-100/80 active:scale-98 shadow-xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
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
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
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
      </div>

      {/* Notification Cards List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-4" id="notificationsListContainer">
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
        <div className="bg-white rounded-3xl p-12 border border-slate-200/80 text-center max-w-md mx-auto my-8 shadow-xs space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            No notifications
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            You're all caught up! New student applications will appear here.
          </p>
          {notificationFilter !== 'all' && (
            <button
              type="button"
              onClick={() => setNotificationFilter('all')}
              className="mt-4 px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
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
