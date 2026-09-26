import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Search, LogOut, Sparkles, Activity, ShieldCheck, User } from "lucide-react";

function Header({ setselectedtab, searchQuery, setSearchQuery, selectedtab }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  const getUserInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    return 'D';
  };

  const getUserDisplayName = () => {
    if (user?.name) return user.name;
    return 'Dr. Clinician';
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      localStorage.removeItem('currentPatient');
      localStorage.removeItem('latestPrediction');
      localStorage.removeItem('registeredPatients');
      logout();
    } catch (err) {
      console.error('Logout error:', err);
      setLogoutLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      setselectedtab('reports');
    }
  };

  const roleLabel = user?.role === 'admin' 
    ? 'System Administrator' 
    : user?.role === 'doctor' 
    ? 'Lead Cardiologist' 
    : 'Clinical Practitioner';

  return (
    <header className="bg-[#0B1F33] text-white px-4 md:px-8 py-3.5 border-b border-white/10 shadow-md sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
        
        {/* Left: Search Bar with Keyboard Hint */}
        <form onSubmit={handleSearch} className="w-full md:w-auto md:flex-1 md:max-w-md">
          <div className="relative group">
            <Search 
              size={17} 
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#20D9C2] transition-colors" 
            />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search by Report ID, patient name..."
              className="w-full bg-[#123B5D]/60 hover:bg-[#123B5D]/80 focus:bg-[#123B5D] text-white placeholder-slate-400 text-sm pl-10 pr-14 py-2 rounded-xl border border-white/10 focus:border-[#20D9C2]/60 focus:outline-none focus:ring-2 focus:ring-[#20D9C2]/20 transition-all duration-200"
            />
            <span className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 bg-white/10 px-1.5 py-0.5 rounded border border-white/10 pointer-events-none">
              ↵ Enter
            </span>
          </div>
        </form>

        {/* Center / Right: System Status & User Profile */}
        <div className="flex items-center gap-3 sm:gap-5 w-full md:w-auto justify-between md:justify-end">
          
          {/* AI Model Status Badge */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#20D9C2] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#20D9C2]"></span>
            </span>
            <span className="text-slate-300 font-medium">Model:</span>
            <span className="text-[#20D9C2] font-semibold font-mono">Calibrated XGBoost</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-500/20 text-[#20D9C2] font-mono">v2.4</span>
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 pl-2 pr-3 py-1.5 rounded-xl transition duration-200">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#13B8A6] to-[#20D9C2] flex items-center justify-center font-bold text-[#0B1F33] text-sm shadow-sm ring-1 ring-white/20">
              {getUserInitial()}
            </div>
            
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-white tracking-wide truncate max-w-[130px]">
                {getUserDisplayName()}
              </p>
              <div className="flex items-center gap-1">
                <ShieldCheck size={11} className="text-[#20D9C2]" />
                <span className="text-[10px] text-slate-300 font-medium">
                  {roleLabel}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <div className="h-5 w-[1px] bg-white/15 mx-1 hidden sm:block"></div>
            
            <button 
              onClick={handleLogout} 
              disabled={logoutLoading}
              title="Sign Out"
              className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-red-500/20 transition-all text-xs font-medium disabled:opacity-50"
            >
              <LogOut size={14} className="group-hover:text-red-400 transition-colors" />
              <span className="hidden md:inline group-hover:text-red-300 transition-colors">
                {logoutLoading ? 'Exiting...' : 'Sign Out'}
              </span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Header;
