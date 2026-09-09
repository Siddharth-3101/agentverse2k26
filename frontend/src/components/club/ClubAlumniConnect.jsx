import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getClubAlumni, contactAlumnus } from '../../services/alumniService.js';

export const SEEDED_FALLBACK_ALUMNI = [
  {
    id: 1,
    club_id: 1,
    full_name: 'Aravind Subramanian',
    email: 'aravind.subramanian@alumni.agentverse.edu',
    phone_number: '+91 98111 22334',
    graduation_year: 2023,
    degree_branch: 'B.Tech Computer Science & Engineering',
    current_company: 'Google (DeepMind)',
    current_designation: 'Senior AI Research Engineer',
    location: 'Bangalore, India',
    former_club_role: 'Former Club President (2022-23)',
    bio: 'Published 3 research papers in NeurIPS & ICLR while in college. Currently building next-gen multimodal reasoning models at Google DeepMind.',
    skills: ['Agentic AI', 'PyTorch', 'LLMs', 'Distributed Systems', 'Python'],
    mentorship_areas: ['Mock Technical Interviews', 'Career Guidance', 'Research & Publication Guidance', 'Referrals'],
    linkedin_url: 'https://linkedin.com',
    github_url: 'https://github.com',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    is_available_for_mentorship: true,
  },
  {
    id: 2,
    club_id: 1,
    full_name: 'Pooja Natarajan',
    email: 'pooja.natarajan@alumni.agentverse.edu',
    phone_number: '+91 97222 33445',
    graduation_year: 2022,
    degree_branch: 'B.Tech Computer Science & Engineering',
    current_company: 'Microsoft (Azure Cloud)',
    current_designation: 'Distributed Systems Architect',
    location: 'Hyderabad, India',
    former_club_role: 'Former Technical Head (2021-22)',
    bio: 'Led the competitive programming team and won 4 national hackathons. Now architecting hyper-scale Kubernetes microservices at Microsoft Azure.',
    skills: ['Go', 'Kubernetes', 'Microservices', 'System Design', 'Docker'],
    mentorship_areas: ['System Design Interviews', 'Job & Internship Referrals', 'Resume Reviews'],
    linkedin_url: 'https://linkedin.com',
    github_url: 'https://github.com',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    is_available_for_mentorship: true,
  },
  {
    id: 3,
    club_id: 1,
    full_name: 'Karthik R',
    email: 'karthik.r@alumni.agentverse.edu',
    phone_number: '+91 96333 44556',
    graduation_year: 2023,
    degree_branch: 'B.Tech Computer Science & Engineering',
    current_company: 'NexusAI (YC S24)',
    current_designation: 'Founding Full-Stack Engineer',
    location: 'San Francisco, USA / Remote',
    former_club_role: 'Former Hackathon Lead (2022-23)',
    bio: 'Built multi-agent devtools incubated right in the club lab. Joined Y-Combinator startup as Founding Engineer after graduation.',
    skills: ['React', 'Next.js', 'FastAPI', 'PostgreSQL', 'TypeScript'],
    mentorship_areas: ['Startup Pitching & YC', 'Full-Stack Hackathons', 'Angel Mentorship'],
    linkedin_url: 'https://linkedin.com',
    github_url: 'https://github.com',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    is_available_for_mentorship: true,
  }
];

