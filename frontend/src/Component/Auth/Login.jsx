// Login.jsx
import React from 'react';
import imagee from "../../assets/logo3.jpg";  // ya jo bhi transparent PNG hai
import { useNavigate } from 'react-router-dom';
function Login() {
  const navigate = useNavigate();
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

          {/* Logo - sahi syntax */}
          <img
            src={imagee}
            alt="CardioShield AI"
            className="
              h-20 md:h-28 w-auto mb-6 

            
              transition-shadow duration-300
            "
            style={{ background: 'transparent' }} // extra safety ke liye (mostly nahi chahiye agar PNG transparent hai)
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

          <form className="flex flex-col space-y-6">
            <input
              type="email"
              placeholder="Email or Username"
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
              placeholder="Password"
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
              className="
                py-4 px-6 bg-[#ff6b4a] text-white font-semibold 
                text-lg rounded-xl shadow-lg shadow-orange-500/30 
                hover:bg-[#e65a39] hover:shadow-xl hover:shadow-orange-500/40 
                hover:-translate-y-1 transition-all duration-300
              " onClick={() => navigate('/home')}
            >
              Login Securely
            </button>
          </form>

          <div className="text-center mt-8 text-sm">
            <a href="#" className="text-[#0a3d62] hover:underline">
              Forgot Password?
            </a>
            <br /><br />
            <span className="text-gray-600">New Doctor? </span>
            <a href="#" className="text-[#0a3d62] hover:underline font-medium">
              Register Here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;