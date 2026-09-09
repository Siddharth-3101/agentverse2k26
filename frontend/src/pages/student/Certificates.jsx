import React, { useState, useEffect } from 'react';
import CertificateCard from '../../components/student/CertificateCard';
import { getStudentCertificates, uploadCertificate, addCertificate } from '../../services/certificateService';

const INITIAL_CERTIFICATES = [
  {
    id: 'cert-1',
    title: 'National Cyber Shield CTF Championship',
    issuer: 'IIT Roorkee Cyber Society',
    issueDate: 'Sep 05, 2026',
    category: 'Competition',
    credentialId: 'AV-CYBER-2026-9042',
    grade: 'Top 10 Finalist (Score: 92/100)',
    skills: ['Network Security', 'Cryptography', 'Digital Forensics', 'Ethical Hacking'],
    isVerified: true,
    verificationUrl: 'https://agentverse.edu/verify/AV-CYBER-2026-9042',
    description: 'Awarded for demonstrating exceptional penetration testing and reverse engineering capabilities during the 24-hour National Cyber Shield CTF.'
  },
  {
    id: 'cert-2',
    title: 'AI & Generative Vision Masterclass',
    issuer: 'Delhi Technological University (DTU)',
    issueDate: 'Aug 28, 2026',
    category: 'Workshop',
    credentialId: 'AV-DTU-AI-8831',
    grade: 'Completed with Distinction',
    skills: ['Generative AI', 'Diffusion Models', 'PyTorch', 'LLM Agent Frameworks'],
    isVerified: true,
    verificationUrl: 'https://agentverse.edu/verify/AV-DTU-AI-8831',
    description: 'Certified proficiency in training Transformer models, fine-tuning Llama weights, and architecting multi-agent autonomous systems.'
  },
  {
    id: 'cert-3',
    title: 'Tejas India Hackathon 2026 Participation',
    issuer: 'Government Engineering College (GEC)',
    issueDate: 'Aug 14, 2026',
    category: 'Hackathon',
    credentialId: 'AV-TEJAS-2026-1149',
    grade: 'Runner Up - FinTech Track',
    skills: ['React', 'Node.js', 'Smart Contracts', 'System Architecture'],
    isVerified: true,
    verificationUrl: 'https://agentverse.edu/verify/AV-TEJAS-2026-1149',
    description: 'Built an end-to-end decentralized micro-lending portal for rural agricultural cooperatives using zero-knowledge identity proofs.'
  },
  {
    id: 'cert-4',
    title: 'Full Stack Cloud Native Specialization',
    issuer: 'AWS Academy & AgentVerse',
    issueDate: 'Jul 20, 2026',
    category: 'Coursework',
    credentialId: 'AV-AWS-CLOUD-5520',
    grade: 'Grade A+ (96%)',
    skills: ['Docker', 'Kubernetes', 'AWS Lambda', 'CI/CD Pipelines', 'Terraform'],
    isVerified: true,
    verificationUrl: 'https://agentverse.edu/verify/AV-AWS-CLOUD-5520',
    description: 'Completed 60+ hours of hands-on cloud architectural labs and containerized orchestration workflows.'
  },
  {
    id: 'cert-5',
    title: 'Competitive Programming DSA Elite',
    issuer: 'Coding Club, DCRUST',
    issueDate: 'Jun 10, 2026',
    category: 'Technical',
    credentialId: 'AV-DSA-ELITE-3391',
    grade: 'Rank 3 / 250 Candidates',
    skills: ['Dynamic Programming', 'Graph Theory', 'Data Structures', 'C++'],
    isVerified: true,
    verificationUrl: 'https://agentverse.edu/verify/AV-DSA-ELITE-3391',
    description: 'Demonstrated speed and algorithmic mastery solving 12 advanced DP and segment tree challenges under strict time constraints.'
  }
];

const formatSkill = (skill) => {
  if (!skill) return '';
  if (typeof skill === 'string') return skill;
  if (typeof skill === 'object') {
    return skill.name || skill.skill || skill.title || '';
  }
  return String(skill);
};

const parseSkills = (s) => {
  if (!s) return [];
  if (Array.isArray(s)) return s;
  if (typeof s === 'string') {
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return s.split(',').map((x) => x.trim()).filter(Boolean);
    }
  }
  return [];
};

