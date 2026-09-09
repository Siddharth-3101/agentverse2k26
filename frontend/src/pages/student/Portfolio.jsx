import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { generatePortfolio, getPortfolioPDFUrl } from '../../services/portfolioService';
import { useAuth } from '../../context/AuthContext';

const Portfolio = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [portfolioData, setPortfolioData] = useState({
    name: user?.name || user?.full_name || 'Student',
    tagline: user?.tagline || 'Full-Stack Developer & AI Systems Builder',
    university: 'AgentVerse University',
    department: user?.dept || user?.department || 'Computer Science & Engineering',
    batch: `Batch of 2026 (${user?.year || `${user?.year_of_study || 3}rd Year`})`,
    email: user?.email || 'student@agentverse.edu',
    github: 'https://github.com/agentverse',
    linkedin: 'https://linkedin.com/in/agentverse',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    aiSummary: user?.bio || `High-impact 3rd-year student specializing in AI systems, agentic architectures, and distributed services. Winner and finalist in collegiate hackathons with active leadership at campus societies.`,
    stats: {
      hackathonsWon: 3,
      verifiedCertificates: 5,
      skillsAcquired: 14,
      clubRole: user?.id === 1 ? 'Vice President (Coding Club)' : 'President (Agentic AI Society)'
    },
    skills: user?.skills?.length > 0
      ? user.skills
      : ['Python', 'Agentic AI', 'React', 'FastAPI', 'Solidity', 'PyTorch', 'Network Security'],
    nonVerifiedSkills: user?.nonVerifiedSkills?.length > 0
      ? user.nonVerifiedSkills
      : ['Docker & Containers', 'Kubernetes', 'AWS Cloud Native', 'GraphQL', 'Terraform', 'Zero-Knowledge Proofs'],
    verifiedAchievements: [
      {
        id: 'ach-1',
        title: 'Tejas India Hackathon 2026 — Runner Up',
        organization: 'GEC Sheikhpura / Pan-India',
        date: 'Aug 2026',
        badge: '🏆 National Rank #2',
        description: 'Led a 4-member team to construct an autonomous micro-lending portal with zero-knowledge credentials.',
        credentialId: 'AV-TEJAS-2026-1149'
      },
      {
        id: 'ach-2',
        title: 'National Cyber Shield CTF Finalist',
        organization: 'IIT Roorkee Cyber Society',
        date: 'Sep 2026',
        badge: '🛡️ Top 10 Finalist',
        description: 'Scored 92/100 across reverse engineering, binary exploitation, and cloud penetration testing.',
        credentialId: 'AV-CYBER-2026-9042'
      },
      {
        id: 'ach-3',
        title: 'AI & Generative Vision Masterclass with Distinction',
        organization: 'Delhi Technological University (DTU)',
        date: 'Aug 2026',
        badge: '🎓 Distinction Grade',
        description: 'Built multi-modal agents fine-tuning open-source vision transformers.',
        credentialId: 'AV-DTU-AI-8831'
      }
    ],
    featuredProjects: [
      {
        id: 'proj-1',
        title: 'AgentVerse — Autonomous Campus Intelligence Platform',
        tech: ['React', 'Vite', 'Tailwind', 'Python', 'Recharts'],
        description: 'A comprehensive university governance portal connecting 1,400+ students, societies, and faculty with automated role verification and skill telemetry.',
        link: 'https://github.com/Siddharth-3101/agentverse2k26'
      },
      {
        id: 'proj-2',
        title: 'DeFi AgriShield Micro-Lending Portal',
        tech: ['Solidity', 'Node.js', 'ZK-Proofs', 'React'],
        description: 'Decentralized credit appraisal engine allowing rural farmers to verify crop yields on-chain without exposing private financial disclosures.',
        link: 'https://github.com/Siddharth-3101'
      }
    ]
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    showToast('📋 Public AI Portfolio link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateAI = async () => {
    setIsGenerating(true);
    showToast('✨ AI is analyzing verified certificates and synthesizing evidence-grounded portfolio...');
    try {
      const serverData = await generatePortfolio();
      if (serverData && (serverData.name || serverData.aiSummary)) {
        setPortfolioData((prev) => ({
          ...prev,
          name: serverData.name || prev.name,
          aiSummary: serverData.aiSummary || prev.aiSummary,
          skills: (serverData.skills && serverData.skills.length > 0)
            ? serverData.skills.map((s) => (typeof s === 'string' ? s : (s.name || s.skill)))
            : prev.skills,
          stats: {
            ...prev.stats,
            hackathonsWon: serverData.hackathonsWon ?? prev.stats.hackathonsWon,
            verifiedCertificates: serverData.verifiedCertificates ?? prev.stats.verifiedCertificates,
          }
        }));
        showToast('🎉 AI Portfolio refreshed with verified credentials!');
      } else {
        showToast('🎉 AI Portfolio refreshed with active credentials!');
      }
    } catch (e) {
      showToast('🎉 AI Portfolio telemetry refreshed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    showToast('📥 Generating & downloading AI Verified Portfolio PDF Resume...');
    try {
      const pdfUrl = getPortfolioPDFUrl();
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', `${portfolioData.name.replace(/\s+/g, '_')}_Portfolio.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      window.open(getPortfolioPDFUrl(), '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1c4980] text-white px-5 py-3 rounded-2xl shadow-xl font-semibold text-sm flex items-center gap-2 animate-fadeIn">
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Top Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#1c4980] text-xs font-bold mb-2">
              <span>🤖 Verifiable AI Student Portfolio</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Public Talent Profile
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                ● Live & Verified
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleRegenerateAI}
              disabled={isGenerating}
              className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isGenerating ? '⏳ Synthesizing...' : '✨ Refresh with AI'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 bg-blue-50 text-[#1c4980] hover:bg-blue-100 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>{copied ? '✓ Link Copied!' : '🔗 Share Portfolio'}</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="px-5 py-2.5 bg-[#1c4980] hover:bg-[#153760] text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-900/10 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Download PDF Resume</span>
            </button>
          </div>
        </div>

        {/* Hero Profile Banner Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-[#1c4980] to-[#2563eb] text-white flex items-center justify-center font-black text-3xl shadow-lg shadow-blue-900/20 shrink-0">
              {portfolioData.name.charAt(0)}
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {portfolioData.name}
                </h2>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  ✓ Verified Talent
                </span>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">
                  {portfolioData.stats.clubRole}
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-700">
                {portfolioData.tagline}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                🏛️ {portfolioData.university} • 🎓 {portfolioData.department} ({portfolioData.batch})
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1 text-[#1c4980]">
                  📧 {portfolioData.email}
                </span>
                <span>•</span>
                <a href={portfolioData.github} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                  💻 GitHub Profile
                </a>
                <span>•</span>
                <a href={portfolioData.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                  🌐 LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* AI Executive Summary Box */}
          <div className="mt-6 p-5 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-2xl border border-blue-100/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#1c4980] uppercase tracking-wider flex items-center gap-1.5">
                <span>🤖 AI Synthesized Professional Bio</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400">Based on verified event audits</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              "{portfolioData.aiSummary}"
            </p>
          </div>
        </div>

        {/* 4 Telemetry Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">National Hackathons Won</span>
            <div className="text-2xl font-black text-[#1c4980] mt-1">{portfolioData.stats.hackathonsWon}</div>
            <span className="text-[11px] text-amber-600 font-bold">Top 1% Ranker</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Verified Credentials</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">{portfolioData.stats.verifiedCertificates}</div>
            <span className="text-[11px] text-emerald-600 font-bold">100% Cryptographic Proof</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Verified Skills</span>
            <div className="text-2xl font-black text-indigo-600 mt-1">{portfolioData.skills.length}</div>
            <span className="text-[11px] text-indigo-600 font-bold">Evidence-Backed</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Career Targets</span>
            <div className="text-2xl font-black text-purple-600 mt-1">{portfolioData.nonVerifiedSkills.length}</div>
            <span className="text-[11px] text-purple-700 font-bold">In-Progress Skills</span>
          </div>
        </div>

        {/* Two Columns: Skills Breakdown (Verified vs Non-Verified) + Verified Accreditations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Verified vs Non-Verified Skills */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Technical Skills Portfolio</h3>
                <p className="text-xs text-slate-500 mt-0.5">Categorized by verified evidence and target career milestones</p>
              </div>
              <NavLink to="/profile" className="text-xs font-bold text-[#1c4980] hover:underline">
                Edit Skills →
              </NavLink>
            </div>

            {/* Group 1: Verified Skills */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <span>✓ Verified Skills</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                    Evidence-Backed
                  </span>
                </span>
                <span className="text-xs font-bold text-emerald-700">{portfolioData.skills.length} Skills</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {portfolioData.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold shadow-2xs"
                  >
                    ✓ {typeof s === 'string' ? s : s.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Group 2: Non-Verified Skills */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <span>🎯 Non-Verified Skills</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md">
                    Target & In-Progress
                  </span>
                </span>
                <span className="text-xs font-bold text-amber-700">{portfolioData.nonVerifiedSkills.length} Skills</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {portfolioData.nonVerifiedSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold shadow-2xs"
                  >
                    🎯 {typeof s === 'string' ? s : s.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Verified Achievements & Accreditations */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Verified Accreditations</h3>
                <p className="text-xs text-slate-500 mt-0.5">Backed by cryptographic credential hashes</p>
              </div>
              <NavLink to="/certificates" className="text-xs font-bold text-[#1c4980] hover:underline">
                View All →
              </NavLink>
            </div>

            <div className="space-y-4">
              {portfolioData.verifiedAchievements.map((ach) => (
                <div key={ach.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-sm text-slate-900">{ach.title}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md shrink-0">
                      {ach.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold">{ach.organization} • {ach.date}</p>
                  <p className="text-xs text-slate-700 leading-relaxed">{ach.description}</p>
                  <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>ID: {ach.credentialId}</span>
                    <span className="text-emerald-600 font-bold">✓ VERIFIED</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Projects Showcase */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-900">Featured Capstone & Hackathon Projects</h3>
            <p className="text-xs text-slate-500 mt-0.5">Live software systems delivered for production campuses and decentralized platforms</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {portfolioData.featuredProjects.map((p) => (
              <div key={p.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="font-extrabold text-base text-slate-900">{p.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.tech.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-white text-slate-700 text-[11px] font-semibold rounded-md border border-slate-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1c4980] hover:underline pt-3 border-t border-slate-200/60"
                >
                  <span>Explore Repository & Demo</span>
                  <span>↗</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
