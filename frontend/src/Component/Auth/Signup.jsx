import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, Activity, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (e.target.name === 'password') {
      const password = e.target.value;
      setPasswordStrength({
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      });
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters';
    }
    if (!hasUppercase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowercase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumber) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character (!@#$%^&*...)';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      const result = await signup(formData.fullName, formData.email, formData.password);

      if (result.success) {
        if (result.data.data && result.data.data.token) {
          const { token, user } = result.data.data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          navigate('/home');
        } else {
          alert(result.data.message || 'Registration successful! Please check your email to verify your account.');
          navigate('/login');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center p-4 sm:p-6 lg:p-8 antialiased">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#E0E8F0] overflow-hidden flex flex-col md:flex-row">

        {/* Left panel */}
        <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-[#0B1F33] via-[#0E2A44] to-[#123B5D] p-10 lg:p-12 flex-col justify-between text-white overflow-hidden">
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-[#13B8A6]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-[#20D9C2]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#13B8A6] to-[#20D9C2] flex items-center justify-center text-[#0B1F33] shadow-md shadow-[#20D9C2]/20">
              <Activity size={20} className="stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-display">
              CardioShield AI
            </span>
          </div>

          {/* Rationale */}
          <div className="relative z-10 my-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-[#20D9C2] text-xs font-semibold">
              <ShieldCheck size={14} />
              <span>Physician Onboarding</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white leading-tight font-display">
              Join the Network of Evidence-Driven Cardiologists
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Equip your clinic with instant ML vitals stratification, calibrated risks, and automated patient report generation.
            </p>
          </div>

          {/* Footer security */}
          <div className="relative z-10 border-t border-white/10 pt-4 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Clinical Verification Standard</span>
            <span>Zero Third-Party Tracking</span>
          </div>
        </div>

        {/* Right panel - form */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] tracking-tight font-display">
              Create Doctor Account
            </h2>
            <p className="text-sm text-[#627487] mt-1">
              Register to access the diagnostic assessment platform
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-[#D94F59] rounded-xl text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1 uppercase tracking-wider">
                Full Name & Title
              </label>
              <div className="relative group">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#13B8A6] transition-colors" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Dr. Eleanor Vance, MD"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E0E8F0] text-sm text-[#172B3A] placeholder-slate-400 bg-[#F5F8FC]/50 focus:bg-white focus:outline-none focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1 uppercase tracking-wider">
                Medical Email
              </label>
              <div className="relative group">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#13B8A6] transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="vance@cardiology.hospital.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E0E8F0] text-sm text-[#172B3A] placeholder-slate-400 bg-[#F5F8FC]/50 focus:bg-white focus:outline-none focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1 uppercase tracking-wider">
                Password
              </label>
              <div className="relative group">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#13B8A6] transition-colors" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password (8+ chars, uppercase, number, symbol)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E0E8F0] text-sm text-[#172B3A] placeholder-slate-400 bg-[#F5F8FC]/50 focus:bg-white focus:outline-none focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Strength Checklist */}
            {formData.password && (
              <div className="p-3 bg-[#F5F8FC] rounded-xl border border-[#E0E8F0] text-[11px] space-y-1">
                <span className="font-semibold text-[#172B3A] block mb-1">Password Requirements:</span>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <div className={`flex items-center gap-1.5 ${passwordStrength.minLength ? 'text-teal-700 font-semibold' : 'text-slate-600'}`}>
                    <span>{passwordStrength.minLength ? '✓' : '○'}</span>
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordStrength.hasUppercase ? 'text-teal-700 font-semibold' : 'text-slate-600'}`}>
                    <span>{passwordStrength.hasUppercase ? '✓' : '○'}</span>
                    <span>Uppercase (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordStrength.hasLowercase ? 'text-teal-700 font-semibold' : 'text-slate-600'}`}>
                    <span>{passwordStrength.hasLowercase ? '✓' : '○'}</span>
                    <span>Lowercase (a-z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordStrength.hasNumber ? 'text-teal-700 font-semibold' : 'text-slate-600'}`}>
                    <span>{passwordStrength.hasNumber ? '✓' : '○'}</span>
                    <span>One number (0-9)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 col-span-2 ${passwordStrength.hasSpecialChar ? 'text-teal-700 font-semibold' : 'text-slate-600'}`}>
                    <span>{passwordStrength.hasSpecialChar ? '✓' : '○'}</span>
                    <span>One special character (!@#$%...)</span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#13B8A6] transition-colors" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Repeat your chosen password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E0E8F0] text-sm text-[#172B3A] placeholder-slate-400 bg-[#F5F8FC]/50 focus:bg-white focus:outline-none focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20 transition-all duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-6 bg-gradient-to-r from-[#13B8A6] to-[#20D9C2] text-[#0B1F33] rounded-xl text-sm font-bold shadow-md shadow-[#20D9C2]/20 hover:shadow-lg hover:shadow-[#20D9C2]/35 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Creating Doctor Account...' : 'Complete Registration'}</span>
              {!loading && <ArrowRight size={16} />}
            </button>

          </form>

          <p className="text-center mt-6 pt-4 border-t border-[#E0E8F0] text-xs text-[#627487]">
            Already registered?{' '}
            <Link to="/login" className="text-[#13B8A6] font-bold hover:underline">
              Sign In Here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Signup;
