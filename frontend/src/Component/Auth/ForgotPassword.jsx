import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/apiService';
import { LoadingButton } from '../../components/Loading';
import { Alert } from '../../components/Alert';
import { Mail, Activity, ArrowLeft, KeyRound, ShieldCheck } from 'lucide-react';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid clinical email address');
      return;
    }

    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F8FC] p-4 sm:p-6 lg:p-8 antialiased">
      <div className="flex w-full max-w-4xl flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl bg-white border border-[#E0E8F0]">
        
        {/* Left Panel */}
        <div className="relative flex-1 bg-gradient-to-br from-[#0B1F33] via-[#0E2A44] to-[#123B5D] text-white flex flex-col justify-between p-8 md:p-12 overflow-hidden">
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

          {/* Info */}
          <div className="relative z-10 my-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#20D9C2]">
              <KeyRound size={24} />
            </div>
            <h1 className="text-3xl font-extrabold text-white leading-tight font-display">
              Doctor Account Recovery
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              We enforce strict cryptographic password resets to maintain HIPAA access compliance and protect sensitive patient data.
            </p>
          </div>

          <div className="relative z-10 border-t border-white/10 pt-4 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Audit-Logged Operation</span>
            <span>Single-Use Token</span>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] tracking-tight font-display">
              Reset Your Password
            </h2>
            <p className="text-sm text-[#627487] mt-1.5">
              Enter your clinical email address and we'll dispatch a secure recovery token.
            </p>
          </div>

          {/* Alerts */}
          {success && (
            <Alert
              type="success"
              message="Password reset link has been dispatched to your email. Please inspect your inbox and spam folder."
              className="mb-5"
            />
          )}

          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError('')}
              className="mb-5"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[#172B3A] mb-1.5 uppercase tracking-wider">
                Clinical Email Address
              </label>
              <div className="relative group">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#13B8A6] transition-colors" />
                <input
                  id="email"
                  type="email"
                  placeholder="doctor@hospital.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E8F0] text-sm text-[#172B3A] placeholder-slate-400 bg-[#F5F8FC]/50 focus:bg-white focus:outline-none focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20 transition-all duration-200"
                />
              </div>
            </div>

            <LoadingButton
              type="submit"
              loading={loading}
              className="w-full mt-2 py-3.5 px-6 bg-gradient-to-r from-[#13B8A6] to-[#20D9C2] text-[#0B1F33] font-bold text-sm rounded-xl shadow-md shadow-[#20D9C2]/20 hover:shadow-lg hover:shadow-[#20D9C2]/35 active:scale-[0.99] transition-all duration-200"
            >
              Send Recovery Instructions
            </LoadingButton>
          </form>

          {/* Return to Login */}
          <div className="text-center mt-8 pt-6 border-t border-[#E0E8F0] flex items-center justify-between text-xs">
            <Link
              to="/login"
              className="text-[#123B5D] font-bold hover:text-[#13B8A6] inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Sign In</span>
            </Link>

            <Link to="/signup" className="text-[#13B8A6] font-bold hover:underline">
              Create New Account
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;
