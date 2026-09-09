/**
 * SkillExtractionService.js
 * Independent Rule-Based Skill Taxonomy & AI Inference Engine.
 *
 * Maintains a comprehensive multi-domain skills taxonomy dataset:
 *  - Software & Web Development
 *  - Mobile Development
 *  - Artificial Intelligence & Data Science
 *  - Cybersecurity & Networks
 *  - Cloud, DevOps & Infrastructure
 *  - Embedded Systems, IoT & Hardware
 *  - Electrical, Electronics & VLSI
 *  - Mechanical, CAD & Robotics
 *  - Civil & Environmental Engineering
 *  - Business, Finance & FinTech
 *  - Marketing, Media & Design
 *  - Soft Skills, Leadership & Event Management
 *
 * Skill Inference Rules:
 *  1. Text keyword extraction from certificate & event content.
 *  2. Domain taxonomy mapping.
 *  3. Fallback domain inference based on event name and category.
 */

'use strict';

class SkillExtractionService {
  constructor() {
    // Multi-domain Skill Taxonomy Dataset
    this.skillTaxonomy = [
      // ── Programming Languages ───────────────────────────────────────────────
      { name: 'Python',         category: 'Programming Language', keywords: ['python', 'django', 'flask', 'fastapi', 'numpy', 'pandas', 'scikit-learn', 'pytorch', 'tensorflow'] },
      { name: 'JavaScript',     category: 'Programming Language', keywords: ['javascript', 'js', 'es6', 'ecmascript', 'typescript'] },
      { name: 'TypeScript',     category: 'Programming Language', keywords: ['typescript', 'ts'] },
      { name: 'Java',           category: 'Programming Language', keywords: ['java', 'spring', 'springboot', 'jvm'] },
      { name: 'C++',            category: 'Programming Language', keywords: ['c++', 'cpp', 'stl'] },
      { name: 'C',              category: 'Programming Language', keywords: [' c language', 'c programming', 'ansi c', 'embedded c'] },
      { name: 'Rust',           category: 'Programming Language', keywords: ['rust', 'rustlang'] },
      { name: 'Go',             category: 'Programming Language', keywords: ['golang', 'go language'] },
      { name: 'Kotlin',         category: 'Programming Language', keywords: ['kotlin', 'android studio'] },
      { name: 'Swift',          category: 'Programming Language', keywords: ['swift', 'xcode', 'ios development'] },
      { name: 'R',              category: 'Programming Language', keywords: [' r programming', 'rstudio', 'tidyverse'] },
      { name: 'MATLAB',         category: 'Programming Language', keywords: ['matlab', 'simulink'] },

      // ── Web Development ─────────────────────────────────────────────────────
      { name: 'React.js',       category: 'Frontend Development', keywords: ['react', 'react.js', 'reactjs', 'redux', 'jsx'] },
      { name: 'Next.js',        category: 'Frontend Development', keywords: ['next.js', 'nextjs', 'ssr'] },
      { name: 'Node.js',        category: 'Backend Development',  keywords: ['node.js', 'nodejs', 'express', 'nestjs'] },
      { name: 'HTML & CSS',     category: 'Frontend Development', keywords: ['html', 'css', 'tailwind', 'bootstrap', 'sass', 'scss'] },
      { name: 'Vue.js',         category: 'Frontend Development', keywords: ['vue', 'vue.js', 'vuejs', 'nuxt'] },
      { name: 'Angular',        category: 'Frontend Development', keywords: ['angular', 'angularjs'] },
      { name: 'REST API Design', category: 'Software Architecture', keywords: ['rest api', 'restful', 'api design', 'graphql', 'web services'] },

      // ── Mobile Development ──────────────────────────────────────────────────
      { name: 'Android Development', category: 'Mobile Development', keywords: ['android', 'apk', 'jetpack compose', 'kotlin android'] },
      { name: 'iOS Development',     category: 'Mobile Development', keywords: ['ios', 'swiftui', 'cocoapods', 'xcode'] },
      { name: 'Flutter',             category: 'Mobile Development', keywords: ['flutter', 'dart', 'cross-platform mobile'] },
      { name: 'React Native',        category: 'Mobile Development', keywords: ['react native', 'expo'] },

      // ── Databases ───────────────────────────────────────────────────────────
      { name: 'SQL',            category: 'Database', keywords: ['sql', 'mysql', 'postgresql', 'sqlite', 'oracle'] },
      { name: 'MongoDB',        category: 'Database', keywords: ['mongodb', 'nosql', 'mongoose'] },
      { name: 'Redis',          category: 'Database', keywords: ['redis', 'caching'] },
      { name: 'Firebase',       category: 'Database & Cloud', keywords: ['firebase', 'firestore', 'realtime database'] },

      // ── AI & Machine Learning ───────────────────────────────────────────────
      { name: 'Machine Learning',   category: 'Artificial Intelligence', keywords: ['machine learning', 'ml', 'scikit-learn', 'tensorflow', 'pytorch', 'xgboost'] },
      { name: 'Deep Learning',      category: 'Artificial Intelligence', keywords: ['deep learning', 'neural network', 'cnn', 'rnn', 'lstm', 'transformer', 'bert', 'gpt'] },
      { name: 'Generative AI',      category: 'Artificial Intelligence', keywords: ['generative ai', 'genai', 'llm', 'large language model', 'prompt engineering', 'gemini', 'openai', 'fine-tuning'] },
      { name: 'Computer Vision',    category: 'Artificial Intelligence', keywords: ['computer vision', 'opencv', 'image recognition', 'object detection', 'yolo'] },
      { name: 'Natural Language Processing', category: 'Artificial Intelligence', keywords: ['nlp', 'natural language processing', 'text classification', 'sentiment analysis'] },
      { name: 'Data Science & Analytics', category: 'Data Science', keywords: ['data science', 'data analysis', 'data analytics', 'pandas', 'numpy', 'matplotlib', 'power bi', 'tableau'] },

      // ── Cloud, DevOps & Infrastructure ──────────────────────────────────────
      { name: 'AWS',                category: 'Cloud Computing', keywords: ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'aws academy', 'aws certified'] },
      { name: 'Google Cloud',       category: 'Cloud Computing', keywords: ['google cloud', 'gcp', 'bigquery', 'cloud run', 'vertex ai', 'google cloud certified'] },
      { name: 'Microsoft Azure',    category: 'Cloud Computing', keywords: ['azure', 'microsoft azure', 'azure certified'] },
      { name: 'Docker',             category: 'DevOps',          keywords: ['docker', 'container', 'containerization'] },
      { name: 'Kubernetes',         category: 'DevOps',          keywords: ['kubernetes', 'k8s', 'orchestration'] },
      { name: 'CI/CD',              category: 'DevOps',          keywords: ['ci/cd', 'continuous integration', 'github actions', 'jenkins', 'devops pipeline'] },
      { name: 'Git & Version Control', category: 'DevOps',       keywords: ['git', 'github', 'gitlab', 'version control', 'source control'] },

      // ── Cybersecurity & Networking ──────────────────────────────────────────
      { name: 'Cybersecurity',      category: 'Security', keywords: ['cybersecurity', 'cyber security', 'ethical hacking', 'penetration testing', 'network security', 'ctf', 'capture the flag', 'reverse engineering', 'binary exploitation', 'digital forensics', 'cryptography'] },
      { name: 'Computer Networking', category: 'Networking', keywords: ['networking', 'cisco', 'packet tracer', 'ccna', 'tcp/ip', 'routing', 'switching', 'network simulation'] },
      { name: 'Cisco Packet Tracer', category: 'Networking', keywords: ['packet tracer', 'cisco packet tracer'] },

      // ── Hardware, IoT & Core Engineering ─────────────────────────────────────
      { name: 'Embedded Systems & IoT', category: 'Hardware & IoT', keywords: ['embedded', 'iot', 'internet of things', 'arduino', 'raspberry pi', 'esp32', 'microcontroller', 'sensors'] },
      { name: 'VLSI & Digital Electronics', category: 'Core Engineering', keywords: ['vlsi', 'verilog', 'vhdl', 'fpga', 'digital electronics', 'cadence', 'circuit design'] },
      { name: 'CAD & 3D Modeling',  category: 'Core Engineering', keywords: ['autocad', 'solidworks', 'cad', '3d modeling', 'catia', 'fusion 360', 'ansys'] },
      { name: 'Robotics',           category: 'Core Engineering', keywords: ['robotics', 'ros', 'robot operating system', 'mechatronics', 'kinematics'] },

      // ── Business, Finance & Management ──────────────────────────────────────
      { name: 'FinTech & Financial Analysis', category: 'Finance', keywords: ['fintech', 'financial modeling', 'stock trading', 'blockchain', 'smart contracts', 'crypto', 'banking'] },
      { name: 'Project Management & Agile', category: 'Management', keywords: ['project management', 'agile', 'scrum', 'jira', 'trello', 'pmp', 'sprint planning'] },
      { name: 'Product Management',  category: 'Management', keywords: ['product management', 'product strategy', 'wireframing', 'user stories', 'roadmap'] },

      // ── Design & Digital Media ──────────────────────────────────────────────
      { name: 'UI/UX Design',       category: 'Design', keywords: ['ui/ux', 'user interface', 'user experience', 'figma', 'design thinking', 'wireframing', 'adobe xd'] },
      { name: 'Graphic Design & Video Editing', category: 'Media & Design', keywords: ['photoshop', 'illustrator', 'after effects', 'video editing', 'premiere pro', 'graphic design', 'canva'] },

      // ── Algorithms & Computer Science ───────────────────────────────────────
      { name: 'Data Structures & Algorithms', category: 'Computer Science', keywords: ['data structures', 'algorithms', 'dsa', 'competitive programming', 'dynamic programming', 'graph algorithms', 'segment tree'] },

      // ── Soft Skills, Leadership & Communication ──────────────────────────────
      { name: 'Problem Solving',    category: 'Soft Skill',   keywords: ['problem solving', 'problem-solving', 'critical thinking', 'debugging', 'troubleshooting', 'hackathon', 'competition'] },
      { name: 'Teamwork & Collaboration', category: 'Soft Skill', keywords: ['teamwork', 'team collaboration', 'collaborative', 'group project', 'team project'] },
      { name: 'Leadership',         category: 'Leadership',   keywords: ['leadership', 'team lead', 'president', 'vice president', 'coordinator', 'organizer', 'captain'] },
      { name: 'Public Speaking & Pitching', category: 'Communication', keywords: ['presentation', 'public speaking', 'pitch', 'keynote', 'speaker', 'communication skills'] },
      { name: 'Event Management',   category: 'Management',   keywords: ['event management', 'event organizer', 'organized', 'coordinated event', 'managed event'] },
      { name: 'Research & Technical Writing', category: 'Academic', keywords: ['research', 'research paper', 'publication', 'journal', 'academic paper', 'thesis', 'technical writing'] }
    ];

