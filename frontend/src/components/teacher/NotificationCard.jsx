import React from 'react';

const NotificationCard = ({ notification, onClick }) => {
  const {
    studentName,
    clubName = 'Coding Club',
    createdAt,
    read,
    status = 'PENDING'
  } = notification;

  return (
    <div
      onClick={() => onClick(notification)}
      className={`group relative rounded-2xl p-5 transition-all duration-200 cursor-pointer border ${
        !read
          ? 'bg-indigo-50/40 border-l-4 border-l-indigo-600 border-indigo-200/80 shadow-xs hover:bg-indigo-50/70 hover:shadow-sm'
          : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left Side: Avatar/Icon & Notification Details */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-sm transition-colors ${
              !read
                ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-200'
                : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span
                className={`text-sm font-bold truncate ${
                  !read ? 'text-slate-900' : 'text-slate-700'
                }`}
              >
                {studentName}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600">
                {clubName}
              </span>
              {status && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                    status === 'ACCEPTED'
                      ? 'bg-emerald-100 text-emerald-700'
                      : status === 'DECLINED'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {status}
                </span>
              )}
            </div>

            <p
              className={`text-sm leading-snug mb-1 ${
                !read ? 'font-semibold text-indigo-950' : 'text-slate-600'
              }`}
            >
              Applied to {clubName}
            </p>

            <p className="text-xs text-slate-500 line-clamp-1">
              {studentName} has submitted an application to join your club.
            </p>

            <div className="flex items-center gap-3 mt-2.5 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {createdAt}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Unread dot & Action Arrow */}
        <div className="flex flex-col items-end justify-between self-stretch">
          {!read ? (
            <span
              className="w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-indigo-100"
              title="Unread notification"
            ></span>
          ) : (
            <span className="w-2.5 h-2.5"></span>
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
