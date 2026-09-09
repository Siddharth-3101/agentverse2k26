import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const PERSONAS = {
  STUDENT: {
    id: 2,
    name: 'Siddharth G',
    full_name: 'Siddharth G',
    email: 'siddharth.g@agentverse.edu',
    role: 'STUDENT',
    department: 'Computer Science & Engineering',
    dept: 'Computer Science & Engineering',
    year_of_study: 3,
    year: '3rd Year',
    student_id_number: '2024CS002',
    phone_number: '+91 98765 43210',
    skills: ['Python', 'Agentic AI', 'React', 'FastAPI', 'LangChain'],
    bio: 'AI researcher and President of Agentic AI & Coding Society.',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
  },
  STUDENT_SANJAY: {
    id: 1,
    name: 'Sanjay Krishna',
    full_name: 'Sanjay Krishna',
    email: 'sanjay.krishna@agentverse.edu',
    role: 'STUDENT',
    department: 'Computer Science & Engineering',
    dept: 'Computer Science & Engineering',
    year_of_study: 3,
    year: '3rd Year',
    student_id_number: '2024CS001',
    phone_number: '+91 98765 11223',
    skills: ['Solidity', 'Smart Contracts', 'Web3.js', 'Node.js', 'Go'],
    bio: 'Web3 & Blockchain builder. President of Web3 Guild & VP of AI Society.',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150'
  },
  STUDENT_SANKARI: {
    id: 3,
    name: 'Sankari G',
    full_name: 'Sankari G',
    email: 'sankari.g@agentverse.edu',
    role: 'STUDENT',
    department: 'Electronics & Communication',
    dept: 'Electronics & Communication',
    year_of_study: 3,
    year: '3rd Year',
    student_id_number: '2024EC003',
    phone_number: '+91 98765 22334',
    skills: ['Network Security', 'Penetration Testing', 'Cryptography', 'Wireshark'],
    bio: 'Cybersecurity advocate and President of Cyber Defense Guild.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  },
  STUDENT_SANTHANA: {
    id: 4,
    name: 'Santhana S',
    full_name: 'Santhana S',
    email: 'santhana.s@agentverse.edu',
    role: 'STUDENT',
    department: 'Information Technology',
    dept: 'Information Technology',
    year_of_study: 2,
    year: '2nd Year',
    student_id_number: '2025IT004',
    phone_number: '+91 98765 33445',
    skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD'],
    bio: 'Cloud architecture enthusiast and President of Cloud & DevOps Guild.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  STUDENT_SENTHIL: {
    id: 5,
    name: 'Senthil P',
    full_name: 'Senthil P',
    email: 'senthil.p@agentverse.edu',
    role: 'STUDENT',
    department: 'Mechanical Engineering',
    dept: 'Mechanical Engineering',
    year_of_study: 4,
    year: '4th Year',
    student_id_number: '2023ME005',
    phone_number: '+91 98765 44556',
    skills: ['ROS 2', 'Embedded C', 'IoT', 'Arduino', 'Robotics Hardware'],
    bio: 'Robotics engineer and President of Robotics & Autonomous Systems.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  },
  STUDENT_SABARISH: {
    id: 6,
    name: 'Sabarish R',
    full_name: 'Sabarish R',
    email: 'sabarish.r@agentverse.edu',
    role: 'STUDENT',
    department: 'Computer Science & Engineering',
    dept: 'Computer Science & Engineering',
    year_of_study: 2,
    year: '2nd Year',
    student_id_number: '2025CS006',
    phone_number: '+91 98765 55667',
    skills: ['Full Stack', 'Next.js', 'PostgreSQL', 'TailwindCSS'],
    bio: 'Full-stack web developer and competitive coder.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
  },
  STUDENT_DINESH: {
    id: 7,
    name: 'Dinesh S',
    full_name: 'Dinesh S',
    email: 'dinesh.s@agentverse.edu',
    role: 'STUDENT',
    department: 'AI & Data Science',
    dept: 'AI & Data Science',
    year_of_study: 3,
    year: '3rd Year',
    student_id_number: '2024AD007',
    phone_number: '+91 98765 66778',
    skills: ['Machine Learning', 'Data Pipelines', 'PyTorch', 'Pandas'],
    bio: 'Data Science enthusiast and Kaggle competitor.',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150'
  },
  STUDENT_SHALINI: {
    id: 8,
    name: 'Shalini S',
    full_name: 'Shalini S',
    email: 'shalini.s@agentverse.edu',
    role: 'STUDENT',
    department: 'Electrical & Electronics',
    dept: 'Electrical & Electronics',
    year_of_study: 2,
    year: '2nd Year',
    student_id_number: '2025EE008',
    phone_number: '+91 98765 77889',
    skills: ['Circuit Design', 'Microcontrollers', 'IoT Sensors', 'MATLAB'],
    bio: 'Hardware engineer and IoT enthusiast.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  },
  TEACHER: {
    id: 9,
    name: 'Dr. A. K. Gupta',
    full_name: 'Dr. A. K. Gupta',
    email: 'dr.gupta@agentverse.edu',
    role: 'TEACHER',
    department: 'Computer Science & Engineering',
    dept: 'Computer Science & Engineering',
    staff_id: 'STF001',
    club: 'Agentic AI & Coding Society',
    club_id: 1,
    phone_number: '+91 98112 23344',
    bio: 'Professor & Head of AI Research. Faculty Mentor for Agentic AI & Coding Society.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },
  TEACHER_SHARMA: {
    id: 10,
    name: 'Prof. Meenakshi Sharma',
    full_name: 'Prof. Meenakshi Sharma',
    email: 'prof.sharma@agentverse.edu',
    role: 'TEACHER',
    department: 'Electronics & Communication',
    dept: 'Electronics & Communication',
    staff_id: 'STF002',
    club: 'Resonance Music & Band Society',
    club_id: 3,
    phone_number: '+91 98300 11223',
    bio: 'Associate Professor & Faculty Mentor for Resonance Music & Band Society.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
  },
  TEACHER_NAIR: {
    id: 11,
    name: 'Dr. Ramesh Nair',
    full_name: 'Dr. Ramesh Nair',
    email: 'dr.nair@agentverse.edu',
    role: 'TEACHER',
    department: 'Robotics & Automation',
    dept: 'Robotics & Automation',
    staff_id: 'STF003',
    club: 'Robotics & Automation Guild',
    club_id: 2,
    phone_number: '+91 98765 43210',
    bio: 'Professor & Faculty Mentor for Robotics & Automation Guild.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
  },
  TEACHER_VERMA: {
    id: 12,
    name: 'Prof. Rajesh Verma',
    full_name: 'Prof. Rajesh Verma',
    email: 'prof.verma@agentverse.edu',
    role: 'TEACHER',
    department: 'Information Technology',
    dept: 'Information Technology',
    staff_id: 'STF004',
    club: 'E-Cell & Startup Incubator',
    club_id: 4,
    phone_number: '+91 97110 09988',
    bio: 'Associate Professor & Faculty Mentor for E-Cell & Startup Incubator.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
  },
  TEACHER_DESHMUKH: {
    id: 13,
    name: 'Dr. Sunita Deshmukh',
    full_name: 'Dr. Sunita Deshmukh',
    email: 'dr.deshmukh@agentverse.edu',
    role: 'TEACHER',
    department: 'Cyber Security',
    dept: 'Cyber Security',
    staff_id: 'STF005',
    club: 'Cyber Shield Security Club',
    club_id: 5,
    phone_number: '+91 98765 99887',
    bio: 'Professor & Faculty Mentor for Cyber Shield Security Club.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
  },
  ADMIN: {
    id: 14,
    name: 'Campus Administrator',
    full_name: 'Campus Administrator',
    email: 'admin@agentverse.edu',
    role: 'ADMIN',
    department: 'Academic Administration',
    dept: 'Administration',
    phone_number: '+91 99999 88888',
    bio: 'University Central Administration Portal Manager.',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'
  }
};

export const normalizeUser = (u) => {
  if (!u) return null;
  const name = u.name || u.full_name || u.email?.split('@')[0] || 'User';
  const department = u.department || u.dept || u.profile?.department || 'Computer Science & Engineering';
  const year_of_study = u.year_of_study || u.profile?.year_of_study || 3;
  const year = u.year || `${year_of_study}${year_of_study === 1 ? 'st' : year_of_study === 2 ? 'nd' : year_of_study === 3 ? 'rd' : 'th'} Year`;
  const phone = u.phone_number || u.phone || u.profile?.phone_number || '+91 98765 43210';
  const student_id_number = u.student_id_number || u.profile?.student_id || (u.id ? `2024CS00${u.id}` : '2024CS001');
  const staff_id = u.staff_id || u.profile?.staff_id || (u.id ? `STF00${u.id - 8}` : 'STF001');
  const club = u.club || u.profile?.club_name || u.club_name || null;
  const club_id = u.club_id || u.profile?.club_id || null;

  return {
    ...u,
    id: u.id || 1,
    name,
    full_name: name,
    email: u.email || 'user@agentverse.edu',
    role: (u.role || 'STUDENT').toUpperCase(),
    department,
    dept: department,
    year_of_study,
    year,
    student_id_number,
    staff_id,
    club,
    club_id,
    phone_number: phone,
    phone,
    skills: u.skills && u.skills.length > 0 ? u.skills : ['Python', 'React', 'AI Agents', 'Node.js', 'FastAPI'],
    bio: u.bio || `Member at AgentVerse University.`
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('agentverse_user');
      const token = localStorage.getItem('agentverse_token');
      if (saved && token) {
        return normalizeUser(JSON.parse(saved));
      }
      return null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('agentverse_user', JSON.stringify(user));
    }
  }, [user]);

  const loginAs = (personaKey) => {
    let personaObj = null;
    if (typeof personaKey === 'string' && PERSONAS[personaKey]) {
      personaObj = PERSONAS[personaKey];
    } else if (typeof personaKey === 'object' && personaKey !== null) {
      personaObj = personaKey;
    }
    if (personaObj) {
      const normalized = normalizeUser(personaObj);
      setUser(normalized);
      localStorage.setItem('agentverse_user', JSON.stringify(normalized));
      localStorage.setItem('agentverse_token', 'mock_jwt_token_' + normalized.id);
    }
  };

  const setRole = (newRole) => {
    setUser((prev) => (prev ? { ...prev, role: newRole.toUpperCase() } : { role: newRole.toUpperCase() }));
  };

  const login = (userData) => {
    const normalized = normalizeUser(userData);
    setUser(normalized);
    localStorage.setItem('agentverse_user', JSON.stringify(normalized));
    if (!localStorage.getItem('agentverse_token')) {
      localStorage.setItem('agentverse_token', 'token_' + normalized.id);
    }
  };

  const logout = () => {
    localStorage.removeItem('agentverse_user');
    localStorage.removeItem('agentverse_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role || 'GUEST', setUser, setRole, loginAs, login, logout, PERSONAS, normalizeUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


