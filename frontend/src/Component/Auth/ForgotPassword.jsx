import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/apiService';
import { LoadingButton } from '../../components/Loading';
import { Alert } from '../../components/Alert';
import imagee from "../../assets/logo3.jpg";

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

    // Validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
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
            Secure password recovery for your account
          </p>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 px-8 py-16 md:px-12 md:py-20 flex flex-col justify-center">
          
          <div className="text-[#0a3d62] text-3xl md:text-4xl font-bold text-center mb-4">
            Forgot Password?
          </div>

          <p className="text-center text-gray-600 mb-8">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {/* Success Message */}
          {success && (
            <Alert
              type="success"
              message="Password reset link has been sent to your email. Please check your inbox."
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
            
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-5 py-4 rounded-xl border border-gray-300 text-base focus:outline-none focus:border-[#3c6382] focus:ring-4 focus:ring-[#3c6382]/30 shadow-sm transition-all duration-200 w-full"
              />
            </div>

            {/* Submit Button */}
            <LoadingButton
              type="submit"
              loading={loading}
              className="py-4 px-6 bg-[#ff6b4a] text-white font-semibold text-lg rounded-xl shadow-lg shadow-orange-500/30 hover:bg-[#e65a39] hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-1 transition-all duration-300 w-full"
            >
              Send Reset Link
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

          {/* Additional Help */}
          <div className="text-center mt-6 text-sm text-gray-600">
            <p>Don't have an account?{' '}
              <Link to="/signup" className="text-[#0a3d62] hover:underline font-medium">
                Register Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
