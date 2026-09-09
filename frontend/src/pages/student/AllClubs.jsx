import React, { useState, useEffect } from 'react';
import '../../styles/allclubs.css';
import ClubCard from '../../components/student/ClubCard.jsx';
import RecommendationCard from '../../components/student/RecommendationCard.jsx';
import CreateClubModal from '../../components/club/CreateClubModal.jsx';
import JoinClubModal from '../../components/club/JoinClubModal.jsx';
import { getClubs } from '../../services/clubService.js';
import { getRecommendedClubs } from '../../services/careerService.js';

export const SEEDED_CLUBS = [
  {
    id: 1,
    name: 'Agentic AI & Coding Society',
    category: 'Technical',
    mentorName: 'Dr. A. K. Gupta',
    presidentName: 'Siddharth G',
    vpName: 'Sanjay Krishna',
    presidentPhone: '+91 98765 43210',
    vpPhone: '+91 91234 56789',
    memberCount: 142,
    activeEventsCount: 4,
    logoImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    description: 'The premier technical club dedicated to Competitive Programming, Machine Learning, Web3, and Open Source development.',
    fullVision: 'Our goal is to build industry-ready software engineers and AI practitioners through weekly hack nights, workshops, and inter-college hackathons.',
    tags: ['Python', 'AI Agents', 'DSA', 'WebDev']
  },
  {
    id: 2,
    name: 'Robotics & Automation Guild',
    category: 'Technical',
    mentorName: 'Dr. Ramesh Nair',
    presidentName: 'Santhana S',
    vpName: 'Siddharth G',
    presidentPhone: '+91 98112 23344',
    vpPhone: '+91 99887 76655',
    memberCount: 98,
    activeEventsCount: 2,
    logoImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    description: 'Build autonomous rovers, drone swarms, and industrial automation prototypes with hands-on hardware labs.',
    fullVision: 'Equipping students with CAD design, embedded C/C++, ROS2, and PCB soldering skills for national competitions.',
    tags: ['Robotics', 'Arduino', 'IoT', 'Hardware']
  },
  {
    id: 3,
    name: 'Resonance Music & Band Society',
    category: 'Cultural',
    mentorName: 'Prof. Meenakshi Sharma',
    presidentName: 'Sankari G',
    vpName: 'Shalini S',
    presidentPhone: '+91 98300 11223',
    vpPhone: '+91 98711 22334',
    memberCount: 210,
    activeEventsCount: 3,
    logoImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    description: 'A vibrant community for vocalists, instrumentalists, sound engineers, and stage performers across all musical genres.',
    fullVision: 'Organizing battle of bands, acoustic jam sessions, production masterclasses, and mainstage cultural fest performances.',
    tags: ['Music', 'Live Band', 'Stage', 'Vocals']
  },
  {
    id: 4,
    name: 'E-Cell & Startup Incubator',
    category: 'Entrepreneurship',
    mentorName: 'Prof. Rajesh Verma',
    presidentName: 'Senthil P',
    vpName: 'Dinesh S',
    presidentPhone: '+91 97110 09988',
    vpPhone: '+91 94567 89012',
    memberCount: 165,
    activeEventsCount: 5,
    logoImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=150&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80',
    description: 'Fostering student startup culture through pitch competitions, angel investor meets, and incubation mentorship.',
    fullVision: 'Connecting student founders with venture capitalists, seed grants, and startup bootcamps.',
    tags: ['Startups', 'Pitch Deck', 'Business', 'Finance']
  },
  {
    id: 5,
    name: 'Cyber Shield Security Club',
    category: 'Technical',
    mentorName: 'Dr. Sunita Deshmukh',
    presidentName: 'Sabarish R',
    vpName: 'Sanjay Krishna',
    presidentPhone: '+91 98765 99887',
    vpPhone: '+91 91234 55443',
    memberCount: 115,
    activeEventsCount: 2,
    logoImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=150&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    description: 'Learn Ethical Hacking, CTF challenges, Network Defense, and Bug Bounty hunting in a legal sandbox environment.',
    fullVision: 'Training cybersecurity enthusiasts for global CTFs, penetration testing certifications, and cloud security defense.',
    tags: ['CyberSecurity', 'CTF', 'Ethical Hacking']
  }
];

export const DEFAULT_RECOMMENDED_CLUBS = [
  {
    id: 'rec-1',
    name: 'Agentic AI & Coding Society',
    mentorName: 'Dr. A. K. Gupta',
    logoImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&auto=format&fit=crop&q=80',
    matchScore: 96,
    matchedSkills: ['Python', 'Machine Learning', 'React'],
    matchReason: 'Matched with your verified "Generative AI Agentic Systems" certificate.'
  },
  {
    id: 'rec-2',
    name: 'E-Cell & Startup Incubator',
    mentorName: 'Prof. Rajesh Verma',
    logoImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=150&auto=format&fit=crop&q=80',
    matchScore: 88,
    matchedSkills: ['Leadership', 'Project Management'],
    matchReason: 'Matched with your "Team Lead & Event Coordination" certificate badge.'
  }
];

