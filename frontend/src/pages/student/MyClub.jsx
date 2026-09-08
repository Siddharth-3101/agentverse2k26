import React, { useState } from 'react';
import '../../styles/club.css';
import ClubPage from './ClubPage.jsx';

/* ==========================================================================
   EASY-TO-REMOVE DUMMY DATA FOR MY JOINED & MANAGED CLUBS
   Replace DUMMY_MY_CLUBS with student's backend club list
   ========================================================================== */
export const DUMMY_MY_CLUBS = [
  {
    id: 'my-club-1',
    name: 'Agentic AI & Coding Society',
    category: 'Technical',
    userRole: 'President',
    roleBadgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    mentorName: 'Dr. A. K. Gupta (CSE)',
    presidentName: 'Siddharth Mehta (You)',
    vpName: 'Aarav Sharma',
    memberCount: 142,
    activeEventsCount: 4,
    guildLevel: 'Level 4 Active Guild',
    logoImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    description: 'The premier technical club dedicated to Competitive Programming, Machine Learning, Web3, and Open Source development.',
    fullVision: 'Our goal is to build industry-ready software engineers and AI practitioners through weekly hack nights, workshops, open-source sprints, and inter-college hackathons.'
  },
  {
    id: 'my-club-2',
    name: 'Resonance Music & Band Society',
    category: 'Cultural',
    userRole: 'Member',
    roleBadgeClass: 'bg-blue-100 text-[#1c4980] border-blue-200',
    mentorName: 'Prof. Meenakshi Sharma (ECE)',
    presidentName: 'Ananya Roy',
    vpName: 'Karan Malhotra',
    memberCount: 210,
    activeEventsCount: 3,
    guildLevel: 'Level 5 Elite Guild',
    logoImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    description: 'A vibrant community for vocalists, instrumentalists, sound engineers, and stage performers across all musical genres.',
    fullVision: 'Organizing battle of bands, acoustic jam sessions, production masterclasses, and mainstage cultural fest performances.'
  }
];

const MyClub = () => {
  // Currently viewed club state. If null, displays "My Clubs" list overview.
  const [selectedClub, setSelectedClub] = useState(null);

  // If a club is selected, render the dedicated ClubPage view!
  if (selectedClub) {
    return (
      <ClubPage
        club={selectedClub}
        onBackToClubs={() => setSelectedClub(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Title Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            My Clubs & Guilds
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
              {DUMMY_MY_CLUBS.length} Joined Clubs
            </span>
          </h1>
          <p className="text-slate-600 mt-1 font-medium text-sm">
            View the clubs you belong to, manage member roles, host events, and inspect real-time club activity feeds.
          </p>
        </div>

        {/* My Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DUMMY_MY_CLUBS.map((club) => (
            <div
              key={club.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition"
            >
              <div>
                {/* Banner & Role Header */}
                <div className="relative h-36 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={club.bannerImage}
                    alt={club.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                  {/* User's Role Badge on Banner */}
                  <span
                    className={`absolute top-3 right-3 text-xs font-extrabold px-3 py-1 rounded-full shadow-sm border ${club.roleBadgeClass}`}
                  >
                    👑 {club.userRole}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-6 relative">
                  {/* Logo Thumbnail */}
                  <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-md border border-slate-100 -mt-12 relative z-10 overflow-hidden">
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

                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-[#1c4980] transition mt-2">
                    {club.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1">
                    {club.description}
                  </p>

                  {/* Leadership Info Box */}
                  <div className="mt-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Faculty Mentor:</span>
                      <span className="font-bold text-[#1c4980]">{club.mentorName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">President:</span>
                      <span className="font-semibold text-slate-800">{club.presidentName}</span>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="flex items-center justify-between mt-4 text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1">
                      👥 {club.memberCount} Members
                    </span>
                    <span className="flex items-center gap-1 text-blue-700">
                      📅 {club.activeEventsCount} Ongoing Events
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button: Open Club Page */}
              <div className="p-5 border-t border-slate-100 bg-slate-50/50">
                <button
                  onClick={() => setSelectedClub(club)}
                  className="w-full py-3 bg-[#1c4980] hover:bg-blue-900 text-white font-extrabold text-xs rounded-xl transition shadow-md flex items-center justify-center space-x-2"
                >
                  <span>Open Club Page & Clan Dashboard</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default MyClub;
