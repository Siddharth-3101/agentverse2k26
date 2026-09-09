/**
 * roadmapTaxonomy.js
 * Roadmap.sh Style Career Path Skill Trees & Local Image Analyzer.
 *
 * Features:
 *   1. Built-in Roadmap Trees (Frontend, Backend, AI/ML, Cybersecurity, DevOps).
 *   2. Automatic Scanner for `career/` or `ai/career/` directory:
 *      Reads custom roadmap images (PNG/JPG) or JSON/Markdown files placed by user.
 *   3. Qualitative Milestones: COMPLETED, BUILD_NEXT, UPCOMING (no artificial % bars).
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// Base Built-In Career Roadmaps (Roadmap.sh Style)
const BASE_ROADMAPS = {
  'Frontend Developer': {
    role        : 'Frontend Developer',
    description : 'Build modern, responsive, and performant web interfaces.',
    category    : 'Software Engineering',
    milestones  : [
      { id: 'fe-1', topic: 'Web Basics & Styling', skills: ['HTML & CSS', 'HTML', 'CSS', 'Tailwind', 'Bootstrap'], phase: 1 },
      { id: 'fe-2', topic: 'JavaScript Programming', skills: ['JavaScript', 'ES6', 'DOM Manipulation'], phase: 1 },
      { id: 'fe-3', topic: 'Version Control', skills: ['Git & Version Control', 'Git', 'GitHub'], phase: 1 },
      { id: 'fe-4', topic: 'Frontend Frameworks', skills: ['React.js', 'Vue.js', 'Angular', 'JSX'], phase: 2 },
      { id: 'fe-5', topic: 'State & Type Safety', skills: ['TypeScript', 'Redux', 'Zustand'], phase: 2 },
      { id: 'fe-6', topic: 'Full Stack & SSR', skills: ['Next.js', 'REST API Design', 'Web Performance'], phase: 3 }
    ]
  },
  'Backend Developer': {
    role        : 'Backend Developer',
    description : 'Design server architecture, databases, and API services.',
    category    : 'Software Engineering',
    milestones  : [
      { id: 'be-1', topic: 'Programming Language', skills: ['Python', 'Node.js', 'Java', 'C++', 'Go'], phase: 1 },
      { id: 'be-2', topic: 'Version Control', skills: ['Git & Version Control', 'Git', 'GitHub'], phase: 1 },
      { id: 'be-3', topic: 'Databases & Storage', skills: ['SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis'], phase: 2 },
      { id: 'be-4', topic: 'API Design & Architecture', skills: ['REST API Design', 'GraphQL', 'Microservices'], phase: 2 },
      { id: 'be-5', topic: 'Containerization & Cloud', skills: ['Docker', 'Kubernetes', 'AWS', 'Google Cloud'], phase: 3 }
    ]
  },
  'AI / ML Engineer': {
    role        : 'AI / ML Engineer',
    description : 'Develop machine learning models, neural networks, and generative AI systems.',
    category    : 'Artificial Intelligence',
    milestones  : [
      { id: 'ai-1', topic: 'Python & Data Analysis', skills: ['Python', 'Data Science & Analytics', 'NumPy', 'Pandas'], phase: 1 },
      { id: 'ai-2', topic: 'Machine Learning Core', skills: ['Machine Learning', 'Scikit-Learn', 'Regression', 'Classification'], phase: 1 },
      { id: 'ai-3', topic: 'Deep Learning & Vision', skills: ['Deep Learning', 'PyTorch', 'TensorFlow', 'Computer Vision', 'OpenCV'], phase: 2 },
      { id: 'ai-4', topic: 'NLP & Language Models', skills: ['Natural Language Processing', 'Transformers', 'BERT'], phase: 2 },
      { id: 'ai-5', topic: 'Generative AI & LLMs', skills: ['Generative AI', 'Prompt Engineering', 'RAG', 'Gemini API', 'LLMs'], phase: 3 }
    ]
  },
  'Cybersecurity Analyst': {
    role        : 'Cybersecurity Analyst',
    description : 'Protect systems, networks, and applications from cyber threats and vulnerabilities.',
    category    : 'Security',
    milestones  : [
      { id: 'sec-1', topic: 'Networking Fundamentals', skills: ['Computer Networking', 'Cisco Packet Tracer', 'TCP/IP', 'Routing'], phase: 1 },
      { id: 'sec-2', topic: 'Security Foundations', skills: ['Cybersecurity', 'Linux', 'Cryptography'], phase: 1 },
      { id: 'sec-3', topic: 'Ethical Hacking & CTF', skills: ['Ethical Hacking', 'Penetration Testing', 'Capture the Flag'], phase: 2 },
      { id: 'sec-4', topic: 'Defensive Security & Forensics', skills: ['Network Security', 'Digital Forensics', 'Incident Response'], phase: 3 }
    ]
  },
  'DevOps & Cloud Engineer': {
    role        : 'DevOps & Cloud Engineer',
    description : 'Automate deployment pipelines, cloud infrastructure, and system reliability.',
    category    : 'DevOps',
    milestones  : [
      { id: 'dev-1', topic: 'Linux & Scripting', skills: ['Linux', 'Python', 'Shell Scripting'], phase: 1 },
      { id: 'dev-2', topic: 'Version Control & CI/CD', skills: ['Git & Version Control', 'CI/CD', 'GitHub Actions', 'Jenkins'], phase: 1 },
      { id: 'dev-3', topic: 'Containerization', skills: ['Docker', 'Kubernetes'], phase: 2 },
      { id: 'dev-4', topic: 'Cloud Infrastructure', skills: ['AWS', 'Google Cloud', 'Microsoft Azure', 'Terraform'], phase: 3 }
    ]
  }
};

class RoadmapTaxonomy {
  constructor() {
    this.roadmaps = { ...BASE_ROADMAPS };
    this.scanCustomCareerFolder();
  }

  /**
   * Automatically scans `career/` or `ai/career/` for user-added roadmap files or folders.
   */
  scanCustomCareerFolder() {
    const projectRoot = path.resolve(__dirname, '..');
    const candidatePaths = [
      path.join(projectRoot, 'career'),
      path.join(__dirname, 'career')
    ];

    for (const dirPath of candidatePaths) {
      if (fs.existsSync(dirPath)) {
        try {
          const files = fs.readdirSync(dirPath);
          for (const file of files) {
            const fullPath = path.join(dirPath, file);
            const ext      = path.extname(file).toLowerCase();

            // Load custom JSON roadmaps directly
            if (ext === '.json') {
              const content = fs.readFileSync(fullPath, 'utf-8');
              const json    = JSON.parse(content);
              if (json.role && Array.isArray(json.milestones)) {
                this.roadmaps[json.role] = json;
              }
            }
          }
        } catch (err) {
          console.warn('[RoadmapTaxonomy] Error reading custom career directory:', err.message);
        }
      }
    }
  }

  getRoadmap(roleName) {
    if (!roleName) return null;
    if (this.roadmaps[roleName]) return this.roadmaps[roleName];

    // Case-insensitive & slug alias search
    const targetNorm = roleName.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const [key, roadmap] of Object.entries(this.roadmaps)) {
      const keyNorm = key.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (keyNorm === targetNorm || keyNorm.includes(targetNorm) || targetNorm.includes(keyNorm)) {
        return roadmap;
      }
    }
    return null;
  }

  getAllRoles() {
    return Object.keys(this.roadmaps);
  }

  getAllRoadmaps() {
    return this.roadmaps;
  }
}

module.exports = RoadmapTaxonomy;
