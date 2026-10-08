import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { authService } from '../../services/apiService';
import { LoadingButton } from '../../components/Loading';
import { Alert } from '../../components/Alert';
import { Lock, Activity, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing password reset token');
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'password') {
      setPasswordStrength({
        minLength: value.length >= 8,
        hasUppercase: /[A-Z]/.test(value),
        hasLowercase: /[a-z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      });
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one special character';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.password || !formData.confirmPassword) {
      setError('Please complete both password fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Entered passwords do not match");
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(token, formData.password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
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

          <div className="relative z-10 my-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#20D9C2]">
              <Lock size={24} />
            </div>
            <h1 className="text-3xl font-extrabold text-white leading-tight font-display">
              Set New Credentials
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              Please establish a secure password conforming to enterprise healthcare cryptographic standards.
            </p>
          </div>

          <div className="relative z-10 border-t border-white/10 pt-4 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Bcrypt 12-Round Salt</span>
            <span>Zero Plaintext Persistence</span>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] tracking-tight font-display">
              Update Password
            </h2>
            <p className="text-sm text-[#627487] mt-1.5">
              Choose a strong, unique password for your clinical profile.
            </p>
          </div>

          {success && (
            <Alert
              type="success"
              message="Password updated successfully! Redirecting to doctor sign in..."
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
              <label className="block text-xs font-semibold text-[#172B3A] mb-1.5 uppercase tracking-wider">
                New Password
              </label>
              <div className="relative group">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#13B8A6] transition-colors" />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E8F0] text-sm text-[#172B3A] placeholder-slate-400 bg-[#F5F8FC]/50 focus:bg-white focus:outline-none focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1.5 uppercase tracking-wider">
                Confirm New Password
              </label>
              <div className="relative group">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#13B8A6] transition-colors" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E8F0] text-sm text-[#172B3A] placeholder-slate-400 bg-[#F5F8FC]/50 focus:bg-white focus:outline-none focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Checklist */}
            {formData.password && (
              <div className="p-3 bg-[#F5F8FC] rounded-xl border border-[#E0E8F0] text-[11px] space-y-1">
                <span className="font-semibold text-[#172B3A] block mb-1">Security Standard:</span>
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
                    <span>Number (0-9)</span>
                  </div>
                </div>
              </div>
            )}

            <LoadingButton
              type="submit"
              loading={loading}
              disabled={success}
              className="w-full mt-2 py-3.5 px-6 bg-gradient-to-r from-[#13B8A6] to-[#20D9C2] text-[#0B1F33] font-bold text-sm rounded-xl shadow-md shadow-[#20D9C2]/20 hover:shadow-lg hover:shadow-[#20D9C2]/35 active:scale-[0.99] transition-all duration-200"
            >
              Reset & Save Password
            </LoadingButton>
          </form>

          <div className="text-center mt-8 pt-6 border-t border-[#E0E8F0]">
            <Link
              to="/login"
              className="text-[#123B5D] font-bold hover:text-[#13B8A6] inline-flex items-center gap-1.5 transition-colors text-xs"
            >
              <ArrowLeft size={14} />
              <span>Return to Doctor Sign In</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ResetPassword;
