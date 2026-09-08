import React from 'react';

const ClubEvents = ({ events = [], onCreateNewEvent }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
      
      {/* Header Bar with Create Event Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            📅 Ongoing & Upcoming Club Events
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              {events.length} Live Events
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Events organized and managed by this club.
          </p>
        </div>

        {onCreateNewEvent && (
          <button
            onClick={onCreateNewEvent}
            className="px-4 py-2 bg-[#1c4980] hover:bg-blue-900 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center justify-center space-x-1 shrink-0"
          >
            <span>+ Create Club Event</span>
          </button>
        )}
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
          <div className="text-3xl mb-2">📅</div>
          <h4 className="text-sm font-bold text-slate-800">No active events for this club</h4>
          <p className="text-xs text-slate-500 mt-1">
            Check back soon or create a new event for club members.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 hover:border-blue-300 transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start space-x-3">
                  <img
                    src={evt.logoImage || evt.bannerImage}
                    alt={evt.title}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                      {evt.mode || 'Online'}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#1c4980] transition truncate mt-1">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      🗓️ {evt.schedule || 'Sep 20 - Sep 22'}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {evt.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                  ⏳ {evt.daysLeft || 'Active'}
                </span>

                <a
                  href={evt.googleFormUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#1c4980] hover:bg-blue-900 text-white font-bold text-xs rounded-lg transition"
                >
                  Register / Open Form →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClubEvents;
