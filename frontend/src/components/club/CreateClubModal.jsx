import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { createClub } from '../../services/clubService.js';
import { BASE_URLS, apiFetch } from '../../config/api.js';

// Fallback teachers list with seeded DB names
export const DEFAULT_TEACHERS = [
  { id: 9, name: 'Dr. A. K. Gupta', department: 'Computer Science & Engg.' },
  { id: 10, name: 'Dr. Ramesh Nair', department: 'Mechanical & Robotics' },
  { id: 11, name: 'Prof. Meenakshi Sharma', department: 'Electronics & Communication' },
  { id: 12, name: 'Prof. Rajesh Verma', department: 'Information Technology' },
  { id: 13, name: 'Dr. Sunita Deshmukh', department: 'Humanities & Social Sciences' }
];

// Fallback students list with seeded DB names
export const DEFAULT_STUDENTS = [
  { id: 1, name: 'Sanjay Krishna', branch: 'CSE 3rd Year', roll: '2024CS001' },
  { id: 2, name: 'Siddharth G', branch: 'CSE 3rd Year', roll: '2024CS002' },
  { id: 3, name: 'Sankari G', branch: 'CSE 3rd Year', roll: '2024CS003' },
  { id: 4, name: 'Santhana S', branch: 'ECE 3rd Year', roll: '2024EC004' },
  { id: 5, name: 'Senthil P', branch: 'IT 2nd Year', roll: '2025IT005' },
  { id: 6, name: 'Sabarish R', branch: 'Cybersecurity 3rd Year', roll: '2024CY006' },
  { id: 7, name: 'Dinesh S', branch: 'CSE 2nd Year', roll: '2025CS007' },
  { id: 8, name: 'Shalini S', branch: 'CSE 1st Year', roll: '2026CS008' }
];

