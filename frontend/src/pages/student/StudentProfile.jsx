import React, { useState } from 'react';

const StudentProfile = () => {
  // Initial Mock Data in React State
  const [profile, setProfile] = useState({
    fullName: 'Sankari Ganeshan',
    registrationNumber: '23CSXXXX',
    email: 'student@example.com',
    phone: '+91 XXXXX XXXXX',
    address: 'Coimbatore, Tamil Nadu',
    skills: ['Java', 'React', 'Python'],
    interests: ['Artificial Intelligence', 'Web Development', 'Hackathons'],
  });

  // Local inputs for adding skills and interests
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  const [newInterestInput, setNewInterestInput] = useState('');
  const [isAddingInterest, setIsAddingInterest] = useState(false);

  // Success toast state
  const [successToast, setSuccessToast] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Handle simple text changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Add Skill
  const handleAddSkill = (e) => {
    if (e) e.preventDefault();
    const trimmed = newSkillInput.trim();
    if (trimmed && !profile.skills.includes(trimmed)) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
      }));
      setNewSkillInput('');
      setIsAddingSkill(false);
    }
  };

  // Remove Skill
  const handleRemoveSkill = (skillToRemove) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
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
    }
  };

  // Remove Interest
  const handleRemoveInterest = (interestToRemove) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.filter((item) => item !== interestToRemove),
    }));
  };

  // Save Changes
  const handleSaveChanges = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSuccessToast('Profile updated successfully.');
      setTimeout(() => {
        setSuccessToast('');
      }, 3500);
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Profile
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your personal information, skills, and interests.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-full self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Verified Student Profile</span>
        </div>
      </div>

      {/* Floating Success Toast */}
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-900">{successToast}</p>
              <p className="text-xs text-emerald-700">Your profile details are updated in your session.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast('')}
            className="text-emerald-700 hover:text-emerald-900 text-sm font-semibold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        
        {/* Profile Card Hero Banner */}
        <div className="bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#4338ca] p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
            {/* Initials Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-1 shadow-lg shrink-0">
              <div className="w-full h-full rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold tracking-wider">
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
                <h2 className="text-xl sm:text-2xl font-bold text-white">{profile.fullName}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                  {profile.registrationNumber}
                </span>
              </div>
              <p className="text-indigo-100 text-xs sm:text-sm">
                {profile.email} • {profile.phone}
              </p>
              <p className="text-indigo-200/80 text-xs mt-0.5">
                📍 {profile.address}
              </p>
            </div>

            {/* Stats Pills */}
            <div className="hidden md:flex flex-col items-end space-y-1 text-xs text-indigo-100">
              <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10 font-medium">
                {profile.skills.length} Technical Skills
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10 font-medium">
                {profile.interests.length} Campus Interests
              </span>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSaveChanges} className="p-6 sm:p-8 space-y-6">
          
          {/* Section 1: General Info */}
          <div>
            <div className="border-b border-slate-100 pb-3 mb-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                <span>Personal Information</span>
              </h3>
            </div>

            {/* Two Columns on Desktop, One Column on Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 1. Full Name */}
              <div>
                <label 
                  htmlFor="profile-fullname" 
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="profile-fullname"
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>

              {/* 2. Registration Number */}
              <div>
                <label 
                  htmlFor="profile-regno" 
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Registration Number
                </label>
                <input
                  id="profile-regno"
                  type="text"
                  name="registrationNumber"
                  value={profile.registrationNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your registration number"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>

              {/* 3. Email Address */}
              <div>
                <label 
                  htmlFor="profile-email" 
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="profile-email"
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>

              {/* 4. Phone Number */}
              <div>
                <label 
                  htmlFor="profile-phone" 
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Phone Number
                </label>
                <input
                  id="profile-phone"
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
              </div>

              {/* 5. Address (Full Width Textarea) */}
              <div className="md:col-span-2">
                <label 
                  htmlFor="profile-address" 
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Address
                </label>
                <textarea
                  id="profile-address"
                  rows="3"
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Section 2: Skills (Tag/Chip UI) */}
          <div>
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                <span>Skills</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tag your primary technical proficiencies.
              </p>
            </div>

            {/* Skills Chips Container */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs transition hover:bg-indigo-100"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="w-4 h-4 rounded-full flex items-center justify-center text-indigo-500 hover:bg-indigo-200 hover:text-indigo-900 transition focus:outline-none cursor-pointer"
                    aria-label={`Remove skill ${skill}`}
                  >
                    ×
                  </button>
                </span>
              ))}

              {/* Inline Add Skill Form / Button */}
              {isAddingSkill ? (
                <div className="inline-flex items-center space-x-1.5 bg-white border border-indigo-400 rounded-xl p-1 shadow-xs">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      } else if (e.key === 'Escape') {
                        setIsAddingSkill(false);
                        setNewSkillInput('');
                      }
                    }}
                    placeholder="Enter skill..."
                    autoFocus
                    className="px-2.5 py-0.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none w-28 sm:w-36 bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingSkill(false);
                      setNewSkillInput('');
                    }}
                    className="px-2 py-1 text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingSkill(true)}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-700 bg-slate-100/80 hover:bg-indigo-50 hover:text-indigo-800 border border-dashed border-slate-300 hover:border-indigo-400 transition cursor-pointer"
                >
                  <span className="text-sm font-bold">+</span>
                  <span>Add Skill</span>
                </button>
              )}
            </div>
          </div>

          {/* Section 3: Interests (Tag/Chip UI) */}
          <div>
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                <span>Interests</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Specify domain, club, or research interest areas.
              </p>
            </div>

            {/* Interests Chips Container */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs transition hover:bg-purple-100"
                >
                  <span>{interest}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(interest)}
                    className="w-4 h-4 rounded-full flex items-center justify-center text-purple-500 hover:bg-purple-200 hover:text-purple-900 transition focus:outline-none cursor-pointer"
                    aria-label={`Remove interest ${interest}`}
                  >
                    ×
                  </button>
                </span>
              ))}

              {/* Inline Add Interest Form / Button */}
              {isAddingInterest ? (
                <div className="inline-flex items-center space-x-1.5 bg-white border border-purple-400 rounded-xl p-1 shadow-xs">
                  <input
                    type="text"
                    value={newInterestInput}
                    onChange={(e) => setNewInterestInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddInterest();
                      } else if (e.key === 'Escape') {
                        setIsAddingInterest(false);
                        setNewInterestInput('');
                      }
                    }}
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
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-purple-700 bg-slate-100/80 hover:bg-purple-50 hover:text-purple-800 border border-dashed border-slate-300 hover:border-purple-400 transition cursor-pointer"
                >
                  <span className="text-sm font-bold">+</span>
                  <span>Add Interest</span>
                </button>
              )}
            </div>
          </div>

          {/* Bottom Actions: Save Changes */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl text-sm transition-all duration-200 shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.99] disabled:opacity-70 cursor-pointer flex items-center justify-center space-x-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default StudentProfile;
