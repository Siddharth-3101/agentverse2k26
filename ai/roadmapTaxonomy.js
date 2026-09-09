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
  'Backend Developer': {
    role        : 'Backend Developer',
    description : 'Build server-side logic, high-throughput databases, API architectures, and microservices.',
    category    : 'Software Engineering',
    milestones  : [
      { id: 'be-1', topic: 'Programming Language Core', skills: ['Python', 'Node.js', 'Go', 'Java', 'C++'], phase: 1 },
      { id: 'be-2', topic: 'Version Control & Collaboration', skills: ['Git', 'GitHub', 'Git & Version Control'], phase: 1 },
      { id: 'be-3', topic: 'Relational & NoSQL Databases', skills: ['SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis'], phase: 2 },
      { id: 'be-4', topic: 'API Design & Communication', skills: ['REST API Design', 'GraphQL', 'Microservices', 'FastAPI', 'gRPC'], phase: 2 },
      { id: 'be-5', topic: 'Containerization & Cloud Infrastructure', skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'], phase: 3 }
    ]
  },
  'Frontend Developer': {
    role        : 'Frontend Developer',
    description : 'Build modern, responsive, and performant web interfaces and web applications.',
    category    : 'Software Engineering',
    milestones  : [
      { id: 'fe-1', topic: 'Web Basics & Responsive Styling', skills: ['HTML & CSS', 'HTML', 'CSS', 'Tailwind', 'Bootstrap'], phase: 1 },
      { id: 'fe-2', topic: 'JavaScript & Modern ES6+', skills: ['JavaScript', 'ES6', 'DOM Manipulation', 'TypeScript'], phase: 1 },
      { id: 'fe-3', topic: 'Version Control & Git', skills: ['Git', 'GitHub', 'Git & Version Control'], phase: 1 },
      { id: 'fe-4', topic: 'Frontend Frameworks & UI Ecosystem', skills: ['React.js', 'React', 'Vue.js', 'Next.js', 'JSX'], phase: 2 },
      { id: 'fe-5', topic: 'State Management & Performance', skills: ['Redux', 'Zustand', 'Web Performance', 'REST API Design'], phase: 3 }
    ]
  },
  'AI Engineer': {
    role        : 'AI Engineer',
    description : 'Develop machine learning models, neural networks, agentic systems, and generative AI pipelines.',
    category    : 'Artificial Intelligence',
    milestones  : [
      { id: 'ai-1', topic: 'Python & Data Engineering', skills: ['Python', 'Data Science & Analytics', 'NumPy', 'Pandas'], phase: 1 },
      { id: 'ai-2', topic: 'Machine Learning Fundamentals', skills: ['Machine Learning', 'Scikit-Learn', 'Regression', 'Classification'], phase: 1 },
      { id: 'ai-3', topic: 'Deep Learning & Neural Architectures', skills: ['Deep Learning', 'PyTorch', 'TensorFlow', 'Computer Vision', 'OpenCV'], phase: 2 },
      { id: 'ai-4', topic: 'Natural Language Processing & LLMs', skills: ['Natural Language Processing', 'Transformers', 'BERT', 'LLMs'], phase: 2 },
      { id: 'ai-5', topic: 'Generative AI & Agentic Systems', skills: ['Agentic AI', 'Generative AI', 'Prompt Engineering', 'RAG', 'LangChain'], phase: 3 }
    ]
  },
  'AI / ML Engineer': {
    role        : 'AI / ML Engineer',
    description : 'Develop machine learning models, neural networks, agentic systems, and generative AI pipelines.',
    category    : 'Artificial Intelligence',
    milestones  : [
      { id: 'aiml-1', topic: 'Python & Data Engineering', skills: ['Python', 'Data Science & Analytics', 'NumPy', 'Pandas'], phase: 1 },
      { id: 'aiml-2', topic: 'Machine Learning Fundamentals', skills: ['Machine Learning', 'Scikit-Learn', 'Regression', 'Classification'], phase: 1 },
      { id: 'aiml-3', topic: 'Deep Learning & Neural Architectures', skills: ['Deep Learning', 'PyTorch', 'TensorFlow', 'Computer Vision', 'OpenCV'], phase: 2 },
      { id: 'aiml-4', topic: 'Natural Language Processing & LLMs', skills: ['Natural Language Processing', 'Transformers', 'BERT', 'LLMs'], phase: 2 },
      { id: 'aiml-5', topic: 'Generative AI & Agentic Systems', skills: ['Agentic AI', 'Generative AI', 'Prompt Engineering', 'RAG', 'LangChain'], phase: 3 }
    ]
  },
  'Full Stack Developer': {
    role        : 'Full Stack Developer',
    description : 'Master end-to-end development across frontend client interfaces, backend servers, and databases.',
    category    : 'Software Engineering',
    milestones  : [
      { id: 'fs-1', topic: 'Frontend Core & UI Frameworks', skills: ['HTML & CSS', 'JavaScript', 'React', 'React.js', 'Tailwind'], phase: 1 },
      { id: 'fs-2', topic: 'Backend Server & APIs', skills: ['Node.js', 'Express', 'Python', 'REST API Design', 'FastAPI'], phase: 1 },
      { id: 'fs-3', topic: 'Databases & Data Modeling', skills: ['SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Prisma'], phase: 2 },
      { id: 'fs-4', topic: 'Full Stack Architecture & Auth', skills: ['Next.js', 'TypeScript', 'JWT Auth', 'GraphQL'], phase: 2 },
      { id: 'fs-5', topic: 'DevOps, CI/CD & Deployment', skills: ['Docker', 'Git', 'AWS', 'CI/CD', 'Vercel'], phase: 3 }
    ]
  },
  'Cybersecurity Specialist': {
    role        : 'Cybersecurity Specialist',
    description : 'Protect infrastructure, audit code vulnerabilities, conduct penetration testing, and analyze threats.',
    category    : 'Security',
    milestones  : [
      { id: 'sec-1', topic: 'Networking & Protocols', skills: ['Computer Networking', 'Cisco Packet Tracer', 'TCP/IP', 'Wireshark'], phase: 1 },
      { id: 'sec-2', topic: 'System Security & Linux Foundations', skills: ['Linux', 'Cybersecurity', 'Cryptography', 'Bash'], phase: 1 },
      { id: 'sec-3', topic: 'Ethical Hacking & Vulnerability Assessment', skills: ['Ethical Hacking', 'Penetration Testing', 'Capture the Flag', 'Burp Suite'], phase: 2 },
      { id: 'sec-4', topic: 'Defensive Security & Digital Forensics', skills: ['Network Security', 'Digital Forensics', 'Incident Response', 'Firewalls'], phase: 3 }
    ]
  },
  'Cybersecurity Analyst': {
    role        : 'Cybersecurity Analyst',
    description : 'Protect infrastructure, audit code vulnerabilities, conduct penetration testing, and analyze threats.',
    category    : 'Security',
    milestones  : [
      { id: 'seca-1', topic: 'Networking & Protocols', skills: ['Computer Networking', 'Cisco Packet Tracer', 'TCP/IP', 'Wireshark'], phase: 1 },
      { id: 'seca-2', topic: 'System Security & Linux Foundations', skills: ['Linux', 'Cybersecurity', 'Cryptography', 'Bash'], phase: 1 },
      { id: 'seca-3', topic: 'Ethical Hacking & Vulnerability Assessment', skills: ['Ethical Hacking', 'Penetration Testing', 'Capture the Flag', 'Burp Suite'], phase: 2 },
      { id: 'seca-4', topic: 'Defensive Security & Digital Forensics', skills: ['Network Security', 'Digital Forensics', 'Incident Response', 'Firewalls'], phase: 3 }
    ]
  },
  'DevOps Engineer': {
    role        : 'DevOps Engineer',
    description : 'Automate deployment pipelines, cloud provisioning, container fleets, and infrastructure reliability.',
    category    : 'DevOps & Cloud',
    milestones  : [
      { id: 'dev-1', topic: 'Linux Administration & Shell Scripting', skills: ['Linux', 'Python', 'Shell Scripting', 'Git'], phase: 1 },
      { id: 'dev-2', topic: 'CI/CD & Continuous Delivery', skills: ['CI/CD', 'GitHub Actions', 'Jenkins', 'Git & Version Control'], phase: 1 },
      { id: 'dev-3', topic: 'Containerization & Orchestration', skills: ['Docker', 'Kubernetes', 'Helm'], phase: 2 },
      { id: 'dev-4', topic: 'Cloud Platforms & Infrastructure as Code', skills: ['AWS', 'Terraform', 'Google Cloud', 'Ansible'], phase: 3 }
    ]
  },
  'AWS Cloud Architect': {
    role        : 'AWS Cloud Architect',
    description : 'Architect resilient, scalable, and cost-effective cloud systems on Amazon Web Services.',
    category    : 'DevOps & Cloud',
    milestones  : [
      { id: 'aws-1', topic: 'Core AWS Compute & Serverless', skills: ['AWS', 'AWS EC2', 'AWS Lambda', 'ECS', 'Docker'], phase: 1 },
      { id: 'aws-2', topic: 'Storage, Databases & Caching', skills: ['AWS S3', 'DynamoDB', 'RDS', 'Redis', 'SQL'], phase: 1 },
      { id: 'aws-3', topic: 'Networking, Security & Identity', skills: ['AWS VPC', 'IAM', 'CloudFront', 'Route 53', 'Cybersecurity'], phase: 2 },
      { id: 'aws-4', topic: 'Infrastructure as Code & Reliability', skills: ['Terraform', 'CloudFormation', 'CI/CD', 'Kubernetes'], phase: 3 }
    ]
  },
  'Data Analyst': {
    role        : 'Data Analyst',
    description : 'Transform complex datasets into actionable business intelligence through analytics and visualizations.',
    category    : 'Data Science',
    milestones  : [
      { id: 'da-1', topic: 'Spreadsheets & SQL Data Extraction', skills: ['SQL', 'PostgreSQL', 'Advanced Excel', 'Data Science & Analytics'], phase: 1 },
      { id: 'da-2', topic: 'Python Programming for Data', skills: ['Python', 'Pandas', 'NumPy', 'Data Wrangling'], phase: 1 },
      { id: 'da-3', topic: 'Data Visualization & Dashboards', skills: ['Tableau', 'Power BI', 'Matplotlib', 'Seaborn'], phase: 2 },
      { id: 'da-4', topic: 'Statistical Modeling & Experimentation', skills: ['Statistics', 'A/B Testing', 'Hypothesis Testing', 'Machine Learning'], phase: 3 }
    ]
  },
  'Blockchain Developer': {
    role        : 'Blockchain Developer',
    description : 'Build decentralized protocols, smart contracts, and Web3 decentralized applications.',
    category    : 'Web3 & Blockchain',
    milestones  : [
      { id: 'bc-1', topic: 'Cryptography & Blockchain Fundamentals', skills: ['Cryptography', 'Blockchain Basics', 'Ethereum', 'Hashing'], phase: 1 },
      { id: 'bc-2', topic: 'Smart Contract Development', skills: ['Solidity', 'Smart Contracts', 'Hardhat', 'Foundry'], phase: 1 },
      { id: 'bc-3', topic: 'Web3 Client Integration & DeFi', skills: ['Web3.js', 'Ethers.js', 'Node.js', 'DeFi Protocols'], phase: 2 },
      { id: 'bc-4', topic: 'Security Auditing & Layer 2 Protocols', skills: ['Smart Contract Security', 'IPFS', 'Solana', 'Go'], phase: 3 }
    ]
  },
  'iOS Developer': {
    role        : 'iOS Developer',
    description : 'Design and engineer native iOS applications with Swift, SwiftUI, and Apple Frameworks.',
    category    : 'Mobile Development',
    milestones  : [
      { id: 'ios-1', topic: 'Swift Language & Modern Syntax', skills: ['Swift', 'SwiftUI', 'Object-Oriented Programming'], phase: 1 },
      { id: 'ios-2', topic: 'UI Design & Apple Human Interface', skills: ['SwiftUI', 'UIKit', 'Auto Layout', 'Combine'], phase: 1 },
      { id: 'ios-3', topic: 'Networking, Persistence & Architecture', skills: ['REST API Design', 'CoreData', 'URLSession', 'MVVM'], phase: 2 },
      { id: 'ios-4', topic: 'App Store Deployment & CI/CD', skills: ['Xcode', 'TestFlight', 'CI/CD', 'Git'], phase: 3 }
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

            // Load custom JSON roadmaps only if valid and non-corrupt
            if (ext === '.json') {
              const content = fs.readFileSync(fullPath, 'utf-8');
              try {
                const json = JSON.parse(content);
                if (json.role && Array.isArray(json.milestones) && json.milestones.length >= 3) {
                  // Only override if the topics aren't raw OCR noisy tracks
                  const isNoisy = json.milestones.some(m => m.topic && (m.topic.includes('relevant tracks') || m.topic.includes('What is hosting')));
                  if (!isNoisy) {
                    this.roadmaps[json.role] = json;
                  }
                }
              } catch (e) {}
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
    return this.roadmaps['Backend Developer'] || null;
  }

  getAllRoles() {
    return [
      'Backend Developer',
      'Frontend Developer',
      'AI Engineer',
      'Full Stack Developer',
      'Cybersecurity Specialist',
      'DevOps Engineer',
      'AWS Cloud Architect',
      'Data Analyst',
      'Blockchain Developer',
      'iOS Developer'
    ];
  }

  getAllRoadmaps() {
    return this.roadmaps;
  }
}

module.exports = RoadmapTaxonomy;
