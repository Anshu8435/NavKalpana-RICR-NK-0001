// src/components/DoctorSignup.jsx   or   src/pages/Signup.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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

    // Update password strength indicators in real-time
    if (e.target.name === 'password') {
      const password = e.target.value;
      setPasswordStrength({
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?\":{}|<>]/.test(password),
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
        // Check if token is returned (auto-verified) or email verification required
        if (result.data.data && result.data.data.token) {
          // Auto-verified user (development mode)
          const { token, user } = result.data.data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          alert('Registration successful! Welcome to CardioShield AI');
          navigate('/home');
        } else {
          // Email verification required
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* Left panel - visible only on md+ screens */}
        <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-r from-[#0a3d62] to-[#3c6382] p-10 lg:p-16 items-center justify-center text-white overflow-hidden">

          {/* Decorative blurred blobs */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#ff6b4a] rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-cyan-400 rounded-full opacity-20 blur-3xl"></div>

          <div className="relative z-10 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              Join CardioShield AI
            </h1>
            <p className="text-lg opacity-90 max-w-xs mx-auto leading-relaxed">
              Register as a doctor and start protecting every heartbeat with intelligent care.
            </p>
          </div>
        </div>

        {/* Right panel - form */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 lg:p-16 flex flex-col justify-center">

          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-[#0a3d62] tracking-tight">
              CardioShield AI
            </h2>
            <p className="text-xl text-gray-600 mt-1 font-medium">Doctor Signup</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#3c6382] focus:ring-4 focus:ring-[#3c6382]/30 transition-all duration-200 shadow-sm text-gray-800 placeholder-gray-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#3c6382] focus:ring-4 focus:ring-[#3c6382]/30 transition-all duration-200 shadow-sm text-gray-800 placeholder-gray-500"
            />



            <input
              type="password"
              name="password"
              placeholder="Password (8+ chars, A-Z, a-z, 0-9, !@#$...)"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#3c6382] focus:ring-4 focus:ring-[#3c6382]/30 transition-all duration-200 shadow-sm text-gray-800 placeholder-gray-500"
            />

            {/* Password Strength Indicators */}
            {formData.password && (
              <div className="px-2 space-y-1">
                <p className="text-xs font-medium text-gray-600 mb-2">Password Requirements:</p>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <div className={`flex items-center gap-2 ${passwordStrength.minLength ? 'text-green-600' : 'text-gray-400'}`}>
                    <span>{passwordStrength.minLength ? '✓' : '○'}</span>
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordStrength.hasUppercase ? 'text-green-600' : 'text-gray-400'}`}>
                    <span>{passwordStrength.hasUppercase ? '✓' : '○'}</span>
                    <span>One uppercase letter (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordStrength.hasLowercase ? 'text-green-600' : 'text-gray-400'}`}>
                    <span>{passwordStrength.hasLowercase ? '✓' : '○'}</span>
                    <span>One lowercase letter (a-z)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                    <span>{passwordStrength.hasNumber ? '✓' : '○'}</span>
                    <span>One number (0-9)</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-gray-400'}`}>
                    <span>{passwordStrength.hasSpecialChar ? '✓' : '○'}</span>
                    <span>One special character (!@#$...)</span>
                  </div>
                </div>
              </div>
            )}

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#3c6382] focus:ring-4 focus:ring-[#3c6382]/30 transition-all duration-200 shadow-sm text-gray-800 placeholder-gray-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-3 bg-[#ff6b4a] text-white rounded-xl text-lg font-semibold tracking-wide hover:bg-[#e65a39] active:scale-[0.98] shadow-lg shadow-[#ff6b4a]/30 hover:shadow-xl hover:shadow-[#ff6b4a]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>

          </form>

          <p className="text-center mt-8 text-gray-600 text-sm">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-[#0a3d62] font-medium hover:underline transition-colors"
            >
              Login Here
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Signup;