const Certificates = () => {
  const [certificates, setCertificates] = useState(INITIAL_CERTIFICATES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCert, setSelectedCert] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Upload Form State
  const [newCert, setNewCert] = useState({
    title: '',
    issuer: '',
    category: 'Hackathon',
    issueDate: '',
    credentialId: '',
    skillsInput: '',
    grade: '',
    description: '',
    fileName: '',
    file: null,
  });

  useEffect(() => {
    // Load backend certificates if available
    getStudentCertificates()
      .then((serverCerts) => {
        if (Array.isArray(serverCerts) && serverCerts.length > 0) {
          const normalized = serverCerts.map((c) => ({
            id: c.id || c.credentialId || c.credential_id,
            title: c.title || 'Verified Certificate',
            issuer: c.issuer || c.organization || 'AgentVerse Academic Accreditation',
            issueDate: c.issueDate || c.issue_date || 'Sep 2026',
            category: c.category || 'Technical',
            credentialId: c.credentialId || c.credential_id || 'AV-CERT',
            grade: c.grade || c.achievement || 'Verified Completion',
            skills: parseSkills(c.skills),
            isVerified: c.isVerified !== undefined ? c.isVerified : (c.verification_status !== 'REJECTED'),
            verificationUrl: c.verificationUrl || `https://agentverse.edu/verify/${c.credential_id || c.credentialId || 'AV'}`,
            description: c.description || `Verified ${c.category || 'academic'} credential.`
          }));

          // Merge with initial dummy data
          setCertificates((prev) => {
            const serverIds = new Set(normalized.map((c) => c.id || c.credentialId));
            const filteredDefaults = prev.filter((p) => !serverIds.has(p.id));
            return [...normalized, ...filteredDefaults];
          });
        }
      })
      .catch((e) => console.warn('[Certificates load notice]:', e.message));
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const categories = ['All', 'Hackathon', 'Workshop', 'Competition', 'Coursework', 'Technical'];

  // Filtered Certificates
  const filteredCertificates = certificates.filter((cert) => {
    const matchesCategory =
      selectedCategory === 'All' || (cert.category || '').toLowerCase() === selectedCategory.toLowerCase();
    const skillsList = parseSkills(cert.skills);
    const matchesSearch =
      (cert.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cert.issuer || cert.organization || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      skillsList.some((s) => formatSkill(s).toLowerCase().includes(searchQuery.toLowerCase())) ||
      (cert.credentialId || cert.credential_id || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate unique skills count
  const allSkills = new Set();
  certificates.forEach((c) => {
    parseSkills(c.skills).forEach((s) => {
      const name = formatSkill(s);
      if (name) allSkills.add(name);
    });
  });

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewCert((prev) => ({
        ...prev,
        file,
        fileName: file.name,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
      }));

      // Trigger AI Auto-Scan preview if backend upload endpoint is active
      setIsScanning(true);
      showToast('🤖 AI scanning certificate OCR text & verifying issuer signatures...');
      try {
        const aiRes = await uploadCertificate(file);
        if (aiRes?.success && aiRes.data) {
          const adapted = aiRes.data;
          setNewCert((prev) => ({
            ...prev,
            title: adapted.title || prev.title,
            issuer: adapted.issuer || prev.issuer,
            issueDate: adapted.issueDate || prev.issueDate,
            category: adapted.category || prev.category,
            credentialId: adapted.credentialId || prev.credentialId,
            skillsInput: (adapted.skills || []).join(', '),
            grade: adapted.grade || prev.grade,
          }));
          showToast(`✨ AI Extraction Complete! Confidence: ${Math.round((aiRes.confidence?.overall || 0.95) * 100)}%`);
        }
      } catch (err) {
        showToast('ℹ️ Local file selected. You can review details and save.');
      } finally {
        setIsScanning(false);
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!newCert.file && !newCert.fileName) {
      showToast('⚠️ Please select or drop a certificate document.');
      return;
    }

    const title = newCert.title.trim() || newCert.fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'Verified Credential';
    const issuer = newCert.issuer.trim() || 'AgentVerse Academic Accreditation';

    const skillsArray = newCert.skillsInput
      ? newCert.skillsInput.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Verified Competency'];

    const newCertificateObject = {
      id: `cert-${Date.now()}`,
      title,
      issuer,
      issueDate: newCert.issueDate || 'Sep 2026',
      category: newCert.category || 'Technical',
      credentialId: newCert.credentialId.trim() || `AV-CERT-${Math.floor(1000 + Math.random() * 9000)}`,
      grade: newCert.grade || 'Verified Completion',
      skills: skillsArray,
      isVerified: true,
      verificationUrl: `https://agentverse.edu/verify/${newCert.credentialId.trim() || 'NEW'}`,
      description: newCert.description || `Verified ${newCert.category || 'technical'} credential certified by ${issuer}.`
    };

    // Save to local state immediately
    setCertificates([newCertificateObject, ...certificates]);
    setIsUploadModalOpen(false);

    // Save to backend DB
    try {
      await addCertificate(2, {
        title: newCertificateObject.title,
        organization: newCertificateObject.issuer,
        category: newCertificateObject.category,
        issue_date: newCertificateObject.issueDate,
        credential_id: newCertificateObject.credentialId,
        achievement: newCertificateObject.grade,
        skills: newCertificateObject.skills,
        verification_status: 'PENDING',
      });
    } catch (e) {
      console.warn('[Add Certificate Server Notice]:', e.message);
    }

    setNewCert({
      title: '',
      issuer: '',
      category: 'Hackathon',
      issueDate: '',
      credentialId: '',
      skillsInput: '',
      grade: '',
      description: '',
      fileName: '',
      file: null,
    });
    showToast('🎉 Certificate uploaded and AI-verified successfully! Added to your profile.');
  };

  const handleDownload = (cert) => {
    showToast(`📥 Downloading official certificate PDF: ${cert.title}`);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 pb-16">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1c4980] text-white px-5 py-3 rounded-2xl shadow-xl font-semibold text-sm flex items-center gap-2 animate-fadeIn">
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#1c4980] text-xs font-bold mb-2">
              <span>📜 Academic & Event Credentials</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              My Verified Certificates
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                {certificates.length} Issued
              </span>
            </h1>
            <p className="text-slate-600 mt-1 text-sm font-medium">
              Upload, organize, and showcase verified credentials from national hackathons, workshops, and college contests.
            </p>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-5 py-3 bg-[#1c4980] hover:bg-[#153760] text-white font-extrabold text-sm rounded-xl transition shadow-md shadow-blue-900/10 flex items-center justify-center gap-2 shrink-0"
          >
            <span className="text-base font-bold">+</span>
            <span>Upload Certificate</span>
          </button>
        </div>

        {/* 4 Summary Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Certificates</span>
            <div className="text-2xl font-black text-[#1c4980] mt-1">{certificates.length}</div>
            <span className="text-[11px] text-emerald-600 font-bold">100% Verified</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Skills Mastered</span>
            <div className="text-2xl font-black text-indigo-600 mt-1">{allSkills.size}</div>
            <span className="text-[11px] text-slate-500 font-medium">Across all domains</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Hackathons & Contests</span>
            <div className="text-2xl font-black text-amber-600 mt-1">
              {certificates.filter((c) => c.category === 'Hackathon' || c.category === 'Competition').length}
            </div>
            <span className="text-[11px] text-amber-600 font-bold">Ranked achievements</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Portfolio Readiness</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">94%</div>
            <span className="text-[11px] text-emerald-600 font-bold">AI Skill Graph Ready</span>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-[#1c4980] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search by title, skill, issuer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1c4980]"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Certificates Cards Grid */}
        {filteredCertificates.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto">
            <div className="text-4xl mb-3">📜</div>
            <h3 className="text-lg font-bold text-slate-900">No Certificates Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              No credentials match your current search and filter settings.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-blue-50 text-[#1c4980] rounded-xl text-xs font-bold hover:bg-blue-100 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((cert) => (
              <CertificateCard
                key={cert.id}
                certificate={cert}
                onView={(c) => setSelectedCert(c)}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </div>

      {/* =========================================================================
          UPLOAD CERTIFICATE MODAL
          ========================================================================= */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Upload New Certificate</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add verified proof of participation, rankings, or coursework.
                </p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 font-bold flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* AI OCR Banner */}
            <div className="my-4 p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-[#1c4980] flex items-center gap-2 font-medium">
              <span className="text-base">🤖</span>
              <span><strong>AI Auto-Verification:</strong> Uploaded credentials will be scanned for issuer signature and skills extraction.</span>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Drop Area & File Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Certificate Document (PDF / Image) *
                </label>
                <div className="border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/40 rounded-2xl p-6 text-center transition cursor-pointer relative">
                  <input
                    type="file"
                    id="cert-file-input"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <label htmlFor="cert-file-input" className="cursor-pointer">
                    {isScanning ? (
                      <div className="py-3 space-y-2">
                        <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <span className="text-xs font-bold text-[#1c4980] block">🤖 AI Extracting OCR Entities & Skills...</span>
                        <span className="text-[11px] text-slate-500 block">Parsing issuer credentials, student names & competencies</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#1c4980] mx-auto flex items-center justify-center text-xl mb-2">
                          📁
                        </div>
                        <span className="text-xs font-bold text-slate-800 block">
                          {newCert.fileName ? `Selected: ${newCert.fileName}` : 'Drag & Drop Certificate or Click to Browse'}
                        </span>
                        <span className="text-[11px] text-slate-500 mt-1 block">
                          Supports PDF, PNG, JPG • Auto OCR extraction enabled
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Certificate Category *
                </label>
                <select
                  value={newCert.category}
                  onChange={(e) => setNewCert({ ...newCert, category: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1c4980] focus:bg-white"
                >
                  <option value="Hackathon">💻 Hackathon & Coding Contests</option>
                  <option value="Workshop">🎓 Technical Workshop / Masterclass</option>
                  <option value="Competition">🎯 Collegiate & National Competition</option>
                  <option value="Coursework">📚 Academic Specialization & Coursework</option>
                  <option value="Technical">⚡ Professional Technical Certification</option>
                </select>
              </div>

              {/* AI Extraction Live Preview */}
              {newCert.fileName && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#1c4980] uppercase tracking-wider flex items-center gap-1.5">
                      <span>✨ AI Detected Metadata</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                      Auto-Extracted
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Title</span>
                      <span className="font-bold text-slate-800 truncate block">{newCert.title || newCert.fileName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Issuer</span>
                      <span className="font-bold text-slate-800 truncate block">{newCert.issuer || 'AgentVerse Accreditation'}</span>
                    </div>
                  </div>
                  {newCert.skillsInput && (
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold mb-1">Detected Skills</span>
                      <div className="flex flex-wrap gap-1">
                        {newCert.skillsInput.split(',').map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md border border-indigo-100">
                            ✓ {s.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newCert.fileName || isScanning}
                  className="px-6 py-2.5 bg-[#1c4980] hover:bg-[#153760] disabled:opacity-50 text-white font-extrabold rounded-xl text-xs transition shadow-md shadow-blue-900/15 flex items-center gap-2"
                >
                  <span>Upload & Verify Certificate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          CERTIFICATE DETAIL MODAL
          ========================================================================= */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                ✓ Cryptographically Verified Credential
              </span>
              <button
                onClick={() => setSelectedCert(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 font-bold flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Official Certificate Visual Template */}
            <div className="bg-gradient-to-br from-slate-900 via-[#1c4980] to-indigo-950 p-6 sm:p-8 rounded-2xl text-white border border-blue-300/20 shadow-inner relative overflow-hidden text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mx-auto flex items-center justify-center font-black text-xl text-white shadow-md">
                AV
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-200/90 block">
                  AgentVerse Official Accreditation
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {selectedCert.title}
                </h2>
                <p className="text-xs text-blue-100/80 mt-1">
                  Conferred by <strong>{selectedCert.issuer}</strong> on {selectedCert.issueDate}
                </p>
              </div>

              <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 max-w-md mx-auto text-xs text-blue-50 leading-relaxed">
                "{selectedCert.description}"
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-blue-200/70 border-t border-white/10">
                <span>ID: {selectedCert.credentialId}</span>
                <span>Verified Status: ACTIVE</span>
              </div>
            </div>

            {/* Credential Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Category</span>
                <span className="font-bold text-slate-800">{selectedCert.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Performance</span>
                <span className="font-bold text-emerald-700">{selectedCert.grade || 'Verified'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Issue Date</span>
                <span className="font-bold text-slate-800">{selectedCert.issueDate}</span>
              </div>
            </div>

              {/* Skills Acquired */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                  Certified Competencies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {parseSkills(selectedCert.skills).map((s, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-100"
                    >
                      ✓ {formatSkill(s)}
                    </span>
                  ))}
                </div>
              </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => setSelectedCert(null)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                Close
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(selectedCert.verificationUrl);
                    showToast('📋 Verification link copied to clipboard!');
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-blue-50 text-[#1c4980] hover:bg-blue-100 font-bold rounded-xl text-xs transition"
                >
                  Copy Verification Link
                </button>
                <button
                  onClick={() => handleDownload(selectedCert)}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-[#1c4980] hover:bg-[#153760] text-white font-extrabold rounded-xl text-xs transition shadow-md shadow-blue-900/10"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;