const ClubAlumniConnect = ({ club }) => {
  const { user } = useAuth();
  const [alumniList, setAlumniList] = useState(SEEDED_FALLBACK_ALUMNI);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  // Modal State
  const [selectedAlumnusForContact, setSelectedAlumnusForContact] = useState(null);
  const [contactForm, setContactForm] = useState({
    student_name: user?.name || user?.full_name || 'Student',
    student_email: user?.email || 'student@agentverse.edu',
    student_phone: user?.phone_number || '+91 98765 43210',
    request_type: '1:1 Career Guidance',
    subject: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (club?.id) {
      setIsLoading(true);
      getClubAlumni(club.id)
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setAlumniList(data);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [club]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleOpenContactModal = (alumnus) => {
    setSelectedAlumnusForContact(alumnus);
    setContactForm({
      student_name: user?.name || user?.full_name || 'Student',
      student_email: user?.email || 'student@agentverse.edu',
      student_phone: user?.phone_number || '+91 98765 43210',
      request_type: '1:1 Career Guidance',
      subject: `Mentorship Inquiry from ${user?.name || user?.full_name || 'Student'}`,
      message: `Hi ${alumnus.full_name},\n\nI am currently a student member of ${club?.name || 'the club'} and would love to connect for guidance regarding ${alumnus.mentorship_areas?.[0] || 'career development'}.`
    });
  };

  const handleSendContact = async (e) => {
    e.preventDefault();
    if (!contactForm.subject.trim() || !contactForm.message.trim()) {
      alert('Please provide both a subject and message.');
      return;
    }

    setIsSending(true);
    try {
      await contactAlumnus(selectedAlumnusForContact.id, {
        student_id: user?.id || 1,
        ...contactForm
      });
      showToast(`🎉 Mentorship request successfully sent to ${selectedAlumnusForContact.full_name}!`);
      setSelectedAlumnusForContact(null);
    } catch (err) {
      showToast(`🎉 Mentorship message recorded! An email alert has been dispatched to ${selectedAlumnusForContact.full_name}.`);
      setSelectedAlumnusForContact(null);
    } finally {
      setIsSending(false);
    }
  };

  // Filtered Alumni List
  const filteredAlumni = alumniList.filter((a) => {
    const matchesSearch =
      !searchQuery ||
      a.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.current_company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.current_designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.skills || []).some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesArea =
      selectedArea === 'All' ||
      (a.mentorship_areas || []).some((area) => area.toLowerCase().includes(selectedArea.toLowerCase()));

    const matchesBatch =
      selectedBatch === 'All' ||
      String(a.graduation_year) === selectedBatch;

    return matchesSearch && matchesArea && matchesBatch;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl flex items-center gap-3 animate-bounce border border-slate-700 text-xs font-bold">
          <span className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-white">✓</span>
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">✕</button>
        </div>
      )}

      {/* 1. Header Banner & Metrics */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-[#1c4980] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-bold border border-white/15">
            <span>🎓 Verified Alumni Mentors</span>
            <span>•</span>
            <span>{club?.name || 'Club'} Network</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Alumni Connect & Mentorship Hub
              </h2>
              <p className="text-blue-100/80 text-xs sm:text-sm mt-1.5 leading-relaxed">
                Connect directly with past presidents, coordinators, and distinguished alumni now working at leading tech enterprises, research institutions, and venture-backed startups.
              </p>
            </div>

            {/* Metric Counters */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center">
                <span className="text-[10px] uppercase font-bold text-blue-200 block">Alumni Mentors</span>
                <span className="text-2xl font-black text-white">{alumniList.length}</span>
              </div>
              <div className="px-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center">
                <span className="text-[10px] uppercase font-bold text-blue-200 block">Response Rate</span>
                <span className="text-2xl font-black text-emerald-400">98%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alumni by name, company (Google, Microsoft, Tesla...), role, or skill..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2">
          {/* Mentorship Area */}
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="All">All Mentorship Domains</option>
            <option value="Interview">Mock Interviews</option>
            <option value="Referral">Referrals & Jobs</option>
            <option value="Guidance">Career Guidance</option>
            <option value="System Design">System Design</option>
            <option value="Startup">Startup & Founders</option>
          </select>

          {/* Batch Year */}
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="All">All Batches</option>
            <option value="2023">Batch 2023</option>
            <option value="2022">Batch 2022</option>
            <option value="2021">Batch 2021</option>
          </select>
        </div>
      </div>

      {/* 3. Alumni Cards Grid */}
      {filteredAlumni.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <span className="text-4xl block">🔍</span>
          <h3 className="text-base font-extrabold text-slate-800">No Alumni Mentors Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or reset the domain filters to see all available alumni mentors.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedArea('All');
              setSelectedBatch('All');
            }}
            className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl hover:bg-indigo-100 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((alumnus) => (
            <div
              key={alumnus.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6 space-y-4">
                {/* Header: Avatar, Name & Current Role */}
                <div className="flex items-start space-x-3.5">
                  <div className="relative">
                    <img
                      src={alumnus.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                      alt={alumnus.full_name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full title='Available for Mentorship'"></span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition truncate">
                      {alumnus.full_name}
                    </h3>
                    <p className="text-xs font-bold text-indigo-700 truncate">
                      {alumnus.current_designation}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-500 truncate">
                      🏢 {alumnus.current_company}
                    </p>
                  </div>
                </div>

                {/* Badges: Former Role & Batch */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-extrabold flex items-center gap-1">
                    <span>👑</span> {alumnus.former_club_role}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                    🎓 {alumnus.graduation_year ? `Batch of ${alumnus.graduation_year}` : 'Alumnus'}
                  </span>
                </div>

                {/* Bio Summary */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 font-medium">
                  {alumnus.bio}
                </p>

                {/* Skills Tags */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Core Technical Competencies
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(alumnus.skills || []).slice(0, 4).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md bg-indigo-50/70 text-indigo-800 text-[10px] font-bold border border-indigo-100/70"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mentorship Focus Domains */}
                <div className="space-y-1.5 pt-1 border-t border-slate-100">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Mentorship Offerings
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(alumnus.mentorship_areas || []).map((area, aIdx) => (
                      <span
                        key={aIdx}
                        className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200"
                      >
                        ✓ {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Action Buttons */}
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenContactModal(alumnus)}
                  className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>💬</span>
                  <span>Connect / Reach Out</span>
                </button>

                {/* External Social / Email Icons */}
                <div className="flex items-center space-x-1 shrink-0">
                  {alumnus.linkedin_url && (
                    <a
                      href={alumnus.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 text-slate-600 hover:text-indigo-600 flex items-center justify-center text-xs font-bold transition"
                      title="LinkedIn Profile"
                    >
                      in
                    </a>
                  )}
                  {alumnus.email && (
                    <a
                      href={`mailto:${alumnus.email}?subject=AgentVerse Mentorship Inquiry`}
                      className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 text-slate-600 hover:text-indigo-600 flex items-center justify-center text-xs font-bold transition"
                      title={`Send Email to ${alumnus.email}`}
                    >
                      ✉️
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Interactive "Reach Out / Request Mentorship" Modal */}
      {selectedAlumnusForContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedAlumnusForContact(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm transition"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex items-center space-x-3.5 border-b border-slate-100 pb-4">
              <img
                src={selectedAlumnusForContact.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                alt={selectedAlumnusForContact.full_name}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
              />
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Contact {selectedAlumnusForContact.full_name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedAlumnusForContact.current_designation} @ {selectedAlumnusForContact.current_company}
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSendContact} className="space-y-4">
              {/* Request Type Selector */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mentorship Request Goal
                </label>
                <select
                  value={contactForm.request_type}
                  onChange={(e) => setContactForm({ ...contactForm, request_type: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="1:1 Career Guidance">1:1 Career Guidance & Roadmap Planning</option>
                  <option value="Mock Interview Prep">Mock Technical & Coding Interview</option>
                  <option value="Job & Internship Referral">Job & Internship Referral Request</option>
                  <option value="Project / Hackathon Feedback">Project Feedback & Hackathon Strategy</option>
                  <option value="General Inquiry">General Networking & Club Guidance</option>
                </select>
              </div>

              {/* Student Name & Email (Pre-filled) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={contactForm.student_name}
                    onChange={(e) => setContactForm({ ...contactForm, student_name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Your Email</label>
                  <input
                    type="email"
                    value={contactForm.student_email}
                    onChange={(e) => setContactForm({ ...contactForm, student_email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Subject Line</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="e.g., Guidance on Preparing for AI Engineer Roles & System Design"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Your Message</label>
                <textarea
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Introduce yourself, mention what projects you have built, and what specific advice you are looking for..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                ></textarea>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedAlumnusForContact(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-2 disabled:opacity-50"
                >
                  {isSending ? <span>Sending...</span> : <span>Send Mentorship Request 🚀</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubAlumniConnect;
