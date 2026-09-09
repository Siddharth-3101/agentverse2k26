import React from 'react';

const NotificationCard = ({ notification, onClick }) => {
  const studentName = notification.full_name || notification.student_name || notification.studentName || 'Student';
  const clubName = notification.club_name || notification.clubName || 'Agentic AI & Coding Society';
  const createdAt = notification.applied_at
    ? new Date(notification.applied_at).toLocaleDateString()
    : notification.created_at
    ? new Date(notification.created_at).toLocaleDateString()
    : notification.createdAt || 'Recently';
  const read = notification.is_read !== undefined ? Boolean(notification.is_read) : Boolean(notification.read);
  const status = notification.status || 'PENDING';

  return (
    <div
      onClick={() => onClick(notification)}
      className={`group relative rounded-2xl p-5 transition-all duration-200 cursor-pointer border ${
        !read
          ? 'bg-indigo-50/50 border-l-4 border-l-indigo-600 border-indigo-200/80 shadow-xs hover:bg-indigo-50/80 hover:shadow-sm'
          : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left Side: Avatar/Icon & Notification Details */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-sm transition-all ${
              !read
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600'
            }`}
          >
            {studentName ? studentName.charAt(0) : 'S'}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className={`text-base font-bold truncate ${
                  !read ? 'text-slate-900' : 'text-slate-700'
                }`}
              >
                {studentName}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-600">
                {clubName}
              </span>
              {status && (
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    status === 'ACCEPTED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : status === 'DECLINED' || status === 'REJECTED'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {status}
                </span>
              )}
            </div>

            <p
              className={`text-sm leading-snug mb-1 ${
                !read ? 'font-bold text-indigo-950' : 'text-slate-700'
              }`}
            >
              Applied to {clubName}
            </p>

            <p className="text-xs text-slate-500 leading-relaxed">
              {studentName} has submitted an application to join {clubName}.
            </p>

            <div className="flex items-center gap-3 mt-3 text-xs text-slate-400 font-medium">
              <span className="inline-flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {createdAt}
              </span>
              <span>•</span>
              <span className="text-indigo-600 font-semibold group-hover:underline">
                View application →
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Unread dot & Action Arrow */}
        <div className="flex flex-col items-end justify-between self-stretch">
          {!read ? (
            <span
              className="w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-indigo-100"
              title="Unread notification"
            ></span>
          ) : (
            <span className="w-3 h-3"></span>
          )}

          <div className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-150 mt-auto">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;

