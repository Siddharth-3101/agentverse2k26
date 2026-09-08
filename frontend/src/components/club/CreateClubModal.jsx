import React, { useState } from 'react';

// DUMMY TEACHERS LIST FOR MENTOR SELECTION DROPDOWN
export const DUMMY_TEACHERS = [
  { id: 't-1', name: 'Dr. A. K. Gupta', department: 'Computer Science & Engg.' },
  { id: 't-2', name: 'Prof. Meenakshi Sharma', department: 'Electronics & Communication' },
  { id: 't-3', name: 'Dr. R. K. Singh', department: 'Mechanical & Robotics Dept.' },
  { id: 't-4', name: 'Dr. Sunita Deshmukh', department: 'Humanities & Social Sciences' },
  { id: 't-5', name: 'Prof. Rajesh Verma', department: 'Information Technology' }
];

// DUMMY STUDENTS / USERS LIST FOR VICE PRESIDENT SELECTION DROPDOWN
export const DUMMY_STUDENTS = [
  { id: 's-101', name: 'Aarav Sharma', branch: 'CSE 3rd Year', roll: '2024CS101' },
  { id: 's-102', name: 'Rohan Mehta', branch: 'ECE 3rd Year', roll: '2024EC105' },
  { id: 's-103', name: 'Priya Patel', branch: 'IT 2nd Year', roll: '2025IT203' },
  { id: 's-104', name: 'Vikramaditya Roy', branch: 'CSE 4th Year', roll: '2023CS012' },
  { id: 's-105', name: 'Ananya Deshmukh', branch: 'Mechanical 3rd Year', roll: '2024ME044' }
];

const CreateClubModal = ({ isOpen, onClose, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Technical',
    mentorId: 't-1',
    vpId: 's-101',
    bannerImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    description: '',
    tagline: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get selected mentor and VP details
    const selectedMentor = DUMMY_TEACHERS.find((t) => t.id === formData.mentorId);
    const selectedVP = DUMMY_STUDENTS.find((s) => s.id === formData.vpId);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);

      const newClubApplication = {
        id: `club-app-${Date.now()}`,
        ...formData,
        mentorName: selectedMentor ? selectedMentor.name : 'Dr. A. K. Gupta',
        vpName: selectedVP ? selectedVP.name : 'Aarav Sharma',
        presidentName: 'Siddharth (You)',
        status: 'Pending Mentor Approval',
        submittedAt: new Date().toLocaleDateString()
      };

      if (onSubmitSuccess) {
        onSubmitSuccess(newClubApplication);
      }
    }, 1000);
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
                  {DUMMY_TEACHERS.map((teacher) => (
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
                  {DUMMY_STUDENTS.map((student) => (
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
                {DUMMY_TEACHERS.find((t) => t.id === formData.mentorId)?.name}
              </strong>.
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-left max-w-sm mx-auto space-y-1">
              <div><strong>Your Assigned Role:</strong> President</div>
              <div><strong>Selected VP:</strong> {DUMMY_STUDENTS.find((s) => s.id === formData.vpId)?.name}</div>
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
