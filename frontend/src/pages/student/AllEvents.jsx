import React, { useState } from 'react';
import './allevents.css';

/* ==========================================================================
   EASY-TO-REMOVE DUMMY DATA FOR EXPLORE EVENTS
   Replace DUMMY_EVENTS with backend API responses (e.g. fetchFromApi('/events'))
   ========================================================================== */
export const DUMMY_EVENTS = [
  {
    id: 'evt-1',
    title: 'Tejas India Hackathon 2026',
    organizer: 'Government Engineering College (GEC)',
    college: 'GEC, Sheikhpura',
    category: 'Hackathons',
    mode: 'Online',
    location: 'Online / Pan India',
    teamSize: '2 - 4 Members',
    postedDate: 'Sep 8, 2026',
    deadline: 'Sep 14, 2026',
    daysLeft: '6 days left',
    fee: 'Free',
    logoImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    tags: ['Quizzes & Treasure Hunt', 'Software Development', 'Everyone can apply'],
    eligibility: ['Engineering Students', 'Postgraduate', 'Undergraduate'],
    isFeatured: true,
    description: `Tejas India Hackathon 2026 is a flagship national-level 36-hour virtual hackathon organized by GEC Sheikhpura. It aims to bring together bright minds from across the country to solve real-world challenges in AI, FinTech, AgriTech, and Smart Governance. Participants will receive mentorship from industry leaders, cash prizes worth ₹1,500,000, and direct internship opportunities!`,
    schedule: 'Sep 20 - Sep 22, 2026',
    contactNumbers: [
      { name: 'Rohan Sharma (Lead Organizer)', phone: '+91 98765 43210' },
      { name: 'Priya Verma (Student Coordinator)', phone: '+91 91234 56789' }
    ],
    googleFormUrl: 'https://forms.google.com/example-tejas-hackathon-2026'
  },
  {
    id: 'evt-2',
    title: 'Code Clash 2026',
    organizer: 'CSE Department, DCRUST',
    college: 'Deenbandhu Chhotu Ram University Of Science And Technology, Sonipat',
    category: 'Competitions',
    mode: 'Offline',
    location: 'CVR Lab, CSE Dept, DCRUST, Sonipat, Haryana',
    teamSize: '1 - 2 Members',
    postedDate: 'Sep 7, 2026',
    deadline: 'Sep 29, 2026',
    daysLeft: '22 days left',
    fee: 'Free',
    logoImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    tags: ['Competitive Programming', 'DSA & Algorithms', 'Undergraduate'],
    eligibility: ['B.Tech / BCA / B.Sc CS', 'Batch 2024-2028'],
    isFeatured: true,
    description: `Gear up for Code Clash 2026! A high-speed algorithmic programming showdown designed to test your problem-solving abilities, data structure efficiency, and code speed under pressure. Winners earn trophies, certificates, and exciting gadget prizes!`,
    schedule: 'Oct 02, 2026 | 10:00 AM - 4:00 PM',
    contactNumbers: [
      { name: 'Dr. A. K. Gupta (Faculty Head)', phone: '+91 98112 23344' },
      { name: 'Aman Deep (Technical Lead)', phone: '+91 99887 76655' }
    ],
    googleFormUrl: 'https://forms.google.com/example-code-clash-dcrust'
  },
  {
    id: 'evt-3',
    title: 'AI & Generative Vision Workshop',
    organizer: 'Robotics & AI Society',
    college: 'Delhi Technological University (DTU)',
    category: 'Workshops',
    mode: 'Hybrid',
    location: 'Auditorium 2 & Zoom Virtual Link',
    teamSize: 'Individual',
    postedDate: 'Sep 5, 2026',
    deadline: 'Sep 18, 2026',
    daysLeft: '10 days left',
    fee: '₹199',
    logoImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=150&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    tags: ['Artificial Intelligence', 'Generative AI', 'Hands-on Bootcamp'],
    eligibility: ['Open to All Students & Professionals'],
    isFeatured: false,
    description: `An intensive 2-day hands-on workshop covering LLMs, Diffusion Models, and AI Agentic Frameworks. Learn how to build production-grade AI agents from scratch with live code walk-throughs by senior AI researchers. Certificate of Participation provided.`,
    schedule: 'Sep 24 - Sep 25, 2026',
    contactNumbers: [
      { name: 'Siddharth Mehta (Coordinator)', phone: '+91 97110 09988' }
    ],
    googleFormUrl: 'https://forms.google.com/example-ai-workshop-dtu'
  },
  {
    id: 'evt-4',
    title: 'National Cyber Shield Quiz 2026',
    organizer: 'Cyber Security Club',
    college: 'IIT Roorkee',
    category: 'Quizzes',
    mode: 'Online',
    location: 'Unstop Portal Online',
    teamSize: 'Individual',
    postedDate: 'Sep 4, 2026',
    deadline: 'Sep 12, 2026',
    daysLeft: '4 days left',
    fee: 'Free',
    logoImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=150&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    tags: ['Cyber Security', 'CTF Quiz', 'Ethical Hacking'],
    eligibility: ['All College Students Across India'],
    isFeatured: false,
    description: `Test your knowledge in Network Security, Cryptography, Web Exploitation, and Digital Forensics in this fast-paced online trivia quiz! Top 50 rankers get direct entry into the annual CTF Hackathon.`,
    schedule: 'Sep 15, 2026 | 7:00 PM - 8:00 PM',
    contactNumbers: [
      { name: 'Vikramaditya (Security Lead)', phone: '+91 94567 89012' }
    ],
    googleFormUrl: 'https://forms.google.com/example-cyber-quiz-iitr'
  },
  {
    id: 'evt-5',
    title: 'Resonance 2026 Cultural Fest & Battle of Bands',
    organizer: 'Cultural Board',
    college: 'NSUT Delhi',
    category: 'Cultural',
    mode: 'Offline',
    location: 'NSUT Main Campus Grounds, Dwarka, New Delhi',
    teamSize: '3 - 10 Members',
    postedDate: 'Sep 2, 2026',
    deadline: 'Oct 05, 2026',
    daysLeft: '27 days left',
    fee: 'Free',
    logoImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    tags: ['Music & Dance', 'Band Competition', 'College Fest'],
    eligibility: ['College Music Societies & Independent Bands'],
    isFeatured: true,
    description: `The grandest inter-college battle of bands! Perform live before thousands of students and celebrity judges. Sound system, amps, and drums kit provided on site. Cash prizes worth ₹2,00,000 for top 3 bands!`,
    schedule: 'Oct 12, 2026 | 4:00 PM onwards',
    contactNumbers: [
      { name: 'Ananya Roy (Head of Events)', phone: '+91 98300 11223' },
      { name: 'Karan Malhotra (Band Logistics)', phone: '+91 98711 22334' }
    ],
    googleFormUrl: 'https://forms.google.com/example-resonance-bands-nsut'
  }
];

