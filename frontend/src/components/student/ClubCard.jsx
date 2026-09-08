import React from 'react';

const ClubCard = ({ club, onApply, onView }) => {
  return (
    <div className="club-card bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Banner Image with Logo Overlay */}
        <div className="relative h-32 w-full bg-slate-900 overflow-hidden">
          <img
            src={club.bannerImage}
            alt={club.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

          {/* Category Tag on Banner */}
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#1c4980] text-[11px] font-extrabold px-3 py-1 rounded-full shadow-sm">
            {club.category}
          </span>
        </div>

        {/* Club Details Header */}
        <div className="px-5 pt-4 pb-2 relative">
          {/* Logo Badge */}
          <div className="w-14 h-14 rounded-2xl bg-white p-1 shadow-md border border-slate-100 -mt-11 relative z-10 overflow-hidden">
            <img
              src={club.logoImage}
              alt={club.name}
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=150&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          <div className="mt-2">
            <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#1c4980] transition line-clamp-1">
              {club.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1">
              {club.description}
            </p>
          </div>

          {/* Leadership & Mentor Meta Bar */}
          <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Mentor:</span>
              <span className="font-bold text-[#1c4980]">{club.mentorName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">President:</span>
              <span className="font-semibold text-slate-800">{club.presidentName}</span>
            </div>
            {club.vpName && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Vice President:</span>
                <span className="font-semibold text-slate-700">{club.vpName}</span>
              </div>
            )}
          </div>

          {/* Metrics (Members count & active events count) */}
          <div className="flex items-center justify-between mt-3 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1">
              👥 <span className="font-bold text-slate-900">{club.memberCount}</span> Members
            </span>
            <span className="flex items-center gap-1 text-blue-700">
              📅 <span className="font-bold">{club.activeEventsCount}</span> Active Events
            </span>
          </div>

          {/* Skill / Focus Tags */}
          <div className="flex flex-wrap gap-1 mt-3">
            {club.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
        <button
          onClick={() => onView && onView(club)}
          className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition text-center"
        >
          View Club
        </button>
        <button
          onClick={() => onApply && onApply(club)}
          className="flex-1 py-2 bg-[#1c4980] hover:bg-blue-900 text-white font-bold text-xs rounded-xl transition shadow-sm text-center"
        >
          Apply to Join
        </button>
      </div>
    </div>
  );
};

export default ClubCard;