    // Category & Event Domain Inference Defaults
    this.categoryDefaults = {
      'Hackathon'    : [
        { name: 'Problem Solving', category: 'Soft Skill', confidence: 0.72, evidence: 'category-inferred: hackathon participation' },
        { name: 'Teamwork & Collaboration', category: 'Soft Skill', confidence: 0.70, evidence: 'category-inferred: hackathon team project' }
      ],
      'Competition'  : [
        { name: 'Problem Solving', category: 'Soft Skill', confidence: 0.72, evidence: 'category-inferred: competitive problem solving' }
      ],
      'Workshop'     : [
        { name: 'Teamwork & Collaboration', category: 'Soft Skill', confidence: 0.65, evidence: 'category-inferred: hands-on technical workshop' }
      ],
      'Leadership'   : [
        { name: 'Leadership',      category: 'Leadership', confidence: 0.80, evidence: 'category-inferred: leadership position' },
        { name: 'Public Speaking & Pitching', category: 'Communication', confidence: 0.72, evidence: 'category-inferred: leadership role' }
      ],
      'Volunteering' : [
        { name: 'Teamwork & Collaboration', category: 'Soft Skill', confidence: 0.68, evidence: 'category-inferred: volunteering activity' }
      ],
      'Sports'       : [
        { name: 'Teamwork & Collaboration', category: 'Soft Skill', confidence: 0.75, evidence: 'category-inferred: sports team participation' }
      ],
      'Cultural'     : [
        { name: 'Public Speaking & Pitching', category: 'Communication', confidence: 0.68, evidence: 'category-inferred: cultural performance/event' }
      ],
      'Club Activity': [
        { name: 'Teamwork & Collaboration', category: 'Soft Skill', confidence: 0.68, evidence: 'category-inferred: active club member' }
      ]
    };
  }

  /**
   * Extract & infer skills from certificate text and event metadata.
   * @param {string} rawText   - Extracted document text
   * @param {Object} metadata  - { certificate_title, event_name, category }
   * @returns {Array<{ name, category, confidence, evidence }>}
   */
  extractSkills(rawText = '', metadata = {}) {
    const fullContent = [
      rawText,
      metadata.certificate_title || '',
      metadata.event_name         || '',
      metadata.category           || '',
      metadata.certificate_type   || ''
    ].join(' ').toLowerCase();

    const detectedSkills = [];
    const seenNames      = new Set();

    // 1. Direct Keyword Matching across comprehensive skills dataset
    for (const skill of this.skillTaxonomy) {
      const matchedKeywords = [];

      for (const kw of skill.keywords) {
        const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex   = new RegExp(`(?<![a-z])${escaped}(?![a-z])`, 'i');
        if (regex.test(fullContent)) {
          matchedKeywords.push(kw);
        }
      }

      if (matchedKeywords.length > 0 && !seenNames.has(skill.name)) {
        seenNames.add(skill.name);
        const confidence = Number(Math.min(0.95, 0.70 + matchedKeywords.length * 0.08).toFixed(2));
        detectedSkills.push({
          name       : skill.name,
          category   : skill.category,
          confidence : confidence,
          evidence   : `document-text: "${matchedKeywords.slice(0, 3).join('", "')}"`
        });
      }
    }

    // 2. Domain-based Inferences from Event Title if no direct skill keywords matched
    if (detectedSkills.length === 0 && metadata.category) {
      const defaults = this.categoryDefaults[metadata.category];
      if (defaults) {
        return defaults.filter(s => !seenNames.has(s.name));
      }
    }

    return detectedSkills;
  }
}

module.exports = SkillExtractionService;