/* ==========================================================================
   EASY-TO-REMOVE DUMMY DATA FOR MY PARTICIPATED EVENTS
   Replace DUMMY_PARTICIPATED_EVENTS with student's personal registrations
   ========================================================================== */
export const DUMMY_PARTICIPATED_EVENTS = [
  {
    id: 'part-1',
    eventId: 'evt-1',
    title: 'Tejas India Hackathon 2026',
    organizer: 'Government Engineering College (GEC)',
    college: 'GEC, Sheikhpura',
    category: 'Hackathons',
    mode: 'Online',
    teamName: 'Team ByteBusters',
    userRole: 'Team Leader',
    registrationDate: 'Sep 08, 2026',
    participationStatus: 'Registration Confirmed',
    statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    bannerImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    schedule: 'Sep 20 - Sep 22, 2026',
    contactNumbers: [
      { name: 'Rohan Sharma (Lead Organizer)', phone: '+91 98765 43210' }
    ],
    googleFormUrl: 'https://forms.google.com/example-tejas-hackathon-2026',
    description: 'You are registered for Tejas India Hackathon 2026 as Team Leader of Team ByteBusters. Submission portal opens on Sep 20.'
  },
  {
    id: 'part-2',
    eventId: 'evt-3',
    title: 'AI & Generative Vision Workshop',
    organizer: 'Robotics & AI Society',
    college: 'Delhi Technological University (DTU)',
    category: 'Workshops',
    mode: 'Hybrid',
    teamName: 'Individual Participant',
    userRole: 'Attendee',
    registrationDate: 'Sep 06, 2026',
    participationStatus: 'Pass Generated',
    statusColor: 'bg-blue-100 text-blue-800 border-blue-300',
    bannerImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    schedule: 'Sep 24 - Sep 25, 2026',
    contactNumbers: [
      { name: 'Siddharth Mehta (Coordinator)', phone: '+91 97110 09988' }
    ],
    googleFormUrl: 'https://forms.google.com/example-ai-workshop-dtu',
    description: 'Your seat for AI & Generative Vision Workshop is reserved. Zoom joining credentials have been sent to your registered email.'
  },
  {
    id: 'part-3',
    eventId: 'evt-4',
    title: 'National Cyber Shield Quiz 2026',
    organizer: 'Cyber Security Club',
    college: 'IIT Roorkee',
    category: 'Quizzes',
    mode: 'Online',
    teamName: 'Individual Participant',
    userRole: 'Participant',
    registrationDate: 'Sep 05, 2026',
    participationStatus: 'Certificate Available',
    statusColor: 'bg-purple-100 text-purple-800 border-purple-300',
    bannerImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    schedule: 'Sep 15, 2026 | 7:00 PM - 8:00 PM',
    contactNumbers: [
      { name: 'Vikramaditya (Security Lead)', phone: '+91 94567 89012' }
    ],
    googleFormUrl: 'https://forms.google.com/example-cyber-quiz-iitr',
    description: 'Quiz completed with score 92/100. Your E-Certificate of Excellence is ready for download.'
  }
];

