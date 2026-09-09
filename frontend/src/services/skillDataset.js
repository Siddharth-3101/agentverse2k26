/**
 * skillDataset.js
 * Multi-Domain Skill Taxonomy Dataset matching AI Engine taxonomy.
 */

export const SKILL_DATASET = [
  // ── Programming Languages ───────────────────────────────────────────────
  { name: 'Python', category: 'Programming Languages', domain: 'Core' },
  { name: 'JavaScript', category: 'Programming Languages', domain: 'Web' },
  { name: 'TypeScript', category: 'Programming Languages', domain: 'Web' },
  { name: 'Java', category: 'Programming Languages', domain: 'Backend' },
  { name: 'C++', category: 'Programming Languages', domain: 'Systems' },
  { name: 'C', category: 'Programming Languages', domain: 'Systems' },
  { name: 'Rust', category: 'Programming Languages', domain: 'Systems' },
  { name: 'Go', category: 'Programming Languages', domain: 'Backend' },
  { name: 'Kotlin', category: 'Programming Languages', domain: 'Mobile' },
  { name: 'Swift', category: 'Programming Languages', domain: 'Mobile' },
  { name: 'R', category: 'Programming Languages', domain: 'Data' },
  { name: 'MATLAB', category: 'Programming Languages', domain: 'Engineering' },

  // ── Web Development ─────────────────────────────────────────────────────
  { name: 'React.js', category: 'Frontend Development', domain: 'Web' },
  { name: 'Next.js', category: 'Frontend Development', domain: 'Web' },
  { name: 'Node.js', category: 'Backend Development', domain: 'Web' },
  { name: 'Express.js', category: 'Backend Development', domain: 'Web' },
  { name: 'FastAPI', category: 'Backend Development', domain: 'Web' },
  { name: 'HTML & CSS', category: 'Frontend Development', domain: 'Web' },
  { name: 'Tailwind CSS', category: 'Frontend Development', domain: 'Web' },
  { name: 'Vue.js', category: 'Frontend Development', domain: 'Web' },
  { name: 'Angular', category: 'Frontend Development', domain: 'Web' },
  { name: 'REST API Design', category: 'Software Architecture', domain: 'Backend' },
  { name: 'GraphQL', category: 'Software Architecture', domain: 'Backend' },

  // ── Mobile Development ──────────────────────────────────────────────────
  { name: 'Android Development', category: 'Mobile Development', domain: 'Mobile' },
  { name: 'iOS Development', category: 'Mobile Development', domain: 'Mobile' },
  { name: 'Flutter', category: 'Mobile Development', domain: 'Mobile' },
  { name: 'React Native', category: 'Mobile Development', domain: 'Mobile' },

  // ── Databases ───────────────────────────────────────────────────────────
  { name: 'SQL & Relational DBs', category: 'Databases', domain: 'Data' },
  { name: 'PostgreSQL', category: 'Databases', domain: 'Data' },
  { name: 'MySQL', category: 'Databases', domain: 'Data' },
  { name: 'MongoDB', category: 'Databases', domain: 'Data' },
  { name: 'Redis Caching', category: 'Databases', domain: 'Backend' },
  { name: 'Firebase', category: 'Databases', domain: 'Cloud' },

  // ── AI & Machine Learning ───────────────────────────────────────────────
  { name: 'Agentic AI', category: 'Artificial Intelligence', domain: 'AI/ML' },
  { name: 'Generative AI & LLMs', category: 'Artificial Intelligence', domain: 'AI/ML' },
  { name: 'Machine Learning', category: 'Artificial Intelligence', domain: 'AI/ML' },
  { name: 'Deep Learning', category: 'Artificial Intelligence', domain: 'AI/ML' },
  { name: 'PyTorch', category: 'Artificial Intelligence', domain: 'AI/ML' },
  { name: 'TensorFlow', category: 'Artificial Intelligence', domain: 'AI/ML' },
  { name: 'Computer Vision', category: 'Artificial Intelligence', domain: 'AI/ML' },
  { name: 'Natural Language Processing', category: 'Artificial Intelligence', domain: 'AI/ML' },
  { name: 'Data Science & Analytics', category: 'Data Science', domain: 'Data' },
  { name: 'Prompt Engineering', category: 'Artificial Intelligence', domain: 'AI/ML' },

  // ── Cloud, DevOps & Infrastructure ──────────────────────────────────────
  { name: 'AWS Cloud Native', category: 'Cloud & DevOps', domain: 'Cloud' },
  { name: 'Google Cloud Platform (GCP)', category: 'Cloud & DevOps', domain: 'Cloud' },
  { name: 'Microsoft Azure', category: 'Cloud & DevOps', domain: 'Cloud' },
  { name: 'Docker & Containers', category: 'Cloud & DevOps', domain: 'DevOps' },
  { name: 'Kubernetes', category: 'Cloud & DevOps', domain: 'DevOps' },
  { name: 'CI/CD Pipelines', category: 'Cloud & DevOps', domain: 'DevOps' },
  { name: 'Terraform & IaC', category: 'Cloud & DevOps', domain: 'DevOps' },
  { name: 'Git & Version Control', category: 'DevOps', domain: 'DevOps' },

  // ── Cybersecurity & Networking ──────────────────────────────────────────
  { name: 'Network Security', category: 'Cybersecurity', domain: 'Security' },
  { name: 'Penetration Testing & CTF', category: 'Cybersecurity', domain: 'Security' },
  { name: 'Cryptography', category: 'Cybersecurity', domain: 'Security' },
  { name: 'Digital Forensics', category: 'Cybersecurity', domain: 'Security' },
  { name: 'Ethical Hacking', category: 'Cybersecurity', domain: 'Security' },
  { name: 'Cisco Packet Tracer & Routing', category: 'Networking', domain: 'Security' },

  // ── Hardware, IoT & Core Engineering ─────────────────────────────────────
  { name: 'Embedded Systems & IoT', category: 'Hardware & IoT', domain: 'Engineering' },
  { name: 'Arduino & Microcontrollers', category: 'Hardware & IoT', domain: 'Engineering' },
  { name: 'ROS 2 & Robotics', category: 'Robotics', domain: 'Engineering' },
  { name: 'VLSI & Circuit Design', category: 'Core Engineering', domain: 'Engineering' },
  { name: 'CAD & 3D Modeling (SolidWorks)', category: 'Core Engineering', domain: 'Engineering' },

  // ── Blockchain & Web3 ───────────────────────────────────────────────────
  { name: 'Solidity & Smart Contracts', category: 'Blockchain', domain: 'Web3' },
  { name: 'Web3.js & Ethers.js', category: 'Blockchain', domain: 'Web3' },
  { name: 'Zero-Knowledge Proofs', category: 'Blockchain', domain: 'Web3' },

  // ── Business, Product & Design ──────────────────────────────────────────
  { name: 'UI/UX Design & Figma', category: 'Design', domain: 'Design' },
  { name: 'Product Management', category: 'Management', domain: 'Business' },
  { name: 'Agile & Scrum Methodologies', category: 'Management', domain: 'Business' },

  // ── Soft Skills & Leadership ────────────────────────────────────────────
  { name: 'Data Structures & Algorithms (DSA)', category: 'Computer Science', domain: 'Core' },
  { name: 'Competitive Programming', category: 'Computer Science', domain: 'Core' },
  { name: 'Problem Solving', category: 'Soft Skills', domain: 'Core' },
  { name: 'Team Leadership & Governance', category: 'Soft Skills', domain: 'Leadership' },
  { name: 'Public Speaking & Technical Pitching', category: 'Soft Skills', domain: 'Leadership' },
  { name: 'Event Management', category: 'Soft Skills', domain: 'Leadership' },
];

export const SKILL_CATEGORIES = Array.from(new Set(SKILL_DATASET.map((s) => s.category)));

export function searchSkillsInDataset(query) {
  if (!query || !query.trim()) return SKILL_DATASET.slice(0, 15);
  const q = query.toLowerCase().trim();
  return SKILL_DATASET.filter(
    (s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.domain.toLowerCase().includes(q)
  );
}