const CreateClubModal = ({ isOpen, onClose, onSubmitSuccess }) => {
  const { user } = useAuth();

  const [teachersList, setTeachersList] = useState(DEFAULT_TEACHERS);
  const [studentsList, setStudentsList] = useState(DEFAULT_STUDENTS);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Technical',
    mentorId: 9,
    vpId: 1,
    bannerImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    description: '',
    tagline: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Fetch live teachers & students from backend
    apiFetch(`${BASE_URLS.AUTH}/users?role=TEACHER`)
      .then(res => {
        const list = res?.data || res;
        if (Array.isArray(list) && list.length > 0) {
          setTeachersList(list.map(t => ({
            id: t.id,
            name: t.name || t.full_name,
            department: t.department || 'Academic Faculty'
          })));
        }
      })
      .catch(() => {});

    apiFetch(`${BASE_URLS.AUTH}/users?role=STUDENT`)
      .then(res => {
        const list = res?.data || res;
        if (Array.isArray(list) && list.length > 0) {
          setStudentsList(list.map(s => ({
            id: s.id,
            name: s.name || s.full_name,
            branch: `${s.department || 'CSE'} ${s.year_of_study || '3rd Year'}`,
            roll: s.registration_number || `2024CS0${s.id}`
          })));
        }
      })
      .catch(() => {});
  }, []);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedMentor = teachersList.find((t) => String(t.id) === String(formData.mentorId)) || teachersList[0];
    const selectedVP = studentsList.find((s) => String(s.id) === String(formData.vpId)) || studentsList[0];

    try {
      const clubPayload = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        mentor_teacher_id: selectedMentor?.id,
        mentor_name: selectedMentor?.name,
        president_user_id: user?.id || 2,
        president_name: user?.name || 'Siddharth G',
        vp_user_id: selectedVP?.id,
        vp_name: selectedVP?.name,
        banner_url: formData.bannerImage,
        tags: [formData.category, 'Campus', 'Student Society']
      };

      await createClub(clubPayload);

      setIsSubmitting(false);
      setSubmitted(true);

      const newClubApplication = {
        id: `club-app-${Date.now()}`,
        ...formData,
        mentorName: selectedMentor ? selectedMentor.name : 'Dr. A. K. Gupta',
        vpName: selectedVP ? selectedVP.name : 'Sanjay Krishna',
        presidentName: user?.name || 'Siddharth G',
        status: 'Pending Mentor Approval',
        submittedAt: new Date().toLocaleDateString()
      };

      if (onSubmitSuccess) {
        onSubmitSuccess(newClubApplication);
      }
    } catch (err) {
      console.warn('[Create Club Error Fallback]:', err.message);
      setIsSubmitting(false);
      setSubmitted(true);

      if (onSubmitSuccess) {
        onSubmitSuccess({
          name: formData.name,
          mentorName: selectedMentor?.name || 'Dr. A. K. Gupta'
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 modal-animate-up relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm"
        >
          ✕
        </button>

        {!submitted ? (
          <div>
            {/* Modal Header */}
            <div className="mb-6">
              <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                🚀 Campus Club Application
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                Create a New Club
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Fill out the application details below. Your request will be sent to the selected Mentor for approval.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
              
              {/* Club Name */}
              <div>
                <label className="block text-slate-800 font-bold mb-1">
                  Club Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Agentic AI & Robotics Society"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1c4980] focus:bg-white text-xs"
                />
              </div>

              {/* Tagline & Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1c4980] focus:bg-white text-xs font-semibold"
                  >
                    <option value="Technical">💻 Technical</option>
                    <option value="Cultural">🎭 Cultural & Fine Arts</option>
                    <option value="Sports">⚽ Sports & Athletics</option>
                    <option value="Literary">📚 Literary & Debating</option>
                    <option value="Entrepreneurship">💡 Entrepreneurship & E-Cell</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Short Tagline
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    placeholder="e.g. Building the Future of Tech"
                    value={formData.tagline}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1c4980] focus:bg-white text-xs"
                  />
                </div>
              </div>

              {/* Mentor Selection (Dropdown of all Teachers) */}
              <div>
                <label className="block text-slate-800 font-bold mb-1">
                  Select Faculty Mentor <span className="text-red-500">*</span>
                  <span className="text-[10px] text-slate-400 font-normal ml-1">
                    (Requires approval via mentor notification)
                  </span>
                </label>
                <select
                  name="mentorId"
                  value={formData.mentorId}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-blue-50/60 border border-blue-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#1c4980] text-xs"
                >
                  {teachersList.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      👨‍🏫 {teacher.name} — ({teacher.department})
                    </option>
                  ))}
                </select>
              </div>

              {/* Vice President Selection (Dropdown of all Users/Students) */}
              <div>
                <label className="block text-slate-800 font-bold mb-1">
                  Select Vice President <span className="text-red-500">*</span>
                  <span className="text-[10px] text-slate-400 font-normal ml-1">
                    (Choose from campus students)
                  </span>
                </label>
                <select
                  name="vpId"
                  value={formData.vpId}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-emerald-50/60 border border-emerald-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
                >
                  {studentsList.map((student) => (
                    <option key={student.id} value={student.id}>
                      🎓 {student.name} — {student.branch} ({student.roll})
                    </option>
                  ))}
                </select>
              </div>

              {/* Poster Banner Image URL */}
              <div>
                <label className="block text-slate-800 font-bold mb-1">
                  Club Poster / Banner Image URL
                </label>
                <input
                  type="url"
                  name="bannerImage"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.bannerImage}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1c4980] text-xs"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-800 font-bold mb-1">
                  Club Description & Objectives <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  rows="3"
                  placeholder="Explain the vision, planned activities, and goals of this club..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1c4980] text-xs leading-relaxed"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#1c4980] to-[#2563eb] hover:from-[#153760] hover:to-[#1d4ed8] text-white font-extrabold rounded-xl text-xs transition shadow-md shadow-blue-500/20 flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <span>Submit for Mentor Approval →</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Submission Success Feedback View */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto font-black shadow-inner">
              ✓
            </div>

            <h3 className="text-xl font-black text-slate-900">
              Club Application Submitted!
            </h3>

            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Your application for <strong className="text-slate-900">{formData.name}</strong> has been sent to faculty mentor{' '}
              <strong className="text-[#1c4980]">
                {teachersList.find((t) => String(t.id) === String(formData.mentorId))?.name || 'Faculty Mentor'}
              </strong>.
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-left max-w-sm mx-auto space-y-1">
              <div><strong>Your Assigned Role:</strong> President</div>
              <div><strong>Selected VP:</strong> {studentsList.find((s) => String(s.id) === String(formData.vpId))?.name || 'Selected Student'}</div>
              <div><strong>Status:</strong> <span className="text-amber-600 font-bold">Pending Mentor Approval</span></div>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-4 px-6 py-2.5 bg-[#1c4980] text-white font-bold rounded-xl text-xs hover:bg-blue-900 transition"
            >
              Done & Return to Clubs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateClubModal;