const AllEvents = () => {
  // Active selected category / tab in the pill line
  // Options: 'All' | 'Participated' | 'Competitions' | 'Hackathons' | 'Quizzes' | 'Workshops' | 'Cultural'
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Mode filter state: 'All' | 'Online' | 'Offline' | 'Hybrid'
  const [selectedMode, setSelectedMode] = useState('All');

  // Search query state
  const [searchQuery, setSearchQuery] = useState('');

  // Selected event state for detail modal
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Bookmarked event IDs
  const [bookmarkedIds, setBookmarkedIds] = useState(['evt-1']);

  // Categories list with My Participated Events integrated right into the category pills row!
  const categories = [
    { name: 'All', label: '🏆 All Events' },
    { name: 'Participated', label: `🎉 My Participated Events (${DUMMY_PARTICIPATED_EVENTS.length})`, isSpecial: true },
    { name: 'Competitions', label: '🎯 Competitions' },
    { name: 'Hackathons', label: '💻 Hackathons' },
    { name: 'Quizzes', label: '📝 Quizzes' },
    { name: 'Workshops', label: '🎓 Workshops' },
    { name: 'Cultural', label: '🎭 Cultural & Fest' }
  ];

  // Bookmark toggle handler
  const toggleBookmark = (id, e) => {
    e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter explore events based on search, category, and mode
  const filteredExploreEvents = DUMMY_EVENTS.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || evt.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesMode =
      selectedMode === 'All' || evt.mode.toLowerCase() === selectedMode.toLowerCase();

    return matchesSearch && matchesCategory && matchesMode;
  });

  // Filter participated events based on search query
  const filteredParticipatedEvents = DUMMY_PARTICIPATED_EVENTS.filter((evt) =>
    evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    evt.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    evt.teamName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 pb-16">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Title & Global Search Banner */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                {selectedCategory === 'Participated'
                  ? 'My Participated Events'
                  : `${filteredExploreEvents.length}+ Events in India`}
                <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
              </h1>
              <p className="text-slate-600 mt-1 font-medium text-sm">
                {selectedCategory === 'Participated'
                  ? 'Track your registered hackathons, workshops, and quizzes in one place.'
                  : 'Build, code, and innovate in online and student hackathons across campuses.'}
              </p>
            </div>

            {/* Global Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search events, colleges, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1c4980] focus:border-transparent shadow-sm transition"
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
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold bg-slate-100 rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Pills Line (Including "My Participated Events" button right in the line!) */}
          <div className="flex items-center space-x-2 mt-6 overflow-x-auto hide-scrollbar pb-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 flex items-center space-x-2 ${
                    isSelected
                      ? cat.isSpecial
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/10'
                        : 'bg-[#1c4980] text-white shadow-md shadow-blue-900/10'
                      : cat.isSpecial
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-bold'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Filter Pill Bar (only shown when exploring events) */}
          {selectedCategory !== 'Participated' && (
            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-semibold text-slate-600">
              <span className="flex items-center space-x-1 bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filters</span>
              </span>

              {/* Mode Selectors */}
              {['All', 'Online', 'Offline', 'Hybrid'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSelectedMode(mode)}
                  className={`px-3 py-1.5 rounded-lg border transition ${
                    selectedMode === mode
                      ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Mode: {mode}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* =========================================================================
            MY PARTICIPATED EVENTS VIEW (When "Participated" pill button is selected)
            ========================================================================= */}
        {selectedCategory === 'Participated' ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredParticipatedEvents.length === 0 ? (
                <div className="col-span-2 bg-white rounded-2xl p-12 text-center border border-slate-200">
                  <div className="text-4xl mb-3">🎓</div>
                  <h3 className="text-lg font-bold text-slate-800">No Participated Events Found</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    You haven't registered for any events matching your query yet.
                  </p>
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="mt-4 px-4 py-2 bg-[#1c4980] text-white rounded-xl text-sm font-semibold hover:bg-blue-900 transition"
                  >
                    Explore & Join Events
                  </button>
                </div>
              ) : (
                filteredParticipatedEvents.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      {/* Top status header */}
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${item.statusColor}`}
                        >
                          ● {item.participationStatus}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          Registered {item.registrationDate}
                        </span>
                      </div>

                      {/* Event Title */}
                      <h3 className="text-lg font-bold text-slate-900 hover:text-[#1c4980] transition">
                        {item.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-600 mt-0.5">
                        {item.organizer} • {item.college}
                      </p>

                      {/* Team / Role Box */}
                      <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Team Name:</span>
                          <span className="font-bold text-slate-800">{item.teamName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Role:</span>
                          <span className="font-semibold text-blue-700">{item.userRole}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Event Schedule:</span>
                          <span className="font-medium text-slate-700">{item.schedule}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedEvent(item)}
                        className="text-xs font-bold text-[#1c4980] hover:underline"
                      >
                        View Full Details →
                      </button>

                      <a
                        href={item.googleFormUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition shadow-sm flex items-center space-x-1"
                      >
                        <span>Open Form / Portal</span>
                        <span>↗</span>
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* =========================================================================
              EXPLORE EVENTS LIST VIEW
              ========================================================================= */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Events Card List */}
            <div className="lg:col-span-2 space-y-4">
              {filteredExploreEvents.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                  <div className="text-4xl mb-3">🔍</div>
                  <h3 className="text-lg font-bold text-slate-800">No events found</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Try adjusting your search criteria or resetting filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setSelectedMode('All');
                    }}
                    className="mt-4 px-4 py-2 bg-blue-50 text-[#1c4980] rounded-xl text-sm font-semibold hover:bg-blue-100 transition"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                filteredExploreEvents.map((evt) => {
                  const isBookmarked = bookmarkedIds.includes(evt.id);
                  return (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      className="event-card bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm cursor-pointer hover:border-blue-300 transition-all group relative"
                    >
                      <div className="flex flex-col sm:flex-row items-start gap-4">
                        {/* Event Thumbnail Logo */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100 relative">
                          <img
                            src={evt.logoImage}
                            alt={evt.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&auto=format&fit=crop&q=80';
                            }}
                          />
                          <span className="absolute top-1 left-1 bg-[#1c4980] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {evt.mode}
                          </span>
                        </div>

                        {/* Event Info Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#1c4980] transition line-clamp-1">
                                {evt.title}
                              </h3>
                              <p className="text-xs font-semibold text-slate-600 mt-0.5 line-clamp-1">
                                {evt.organizer} • <span className="text-slate-500">{evt.college}</span>
                              </p>
                            </div>

                            {/* Bookmark Icon Button */}
                            <button
                              onClick={(e) => toggleBookmark(evt.id, e)}
                              title={isBookmarked ? 'Bookmarked' : 'Bookmark Event'}
                              className="text-slate-400 hover:text-amber-500 transition p-1"
                            >
                              <svg
                                className={`w-5 h-5 ${
                                  isBookmarked ? 'fill-amber-400 text-amber-500' : 'fill-none'
                                }`}
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                />
                              </svg>
                            </button>
                          </div>

                          {/* Meta Metrics Bar (Team size, mode, deadline) */}
                          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-3 text-xs text-slate-600 font-medium">
                            <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                              👥 {evt.teamSize}
                            </span>
                            <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                              📍 {evt.location}
                            </span>
                            <span className="flex items-center gap-1 bg-amber-50 text-amber-800 font-semibold px-2.5 py-1 rounded-md border border-amber-100">
                              ⏳ {evt.daysLeft}
                            </span>
                          </div>

                          {/* Tags list */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-3">
                            {evt.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Bottom Card Footer Actions */}
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs">
                            <span className="text-slate-400 font-medium">
                              Posted {evt.postedDate}
                            </span>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEvent(evt);
                                }}
                                className="px-3.5 py-1.5 bg-[#1c4980] hover:bg-[#153760] text-white font-bold rounded-lg transition shadow-sm flex items-center space-x-1"
                              >
                                <span>View Details</span>
                                <span>→</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Column - Featured Events & Highlights Sidebar */}
            <div className="space-y-6">
              {/* Featured Opportunities Box */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm sticky top-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <span>🔥 Featured Opportunities</span>
                  </h3>
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                    Top Picks
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {DUMMY_EVENTS.filter((e) => e.isFeatured).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedEvent(item)}
                      className="py-3 first:pt-0 last:pb-0 cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.logoImage}
                          alt={item.title}
                          className="w-11 h-11 rounded-lg object-cover bg-slate-100 shrink-0 group-hover:scale-105 transition"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#1c4980] truncate transition">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {item.organizer}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                              {item.category}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {item.daysLeft}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Student Stats Box */}
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-xs">
                  <div className="font-bold text-[#1c4980] text-sm">
                    🚀 Elevate Your Campus Profile
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    Participate in hackathons and quizzes to build your verifiable portfolio & get recognized.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* =========================================================================
          EVENT DETAILS MODAL (Poster, Details, Contacts, Google Form Link)
          ========================================================================= */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 modal-animate relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Poster Image */}
            <div className="relative h-48 sm:h-56 w-full bg-slate-900 rounded-t-3xl overflow-hidden">
              <img
                src={selectedEvent.bannerImage}
                alt={selectedEvent.title}
                className="w-full h-full object-cover opacity-85"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 bg-slate-900/70 hover:bg-slate-900 text-white w-9 h-9 rounded-full flex items-center justify-center transition text-lg font-bold shadow-md"
              >
                ✕
              </button>

              {/* Badge Tags on Banner */}
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
                <span className="bg-[#1c4980] text-xs font-bold px-3 py-1 rounded-full border border-blue-400/30">
                  {selectedEvent.category} • {selectedEvent.mode}
                </span>
                {selectedEvent.fee && (
                  <span className="bg-emerald-500 text-white text-xs font-extrabold px-3 py-1 rounded-full">
                    {selectedEvent.fee} Entry
                  </span>
                )}
              </div>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Title & Organizer */}
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {selectedEvent.title}
                </h2>
                <p className="text-sm font-semibold text-slate-600 mt-1">
                  Organized by: <span className="text-[#1c4980]">{selectedEvent.organizer}</span>
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{selectedEvent.college}</p>
              </div>

              {/* Key Event Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Location / Mode</span>
                  <span className="font-bold text-slate-800">{selectedEvent.location}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Team Size</span>
                  <span className="font-bold text-slate-800">{selectedEvent.teamSize || 'Individual'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Schedule</span>
                  <span className="font-bold text-slate-800">{selectedEvent.schedule || 'TBA'}</span>
                </div>
              </div>

              {/* Event Description */}
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                  📌 About The Event
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-white">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Eligibility Tags */}
              {selectedEvent.eligibility && (
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                    🎯 Eligibility Criteria
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.eligibility.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg"
                      >
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Information Section */}
              {selectedEvent.contactNumbers && selectedEvent.contactNumbers.length > 0 && (
                <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100">
                  <h3 className="text-xs font-extrabold text-[#1c4980] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    📞 Event Coordinators & Helpdesk
                  </h3>
                  <div className="space-y-2">
                    {selectedEvent.contactNumbers.map((c, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-2.5 rounded-xl border border-blue-100 text-xs"
                      >
                        <span className="font-bold text-slate-800">{c.name}</span>
                        <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                          <a
                            href={`tel:${c.phone}`}
                            className="text-blue-700 font-semibold hover:underline bg-blue-50 px-2.5 py-1 rounded-md"
                          >
                            📞 {c.phone}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons: Direct Google Form Registration Button */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition"
                >
                  Close
                </button>

                <a
                  href={selectedEvent.googleFormUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-1/2 py-3 bg-gradient-to-r from-[#1c4980] to-[#2563eb] hover:from-[#153760] hover:to-[#1d4ed8] text-white font-extrabold text-center rounded-xl text-sm transition shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2"
                >
                  <span>Register via Google Form</span>
                  <span className="text-base">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEvents;