const AllClubs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [clubsList, setClubsList] = useState(SEEDED_CLUBS);
  const [recommendedClubs, setRecommendedClubs] = useState(DEFAULT_RECOMMENDED_CLUBS);
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedJoinClub, setSelectedJoinClub] = useState(null);
  const [selectedViewClub, setSelectedViewClub] = useState(null);

  // Success Toast Banner
  const [toastMessage, setToastMessage] = useState(null);

  const loadClubs = () => {
    getClubs()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((c) => ({
            id: c.id,
            name: c.name,
            category: c.category || 'Technical',
            mentorName: c.mentor_name || 'Faculty Mentor',
            presidentName: c.president_name || 'Student Lead',
            vpName: c.vp_name || 'Vice President',
            presidentPhone: c.president_phone || '+91 98765 43210',
            vpPhone: c.vp_phone || '+91 91234 56789',
            memberCount: c.member_count || 0,
            activeEventsCount: c.active_events_count || 0,
            logoImage: c.logo_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&auto=format&fit=crop&q=80',
            bannerImage: c.banner_url || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
            description: c.description || 'Campus student club dedicated to student activities and skill development.',
            fullVision: c.full_vision || c.description || 'Fostering excellence and teamwork across campus.',
            tags: typeof c.tags === 'string' ? JSON.parse(c.tags) : (Array.isArray(c.tags) ? c.tags : ['Campus', 'Club'])
          }));
          setClubsList(formatted);
        }
      })
      .catch((err) => console.warn('[AllClubs API warning]:', err.message));

    getRecommendedClubs()
      .then((recs) => {
        if (Array.isArray(recs) && recs.length > 0) {
          setRecommendedClubs(recs.map((r, i) => ({
            id: r.id || `rec-${i}`,
            name: r.name || r.clubName,
            mentorName: r.mentorName || r.mentor_name || 'Faculty Mentor',
            logoImage: r.logoImage || r.logo_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&auto=format&fit=crop&q=80',
            matchScore: r.matchScore || 90,
            matchedSkills: r.matchedSkills || ['Technical Skills'],
            matchReason: r.matchReason || 'Matched with your verified profile skills.'
          })));
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadClubs();
  }, []);

  const categories = [
    { name: 'All', label: '🏆 All Clubs' },
    { name: 'Technical', label: '💻 Technical' },
    { name: 'Cultural', label: '🎭 Cultural' },
    { name: 'Entrepreneurship', label: '💡 Entrepreneurship' },
    { name: 'Sports', label: '⚽ Sports' },
    { name: 'Literary', label: '📚 Literary' }
  ];

  // Filter clubs based on search and category
  const filteredClubs = clubsList.filter((club) => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (club.mentorName && club.mentorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (club.tags && club.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory =
      selectedCategory === 'All' || club.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 pb-16">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center space-x-3 text-xs font-bold animate-bounce">
          <span>🔔</span>
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Title Header & Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Campus Clubs & Communities
              <span className="text-xs font-bold bg-blue-100 text-[#1c4980] px-3 py-1 rounded-full">
                {clubsList.length} Active Clubs
              </span>
            </h1>
            <p className="text-slate-600 mt-1 font-medium text-sm">
              Discover student societies, get skill-matched recommendations, or start your own club.
            </p>
          </div>

          {/* Action Button: Create a Club */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-3 bg-gradient-to-r from-[#1c4980] to-[#2563eb] hover:from-[#153760] hover:to-[#1d4ed8] text-white font-black text-xs rounded-xl transition shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 shrink-0"
          >
            <span className="text-base font-bold">+</span>
            <span>Create a New Club</span>
          </button>
        </div>

        {/* Global Search & Category Pills Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Category Pills Navigation */}
            <div className="flex items-center space-x-2 overflow-x-auto hide-scrollbar pb-2 flex-1">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === cat.name
                      ? 'bg-[#1c4980] text-white shadow-md shadow-blue-900/10'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Global Search Input */}
            <div className="relative w-full md:w-80 shrink-0">
              <input
                type="text"
                placeholder="Search clubs, mentors, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1c4980] shadow-sm transition"
              />
              <svg
                className="w-5 h-5 text-slate-400 absolute left-3 top-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

          </div>
        </div>

        {/* =========================================================================
            RECOMMENDED CLUBS SECTION (Based on student profile skills & certificates)
            ========================================================================= */}
        {selectedCategory === 'All' && !searchQuery && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <span>✨ Recommended For You</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Based on your uploaded certificates & skills profile (Python, AI, Leadership).
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Skills Matched
              </span>
            </div>

            {/* Recommendation Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedClubs.map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  onApply={(item) => {
                    const matchedClub = clubsList.find((c) => c.name === item.name) || clubsList[0];
                    setSelectedJoinClub(matchedClub);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            ALL CAMPUS CLUBS DIRECTORY GRID
            ========================================================================= */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-slate-900">
              {selectedCategory === 'All' ? 'All Campus Clubs' : `${selectedCategory} Clubs`}
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredClubs.length} clubs
            </span>
          </div>

          {filteredClubs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <div className="text-4xl mb-3">♣️</div>
              <h3 className="text-lg font-bold text-slate-800">No clubs found</h3>
              <p className="text-sm text-slate-500 mt-1">
                Try searching for a different keyword or category.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-4 px-4 py-2 bg-blue-50 text-[#1c4980] rounded-xl text-sm font-semibold hover:bg-blue-100 transition"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClubs.map((club) => (
                <ClubCard
                  key={club.id}
                  club={club}
                  onApply={(clubToApply) => setSelectedJoinClub(clubToApply)}
                  onView={(clubToView) => setSelectedViewClub(clubToView)}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* =========================================================================
          CLUB DETAILS OVERLAY MODAL (When clicking "View Details" / "View Club")
          ========================================================================= */}
      {selectedViewClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 modal-animate-up relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Poster Banner Header */}
            <div className="relative h-44 sm:h-52 w-full bg-slate-900 rounded-t-3xl overflow-hidden">
              <img
                src={selectedViewClub.bannerImage}
                alt={selectedViewClub.name}
                className="w-full h-full object-cover opacity-85"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedViewClub(null)}
                className="absolute top-4 right-4 bg-slate-900/70 hover:bg-slate-900 text-white w-9 h-9 rounded-full flex items-center justify-center transition text-lg font-bold shadow-md"
              >
                ✕
              </button>

              {/* Category Tag */}
              <div className="absolute bottom-4 left-6">
                <span className="bg-[#1c4980] text-white text-xs font-extrabold px-3.5 py-1 rounded-full border border-blue-400/30">
                  {selectedViewClub.category}
                </span>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {selectedViewClub.name}
                </h2>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  Faculty Mentor: <span className="text-[#1c4980] font-bold">{selectedViewClub.mentorName}</span>
                </p>
              </div>

              {/* Leadership & Contact Box */}
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100 space-y-2.5 text-xs">
                <h4 className="font-extrabold text-[#1c4980] uppercase tracking-wider text-[11px]">
                  📞 Leadership Team & Contact Info
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="bg-white p-2.5 rounded-xl border border-blue-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">President</span>
                      <span className="font-bold text-slate-800">{selectedViewClub.presidentName}</span>
                    </div>
                    <a
                      href={`tel:${selectedViewClub.presidentPhone}`}
                      className="text-blue-700 font-bold bg-blue-50 px-2 py-1 rounded hover:underline text-xs"
                    >
                      📞 {selectedViewClub.presidentPhone}
                    </a>
                  </div>

                  {selectedViewClub.vpName && (
                    <div className="bg-white p-2.5 rounded-xl border border-blue-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Vice President</span>
                        <span className="font-bold text-slate-800">{selectedViewClub.vpName}</span>
                      </div>
                      <a
                        href={`tel:${selectedViewClub.vpPhone}`}
                        className="text-blue-700 font-bold bg-blue-50 px-2 py-1 rounded hover:underline text-xs"
                      >
                        📞 {selectedViewClub.vpPhone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Club Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block">Total Active Members</span>
                  <span className="font-bold text-slate-800 text-sm">👥 {selectedViewClub.memberCount} Members</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Upcoming / Active Events</span>
                  <span className="font-bold text-blue-700 text-sm">📅 {selectedViewClub.activeEventsCount} Events</span>
                </div>
              </div>

              {/* Full Description & Vision */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                  📌 About & Vision
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {selectedViewClub.description}
                </p>
                {selectedViewClub.fullVision && (
                  <p className="text-xs text-slate-600 leading-relaxed font-medium mt-2">
                    {selectedViewClub.fullVision}
                  </p>
                )}
              </div>

              {/* Skill Tags */}
              <div className="flex flex-wrap gap-1.5">
                {selectedViewClub.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedViewClub(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    const clubToJoin = selectedViewClub;
                    setSelectedViewClub(null);
                    setSelectedJoinClub(clubToJoin);
                  }}
                  className="py-2.5 px-6 bg-[#1c4980] hover:bg-blue-900 text-white font-extrabold rounded-xl text-xs transition shadow-md"
                >
                  Apply to Join This Club →
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CREATE CLUB MODAL
          ========================================================================= */}
      <CreateClubModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitSuccess={(newClubApp) => {
          showToast(`Application submitted for ${newClubApp.name}! Sent to mentor ${newClubApp.mentorName} for approval.`);
        }}
      />

      {/* =========================================================================
          APPLY TO JOIN CLUB MODAL
          ========================================================================= */}
      <JoinClubModal
        club={selectedJoinClub}
        isOpen={!!selectedJoinClub}
        onClose={() => setSelectedJoinClub(null)}
        onSubmitSuccess={(appData) => {
          showToast(`Application submitted to join ${appData.clubName}! Sent to President & VP.`);
        }}
      />

    </div>
  );
};

export default AllClubs;
