// src/components/DoctorSignup.jsx   or   src/pages/Signup.jsx

import { useState } from 'react';

function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    console.log('Signup data:', formData);
    // → Replace with real API call
    // axios.post('/api/signup', formData)...

    alert('Form submitted (demo)');
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
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#3c6382] focus:ring-4 focus:ring-[#3c6382]/30 transition-all duration-200 shadow-sm text-gray-800 placeholder-gray-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#3c6382] focus:ring-4 focus:ring-[#3c6382]/30 transition-all duration-200 shadow-sm text-gray-800 placeholder-gray-500"
            />

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
              className="w-full py-4 mt-3 bg-[#ff6b4a] text-white rounded-xl text-lg font-semibold tracking-wide hover:bg-[#e65a39] active:scale-[0.98] shadow-lg shadow-[#ff6b4a]/30 hover:shadow-xl hover:shadow-[#ff6b4a]/50 transition-all duration-300"
            >
              Sign Up
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