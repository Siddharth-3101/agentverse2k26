import React from 'react';

const ClubHeader = ({ club, userRoleInClub = 'President', onBackToClubs }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      {/* Banner Image Header */}
      <div className="relative h-56 sm:h-64 w-full bg-slate-900">
        <img
          src={club.bannerImage}
          alt={club.name}
          className="w-full h-full object-cover opacity-85"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent"></div>

        {/* Back to All My Clubs Button */}
        {onBackToClubs && (
          <button
            onClick={onBackToClubs}
            className="absolute top-4 left-4 bg-white/90 hover:bg-white text-slate-800 text-xs font-extrabold px-3.5 py-1.5 rounded-xl shadow-md transition flex items-center space-x-1"
          >
            <span>← Back to My Clubs</span>
          </button>
        )}

        {/* Clan / Guild Activity Level Badge */}
        <div className="absolute top-4 right-4 guild-level-badge text-white px-3.5 py-1.5 rounded-full text-xs font-black flex items-center space-x-1.5 shadow-md">
          <span>🔥</span>
          <span>{club.guildLevel || 'Level 4 Active Guild'}</span>
        </div>

        {/* Bottom Banner Info Overlay */}
        <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="flex items-end space-x-4">
            {/* Club Logo Thumbnail */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-1.5 shadow-xl border border-white/40 shrink-0 overflow-hidden">
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

            <div className="mb-1">
              <div className="flex items-center space-x-2">
                <span className="bg-[#1c4980] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-blue-400/30">
                  {club.category}
                </span>
                <span className="bg-emerald-500/80 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  Verified Campus Club
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 drop-shadow-sm">
                {club.name}
              </h1>
              <p className="text-xs text-slate-300 font-medium line-clamp-1">
                Faculty Mentor: <span className="text-white font-bold">{club.mentorName}</span>
              </p>
            </div>
          </div>

          {/* User's Role Status in this Club */}
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xs self-start sm:self-auto">
            <span className="text-slate-300 block text-[10px] uppercase font-bold tracking-wider">Your Role:</span>
            <span className="font-black text-amber-300 text-sm flex items-center gap-1">
              👑 {userRoleInClub}
            </span>
          </div>
        </div>
      </div>

      {/* Leadership & Metrics Bar */}
      <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-slate-700 font-medium">
          <div>
            <span className="text-slate-400 block text-[10px]">President</span>
            <span className="font-bold text-slate-900">{club.presidentName}</span>
          </div>
          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
          <div>
            <span className="text-slate-400 block text-[10px]">Vice President</span>
            <span className="font-bold text-slate-900">{club.vpName || 'Not Assigned'}</span>
          </div>
          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
          <div>
            <span className="text-slate-400 block text-[10px]">Faculty Mentor</span>
            <span className="font-bold text-[#1c4980]">{club.mentorName}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 font-bold text-slate-800">
            👥 <span className="text-[#1c4980]">{club.memberCount}</span> Active Members
          </div>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 font-bold text-slate-800">
            📅 <span className="text-blue-700">{club.activeEventsCount}</span> Ongoing Events
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubHeader;
