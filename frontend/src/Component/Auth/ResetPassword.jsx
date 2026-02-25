import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { authService } from '../../services/apiService';
import { LoadingButton } from '../../components/Loading';
import { Alert } from '../../components/Alert';
import imagee from "../../assets/logo3.jpg";

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

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update password strength indicators
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
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must contain at least one special character';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

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
      const response = await authService.resetPassword(token, formData.password);
      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = (isValid) => {
    return isValid ? 'text-green-600' : 'text-gray-400';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex w-full max-w-4xl flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl bg-white transition-transform duration-300 hover:-translate-y-1">
        
        {/* Left Panel - Branding */}
        <div className="relative flex-1 bg-gradient-to-r from-[#0a3d62] to-[#3c6382] text-white flex flex-col items-center justify-center px-8 py-16 md:px-12 md:py-20">
          
          {/* Background decorations */}
          <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-[#ff6b4a]/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -right-16 w-[200px] h-[200px] bg-cyan-400/20 rounded-full blur-3xl" />

          {/* Logo */}
          <img
            src={imagee}
            alt="CardioShield AI"
            className="h-20 md:h-28 w-auto mb-6 transition-shadow duration-300"
            style={{ background: 'transparent' }}
          />

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center z-10">
            CardioShield AI
          </h1>
          <p className="text-base md:text-lg max-w-xs text-center opacity-90 z-10 leading-relaxed">
            Create a strong new password for your account
          </p>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 px-8 py-16 md:px-12 md:py-20 flex flex-col justify-center">
          
          <div className="text-[#0a3d62] text-3xl md:text-4xl font-bold text-center mb-4">
            Reset Password
          </div>

          <p className="text-center text-gray-600 mb-8">
            Enter your new password below.
          </p>

          {/* Success Message */}
          {success && (
            <Alert
              type="success"
              message="Password reset successful! Redirecting to login..."
              className="mb-6"
            />
          )}

          {/* Error Message */}
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError('')}
              className="mb-6"
            />
          )}

          <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
            
            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleChange}
                required
                className="px-5 py-4 rounded-xl border border-gray-300 text-base focus:outline-none focus:border-[#3c6382] focus:ring-4 focus:ring-[#3c6382]/30 shadow-sm transition-all duration-200 w-full"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Re-enter new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="px-5 py-4 rounded-xl border border-gray-300 text-base focus:outline-none focus:border-[#3c6382] focus:ring-4 focus:ring-[#3c6382]/30 shadow-sm transition-all duration-200 w-full"
              />
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-3">Password Requirements:</p>
                <div className="space-y-2 text-sm">
                  <div className={`flex items-center gap-2 ${getStrengthColor(passwordStrength.minLength)}`}>
                    <span>{passwordStrength.minLength ? '✓' : '○'}</span>
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-2 ${getStrengthColor(passwordStrength.hasUppercase)}`}>
                    <span>{passwordStrength.hasUppercase ? '✓' : '○'}</span>
                    <span>One uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 ${getStrengthColor(passwordStrength.hasLowercase)}`}>
                    <span>{passwordStrength.hasLowercase ? '✓' : '○'}</span>
                    <span>One lowercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 ${getStrengthColor(passwordStrength.hasNumber)}`}>
                    <span>{passwordStrength.hasNumber ? '✓' : '○'}</span>
                    <span>One number</span>
                  </div>
                  <div className={`flex items-center gap-2 ${getStrengthColor(passwordStrength.hasSpecialChar)}`}>
                    <span>{passwordStrength.hasSpecialChar ? '✓' : '○'}</span>
                    <span>One special character (!@#$%...)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <LoadingButton
              type="submit"
              loading={loading}
              disabled={success}
              className="py-4 px-6 bg-[#ff6b4a] text-white font-semibold text-lg rounded-xl shadow-lg shadow-orange-500/30 hover:bg-[#e65a39] hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-1 transition-all duration-300 w-full"
            >
              Reset Password
            </LoadingButton>
          </form>

          {/* Back to Login */}
          <div className="text-center mt-8">
            <Link
              to="/login"
              className="text-[#0a3d62] hover:underline font-medium inline-flex items-center gap-2"
            >
              <span>←</span>
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
