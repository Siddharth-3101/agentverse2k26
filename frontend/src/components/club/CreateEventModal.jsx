import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { createEvent } from '../../services/eventService.js';

const PRESET_BANNERS = [
  {
    label: 'Hackathon / AI',
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'
  },
  {
    label: 'Coding / DSA',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&auto=format&fit=crop&q=80'
  },
  {
    label: 'Workshop / AI Vision',
    url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=150&auto=format&fit=crop&q=80'
  },
  {
    label: 'Cybersecurity / CTF',
    url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=150&auto=format&fit=crop&q=80'
  },
  {
    label: 'Robotics & Hardware',
    url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=150&auto=format&fit=crop&q=80'
  },
  {
    label: 'Cultural & Music Fest',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80'
  }
];

const CATEGORIES = [
  'Hackathons',
  'Competitions',
  'Workshops',
  'Quizzes',
  'Cultural',
  'Technical',
  'Bootcamps',
  'Seminars'
];

const MODES = [
  { value: 'Offline', label: '🏫 Offline (On Campus)', icon: '🏫' },
  { value: 'Online', label: '🌐 Online (Virtual)', icon: '🌐' },
  { value: 'Hybrid', label: '⚡ Hybrid (Both)', icon: '⚡' }
];

const CreateEventModal = ({ isOpen, onClose, club, onEventCreated }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    organizer: club?.name || 'Agentic AI & Coding Society',
    college: 'Campus Tech Block & Labs',
    activity_type: 'Competitions',
    mode: 'Offline',
    location: 'Main Auditorium / Computer Lab 1',
    team_size: '1 - 4 Members',
    start_date: '',
    end_date: '',
    deadline: '',
    fee: 'Free',
    description: '',
    eligibility: 'Open to All Enrolled Students',
    tags: 'Hackathon, AI, Coding, Innovation',
    google_form_url: 'https://forms.google.com/sample-event-registration',
    contact_name: user?.name || 'Siddharth G',
    contact_phone: '+91 98765 43210',
    banner_url: PRESET_BANNERS[0].url,
    logo_url: PRESET_BANNERS[0].logo
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Sync club name if club changes
  useEffect(() => {
    if (club?.name) {
      setFormData((prev) => ({
        ...prev,
        organizer: club.name
      }));
    }
  }, [club]);

  // Set default dates if empty
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const nextWeekEnd = new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000);
      const deadlineDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

      const formatIsoForInput = (d) => {
        const pad = (n) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      };

      setFormData((prev) => ({
        ...prev,
        start_date: prev.start_date || formatIsoForInput(nextWeek),
        end_date: prev.end_date || formatIsoForInput(nextWeekEnd),
        deadline: prev.deadline || formatIsoForInput(deadlineDate),
        organizer: club?.name || prev.organizer,
        contact_name: user?.name || prev.contact_name
      }));
      setError(null);
    }
  }, [isOpen, club, user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectPresetBanner = (preset) => {
    setFormData((prev) => ({
      ...prev,
      banner_url: preset.url,
      logo_url: preset.logo
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide an event title.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const tagsArr = formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : ['Event', 'Campus'];

      const eligibilityArr = formData.eligibility
        ? formData.eligibility.split(',').map((item) => item.trim()).filter(Boolean)
        : ['All Students'];

      const contactArr = [
        {
          name: formData.contact_name || user?.name || 'Club Lead',
          phone: formData.contact_phone || '+91 98765 43210'
        }
      ];

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || 'Join this exciting event to build skills, collaborate, and win recognitions.',
        activity_type: formData.activity_type,
        organizer: formData.organizer,
        college: formData.college,
        start_date: formData.start_date,
        end_date: formData.end_date || formData.start_date,
        location: formData.location,
        mode: formData.mode,
        fee: formData.fee || 'Free',
        team_size: formData.team_size || '1 - 4 Members',
        deadline: formData.deadline,
        logo_url: formData.logo_url,
        banner_url: formData.banner_url,
        google_form_url: formData.google_form_url,
        is_featured: true,
        tags: tagsArr,
        eligibility: eligibilityArr,
        contact_numbers: contactArr
      };

      const res = await createEvent(payload);
      const createdItem = res?.data || res;

      // Format for UI consumers
      const formattedForUI = {
        id: createdItem.id || Date.now(),
        title: payload.title,
        description: payload.description,
        schedule: payload.start_date ? new Date(payload.start_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Upcoming',
        mode: payload.mode,
        organizer: payload.organizer,
        college: payload.college,
        category: payload.activity_type,
        location: payload.location,
        teamSize: payload.team_size,
        daysLeft: 'Upcoming',
        fee: payload.fee,
        logoImage: payload.logo_url,
        bannerImage: payload.banner_url,
        googleFormUrl: payload.google_form_url,
        tags: tagsArr,
        eligibility: eligibilityArr,
        contactNumbers: contactArr,
        isFeatured: true
      };

      if (onEventCreated) {
        onEventCreated(formattedForUI);
      }

      onClose();
    } catch (err) {
      console.error('[CreateEventModal Error]:', err);
      setError(err.message || 'Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Floating Modal Header */}
        <div className="bg-gradient-to-r from-[#1c4980] to-blue-900 px-6 py-4 sm:py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-xl shadow-inner">
              📅
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                Create New Event
                <span className="text-[10px] font-bold bg-blue-400/30 text-blue-100 px-2.5 py-0.5 rounded-full border border-blue-300/30">
                  Campus & Club Calendar
                </span>
              </h2>
              <p className="text-xs text-blue-100 font-medium">
                Publish an official event that appears on this club and the global All Events page.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition text-sm font-bold"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-slate-800">
          
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-bold flex items-center space-x-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Event Identity */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-[#1c4980] tracking-wider border-b border-slate-100 pb-1.5">
              <span>📌</span>
              <span>1. Basic Event Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Event Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g., Spring Agentic AI Hackathon 2026"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Organizing Club / Society
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleChange}
                  placeholder="e.g., Agentic AI & Coding Society"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Event Category
                </label>
                <select
                  name="activity_type"
                  value={formData.activity_type}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Event Format / Mode Pill Selector */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Event Format & Mode
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {MODES.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, mode: m.value }))}
                    className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition border flex items-center justify-center space-x-1.5 ${
                      formData.mode === m.value
                        ? 'bg-[#1c4980] text-white border-[#1c4980] shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{m.icon}</span>
                    <span>{m.value}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Date, Time & Venue */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-[#1c4980] tracking-wider border-b border-slate-100 pb-1.5">
              <span>🕒</span>
              <span>2. Date, Schedule & Venue</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Start Date & Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="start_date"
                  required
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Venue / Location / Platform
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g., Computer Lab 3, CSE Dept / Google Meet"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Registration Deadline
                </label>
                <input
                  type="datetime-local"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Registration & Form Links */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-[#1c4980] tracking-wider border-b border-slate-100 pb-1.5">
              <span>🔗</span>
              <span>3. Registration, Fees & Team Format</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Google Form / Registration Link <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  name="google_form_url"
                  required
                  placeholder="https://forms.google.com/your-event-form"
                  value={formData.google_form_url}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Registration Fee
                </label>
                <input
                  type="text"
                  name="fee"
                  placeholder="Free / ₹100"
                  value={formData.fee}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Team Size Format
                </label>
                <input
                  type="text"
                  name="team_size"
                  placeholder="1 - 4 Members / Solo"
                  value={formData.team_size}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Eligibility
                </label>
                <input
                  type="text"
                  name="eligibility"
                  placeholder="Open to All Engineering Students, B.Tech 1st - 4th Year"
                  value={formData.eligibility}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Description & Tags */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-[#1c4980] tracking-wider border-b border-slate-100 pb-1.5">
              <span>📝</span>
              <span>4. Description & Key Skill Tags</span>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">
                Event Description & Objectives
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Describe the event, hackathon tracks, prizes, round structure, and what participants will build..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">
                Tags / Skill Focus (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                placeholder="AI Agents, Python, Competitive Programming, Web3, Cash Prizes"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Section 5: Banner Presets & Visuals */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-black uppercase text-[#1c4980] tracking-wider border-b border-slate-100 pb-1.5">
              <span className="flex items-center space-x-2">
                <span>🎨</span>
                <span>5. Event Banner Image</span>
              </span>
              <span className="text-[10px] font-normal text-slate-500 normal-case">
                Select a high-resolution preset or paste custom URL
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PRESET_BANNERS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPresetBanner(preset)}
                  className={`relative rounded-xl overflow-hidden border text-left p-1.5 transition group ${
                    formData.banner_url === preset.url
                      ? 'border-[#1c4980] ring-2 ring-[#1c4980] ring-offset-1'
                      : 'border-slate-200 hover:border-blue-400'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-full h-14 object-cover rounded-lg"
                  />
                  <div className="mt-1 text-[11px] font-bold text-slate-700 truncate">
                    {preset.label}
                  </div>
                  {formData.banner_url === preset.url && (
                    <span className="absolute top-2 right-2 bg-[#1c4980] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">
                Custom Banner Image URL
              </label>
              <input
                type="url"
                name="banner_url"
                placeholder="https://images.unsplash.com/..."
                value={formData.banner_url}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Section 6: Contact Lead */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xs font-black uppercase text-[#1c4980] tracking-wider border-b border-slate-100 pb-1.5">
              <span>👤</span>
              <span>6. Student Organizer Contact</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  name="contact_name"
                  value={formData.contact_name}
                  onChange={handleChange}
                  placeholder="e.g., Siddharth G (President)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Contact Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#1c4980] to-blue-800 hover:from-blue-900 hover:to-indigo-950 text-white text-xs font-black rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Publishing Event...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Publish Event to All Events Page</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreateEventModal;
