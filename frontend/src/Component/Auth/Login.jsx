// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/apiService';

function Login() {
  const navigate = useNavigate();
  const { login: authLogin, checkAuth } = useAuth();
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
        // Show resend button if email not verified
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div
        className="
          flex w-full max-w-4xl flex-col md:flex-row 
          rounded-2xl overflow-hidden shadow-2xl 
          bg-white transition-transform duration-300 
          hover:-translate-y-1
        "
      >
        {/* Left Panel */}
        <div
          className="
            relative flex-1 bg-gradient-to-r from-[#0a3d62] to-[#3c6382] 
            text-white flex flex-col items-center justify-center 
            px-8 py-16 md:px-12 md:py-20
          "
        >
          {/* Blurred abstract shapes */}
          <div
            className="
              absolute -top-20 -left-20 w-[300px] h-[300px] 
              bg-[#ff6b4a]/20 rounded-full blur-3xl
            "
          />
          <div
            className="
              absolute -bottom-16 -right-16 w-[200px] h-[200px] 
              bg-cyan-400/20 rounded-full blur-3xl
            "
          />

          

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center z-10">
            CardioShield AI
          </h1>
          <p className="text-base md:text-lg max-w-xs text-center opacity-90 z-10 leading-relaxed">
            Protecting Every Beat with Intelligent Care
          </p>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 px-8 py-16 md:px-12 md:py-20 flex flex-col justify-center">
          <div className="text-[#0a3d62] text-3xl md:text-4xl font-bold text-center mb-8">
            CardioShield AI
          </div>

          <h2 className="text-2xl font-semibold text-[#0a3d62] text-center mb-8">
            Doctor Login
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center text-sm">
              {error}
            </div>
          )}

          {resendSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-300 text-green-700 rounded-xl text-center text-sm">
              {resendSuccess}
            </div>
          )}

          {showResend && !resendSuccess && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-300 rounded-xl text-center">
              <p className="text-yellow-800 text-sm mb-3">Didn't receive the email or link expired?</p>
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendLoading}
                className="text-sm font-semibold text-[#0a3d62] underline hover:text-[#3c6382] disabled:opacity-50"
              >
                {resendLoading ? 'Sending...' : 'Resend Verification Email'}
              </button>
            </div>
          )}

          <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email or Username"
              value={formData.email}
              onChange={handleChange}
              required
              className="
                px-5 py-4 rounded-xl border border-gray-300 
                text-base focus:outline-none focus:border-[#3c6382] 
                focus:ring-4 focus:ring-[#3c6382]/30 
                shadow-sm transition-all duration-200
              "
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="
                px-5 py-4 rounded-xl border border-gray-300 
                text-base focus:outline-none focus:border-[#3c6382] 
                focus:ring-4 focus:ring-[#3c6382]/30 
                shadow-sm transition-all duration-200
              "
            />

            <button
              type="submit"
              disabled={loading}
              className="
                py-4 px-6 bg-blue-500 hover:bg-blue-400 text-white font-semibold 
                text-lg rounded-xl shadow-lg shadow-blue-500/30 
                hover:-translate-y-1 transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {loading ? 'Logging in...' : 'Login Securely'}
            </button>
          </form>

          <div className="text-center mt-8 text-sm">
            <a href="/forgot-password" className="text-[#0a3d62] hover:underline">
              Forgot Password?
            </a>
            <br /><br />
            <span className="text-gray-600">New Doctor? </span>
            <a href="/signup" className="text-[#0a3d62] hover:underline font-medium">
              Register Here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;