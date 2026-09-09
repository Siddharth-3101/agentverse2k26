import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SKILL_DATASET, SKILL_CATEGORIES, searchSkillsInDataset } from '../../services/skillDataset';
import { getCareerRoles, evaluateCareer, getWeeklyAnalytics } from '../../services/careerService';

const StudentProfile = () => {
  const { user, setUser } = useAuth();

  // Dynamic state from active user
  const [profile, setProfile] = useState({
    fullName: user?.name || user?.full_name || 'Student',
    registrationNumber: user?.student_id_number || '2024CS001',
    email: user?.email || 'student@agentverse.edu',
    phone: user?.phone_number || user?.phone || '+91 98765 43210',
    address: 'Campus Hostel Block B, Coimbatore, Tamil Nadu',
    skills: user?.skills && user?.skills.length > 0 ? user.skills : ['Python', 'Agentic AI', 'React', 'FastAPI'],
    nonVerifiedSkills: user?.nonVerifiedSkills && user?.nonVerifiedSkills.length > 0 ? user.nonVerifiedSkills : ['Kubernetes', 'Docker', 'GraphQL', 'AWS Cloud Native'],
    interests: user?.interests && user?.interests.length > 0 ? user.interests : ['Artificial Intelligence', 'Web Development', 'Hackathons'],
  });

  // Autocomplete & Add Skill state
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('All');
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  // Interest State
  const [newInterestInput, setNewInterestInput] = useState('');
  const [isAddingInterest, setIsAddingInterest] = useState(false);

  // Toast / Saving
  const [successToast, setSuccessToast] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // ─── AI Weekly Activity State ─────────────────────────────────────────────
  const [weeklyAnalytics, setWeeklyAnalytics] = useState({
    streaks: { event_streak: 2, certificate_streak: 1, combined_streak: 2 },
    participation_trend: {
      current_week_count: 3,
      previous_week_count: 2,
      trend: 'INCREASED',
      percentage_change: 50,
      summary_text: 'Participation velocity increased by +50.0% compared to previous week.'
    },
    category_breakdown: {
      Events: { count: 3, percentage: 60 },
      Certifications: { count: 1, percentage: 20 },
      Internships: { count: 1, percentage: 20 },
    },
    weekly_activity_log: [
      { type: 'Event', title: 'National Cyber Shield CTF Championship', date: 'Sep 05, 2026' },
      { type: 'Certification', title: 'AI & Generative Vision Masterclass', date: 'Aug 28, 2026' },
      { type: 'Hackathon', title: 'Tejas India Hackathon 2026', date: 'Aug 14, 2026' }
    ]
  });

  // ─── AI Career Path Roadmap State ─────────────────────────────────────────
  const [availableRoles, setAvailableRoles] = useState([
    'AI Engineer',
    'Backend Developer',
    'Full Stack Developer',
    'Frontend Developer',
    'Cybersecurity Specialist',
    'DevOps Engineer',
    'AWS Cloud Architect',
    'Data Analyst',
    'Blockchain Developer',
    'iOS Developer'
  ]);
  const [selectedRole, setSelectedRole] = useState('AI Engineer');
  const [careerRoadmap, setCareerRoadmap] = useState(null);
  const [isLoadingCareer, setIsLoadingCareer] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        fullName: user.name || user.full_name || prev.fullName,
        registrationNumber: user.student_id_number || prev.registrationNumber,
        email: user.email || prev.email,
        phone: user.phone_number || prev.phone,
        skills: user.skills || prev.skills,
      }));
    }
  }, [user]);

  // Load Weekly Analytics & Career Roles on mount
  useEffect(() => {
    getWeeklyAnalytics()
      .then((data) => {
        if (data && data.streaks) {
          setWeeklyAnalytics((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((e) => console.warn('[Weekly Analytics Note]:', e.message));

    getCareerRoles()
      .then((roles) => {
        if (Array.isArray(roles) && roles.length > 0) {
          setAvailableRoles(roles);
        }
      })
      .catch((e) => console.warn('[Career Roles Note]:', e.message));
  }, []);

  // Fetch Career Evaluation when selectedRole changes
  useEffect(() => {
    if (!selectedRole) return;
    setIsLoadingCareer(true);
    evaluateCareer(selectedRole)
      .then((res) => {
        if (res && res.roadmap) {
          setCareerRoadmap(res);
        }
      })
      .catch((err) => {
        console.warn('[Career Recommender Local Notice]:', err.message);
      })
      .finally(() => {
        setIsLoadingCareer(false);
      });
  }, [selectedRole]);

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  // Add Skill from Dataset
  const handleSelectSkillFromDataset = (skillName) => {
    if (profile.skills.includes(skillName) || profile.nonVerifiedSkills.includes(skillName)) {
      showToast(`Skill "${skillName}" is already in your profile.`);
      return;
    }

    setProfile((prev) => ({
      ...prev,
      nonVerifiedSkills: [...prev.nonVerifiedSkills, skillName],
    }));
    setSkillSearchQuery('');
    setIsAddingSkill(false);
    showToast(`🎯 Added "${skillName}" to Non-Verified Skills.`);
  };

  // Remove Skill
  const handleRemoveSkill = (skillToRemove, isVerified = true) => {
    if (isVerified) {
      setProfile((prev) => ({
        ...prev,
        skills: prev.skills.filter((s) => s !== skillToRemove),
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        nonVerifiedSkills: prev.nonVerifiedSkills.filter((s) => s !== skillToRemove),
      }));
    }
  };

  // Add Interest
  const handleAddInterest = (e) => {
    if (e) e.preventDefault();
    const trimmed = newInterestInput.trim();
    if (trimmed && !profile.interests.includes(trimmed)) {
      setProfile((prev) => ({
        ...prev,
        interests: [...prev.interests, trimmed],
      }));
      setNewInterestInput('');
      setIsAddingInterest(false);
      showToast(`Added "${trimmed}" to interests.`);
    }
  };

  // Remove Interest
  const handleRemoveInterest = (interestToRemove) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.filter((item) => item !== interestToRemove),
    }));
  };

  // Add Career Milestone Target Skills to Non-Verified Skills
  const handlePromoteCareerSkillsToNonVerified = (milestone) => {
    let milestoneSkills = Array.isArray(milestone.skills) && milestone.skills.length > 0 ? milestone.skills : [];

    // Fallback: If no skills array, search dataset or use topic
    if (milestoneSkills.length === 0 && milestone.topic) {
      const found = searchSkillsInDataset(milestone.topic);
      if (found.length > 0) {
        milestoneSkills = found.slice(0, 3).map((f) => f.name);
      } else {
        milestoneSkills = [milestone.topic];
      }
    }

    const currentAllSkills = [
      ...profile.skills.map((s) => s.toLowerCase().trim()),
      ...profile.nonVerifiedSkills.map((s) => s.toLowerCase().trim()),
    ];

    const newSkills = milestoneSkills.filter(
      (s) => !currentAllSkills.includes(s.toLowerCase().trim())
    );

    if (newSkills.length === 0) {
      if (milestone.topic && !currentAllSkills.includes(milestone.topic.toLowerCase().trim())) {
        const topicName = milestone.topic;
        setProfile((prev) => {
          const updated = [...prev.nonVerifiedSkills, topicName];
          if (setUser) {
            setUser((u) => (u ? { ...u, nonVerifiedSkills: updated } : u));
          }
          return { ...prev, nonVerifiedSkills: updated };
        });
        showToast(`🎯 Added "${topicName}" to Non-Verified Skills!`);
        return;
      }
      showToast(`All skills from "${milestone.topic}" are already in your profile.`);
      return;
    }

    setProfile((prev) => {
      const updated = [...prev.nonVerifiedSkills, ...newSkills];
      if (setUser) {
        setUser((u) => (u ? { ...u, nonVerifiedSkills: updated } : u));
      }
      return { ...prev, nonVerifiedSkills: updated };
    });
    showToast(`🚀 Added ${newSkills.length} skill(s) (${newSkills.join(', ')}) to Non-Verified Skills!`);
  };

  // Save Changes
  const handleSaveChanges = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      if (setUser) {
        setUser((prev) => ({
          ...prev,
          name: profile.fullName,
          full_name: profile.fullName,
          skills: profile.skills,
          nonVerifiedSkills: profile.nonVerifiedSkills,
        }));
      }
      showToast('🎉 Profile & Skill Portfolio updated successfully.');
    }, 300);
  };

  // Filter dataset for autocomplete
  const filteredDatasetSkills = searchSkillsInDataset(skillSearchQuery).filter((s) => {
    const matchesCategory =
      selectedSkillCategory === 'All' || s.category.toLowerCase().includes(selectedSkillCategory.toLowerCase());
    return matchesCategory;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Profile & AI Skill Roadmap
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Manage your student profile, multi-domain competencies, weekly activity telemetry, and career milestone map.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3.5 py-1.5 rounded-full self-start sm:self-auto shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Verified Student Profile</span>
        </div>
      </div>

      {/* Floating Success Toast */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl flex items-center gap-3 animate-fadeIn">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0 font-bold text-xs text-white">
            ✓
          </div>
          <div>
            <p className="text-xs font-bold text-white">{successToast}</p>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast('')}
            className="text-slate-400 hover:text-white text-sm font-semibold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* =========================================================================
          1. MAIN PROFILE CARD
          ========================================================================= */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
        {/* Profile Hero Banner */}
        <div className="bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#3730a3] p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
            {/* Initials Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-1 shadow-lg shrink-0">
              <div className="w-full h-full rounded-xl bg-gradient-to-tr from-[#1c4980] to-indigo-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold tracking-wider">
                {profile.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()}
              </div>
            </div>

            {/* Student Metadata */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{profile.fullName}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm">
                  {profile.registrationNumber}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Batch 2024-2028
                </span>
              </div>
              <p className="text-indigo-100 text-xs sm:text-sm font-medium">
                {profile.email} • {profile.phone}
              </p>
              <p className="text-indigo-200/80 text-xs mt-0.5 font-medium">
                📍 {profile.address}
              </p>
            </div>

            {/* Stats Pills */}
            <div className="hidden md:flex flex-col items-end space-y-1.5 text-xs text-indigo-100">
              <span className="bg-white/10 px-3 py-1 rounded-xl border border-white/10 font-bold">
                ✓ {profile.skills.length} Verified Skills
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-xl border border-white/10 font-bold">
                🎯 {profile.nonVerifiedSkills.length} Target Skills
              </span>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSaveChanges} className="p-6 sm:p-8 space-y-8">
          {/* Section 1: General Info */}
          <div>
            <div className="border-b border-slate-100 pb-3 mb-5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                <span>Personal Information</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={profile.registrationNumber}
                  onChange={(e) => setProfile({ ...profile, registrationNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Campus Address / Department
                </label>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Skills with Multi-Domain Dataset Integration */}
          <div>
            <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  <span>Skills Portfolio (Skill Taxonomy Dataset)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Categorized into Verified (Backed by certificates/hackathons) and Non-Verified (Career goals).
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingSkill(!isAddingSkill)}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
              >
                <span>{isAddingSkill ? '✕ Close Search' : '+ Add Skill from Dataset'}</span>
              </button>
            </div>

            {/* Interactive Dataset Skill Autocomplete & Selector Dropdown */}
            {isAddingSkill && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-indigo-200 shadow-sm mb-4 space-y-3 animate-fadeIn">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <input
                      type="text"
                      value={skillSearchQuery}
                      onChange={(e) => setSkillSearchQuery(e.target.value)}
                      placeholder="Search skill dataset (e.g. Python, Docker, React, PyTorch, Kubernetes)..."
                      autoFocus
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {skillSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setSkillSearchQuery('')}
                        className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700 font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <select
                    value={selectedSkillCategory}
                    onChange={(e) => setSelectedSkillCategory(e.target.value)}
                    className="px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 w-full sm:w-auto"
                  >
                    <option value="All">All Categories</option>
                    {SKILL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Skill Options Grid */}
                <div className="max-h-48 overflow-y-auto pr-1 flex flex-wrap gap-2">
                  {filteredDatasetSkills.map((item) => {
                    const isAlreadyAdded =
                      profile.skills.includes(item.name) || profile.nonVerifiedSkills.includes(item.name);
                    return (
                      <button
                        type="button"
                        key={item.name}
                        disabled={isAlreadyAdded}
                        onClick={() => handleSelectSkillFromDataset(item.name)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition text-left flex items-center gap-1.5 ${
                          isAlreadyAdded
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-white hover:bg-indigo-600 hover:text-white text-slate-700 border border-slate-200 shadow-2xs cursor-pointer'
                        }`}
                      >
                        <span>{item.name}</span>
                        <span className="text-[10px] opacity-70">({item.category})</span>
                        {isAlreadyAdded && <span className="text-[10px]">✓ Added</span>}
                      </button>
                    );
                  })}
                  {filteredDatasetSkills.length === 0 && (
                    <div className="text-xs text-slate-500 py-2 w-full text-center">
                      No matching skills found in dataset. Type a custom skill name or pick from categories above.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2 Sub-groups: Verified Skills and Non-Verified Skills */}
            <div className="space-y-4">
              {/* Group A: Verified Skills */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <span>✓ Verified Skills</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                      Certificate & Hackathon Backed
                    </span>
                  </span>
                  <span className="text-xs font-bold text-emerald-700">{profile.skills.length} Skills</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-emerald-800 border border-emerald-300 shadow-2xs"
                    >
                      <span>✓ {skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill, true)}
                        className="w-4 h-4 rounded-full flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition focus:outline-none cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {profile.skills.length === 0 && (
                    <span className="text-xs text-emerald-700 italic">No verified skills yet. Upload certificates to verify skills.</span>
                  )}
                </div>
              </div>

              {/* Group B: Non-Verified Skills */}
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <span>⏳ Non-Verified Skills</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md">
                      Self-Declared & Career Path Targets
                    </span>
                  </span>
                  <span className="text-xs font-bold text-amber-700">{profile.nonVerifiedSkills.length} Skills</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {profile.nonVerifiedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-amber-800 border border-amber-300 shadow-2xs"
                    >
                      <span>🎯 {skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill, false)}
                        className="w-4 h-4 rounded-full flex items-center justify-center text-amber-600 hover:bg-amber-100 transition focus:outline-none cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {profile.nonVerifiedSkills.length === 0 && (
                    <span className="text-xs text-amber-700 italic">No target skills added. Click "+ Add Skill from Dataset" or select milestones below.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Interests */}
          <div>
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                <span>Campus Interests</span>
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs"
                >
                  <span>{interest}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(interest)}
                    className="w-4 h-4 rounded-full flex items-center justify-center text-purple-500 hover:bg-purple-200 hover:text-purple-900 transition focus:outline-none cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}

              {isAddingInterest ? (
                <div className="inline-flex items-center space-x-1.5 bg-white border border-purple-400 rounded-xl p-1 shadow-xs">
                  <input
                    type="text"
                    value={newInterestInput}
                    onChange={(e) => setNewInterestInput(e.target.value)}
                    placeholder="Enter interest..."
                    autoFocus
                    className="px-2.5 py-0.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none w-28 sm:w-36 bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingInterest(false);
                      setNewInterestInput('');
                    }}
                    className="px-2 py-1 text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingInterest(true)}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-purple-700 bg-slate-100 hover:bg-purple-50 hover:text-purple-800 border border-dashed border-slate-300 transition cursor-pointer"
                >
                  <span className="text-sm font-bold">+</span>
                  <span>Add Interest</span>
                </button>
              )}
            </div>
          </div>

          {/* Submit Profile Changes */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-gradient-to-r from-[#1c4980] to-indigo-600 hover:from-[#153760] hover:to-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-blue-900/15 cursor-pointer"
            >
              {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* =========================================================================
          2. AI WEEKLY ACTIVITY ANALYSIS MODULE (Placed Below Profile)
          ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold mb-1">
              <span>📊 Activity Telemetry Engine</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              AI Weekly Activity & Streaks Analysis
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Grounded weekly metrics calculated strictly from verified database activity and event records.
            </p>
          </div>

          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-xl self-start sm:self-auto">
            Week Active: 2026-W37
          </span>
        </div>

        {/* 3 Telemetry Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Dual Streaks Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 space-y-2">
            <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block">
              Dual Streaks
            </span>
            <div className="flex items-center justify-between pt-1">
              <div>
                <div className="text-2xl font-black text-indigo-700 flex items-center gap-1.5">
                  <span>{weeklyAnalytics.streaks.event_streak}</span>
                  <span className="text-sm font-bold">Wks 🔥</span>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold block">Event Streak</span>
              </div>
              <div className="h-8 w-px bg-indigo-200"></div>
              <div>
                <div className="text-2xl font-black text-emerald-700 flex items-center gap-1.5">
                  <span>{weeklyAnalytics.streaks.certificate_streak}</span>
                  <span className="text-sm font-bold">Wks 📜</span>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold block">Certificate Streak</span>
              </div>
            </div>
          </div>

          {/* Participation Velocity Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 space-y-2">
            <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block">
              Participation Velocity
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-1 flex items-center gap-2">
              <span>+{weeklyAnalytics.participation_trend.percentage_change}%</span>
              <span className="text-xs font-bold px-2 py-0.5 bg-emerald-200 text-emerald-800 rounded-md">
                {weeklyAnalytics.participation_trend.trend}
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 font-medium leading-snug">
              {weeklyAnalytics.participation_trend.summary_text}
            </p>
          </div>

          {/* 3-Category Breakdown */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-slate-50 border border-purple-100 space-y-2">
            <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider block">
              3-Category Distribution
            </span>
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">Events ({weeklyAnalytics.category_breakdown.Events.count})</span>
                <span className="text-indigo-600">{weeklyAnalytics.category_breakdown.Events.percentage}%</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">Certificates ({weeklyAnalytics.category_breakdown.Certifications.count})</span>
                <span className="text-emerald-600">{weeklyAnalytics.category_breakdown.Certifications.percentage}%</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">Internships ({weeklyAnalytics.category_breakdown.Internships.count})</span>
                <span className="text-purple-600">{weeklyAnalytics.category_breakdown.Internships.percentage}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Activity Log */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">
            Recent Grounded Activity Log
          </h4>
          <div className="space-y-2">
            {weeklyAnalytics.weekly_activity_log.map((log, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-white rounded-md text-[10px] font-bold border border-slate-200 text-[#1c4980]">
                    {log.type}
                  </span>
                  <span className="text-slate-800">{log.title}</span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">{log.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. INTERACTIVE CAREER PATH ROADMAP & MILESTONE MAP
          ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-blue-100 text-[#1c4980] text-[11px] font-bold mb-1">
              <span>🗺️ Roadmap.sh Structured Career Trees</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Interactive Career Path Progression
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Choose your target career path to visualize where you stand on the milestone map and promote upcoming skills to your profile.
            </p>
          </div>

          {/* Career Path Role Selector Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Target Role:</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-[#1c4980] focus:outline-none focus:ring-2 focus:ring-[#1c4980]"
            >
              {availableRoles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoadingCareer && (
          <div className="py-8 text-center space-y-2">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <span className="text-xs font-bold text-slate-600 block">Synthesizing roadmap milestones for {selectedRole}...</span>
          </div>
        )}

        {/* Roadmap Map Content */}
        {!isLoadingCareer && careerRoadmap && careerRoadmap.roadmap && (
          <div className="space-y-6">
            {/* Career Header & Match Summary */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-[#1c4980] rounded-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-200 block">
                  Active Career Pathway
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">{careerRoadmap.roadmap.role}</h3>
                <p className="text-xs text-blue-100/80 mt-1 max-w-xl">{careerRoadmap.roadmap.description}</p>
              </div>

              <div className="px-4 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-center shrink-0">
                <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider block">Path Match</span>
                <span className="text-2xl font-black text-white">{careerRoadmap.matchScore || 88}%</span>
              </div>
            </div>

            {/* Visual Milestone Map / Stepper Graph */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center justify-between">
                <span>Milestone Roadmap Map</span>
                <span className="text-[10px] font-semibold text-slate-400">Qualitative Progression (Completed → Build Next → Upcoming)</span>
              </h4>

              <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-6 ml-3">
                {careerRoadmap.roadmap.milestones.map((m, idx) => {
                  const isCompleted = m.status === 'COMPLETED';
                  const isBuildNext = m.status === 'BUILD_NEXT';
                  const isUpcoming = m.status === 'UPCOMING';

                  return (
                    <div key={m.id || idx} className="relative group">
                      {/* Node Circle */}
                      <div
                        className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-xs ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-600 text-white'
                            : isBuildNext
                            ? 'bg-indigo-600 border-indigo-700 text-white animate-pulse'
                            : 'bg-white border-slate-300 text-slate-400'
                        }`}
                      >
                        {isCompleted ? '✓' : isBuildNext ? '🎯' : idx + 1}
                      </div>

                      {/* Milestone Card */}
                      <div
                        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                          isCompleted
                            ? 'bg-emerald-50/40 border-emerald-200'
                            : isBuildNext
                            ? 'bg-indigo-50/60 border-indigo-300 ring-2 ring-indigo-500/20 shadow-md'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-extrabold text-slate-900">{m.topic}</span>
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                                isCompleted
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isBuildNext
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {isCompleted ? '✓ Completed' : isBuildNext ? '🎯 Current Focus (Build Next)' : 'Upcoming'}
                            </span>
                          </div>

                          {/* Action button to promote skills from Build Next or Upcoming */}
                          {(isBuildNext || isUpcoming) && (
                            <button
                              type="button"
                              onClick={() => handlePromoteCareerSkillsToNonVerified(m)}
                              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-2xs transition self-start sm:self-auto cursor-pointer"
                            >
                              + Add Skills to Non-Verified
                            </button>
                          )}
                        </div>

                        {/* Milestone Skills Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {(m.skills || []).map((skill, sIdx) => {
                            const isVerified = (profile.skills || []).some((s) => s.toLowerCase().trim() === skill.toLowerCase().trim());
                            const isNonVerified = (profile.nonVerifiedSkills || []).some((s) => s.toLowerCase().trim() === skill.toLowerCase().trim());

                            return (
                              <span
                                key={sIdx}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                                  isVerified
                                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                                    : isNonVerified
                                    ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                                    : 'bg-white text-slate-700 border-slate-200'
                                }`}
                              >
                                {isVerified ? `✓ ${skill}` : isNonVerified ? `🎯 ${skill}` : skill}
                              </span>
                            );
                          })}
                        </div>

                        {/* Recommendation Note if Build Next */}
                        {isBuildNext && m.suggestion && (
                          <div className="mt-3 p-2.5 bg-indigo-100/70 rounded-xl border border-indigo-200 text-xs text-indigo-900 font-medium">
                            💡 <strong>AI Guidance:</strong> {m.suggestion}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
