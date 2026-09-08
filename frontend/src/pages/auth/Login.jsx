import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import TeacherLogin from './TeacherLogin.jsx';

const Login = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { setRole: setGlobalRole } = useAuth();
  const [role, setRole] = useState('student'); // 'student' | 'teacher'

  // Student form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNavigateToRegister = (e) => {
    if (e) e.preventDefault();
    if (typeof onNavigate === 'function') {
      onNavigate('register');
    } else {
      navigate('/register');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter a valid email address';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Please enter your password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (validate()) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccessMessage('Login successful!');
        setGlobalRole('STUDENT');
        setTimeout(() => {
          if (typeof onNavigate === 'function') {
            onNavigate('dashboard');
          } else {
            navigate('/dashboard');
          }
        }, 1000);
      }, 350);
    }
  };


  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left Side: CampusVerse Branding */}
        <div className="w-full lg:w-5/12 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#3730a3] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white block">CampusVerse</span>
                <span className="text-[10px] font-semibold text-indigo-300 tracking-wider uppercase">University Network</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white leading-tight mb-2.5">
              Empowering Student Leadership & Innovation
            </h2>
            <p className="text-indigo-100/75 text-xs sm:text-sm leading-relaxed">
              Connect to official student societies, track achievements, and explore verified national opportunities.
            </p>
          </div>

          {/* Highlights */}
          <div className="my-6 space-y-3 relative z-10">
            <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5 text-xs text-indigo-200">
                🔍
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Discover</h4>
                <p className="text-[11px] text-indigo-100/75">Clubs, events, workshops & hackathons.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
              <div className="w-7 h-7 rounded-lg bg-purple-500/30 flex items-center justify-center shrink-0 mt-0.5 text-xs text-purple-200">
                🚀
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Participate</h4>
                <p className="text-[11px] text-indigo-100/75">Collaborate in student teams seamlessly.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 text-xs text-emerald-200">
                🎓
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Build Your Future</h4>
                <p className="text-[11px] text-indigo-100/75">Showcase verified certificates & skill graphs.</p>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-indigo-200/70 border-t border-white/10 pt-3 relative z-10 flex items-center justify-between">
            <span>Accredited Academic Portal</span>
            <span>Batch 2024-2028</span>
          </div>
        </div>

        {/* Right Side: Auth Card with Student / Teacher Toggle */}
        <div className="w-full lg:w-7/12 p-8 sm:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            
            {role === 'teacher' ? (
              /* Render Teacher Login inside when Teacher is selected */
              <TeacherLogin 
                onNavigate={onNavigate} 
                onToggleRole={(r) => setRole(r)} 
              />
            ) : (
              /* Student Login Form */
              <div>
                {/* Segmented Switch: Student | Teacher */}
                <div className="mb-6">
                  <div className="bg-slate-100 p-1 rounded-xl flex items-center max-w-xs mx-auto border border-slate-200/60">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className="flex-1 py-1.5 text-xs font-bold text-indigo-700 bg-white shadow-xs rounded-lg transition text-center cursor-default"
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('teacher')}
                      className="flex-1 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-lg transition text-center cursor-pointer"
                    >
                      Teacher
                    </button>
                  </div>
                </div>

                {/* Heading & Supporting Text */}
                <div className="mb-6 text-left">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Welcome Back
                  </h1>
                  <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
                    Login to continue exploring your campus community.
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

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  
                  {/* Field 1: Email */}
                  <div>
                    <label 
                      htmlFor="student-login-email" 
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <input
                        id="student-login-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your college email"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 transition duration-150 focus:bg-white focus:outline-none focus:ring-2 ${
                          errors.email
                            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                            : 'border-slate-200 focus:border-indigo-600 focus:ring-indigo-600/20'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-rose-600 text-xs mt-1.5 flex items-center space-x-1">
                        <svg className="w-3.5 h-3.5 inline shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Field 2: Password with Show/Hide Toggle */}
                  <div>
                    <label 
                      htmlFor="student-login-password" 
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="student-login-password"
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
                      onClick={() => alert('Password reset link would be sent to your college email.')}
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
                          <span>Logging in...</span>
                        </span>
                      ) : (
                        'Login'
                      )}
                    </button>
                  </div>

                  {/* Footer Switch to Register */}
                  <div className="pt-2 text-center text-sm text-slate-600">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={handleNavigateToRegister}
                      className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition ml-1 cursor-pointer focus:outline-none"
                    >
                      Register
                    </button>
                  </div>

                </form>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
