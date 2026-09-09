import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { loginUser } from '../../services/authService.js';

const DEMO_FACULTY = [
  { name: 'Dr. A. K. Gupta', email: 'dr.gupta@agentverse.edu', role: 'CSE / AI Society Mentor' },
  { name: 'Prof. Meenakshi Sharma', email: 'prof.sharma@agentverse.edu', role: 'Resonance Music Mentor' },
  { name: 'Dr. Ramesh Nair', email: 'dr.nair@agentverse.edu', role: 'Robotics Guild Mentor' },
  { name: 'Prof. Rajesh Verma', email: 'prof.verma@agentverse.edu', role: 'E-Cell Incubator Mentor' },
  { name: 'Dr. Sunita Deshmukh', email: 'dr.deshmukh@agentverse.edu', role: 'Cyber Shield Mentor' },
  { name: 'Campus Admin', email: 'admin@agentverse.edu', role: 'Central Administrator' },
];

const TeacherLogin = ({ onNavigate, onToggleRole }) => {
  const navigate = useNavigate();
  const { setRole: setGlobalRole, login: setAuthUser } = useAuth();
  const [formData, setFormData] = useState({
    facultyIdOrEmail: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name] || errors.general) {
      setErrors((prev) => ({ ...prev, [name]: '', general: '' }));
    }
  };

  const fillQuickFaculty = (email) => {
    setFormData((prev) => ({
      ...prev,
      facultyIdOrEmail: email,
      password: 'password123',
    }));
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};

    // 1. Email / Faculty ID
    if (!formData.facultyIdOrEmail.trim()) {
      newErrors.facultyIdOrEmail = 'Please enter your faculty email or ID';
    }

    // 2. Password
    if (!formData.password) {
      newErrors.password = 'Please enter your password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrors({});

    if (validate()) {
      setIsSubmitting(true);
      try {
        const email = formData.facultyIdOrEmail.trim();
        const res = await loginUser({
          email,
          password: formData.password,
        });

        const loggedInUser = res?.data?.user || res?.user || {
          email,
          full_name: email.includes('admin') ? 'Campus Administrator' : 'Faculty Mentor',
          role: email.includes('admin') ? 'ADMIN' : 'TEACHER',
        };

        const isAdm = loggedInUser.role === 'ADMIN' || email.toLowerCase().includes('admin');
        const userRole = isAdm ? 'ADMIN' : 'TEACHER';

        const finalUser = {
          ...loggedInUser,
          role: userRole,
          name: loggedInUser.name || loggedInUser.full_name || (isAdm ? 'Campus Administrator' : 'Faculty Mentor'),
          full_name: loggedInUser.full_name || loggedInUser.name || (isAdm ? 'Campus Administrator' : 'Faculty Mentor'),
        };

        setSuccessMessage(isAdm ? 'Admin authentication successful!' : 'Faculty login successful!');
        if (typeof setAuthUser === 'function') {
          setAuthUser(finalUser);
        }

        setTimeout(() => {
          if (typeof onNavigate === 'function') {
            onNavigate(isAdm ? 'admin-dashboard' : 'teacher-dashboard');
          } else {
            navigate(isAdm ? '/admin/dashboard' : '/teacher/dashboard');
          }
        }, 500);
      } catch (err) {
        console.warn('[Teacher Login Error]:', err.message);
        setErrors({ general: err.message || 'Invalid credentials. Please verify your faculty email and password.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };


  return (
    <div className="w-full">
      {/* Segmented Toggle: Student | Teacher */}
      <div className="mb-6">
        <div className="bg-slate-100 p-1 rounded-xl flex items-center max-w-xs mx-auto border border-slate-200/60">
          <button
            type="button"
            onClick={() => {
              if (typeof onToggleRole === 'function') {
                onToggleRole('student');
              } else if (typeof onNavigate === 'function') {
                onNavigate('login');
              } else {
                window.location.hash = '#login';
              }
            }}
            className="flex-1 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-lg transition text-center cursor-pointer"
          >
            Student
          </button>
          <button
            type="button"
            className="flex-1 py-1.5 text-xs font-bold text-indigo-700 bg-white shadow-xs rounded-lg transition text-center cursor-default"
          >
            Teacher
          </button>
        </div>
      </div>

      {/* Heading & Supporting Text */}
      <div className="mb-6 text-left">
        <div className="inline-block px-2.5 py-1 mb-2 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase tracking-wider border border-indigo-100">
          Faculty Portal
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Faculty Login
        </h2>
        <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
          Access your faculty dashboard and monitor student activities.
        </p>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-2.5 animate-fadeIn">
          <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Error Banner */}
      {errors.general && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center space-x-2.5 animate-fadeIn">
          <svg className="w-5 h-5 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-semibold">{errors.general}</span>
        </div>
      )}

      {/* Quick Demo Faculty / Admin Login Roster */}
      <div className="mb-5 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            ⚡ Quick Faculty & Admin Logins (Password: password123)
          </span>
          <span className="text-[10px] font-bold text-indigo-600">1-Click Fill</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {DEMO_FACULTY.map((fac) => (
            <button
              type="button"
              key={fac.email}
              onClick={() => fillQuickFaculty(fac.email)}
              className="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-semibold transition cursor-pointer"
              title={`${fac.name} (${fac.role})`}
            >
              {fac.name}
            </button>
          ))}
        </div>
      </div>

      {/* Teacher Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        
        {/* Field 1: Email / Faculty ID */}
        <div>
          <label 
            htmlFor="teacher-email-id" 
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Email / Faculty ID
          </label>
          <div className="relative">
            <input
              id="teacher-email-id"
              type="text"
              name="facultyIdOrEmail"
              value={formData.facultyIdOrEmail}
              onChange={handleChange}
              placeholder="Enter your faculty email or ID"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition duration-150 focus:bg-white focus:outline-none focus:ring-2 ${
                errors.facultyIdOrEmail
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:border-indigo-600 focus:ring-indigo-600/20'
              }`}
            />
          </div>
          {errors.facultyIdOrEmail && (
            <p className="text-rose-600 text-xs mt-1.5 flex items-center space-x-1">
              <svg className="w-3.5 h-3.5 inline shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errors.facultyIdOrEmail}</span>
            </p>
          )}
        </div>

        {/* Field 2: Password with Show/Hide Toggle */}
        <div>
          <label 
            htmlFor="teacher-password-input" 
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="teacher-password-input"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full pl-4 pr-11 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition duration-150 focus:bg-white focus:outline-none focus:ring-2 ${
                errors.password
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:border-indigo-600 focus:ring-indigo-600/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-rose-600 text-xs mt-1.5 flex items-center space-x-1">
              <svg className="w-3.5 h-3.5 inline shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errors.password}</span>
            </p>
          )}
        </div>

        {/* Remember Me + Forgot Password Row */}
        <div className="flex items-center justify-between text-sm pt-1">
          <label className="flex items-center space-x-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 focus:ring-2 cursor-pointer"
            />
            <span className="text-slate-600 text-sm font-medium">Remember me</span>
          </label>

          <button
            type="button"
            onClick={() => alert('Faculty password resets are managed through IT Administration (it-support@college.edu).')}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline transition cursor-pointer focus:outline-none"
          >
            Forgot password?
          </button>
        </div>

        {/* Login Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Authenticating...</span>
              </span>
            ) : (
              'Login'
            )}
          </button>
        </div>

        {/* Notice: NO REGISTRATION LINK */}
        <div className="pt-4 text-center text-xs text-slate-500 border-t border-slate-100 flex items-center justify-center space-x-1.5">
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Faculty accounts are provided by the institution.</span>
        </div>

      </form>
    </div>
  );
};

export default TeacherLogin;
