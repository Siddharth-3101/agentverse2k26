import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPool } from '../config/db.js';
import { initializeDatabase } from './init.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function seedDatabase() {
  await initializeDatabase();
  const pool = getPool();
  console.log('\n[DB Seed] Populating complete AgentVerse production sample data...');

  // Ensure foreign key constraints are temporarily disabled for clean re-seeding
  await pool.query('SET FOREIGN_KEY_CHECKS = 0');

  // Drop tables to apply updated schema
  const tables = [
    'alumni_messages',
    'alumni',
    'notifications',
    'student_activities',
    'certificates',
    'applications',
    'club_members',
    'club_performance',
    'teacher_profiles',
    'student_profiles',
    'activities',
    'clubs',
    'users',
  ];

  for (const table of tables) {
    await pool.query(`DROP TABLE IF EXISTS \`${table}\``);
  }

  await pool.query('SET FOREIGN_KEY_CHECKS = 1');

  // Re-run schema migration
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  await pool.query(schemaSql);

  // =========================================================================
  // 1. SEED USERS (8 STUDENTS + 5 TEACHERS + 1 ADMIN)
  // =========================================================================
  const usersData = [
    // Students (Requested: Sanjay Krishna, Siddharth G, Sankari G, Santhana S, Senthil P, Sabarish R, Dinesh S, Shalini S)
    {
      id: 1,
      full_name: 'Sanjay Krishna',
      email: 'sanjay.krishna@agentverse.edu',
      password_hash: '$2b$10$agentverse.hashed.pass.mock',
      role: 'STUDENT',
      phone_number: '+91 91234 56789',
      department: 'Computer Science & Engineering',
      year_of_study: 3,
    },
    {
      id: 2,
      full_name: 'Siddharth G',
      email: 'siddharth.g@agentverse.edu',
      password_hash: '$2b$10$agentverse.hashed.pass.mock',
      role: 'STUDENT',
      phone_number: '+91 98765 43210',
      department: 'Computer Science & Engineering',
      year_of_study: 3,
    },
    {
      id: 3,
      full_name: 'Sankari G',
      email: 'sankari.g@agentverse.edu',
      password_hash: '$2b$10$agentverse.hashed.pass.mock',
      role: 'STUDENT',
      phone_number: '+91 97110 09988',
      department: 'Information Technology',
      year_of_study: 3,
    },
    {
      id: 4,
      full_name: 'Santhana S',
      email: 'santhana.s@agentverse.edu',
      password_hash: '$2b$10$agentverse.hashed.pass.mock',
      role: 'STUDENT',
      phone_number: '+91 94567 89012',
      department: 'Information Technology',
      year_of_study: 2,
    },
    {
      id: 5,
      full_name: 'Senthil P',
      email: 'senthil.p@agentverse.edu',
      password_hash: '$2b$10$agentverse.hashed.pass.mock',
      role: 'STUDENT',
      phone_number: '+91 98112 23344',
      department: 'Electronics & Communication Engineering',
      year_of_study: 3,
    },
    {
      id: 6,
      full_name: 'Sabarish R',
      email: 'sabarish.r@agentverse.edu',
      password_hash: '$2b$10$agentverse.hashed.pass.mock',
      role: 'STUDENT',
      phone_number: '+91 99887 76655',
      department: 'Mechanical & Automation Engineering',
      year_of_study: 3,
    },
    {
      id: 7,
      full_name: 'Dinesh S',
      email: 'dinesh.s@agentverse.edu',
      password_hash: '$2b$10$agentverse.hashed.pass.mock',
      role: 'STUDENT',
      phone_number: '+91 98765 99887',
      department: 'Cyber Security & Digital Forensics',
      year_of_study: 4,
    },
    {
      id: 8,
      full_name: 'Shalini S',
      email: 'shalini.s@agentverse.edu',
      password_hash: '$2b$10$agentverse.hashed.pass.mock',
      role: 'STUDENT',
      phone_number: '+91 91234 55443',
      department: 'Data Science & Artificial Intelligence',
      year_of_study: 2,
    },

    // Teachers / Faculty Mentors
    {
      id: 9,
      full_name: 'Dr. A. K. Gupta',
      email: 'dr.gupta@agentverse.edu',
      password_hash: '$2b$10$agentverse.hashed.pass.mock',
      role: 'TEACHER',
      phone_number: '+91 98112 23344',
      department: 'Computer Science & Engineering',
      year_of_study: null,
    },
    {
      id: 10,
      full_name: 'Prof. Meenakshi Sharma',
      email: 'prof.sharma@agentverse.edu',
      password_hash: '$2b$10$agentverse.hashed.pass.mock',
      role: 'TEACHER',
      phone_number: '+91 98300 11223',
      department: 'Electronics & Communication',
      year_of_study: null,
    },
    {
      id: 11,
      full_name: 'Dr. Ramesh Nair',
      email: 'dr.nair@agentverse.edu',
      password_hash: '$2b$10$agentverse.hashed.pass.mock',
      role: 'TEACHER',
      phone_number: '+91 98765 43210',
      department: 'Robotics & Automation',
      year_of_study: null,
    },
    {
      id: 12,
      full_name: 'Prof. Rajesh Verma',
      email: 'prof.verma@agentverse.edu',
      password_hash: '$2b$10$agentverse.hashed.pass.mock',
      role: 'TEACHER',
      phone_number: '+91 97110 09988',
      department: 'Information Technology',
      year_of_study: null,
    },
    {
      id: 13,
      full_name: 'Dr. Sunita Deshmukh',
      email: 'dr.deshmukh@agentverse.edu',
      password_hash: '$2b$10$agentverse.hashed.pass.mock',
      role: 'TEACHER',
      phone_number: '+91 98765 99887',
      department: 'Cyber Security',
      year_of_study: null,
    },

    // Admin
    {
      id: 14,
      full_name: 'Campus Administrator',
      email: 'admin@agentverse.edu',
      password_hash: '$2b$10$agentverse.hashed.pass.mock',
      role: 'ADMIN',
      phone_number: '+91 99999 88888',
      department: 'Academic Administration',
      year_of_study: null,
    },
  ];

  for (const u of usersData) {
    await pool.execute(
      `INSERT INTO users (id, full_name, email, password_hash, role, phone_number, department, year_of_study)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [u.id, u.full_name, u.email, u.password_hash, u.role, u.phone_number, u.department, u.year_of_study]
    );
  }

  // =========================================================================
  // 2. SEED STUDENT PROFILES
  // =========================================================================
  const studentProfiles = [
    { user_id: 1, student_id: '2024CS001', phone: '+91 91234 56789', dept: 'Computer Science & Engineering', year: 3 },
    { user_id: 2, student_id: '2024CS002', phone: '+91 98765 43210', dept: 'Computer Science & Engineering', year: 3 },
    { user_id: 3, student_id: '2024IT003', phone: '+91 97110 09988', dept: 'Information Technology', year: 3 },
    { user_id: 4, student_id: '2025IT004', phone: '+91 94567 89012', dept: 'Information Technology', year: 2 },
    { user_id: 5, student_id: '2024EC005', phone: '+91 98112 23344', dept: 'Electronics & Communication Engineering', year: 3 },
    { user_id: 6, student_id: '2024ME006', phone: '+91 99887 76655', dept: 'Mechanical & Automation Engineering', year: 3 },
    { user_id: 7, student_id: '2023CS007', phone: '+91 98765 99887', dept: 'Cyber Security & Digital Forensics', year: 4 },
    { user_id: 8, student_id: '2025DS008', phone: '+91 91234 55443', dept: 'Data Science & Artificial Intelligence', year: 2 },
  ];

  for (const sp of studentProfiles) {
    await pool.execute(
      `INSERT INTO student_profiles (user_id, student_id, phone_number, department, year_of_study)
       VALUES (?, ?, ?, ?, ?)`,
      [sp.user_id, sp.student_id, sp.phone, sp.dept, sp.year]
    );
  }

  // =========================================================================
  // 3. SEED CLUBS (With Mentors, Presidents, VPs, and Contacts)
  // =========================================================================
  const clubsData = [
    {
      id: 1,
      name: 'Agentic AI & Coding Society',
      description: 'The premier technical club dedicated to Competitive Programming, Machine Learning, Web3, and Open Source development.',
      category: 'Technical',
      mentor_teacher_id: 9, // Dr. A. K. Gupta
      president_user_id: 2, // Siddharth G
      vp_user_id: 1, // Sanjay Krishna
      president_name: 'Siddharth G',
      vp_name: 'Sanjay Krishna',
      president_phone: '+91 98765 43210',
      vp_phone: '+91 91234 56789',
      full_vision: 'Our goal is to build industry-ready software engineers and AI practitioners through weekly hack nights, workshops, open-source sprints, and inter-college hackathons.',
      member_count: 142,
      active_events_count: 4,
      logo_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&auto=format&fit=crop&q=80',
      banner_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
      tags: JSON.stringify(['Python', 'AI Agents', 'DSA', 'WebDev', 'React']),
      social_links: JSON.stringify({ github: 'https://github.com/agentverse', discord: 'https://discord.gg/agentverse' }),
      contact_email: 'ai.coding@agentverse.edu',
    },
    {
      id: 2,
      name: 'Robotics & Automation Guild',
      description: 'Build autonomous rovers, drone swarms, and industrial automation prototypes with hands-on hardware labs.',
      category: 'Technical',
      mentor_teacher_id: 11, // Dr. Ramesh Nair
      president_user_id: 5, // Senthil P
      vp_user_id: 6, // Sabarish R
      president_name: 'Senthil P',
      vp_name: 'Sabarish R',
      president_phone: '+91 98112 23344',
      vp_phone: '+91 99887 76655',
      full_vision: 'Equipping students with CAD design, embedded C/C++, ROS2, and PCB soldering skills for national robo-wars and aerial vehicle competitions.',
      member_count: 98,
      active_events_count: 2,
      logo_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&auto=format&fit=crop&q=80',
      banner_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
      tags: JSON.stringify(['Robotics', 'Arduino', 'IoT', 'Hardware', 'ROS2']),
      social_links: JSON.stringify({ instagram: 'https://instagram.com/robotics_guild' }),
      contact_email: 'robotics@agentverse.edu',
    },
    {
      id: 3,
      name: 'Resonance Music & Band Society',
      description: 'A vibrant community for vocalists, instrumentalists, sound engineers, and stage performers across all musical genres.',
      category: 'Cultural',
      mentor_teacher_id: 10, // Prof. Meenakshi Sharma
      president_user_id: 8, // Shalini S
      vp_user_id: 7, // Dinesh S
      president_name: 'Shalini S',
      vp_name: 'Dinesh S',
      president_phone: '+91 91234 55443',
      vp_phone: '+91 98765 99887',
      full_vision: 'Organizing battle of bands, acoustic jam sessions, production masterclasses, and mainstage cultural fest performances.',
      member_count: 210,
      active_events_count: 3,
      logo_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80',
      banner_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
      tags: JSON.stringify(['Music', 'Live Band', 'Stage', 'Vocals', 'Acoustic']),
      social_links: JSON.stringify({ youtube: 'https://youtube.com/resonance_band' }),
      contact_email: 'resonance@agentverse.edu',
    },
    {
      id: 4,
      name: 'E-Cell & Startup Incubator',
      description: 'Fostering student startup culture through pitch competitions, angel investor meets, and incubation mentorship.',
      category: 'Entrepreneurship',
      mentor_teacher_id: 12, // Prof. Rajesh Verma
      president_user_id: 3, // Sankari G
      vp_user_id: 4, // Santhana S
      president_name: 'Sankari G',
      vp_name: 'Santhana S',
      president_phone: '+91 97110 09988',
      vp_phone: '+91 94567 89012',
      full_vision: 'Connecting student founders with venture capitalists, seed grants, patent filing support, and startup bootcamps.',
      member_count: 165,
      active_events_count: 5,
      logo_url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=150&auto=format&fit=crop&q=80',
      banner_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80',
      tags: JSON.stringify(['Startups', 'Pitch Deck', 'Business', 'Finance', 'Incubation']),
      social_links: JSON.stringify({ linkedin: 'https://linkedin.com/company/ecell-agentverse' }),
      contact_email: 'ecell@agentverse.edu',
    },
    {
      id: 5,
      name: 'Cyber Shield Security Club',
      description: 'Learn Ethical Hacking, CTF challenges, Network Defense, and Bug Bounty hunting in a legal sandbox environment.',
      category: 'Technical',
      mentor_teacher_id: 13, // Dr. Sunita Deshmukh
      president_user_id: 7, // Dinesh S
      vp_user_id: 8, // Shalini S
      president_name: 'Dinesh S',
      vp_name: 'Shalini S',
      president_phone: '+91 98765 99887',
      vp_phone: '+91 91234 55443',
      full_vision: 'Training cybersecurity enthusiasts for global CTFs, penetration testing certifications, and cloud security defense.',
      member_count: 115,
      active_events_count: 2,
      logo_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=150&auto=format&fit=crop&q=80',
      banner_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
      tags: JSON.stringify(['CyberSecurity', 'CTF', 'Ethical Hacking', 'Cryptography']),
      social_links: JSON.stringify({ twitter: 'https://twitter.com/cybershield' }),
      contact_email: 'cybershield@agentverse.edu',
    },
  ];

  for (const c of clubsData) {
    await pool.execute(
      `INSERT INTO clubs (id, name, description, category, mentor_teacher_id, president_user_id, vp_user_id, president_name, vp_name, president_phone, vp_phone, full_vision, member_count, active_events_count, logo_url, banner_url, tags, social_links, contact_email)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        c.id,
        c.name,
        c.description,
        c.category,
        c.mentor_teacher_id,
        c.president_user_id,
        c.vp_user_id,
        c.president_name,
        c.vp_name,
        c.president_phone,
        c.vp_phone,
        c.full_vision,
        c.member_count,
        c.active_events_count,
        c.logo_url,
        c.banner_url,
        c.tags,
        c.social_links,
        c.contact_email,
      ]
    );
  }

  // =========================================================================
  // 4. SEED TEACHER PROFILES (1 Teacher -> 1 Club)
  // =========================================================================
  const teacherProfiles = [
    { user_id: 9, staff_id: 'STF001', dept: 'Computer Science & Engineering', phone: '+91 98112 23344', club_id: 1 },
    { user_id: 10, staff_id: 'STF002', dept: 'Electronics & Communication', phone: '+91 98300 11223', club_id: 3 },
    { user_id: 11, staff_id: 'STF003', dept: 'Robotics & Automation', phone: '+91 98765 43210', club_id: 2 },
    { user_id: 12, staff_id: 'STF004', dept: 'Information Technology', phone: '+91 97110 09988', club_id: 4 },
    { user_id: 13, staff_id: 'STF005', dept: 'Cyber Security', phone: '+91 98765 99887', club_id: 5 },
  ];

  for (const tp of teacherProfiles) {
    await pool.execute(
      `INSERT INTO teacher_profiles (user_id, staff_id, phone_number, department, club_id)
       VALUES (?, ?, ?, ?, ?)`,
      [tp.user_id, tp.staff_id, tp.phone, tp.dept, tp.club_id]
    );
  }

  // =========================================================================
  // 5. SEED CLUB MEMBERS (With Executive Roles)
  // =========================================================================
  const clubMembersData = [
    // Club 1: Agentic AI & Coding Society
    { club_id: 1, student_id: 2, role: 'PRESIDENT', status: 'ACTIVE' }, // Siddharth G
    { club_id: 1, student_id: 1, role: 'VICE_PRESIDENT', status: 'ACTIVE' }, // Sanjay Krishna
    { club_id: 1, student_id: 3, role: 'SECRETARY', status: 'ACTIVE' }, // Sankari G
    { club_id: 1, student_id: 4, role: 'CORE', status: 'ACTIVE' }, // Santhana S
    { club_id: 1, student_id: 7, role: 'MEMBER', status: 'ACTIVE' }, // Dinesh S

    // Club 2: Robotics & Automation Guild
    { club_id: 2, student_id: 5, role: 'PRESIDENT', status: 'ACTIVE' }, // Senthil P
    { club_id: 2, student_id: 6, role: 'VICE_PRESIDENT', status: 'ACTIVE' }, // Sabarish R
    { club_id: 2, student_id: 2, role: 'MEMBER', status: 'ACTIVE' }, // Siddharth G

    // Club 3: Resonance Music & Band Society
    { club_id: 3, student_id: 8, role: 'PRESIDENT', status: 'ACTIVE' }, // Shalini S
    { club_id: 3, student_id: 7, role: 'VICE_PRESIDENT', status: 'ACTIVE' }, // Dinesh S
    { club_id: 3, student_id: 2, role: 'MEMBER', status: 'ACTIVE' }, // Siddharth G
    { club_id: 3, student_id: 1, role: 'MEMBER', status: 'ACTIVE' }, // Sanjay Krishna

    // Club 4: E-Cell & Startup Incubator
    { club_id: 4, student_id: 3, role: 'PRESIDENT', status: 'ACTIVE' }, // Sankari G
    { club_id: 4, student_id: 4, role: 'VICE_PRESIDENT', status: 'ACTIVE' }, // Santhana S
    { club_id: 4, student_id: 1, role: 'MEMBER', status: 'ACTIVE' }, // Sanjay Krishna

    // Club 5: Cyber Shield Security Club
    { club_id: 5, student_id: 7, role: 'PRESIDENT', status: 'ACTIVE' }, // Dinesh S
    { club_id: 5, student_id: 8, role: 'VICE_PRESIDENT', status: 'ACTIVE' }, // Shalini S
    { club_id: 5, student_id: 2, role: 'MEMBER', status: 'ACTIVE' }, // Siddharth G
  ];

  for (const cm of clubMembersData) {
    await pool.execute(
      `INSERT INTO club_members (club_id, student_id, role, status)
       VALUES (?, ?, ?, ?)`,
      [cm.club_id, cm.student_id, cm.role, cm.status]
    );
  }

  // =========================================================================
  // 6. SEED ACTIVITIES / EVENTS
  // =========================================================================
  const activitiesData = [
    {
      id: 1,
      title: 'Tejas India Hackathon 2026',
      description: 'Tejas India Hackathon 2026 is a flagship national-level 36-hour virtual hackathon. It aims to bring together bright minds to solve real-world challenges in AI, FinTech, AgriTech, and Smart Governance. Participants receive mentorship from industry leaders, cash prizes worth ₹1,500,000, and direct internship opportunities!',
      activity_type: 'Hackathons',
      organizer: 'Agentic AI & Coding Society',
      college: 'Government Engineering College',
      start_date: '2026-09-20 09:00:00',
      end_date: '2026-09-22 18:00:00',
      location: 'Online / Pan India',
      mode: 'Online',
      fee: 'Free',
      team_size: '2 - 4 Members',
      deadline: '2026-09-18 23:59:59',
      logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      banner_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
      google_form_url: 'https://forms.google.com/example-tejas-hackathon-2026',
      is_featured: true,
      tags: JSON.stringify(['AI Agents', 'Full Stack', 'Competitive', 'Cash Prizes']),
      eligibility: JSON.stringify(['Engineering Students', 'Undergraduate', 'Postgraduate']),
      contact_numbers: JSON.stringify([
        { name: 'Siddharth G (President)', phone: '+91 98765 43210' },
        { name: 'Sanjay Krishna (VP)', phone: '+91 91234 56789' },
      ]),
    },
    {
      id: 2,
      title: 'Code Clash 2026',
      description: 'A high-speed algorithmic programming showdown designed to test your problem-solving abilities, data structure efficiency, and code speed under pressure. Winners earn trophies, certificates, and exciting gadget prizes!',
      activity_type: 'Competitions',
      organizer: 'Agentic AI & Coding Society',
      college: 'DCRUST Campus & Virtual',
      start_date: '2026-10-02 10:00:00',
      end_date: '2026-10-02 16:00:00',
      location: 'CVR Lab, CSE Dept & Online',
      mode: 'Offline',
      fee: 'Free',
      team_size: '1 - 2 Members',
      deadline: '2026-09-29 23:59:59',
      logo_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&auto=format&fit=crop&q=80',
      banner_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      google_form_url: 'https://forms.google.com/example-code-clash-2026',
      is_featured: true,
      tags: JSON.stringify(['DSA', 'Algorithms', 'Competitive Programming', 'Speed Coding']),
      eligibility: JSON.stringify(['B.Tech / BCA / B.Sc CS', 'Batch 2024-2028']),
      contact_numbers: JSON.stringify([
        { name: 'Dr. A. K. Gupta (Faculty Mentor)', phone: '+91 98112 23344' },
        { name: 'Siddharth G (Lead)', phone: '+91 98765 43210' },
      ]),
    },
    {
      id: 3,
      title: 'AI & Generative Vision Workshop',
      description: 'An intensive 2-day hands-on workshop covering LLMs, Diffusion Models, and AI Agentic Frameworks. Learn how to build production-grade AI agents from scratch with live code walk-throughs by senior AI researchers.',
      activity_type: 'Workshops',
      organizer: 'Robotics & Automation Guild',
      college: 'DTU Main Auditorium',
      start_date: '2026-09-24 10:00:00',
      end_date: '2026-09-25 17:00:00',
      location: 'Auditorium 2 & Zoom Link',
      mode: 'Hybrid',
      fee: 'Free',
      team_size: 'Individual',
      deadline: '2026-09-20 23:59:59',
      logo_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=150&auto=format&fit=crop&q=80',
      banner_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
      google_form_url: 'https://forms.google.com/example-ai-workshop',
      is_featured: false,
      tags: JSON.stringify(['Artificial Intelligence', 'Generative AI', 'Computer Vision']),
      eligibility: JSON.stringify(['Open to All Students']),
      contact_numbers: JSON.stringify([
        { name: 'Senthil P (President)', phone: '+91 98112 23344' },
      ]),
    },
    {
      id: 4,
      title: 'National Cyber Shield Quiz 2026',
      description: 'Test your knowledge in Network Security, Cryptography, Web Exploitation, and Digital Forensics in this fast-paced online trivia quiz! Top 50 rankers get direct entry into the annual CTF Hackathon.',
      activity_type: 'Quizzes',
      organizer: 'Cyber Shield Security Club',
      college: 'IIT Roorkee / Online',
      start_date: '2026-09-15 19:00:00',
      end_date: '2026-09-15 20:30:00',
      location: 'Unstop Portal Online',
      mode: 'Online',
      fee: 'Free',
      team_size: 'Individual',
      deadline: '2026-09-14 18:00:00',
      logo_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=150&auto=format&fit=crop&q=80',
      banner_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
      google_form_url: 'https://forms.google.com/example-cyber-quiz-2026',
      is_featured: false,
      tags: JSON.stringify(['CyberSecurity', 'CTF', 'Cryptography', 'Quiz']),
      eligibility: JSON.stringify(['All College Students']),
      contact_numbers: JSON.stringify([
        { name: 'Dinesh S (Security Lead)', phone: '+91 98765 99887' },
      ]),
    },
    {
      id: 5,
      title: 'Resonance 2026 Cultural Fest & Battle of Bands',
      description: 'The grandest inter-college battle of bands! Perform live before thousands of students and celebrity judges. Sound system, amps, and drums kit provided on site. Cash prizes worth ₹200,000 for top 3 bands!',
      activity_type: 'Cultural',
      organizer: 'Resonance Music & Band Society',
      college: 'NSUT Main Grounds',
      start_date: '2026-10-12 16:00:00',
      end_date: '2026-10-12 22:00:00',
      location: 'NSUT Main Campus Grounds, Dwarka',
      mode: 'Offline',
      fee: 'Free',
      team_size: '3 - 10 Members',
      deadline: '2026-10-05 23:59:59',
      logo_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80',
      banner_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
      google_form_url: 'https://forms.google.com/example-resonance-bands',
      is_featured: true,
      tags: JSON.stringify(['Music', 'Band Competition', 'Live Stage', 'Cultural Fest']),
      eligibility: JSON.stringify(['College Music Societies & Independent Bands']),
      contact_numbers: JSON.stringify([
        { name: 'Shalini S (President)', phone: '+91 91234 55443' },
        { name: 'Prof. Meenakshi Sharma (Mentor)', phone: '+91 98300 11223' },
      ]),
    },
    {
      id: 6,
      title: 'E-Summit Startup Pitch Fest 2026',
      description: 'Pitch your early-stage startup or tech idea to prominent angel investors and venture capitalists. Grants up to ₹500,000 for top 3 winning business plans with guaranteed incubation support!',
      activity_type: 'Competitions',
      organizer: 'E-Cell & Startup Incubator',
      college: 'Campus Innovation Center',
      start_date: '2026-10-20 10:00:00',
      end_date: '2026-10-21 17:00:00',
      location: 'Auditorium Hall 1 & Virtual Pitch',
      mode: 'Hybrid',
      fee: 'Free',
      team_size: '2 - 5 Founders',
      deadline: '2026-10-14 23:59:59',
      logo_url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=150&auto=format&fit=crop&q=80',
      banner_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80',
      google_form_url: 'https://forms.google.com/example-pitch-fest-2026',
      is_featured: true,
      tags: JSON.stringify(['Startup', 'Pitch Deck', 'Angel Investors', 'Seed Grant']),
      eligibility: JSON.stringify(['Student Entrepreneurs', 'All Degrees']),
      contact_numbers: JSON.stringify([
        { name: 'Sankari G (President)', phone: '+91 97110 09988' },
        { name: 'Santhana S (VP)', phone: '+91 94567 89012' },
      ]),
    },
    {
      id: 7,
      title: 'Autonomous Drone Grand Prix 2026',
      description: 'Autonomous indoor drone racing through obstacle gates using onboard computer vision and LIDAR sensors without manual RC pilot intervention!',
      activity_type: 'Competitions',
      organizer: 'Robotics & Automation Guild',
      college: 'Robotics Arena',
      start_date: '2026-11-05 09:30:00',
      end_date: '2026-11-05 18:00:00',
      location: 'Indoor Sports Arena Block B',
      mode: 'Offline',
      fee: 'Free',
      team_size: '2 - 4 Members',
      deadline: '2026-10-28 23:59:59',
      logo_url: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=150&auto=format&fit=crop&q=80',
      banner_url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
      google_form_url: 'https://forms.google.com/example-drone-grand-prix',
      is_featured: false,
      tags: JSON.stringify(['Drones', 'Computer Vision', 'ROS2', 'Autonomous Systems']),
      eligibility: JSON.stringify(['Robotics & Engineering Students']),
      contact_numbers: JSON.stringify([
        { name: 'Senthil P (Lead)', phone: '+91 98112 23344' },
        { name: 'Sabarish R (VP)', phone: '+91 99887 76655' },
      ]),
    },
  ];

  for (const act of activitiesData) {
    await pool.execute(
      `INSERT INTO activities (id, title, description, activity_type, organizer, college, start_date, end_date, location, mode, fee, team_size, deadline, logo_url, banner_url, google_form_url, is_featured, tags, eligibility, contact_numbers)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        act.id,
        act.title,
        act.description,
        act.activity_type,
        act.organizer,
        act.college,
        act.start_date,
        act.end_date,
        act.location,
        act.mode,
        act.fee,
        act.team_size,
        act.deadline,
        act.logo_url,
        act.banner_url,
        act.google_form_url,
        act.is_featured ? 1 : 0,
        act.tags,
        act.eligibility,
        act.contact_numbers,
      ]
    );
  }

  // =========================================================================
  // 7. SEED STUDENT PARTICIPATION (student_activities)
  // =========================================================================
  const studentActivitiesData = [
    { student_id: 2, activity_id: 1, participation_status: 'CONFIRMED', achievement: 'Team Leader — Team ByteBusters' },
    { student_id: 2, activity_id: 2, participation_status: 'REGISTERED', achievement: 'Solo Contestant' },
    { student_id: 2, activity_id: 3, participation_status: 'ATTENDED', achievement: 'Certificate of Excellence' },
    { student_id: 1, activity_id: 1, participation_status: 'CONFIRMED', achievement: 'Core Member — Team ByteBusters' },
    { student_id: 1, activity_id: 4, participation_status: 'COMPLETED', achievement: 'Score: 94/100 (Top 5%)' },
    { student_id: 3, activity_id: 6, participation_status: 'CONFIRMED', achievement: 'Pitch Lead — AgriShield' },
    { student_id: 5, activity_id: 7, participation_status: 'CONFIRMED', achievement: 'Team Pilot — AeroDrone' },
    { student_id: 8, activity_id: 5, participation_status: 'CONFIRMED', achievement: 'Lead Vocalist' },
  ];

  for (const sa of studentActivitiesData) {
    await pool.execute(
      `INSERT INTO student_activities (student_id, activity_id, participation_status, achievement)
       VALUES (?, ?, ?, ?)`,
      [sa.student_id, sa.activity_id, sa.participation_status, sa.achievement]
    );
  }

  // =========================================================================
  // 8. SEED VERIFIED CERTIFICATES (For AI Recommendations & Portfolio)
  // =========================================================================
  const certificatesData = [
    {
      student_id: 2, // Siddharth G
      title: 'Generative AI & Agentic Architectures',
      organization: 'DeepLearning.AI & Google Cloud',
      category: 'Artificial Intelligence',
      top_level_category: 'Certifications',
      issue_date: '2026-07-15',
      credential_id: 'DL-AI-883921',
      achievement: 'Grade: 98% with Honors',
      skills: JSON.stringify(['Python', 'LangChain', 'Multi-Agent Systems', 'Vector DBs', 'FastAPI']),
      verification_status: 'HUMAN_VERIFIED',
      confidence_score: 0.98,
    },
    {
      student_id: 2, // Siddharth G
      title: 'AWS Certified Solutions Architect Associate',
      organization: 'Amazon Web Services',
      category: 'Cloud Computing',
      top_level_category: 'Certifications',
      issue_date: '2026-05-10',
      credential_id: 'AWS-SAA-29931',
      achievement: 'Score: 890/1000',
      skills: JSON.stringify(['AWS', 'Docker', 'Kubernetes', 'Microservices', 'PostgreSQL']),
      verification_status: 'HUMAN_VERIFIED',
      confidence_score: 0.96,
    },
    {
      student_id: 2, // Siddharth G
      title: 'Smart India Hackathon 2026 Winner',
      organization: 'Ministry of Education, Govt of India',
      category: 'Hackathons',
      top_level_category: 'Competitions',
      issue_date: '2026-03-22',
      credential_id: 'SIH-2026-1ST-PRIZE',
      achievement: '1st Prize - Smart Governance Domain',
      skills: JSON.stringify(['React', 'Node.js', 'System Architecture', 'Leadership', 'Public Speaking']),
      verification_status: 'HUMAN_VERIFIED',
      confidence_score: 0.99,
    },
    {
      student_id: 1, // Sanjay Krishna
      title: 'Full Stack Web Development & Microservices',
      organization: 'Meta Professional Certifications',
      category: 'Software Engineering',
      top_level_category: 'Certifications',
      issue_date: '2026-06-20',
      credential_id: 'META-FSW-49021',
      achievement: 'Distinction',
      skills: JSON.stringify(['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST APIs']),
      verification_status: 'HUMAN_VERIFIED',
      confidence_score: 0.95,
    },
    {
      student_id: 7, // Dinesh S
      title: 'Certified Ethical Hacker (CEH v12)',
      organization: 'EC-Council',
      category: 'Cyber Security',
      top_level_category: 'Certifications',
      issue_date: '2026-04-18',
      credential_id: 'ECC-CEH-77123',
      achievement: 'Pass with Merit',
      skills: JSON.stringify(['Ethical Hacking', 'Penetration Testing', 'Wireshark', 'Metasploit', 'Linux']),
      verification_status: 'HUMAN_VERIFIED',
      confidence_score: 0.97,
    },
  ];

  for (const cert of certificatesData) {
    await pool.execute(
      `INSERT INTO certificates (student_id, title, organization, category, top_level_category, issue_date, credential_id, achievement, skills, verification_status, confidence_score)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cert.student_id,
        cert.title,
        cert.organization,
        cert.category,
        cert.top_level_category,
        cert.issue_date,
        cert.credential_id,
        cert.achievement,
        cert.skills,
        cert.verification_status,
        cert.confidence_score,
      ]
    );
  }

  // =========================================================================
  // 9. SEED APPLICATIONS & NOTIFICATIONS (Mentor, President & VP Routing)
  // =========================================================================
  const applicationsData = [
    {
      id: 1,
      club_id: 1, // Agentic AI & Coding Society (Mentor: Dr. Gupta, Pres: Siddharth, VP: Sanjay)
      student_id: 4, // Santhana S
      full_name: 'Santhana S',
      student_id_number: '2025IT004',
      email: 'santhana.s@agentverse.edu',
      phone_number: '+91 94567 89012',
      department: 'Information Technology',
      year_of_study: 2,
      reason_to_join: 'Passionate about learning agentic workflows and participating in upcoming collegiate hackathons.',
      skills: 'Python, JavaScript, Git, React, Problem Solving',
      status: 'PENDING',
    },
    {
      id: 2,
      club_id: 1, // Agentic AI & Coding Society
      student_id: 6, // Sabarish R
      full_name: 'Sabarish R',
      student_id_number: '2024ME006',
      email: 'sabarish.r@agentverse.edu',
      phone_number: '+91 99887 76655',
      department: 'Mechanical & Automation Engineering',
      year_of_study: 3,
      reason_to_join: 'Eager to bridge robotics hardware prototypes with backend AI services and competitive algorithms.',
      skills: 'C++, Python, Embedded Systems, ROS',
      status: 'PENDING',
    },
    {
      id: 3,
      club_id: 2, // Robotics & Automation Guild (Mentor: Dr. Ramesh Nair, Pres: Senthil P, VP: Sabarish R)
      student_id: 1, // Sanjay Krishna
      full_name: 'Sanjay Krishna',
      student_id_number: '2024CS001',
      email: 'sanjay.krishna@agentverse.edu',
      phone_number: '+91 91234 56789',
      department: 'Computer Science & Engineering',
      year_of_study: 3,
      reason_to_join: 'Interested in programming microcontrollers, IoT sensor telemetry, and swarm robotics.',
      skills: 'Python, Embedded C, Raspberry Pi, WebSockets',
      status: 'PENDING',
    },
    {
      id: 4,
      club_id: 4, // E-Cell
      student_id: 5, // Senthil P
      full_name: 'Senthil P',
      student_id_number: '2024EC005',
      email: 'senthil.p@agentverse.edu',
      phone_number: '+91 98112 23344',
      department: 'Electronics & Communication',
      year_of_study: 3,
      reason_to_join: 'Want to develop tech product monetization models and pitch hardware inventions.',
      skills: 'Product Design, Leadership, Hardware Prototyping',
      status: 'ACCEPTED',
      reviewed_by: 12,
    },
  ];

  for (const app of applicationsData) {
    await pool.execute(
      `INSERT INTO applications (id, club_id, student_id, full_name, student_id_number, email, phone_number, department, year_of_study, reason_to_join, skills, status, reviewed_by, reviewed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        app.id,
        app.club_id,
        app.student_id,
        app.full_name,
        app.student_id_number,
        app.email,
        app.phone_number,
        app.department,
        app.year_of_study,
        app.reason_to_join,
        app.skills,
        app.status,
        app.reviewed_by || null,
        app.status === 'ACCEPTED' ? new Date() : null,
      ]
    );
  }

  // Create notifications for Mentor (9), President (2), and VP (1) for Club 1 Applications
  const notificationsData = [
    // App 1 (Santhana S -> Club 1): Notify Mentor (Dr. Gupta: 9), President (Siddharth G: 2), VP (Sanjay Krishna: 1)
    {
      recipient_user_id: 9, // Dr. Gupta (Mentor)
      type: 'CLUB_APPLICATION',
      title: 'New Club Application',
      message: 'Santhana S applied to join Agentic AI & Coding Society',
      application_id: 1,
      is_read: false,
    },
    {
      recipient_user_id: 2, // Siddharth G (President)
      type: 'CLUB_APPLICATION',
      title: 'New Member Application (President Action)',
      message: 'Santhana S applied to join Agentic AI & Coding Society',
      application_id: 1,
      is_read: false,
    },
    {
      recipient_user_id: 1, // Sanjay Krishna (VP)
      type: 'CLUB_APPLICATION',
      title: 'New Member Application (VP Notification)',
      message: 'Santhana S applied to join Agentic AI & Coding Society',
      application_id: 1,
      is_read: false,
    },

    // App 2 (Sabarish R -> Club 1): Notify Mentor, President, VP
    {
      recipient_user_id: 9,
      type: 'CLUB_APPLICATION',
      title: 'New Club Application',
      message: 'Sabarish R applied to join Agentic AI & Coding Society',
      application_id: 2,
      is_read: false,
    },
    {
      recipient_user_id: 2,
      type: 'CLUB_APPLICATION',
      title: 'New Member Application (President Action)',
      message: 'Sabarish R applied to join Agentic AI & Coding Society',
      application_id: 2,
      is_read: false,
    },
    {
      recipient_user_id: 1,
      type: 'CLUB_APPLICATION',
      title: 'New Member Application (VP Notification)',
      message: 'Sabarish R applied to join Agentic AI & Coding Society',
      application_id: 2,
      is_read: false,
    },

    // App 3 (Sanjay Krishna -> Club 2): Notify Mentor (Dr. Nair: 11), President (Senthil P: 5), VP (Sabarish R: 6)
    {
      recipient_user_id: 11,
      type: 'CLUB_APPLICATION',
      title: 'New Club Application',
      message: 'Sanjay Krishna applied to join Robotics & Automation Guild',
      application_id: 3,
      is_read: false,
    },
    {
      recipient_user_id: 5,
      type: 'CLUB_APPLICATION',
      title: 'New Member Application (President Action)',
      message: 'Sanjay Krishna applied to join Robotics & Automation Guild',
      application_id: 3,
      is_read: false,
    },
    {
      recipient_user_id: 6,
      type: 'CLUB_APPLICATION',
      title: 'New Member Application (VP Notification)',
      message: 'Sanjay Krishna applied to join Robotics & Automation Guild',
      application_id: 3,
      is_read: false,
    },
  ];

  for (const n of notificationsData) {
    await pool.execute(
      `INSERT INTO notifications (recipient_user_id, type, title, message, application_id, is_read)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [n.recipient_user_id, n.type, n.title, n.message, n.application_id, n.is_read]
    );
  }

  // =========================================================================
  // 10. SEED CLUB PERFORMANCE & LEADERBOARD
  // =========================================================================
  const performanceData = [
    { club_id: 1, members_count: 142, activities_count: 8, participation_count: 320, score: 960, ranking: 1 },
    { club_id: 2, members_count: 98, activities_count: 6, participation_count: 180, score: 870, ranking: 3 },
    { club_id: 3, members_count: 210, activities_count: 7, participation_count: 450, score: 920, ranking: 2 },
    { club_id: 4, members_count: 165, activities_count: 5, participation_count: 210, score: 840, ranking: 4 },
    { club_id: 5, members_count: 115, activities_count: 4, participation_count: 160, score: 790, ranking: 5 },
  ];

  for (const p of performanceData) {
    await pool.execute(
      `INSERT INTO club_performance (club_id, members_count, activities_count, participation_count, score, ranking)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [p.club_id, p.members_count, p.activities_count, p.participation_count, p.score, p.ranking]
    );
  }

  // =========================================================================
  // 11. SEED ALUMNI NETWORK & MENTORS (10 High-Profile Alumni Across 5 Clubs)
  // =========================================================================
  const alumniData = [
    // Club 1: Agentic AI & Coding Society
    {
      club_id: 1,
      full_name: 'Aravind Subramanian',
      email: 'aravind.subramanian@alumni.agentverse.edu',
      phone_number: '+91 98111 22334',
      graduation_year: 2023,
      degree_branch: 'B.Tech Computer Science & Engineering',
      current_company: 'Google (DeepMind)',
      current_designation: 'Senior AI Research Engineer',
      location: 'Bangalore, India',
      former_club_role: 'Former Club President (2022-23)',
      bio: 'Published 3 research papers in NeurIPS & ICLR while in college. Currently building next-gen multimodal reasoning models at Google DeepMind.',
      skills: JSON.stringify(['Agentic AI', 'PyTorch', 'LLMs', 'Distributed Systems', 'Python']),
      mentorship_areas: JSON.stringify(['Mock Technical Interviews', 'Career Guidance', 'Research & Publication Guidance', 'Referrals']),
      linkedin_url: 'https://linkedin.com/in/aravind-subramanian-ai',
      github_url: 'https://github.com/aravind-subramanian',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      is_available_for_mentorship: true,
    },
    {
      club_id: 1,
      full_name: 'Pooja Natarajan',
      email: 'pooja.natarajan@alumni.agentverse.edu',
      phone_number: '+91 97222 33445',
      graduation_year: 2022,
      degree_branch: 'B.Tech Computer Science & Engineering',
      current_company: 'Microsoft (Azure Cloud)',
      current_designation: 'Distributed Systems Architect',
      location: 'Hyderabad, India',
      former_club_role: 'Former Technical Head (2021-22)',
      bio: 'Led the competitive programming team and won 4 national hackathons. Now architecting hyper-scale Kubernetes microservices at Microsoft Azure.',
      skills: JSON.stringify(['Go', 'Kubernetes', 'Microservices', 'System Design', 'Docker']),
      mentorship_areas: JSON.stringify(['System Design Interviews', 'Job & Internship Referrals', 'Resume Reviews']),
      linkedin_url: 'https://linkedin.com/in/pooja-natarajan-msft',
      github_url: 'https://github.com/pooja-natarajan',
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      is_available_for_mentorship: true,
    },
    {
      club_id: 1,
      full_name: 'Karthik R',
      email: 'karthik.r@alumni.agentverse.edu',
      phone_number: '+91 96333 44556',
      graduation_year: 2023,
      degree_branch: 'B.Tech Computer Science & Engineering',
      current_company: 'NexusAI (YC S24)',
      current_designation: 'Founding Full-Stack Engineer',
      location: 'San Francisco, USA / Remote',
      former_club_role: 'Former Hackathon Lead (2022-23)',
      bio: 'Built multi-agent devtools incubated right in the club lab. Joined Y-Combinator startup as Founding Engineer after graduation.',
      skills: JSON.stringify(['React', 'Next.js', 'FastAPI', 'PostgreSQL', 'TypeScript']),
      mentorship_areas: JSON.stringify(['Startup Pitching & YC', 'Full-Stack Hackathons', 'Angel Mentorship']),
      linkedin_url: 'https://linkedin.com/in/karthik-r-founder',
      github_url: 'https://github.com/karthik-nexus',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      is_available_for_mentorship: true,
    },

    // Club 2: Robotics & Automation Guild
    {
      club_id: 2,
      full_name: 'Vikramaditya K',
      email: 'vikram.k@alumni.agentverse.edu',
      phone_number: '+91 95444 55667',
      graduation_year: 2022,
      degree_branch: 'B.Tech Mechanical & Mechatronics',
      current_company: 'Tesla',
      current_designation: 'Autopilot & Vision Systems Engineer',
      location: 'Palo Alto, USA',
      former_club_role: 'Former Club President (2021-22)',
      bio: 'Led the rover design team to 1st place in University Rover Challenge. Designing autonomous perception algorithms for full self-driving vehicles.',
      skills: JSON.stringify(['ROS2', 'Computer Vision', 'C++', 'Embedded Systems', 'Robotics Hardware']),
      mentorship_areas: JSON.stringify(['Robotics Hardware Design', 'International Competitions', 'US Masters Prep']),
      linkedin_url: 'https://linkedin.com/in/vikram-aditya-tesla',
      github_url: 'https://github.com/vikram-robotics',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      is_available_for_mentorship: true,
    },
    {
      club_id: 2,
      full_name: 'Ananya Sundaram',
      email: 'ananya.sundaram@alumni.agentverse.edu',
      phone_number: '+91 94555 66778',
      graduation_year: 2023,
      degree_branch: 'B.Tech Electronics & Communication',
      current_company: 'ABB Automation',
      current_designation: 'Industrial Robotics Specialist',
      location: 'Bangalore, India',
      former_club_role: 'Former Vice President (2022-23)',
      bio: 'Pioneered robotic arm kinematics workshops for junior batches. Currently working on factory cobots and real-time edge telemetry.',
      skills: JSON.stringify(['PLC Programming', 'MATLAB', 'IoT Sensors', 'Control Systems', 'C++']),
      mentorship_areas: JSON.stringify(['Industrial Automation Careers', 'Hardware Internships', 'Core Placement Prep']),
      linkedin_url: 'https://linkedin.com/in/ananya-sundaram-abb',
      github_url: 'https://github.com/ananya-sundaram',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      is_available_for_mentorship: true,
    },

    // Club 3: Resonance Music & Band Society
    {
      club_id: 3,
      full_name: 'Meera Krishnan',
      email: 'meera.k@alumni.agentverse.edu',
      phone_number: '+91 93666 77889',
      graduation_year: 2023,
      degree_branch: 'B.Tech Electronics & Communication',
      current_company: 'Spotify',
      current_designation: 'Audio DSP Engineer & Music Producer',
      location: 'London, UK / Stockholm',
      former_club_role: 'Former Society President & Lead Vocalist (2022-23)',
      bio: 'Headlined 12 inter-college battle of the bands. Blending audio digital signal processing with AI-driven recommendation and mastering algorithms at Spotify.',
      skills: JSON.stringify(['Digital Signal Processing', 'Audio Engineering', 'Live Production', 'Sound Synthesis']),
      mentorship_areas: JSON.stringify(['Audio Tech Careers', 'Music Production Masterclasses', 'Portfolio Reviews']),
      linkedin_url: 'https://linkedin.com/in/meera-krishnan-audio',
      github_url: 'https://github.com/meera-dsp',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      is_available_for_mentorship: true,
    },
    {
      club_id: 3,
      full_name: 'Rahul Dev',
      email: 'rahul.dev@alumni.agentverse.edu',
      phone_number: '+91 92777 88990',
      graduation_year: 2021,
      degree_branch: 'B.Tech Computer Science & Engineering',
      current_company: 'Netflix Studios',
      current_designation: 'Media Technology & Audio Lead',
      location: 'Mumbai, India',
      former_club_role: 'Former Lead Guitarist & Composer',
      bio: 'Produced the university silver jubilee anthem. Managing spatial audio engineering and OTT encoding workflows for global productions.',
      skills: JSON.stringify(['Spatial Audio', 'Logic Pro', 'Python Media Pipeline', 'Acoustics']),
      mentorship_areas: JSON.stringify(['Media Technology Roles', 'Festival Management', 'Creative Tech']),
      linkedin_url: 'https://linkedin.com/in/rahul-dev-sound',
      github_url: 'https://github.com/rahul-dev-audio',
      avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
      is_available_for_mentorship: true,
    },

    // Club 4: E-Cell & Startup Incubator
    {
      club_id: 4,
      full_name: 'Tarun Adithya',
      email: 'tarun.adithya@alumni.agentverse.edu',
      phone_number: '+91 91888 99001',
      graduation_year: 2022,
      degree_branch: 'B.Tech Information Technology',
      current_company: 'FinScale Technologies',
      current_designation: 'Co-Founder & CEO (Raised $4.5M Series A)',
      location: 'Bangalore, India',
      former_club_role: 'Former E-Cell President (2021-22)',
      bio: 'Launched first campus startup through the E-Cell incubator grant. Now leading a 40-person fintech venture backed by marquee venture capital funds.',
      skills: JSON.stringify(['Venture Capital', 'Product Market Fit', 'Pitch Decks', 'FinTech', 'Fundraising']),
      mentorship_areas: JSON.stringify(['Founder 1:1 Mentorship', 'Investor Pitch Deck Reviews', 'Seed Grant Guidance']),
      linkedin_url: 'https://linkedin.com/in/tarun-adithya-finscale',
      github_url: 'https://github.com/tarun-finscale',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
      is_available_for_mentorship: true,
    },
    {
      club_id: 4,
      full_name: 'Divya Prakash',
      email: 'divya.prakash@alumni.agentverse.edu',
      phone_number: '+91 90999 00112',
      graduation_year: 2023,
      degree_branch: 'B.Tech Computer Science & Engineering',
      current_company: 'CRED',
      current_designation: 'Product Manager — Growth',
      location: 'Bangalore, India',
      former_club_role: 'Former Vice President (2022-23)',
      bio: 'Organized the annual campus Startup Expo with 60+ startup booths. Transitioned from software engineering into top-tier fintech product management.',
      skills: JSON.stringify(['Product Strategy', 'Growth Marketing', 'User Research', 'Data Analytics', 'SQL']),
      mentorship_areas: JSON.stringify(['PM Mock Interviews', 'APM Program Preparation', 'Product Case Studies']),
      linkedin_url: 'https://linkedin.com/in/divya-prakash-pm',
      github_url: 'https://github.com/divya-pm',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      is_available_for_mentorship: true,
    },

    // Club 5: Cyber Shield Security Club
    {
      club_id: 5,
      full_name: 'Sneha Murali',
      email: 'sneha.murali@alumni.agentverse.edu',
      phone_number: '+91 99000 11223',
      graduation_year: 2023,
      degree_branch: 'B.Tech Cyber Security & Digital Forensics',
      current_company: 'CrowdStrike',
      current_designation: 'Senior Threat Hunter & Pentester',
      location: 'Hyderabad, India',
      former_club_role: 'Former Club President (2022-23)',
      bio: 'Ranked Top 20 globally in HackTheBox and discovered 5 CVE bounties. Performing advanced adversary emulation and zero-day defense at CrowdStrike.',
      skills: JSON.stringify(['Ethical Hacking', 'Penetration Testing', 'CTFs', 'Reverse Engineering', 'Burp Suite']),
      mentorship_areas: JSON.stringify(['Global CTF Training', 'OSCP Certification Roadmaps', 'Security Job Referrals']),
      linkedin_url: 'https://linkedin.com/in/sneha-murali-security',
      github_url: 'https://github.com/sneha-cybershield',
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      is_available_for_mentorship: true,
    },
    {
      club_id: 5,
      full_name: 'Adarsh Menon',
      email: 'adarsh.menon@alumni.agentverse.edu',
      phone_number: '+91 98111 33221',
      graduation_year: 2021,
      degree_branch: 'B.Tech Computer Science & Engineering',
      current_company: 'Palo Alto Networks',
      current_designation: 'Cloud Security Architect',
      location: 'Bangalore, India',
      former_club_role: 'Former Technical Head (2020-21)',
      bio: 'Architected the collegiate sandbox network defense lab. Specializes in multi-cloud zero trust architectures, IAM governance, and threat modeling.',
      skills: JSON.stringify(['AWS Security', 'Zero Trust Architecture', 'Kubernetes Security', 'IAM', 'Terraform']),
      mentorship_areas: JSON.stringify(['Cloud Security Career Roadmap', 'Mock Security Architecture Reviews', 'Job Referrals']),
      linkedin_url: 'https://linkedin.com/in/adarsh-menon-cyber',
      github_url: 'https://github.com/adarsh-cloudsec',
      avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
      is_available_for_mentorship: true,
    }
  ];

  for (const a of alumniData) {
    await pool.execute(
      `INSERT INTO alumni (club_id, full_name, email, phone_number, graduation_year, degree_branch, current_company, current_designation, location, former_club_role, bio, skills, mentorship_areas, linkedin_url, github_url, avatar_url, is_available_for_mentorship)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        a.club_id,
        a.full_name,
        a.email,
        a.phone_number,
        a.graduation_year,
        a.degree_branch,
        a.current_company,
        a.current_designation,
        a.location,
        a.former_club_role,
        a.bio,
        a.skills,
        a.mentorship_areas,
        a.linkedin_url,
        a.github_url,
        a.avatar_url,
        a.is_available_for_mentorship,
      ]
    );
  }

  console.log('[DB Seed] ✅ Successfully seeded 8 students, 5 teachers, 5 clubs, 7 activities, 11 alumni mentors, certificates, applications & notifications!\n');
}

// Run directly if called as a script
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase()
    .then(() => {
      console.log('[DB Seed] Seeding complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[DB Seed Error]', err);
      process.exit(1);
    });
}
