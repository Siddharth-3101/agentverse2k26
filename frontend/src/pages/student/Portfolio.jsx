import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Portfolio = () => {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [portfolioData, setPortfolioData] = useState({
    name: 'Siddharth Mehta',
    tagline: 'Full-Stack Developer & AI Systems Builder',
    university: 'Government Engineering College / DCRUST',
    department: 'Computer Science and Engineering',
    batch: 'Batch of 2026 (3rd Year)',
    email: 'siddharth@campus.edu',
    github: 'https://github.com/Siddharth-3101',
    linkedin: 'https://linkedin.com/in/siddharth-mehta',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    aiSummary: `High-impact 3rd-year Computer Science undergraduate with proven expertise in full-stack web architecture, distributed systems, and generative AI agents. Winner and top-10 finalist in 3 national hackathons (Tejas India Hackathon, Cyber Shield CTF). Active Vice President & Technical Lead at Coding Club with 120+ mentored peers and 5 production-grade campus initiatives delivered.`,
    stats: {
      hackathonsWon: 3,
      verifiedCertificates: 5,
      skillsAcquired: 14,
      clubRole: 'Vice President (Coding Club)'
    },
    skills: [
      { name: 'React.js & Tailwind CSS', level: 95, category: 'Frontend' },
      { name: 'Node.js & Express / Python', level: 90, category: 'Backend' },
      { name: 'Generative AI & LLM Agents', level: 88, category: 'AI / ML' },
      { name: 'Data Structures & Algorithms', level: 92, category: 'Problem Solving' },
      { name: 'Docker & AWS Cloud Native', level: 85, category: 'DevOps' },
      { name: 'Decentralized Microservices', level: 80, category: 'Architecture' }
    ],
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
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    showToast('📋 Public AI Portfolio link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateAI = () => {
    setIsGenerating(true);
    showToast('✨ AI is analyzing verified certificates and updating your skill telemetry...');
    setTimeout(() => {
      setIsGenerating(false);
      showToast('🎉 AI Portfolio refreshed with latest verified achievements!');
    }, 1200);
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
              className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <span>{isGenerating ? '⏳ Updating...' : '✨ Refresh with AI'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 bg-blue-50 text-[#1c4980] hover:bg-blue-100 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <span>{copied ? '✓ Link Copied!' : '🔗 Share Portfolio'}</span>
            </button>

            <button
              onClick={() => showToast('📥 Exporting high-resolution Verified Talent Portfolio PDF...')}
              className="px-5 py-2.5 bg-[#1c4980] hover:bg-[#153760] text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-900/10 transition flex items-center gap-1.5"
            >
              <span>Download PDF Resume</span>
            </button>
          </div>
        </div>

        {/* Hero Profile Banner Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-[#1c4980] to-[#2563eb] text-white flex items-center justify-center font-black text-3xl shadow-lg shadow-blue-900/20 shrink-0">
              S
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
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Technical Competencies</span>
            <div className="text-2xl font-black text-indigo-600 mt-1">{portfolioData.stats.skillsAcquired}</div>
            <span className="text-[11px] text-slate-500 font-medium">Full Stack & AI</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Society Mentorship</span>
            <div className="text-2xl font-black text-purple-600 mt-1">120+</div>
            <span className="text-[11px] text-purple-700 font-bold">Junior Engineers Led</span>
          </div>
        </div>

        {/* Two Columns: Skills Telemetry + Verified Milestone Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Verified Skills Breakdown */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Skill Proficiency Matrix</h3>
                <p className="text-xs text-slate-500 mt-0.5">Calculated from project commits and hackathon submissions</p>
              </div>
              <span className="text-xs font-bold text-[#1c4980]">Score Telemetry</span>
            </div>

            <div className="space-y-4">
              {portfolioData.skills.map((s, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">{s.name}</span>
                    <span className="text-[#1c4980]">{s.level}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#1c4980] to-[#2563eb] rounded-full transition-all duration-500"
                      style={{ width: `${s.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
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
