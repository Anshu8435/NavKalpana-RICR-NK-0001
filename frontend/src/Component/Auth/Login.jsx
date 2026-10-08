import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/apiService';
import { Mail, Lock, Activity, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    setResendSuccess('');
    try {
      const response = await authService.resendVerification(formData.email);
      setResendSuccess(response.message || 'Verification email sent! Please check your inbox.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend verification email.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowResend(false);
    setResendSuccess('');
    setLoading(true);

    try {
      const result = await authLogin(formData.email, formData.password);
      
      if (result.success) {
        navigate('/home');
      } else {
        setError(result.message);
        if (result.message.toLowerCase().includes('verify')) {
          setShowResend(true);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F8FC] p-4 sm:p-6 lg:p-8 antialiased">
      <div className="flex w-full max-w-4xl flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl bg-white border border-[#E0E8F0] transition-all duration-300">
        
        {/* Left Panel: Clinical Branding & Security */}
        <div className="relative flex-1 bg-gradient-to-br from-[#0B1F33] via-[#0E2A44] to-[#123B5D] text-white flex flex-col justify-between p-8 md:p-12 overflow-hidden">
          {/* Subtle glowing accents */}
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-[#13B8A6]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-[#20D9C2]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Logo */}
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#13B8A6] to-[#20D9C2] flex items-center justify-center text-[#0B1F33] shadow-md shadow-[#20D9C2]/20">
              <Activity size={20} className="stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-display">
              CardioShield AI
            </span>
          </div>

          {/* Middle Pitch */}
          <div className="relative z-10 my-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-[#20D9C2] text-xs font-semibold">
              <ShieldCheck size={14} />
              <span>Certified Healthcare Portal</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight font-display">
              Explainable Risk Intelligence for Cardiology
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              Securely authenticate to access patient stratifications, real-time SHAP attributions, and clinical intervention plans.
            </p>
          </div>

          {/* Bottom Security Assurance */}
          <div className="relative z-10 border-t border-white/10 pt-4 text-[11px] text-slate-400 flex items-center justify-between">
            <span>256-Bit Encrypted Session</span>
            <span>HIPAA Compliant</span>
          </div>
        </div>

        {/* Right Panel: Doctor Login Form */}
        <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] tracking-tight font-display">
              Doctor Sign In
            </h2>
            <p className="text-sm text-[#627487] mt-1.5">
              Enter your clinical credentials to access the diagnostic dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-[#D94F59] rounded-xl text-sm flex items-start gap-2.5">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Resend Success Message */}
          {resendSuccess && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-[#16866A] rounded-xl text-sm flex items-start gap-2.5">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <span>{resendSuccess}</span>
            </div>
          )}

          {/* Resend Verification Callout */}
          {showResend && !resendSuccess && (
            <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs">
              <p className="text-[#D49A27] font-medium mb-2">Account email verification required.</p>
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendLoading}
                className="font-bold text-[#123B5D] underline hover:text-[#13B8A6] disabled:opacity-50"
              >
                {resendLoading ? 'Sending...' : 'Click to Resend Verification Email'}
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1.5 uppercase tracking-wider">
                Clinical Email Address
              </label>
              <div className="relative group">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#13B8A6] transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="doctor@hospital.org"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E8F0] text-sm text-[#172B3A] placeholder-slate-400 bg-[#F5F8FC]/50 focus:bg-white focus:outline-none focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#172B3A] uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-medium text-[#13B8A6] hover:text-[#0B1F33] transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#13B8A6] transition-colors" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E8F0] text-sm text-[#172B3A] placeholder-slate-400 bg-[#F5F8FC]/50 focus:bg-white focus:outline-none focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-6 bg-gradient-to-r from-[#13B8A6] to-[#20D9C2] text-[#0B1F33] font-bold text-sm rounded-xl shadow-md shadow-[#20D9C2]/20 hover:shadow-lg hover:shadow-[#20D9C2]/35 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center mt-8 pt-6 border-t border-[#E0E8F0] text-xs text-[#627487]">
            <span>Don't have clinical access yet? </span>
            <Link to="/signup" className="text-[#13B8A6] font-bold hover:underline">
              Register as Doctor
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;
