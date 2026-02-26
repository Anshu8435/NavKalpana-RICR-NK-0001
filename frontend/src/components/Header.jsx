import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Search } from "lucide-react";

function Header({ setselectedtab, searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  const getUserInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    return 'U';
  };

  const getUserDisplayName = () => {
    if (user?.name) return user.name;
    return 'Doctor';
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      // Clear patient-specific data
      localStorage.removeItem('currentPatient');
      localStorage.removeItem('latestPrediction');
      localStorage.removeItem('registeredPatients');
      
      // Use auth context logout
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

  return (
    <header className="bg-gradient-to-r from-[#2c5f7c] to-[#3d7a99] text-white px-4 md:px-8 py-4 shadow-lg sticky top-0 z-50">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">{/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full md:w-auto md:flex-1 md:max-w-xl">
          <div className="relative">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search by Report ID..."
              className="w-full bg-white/90 text-gray-800 px-4 py-2.5 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm md:text-base"
            />
            <button 
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <Search size={18} />
            </button>
          </div>
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-3 md:gap-6 w-full md:w-auto justify-between md:justify-end">
          {/* User Profile */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-cyan-500 rounded-full flex items-center justify-center font-bold text-white text-sm md:text-base">
              {getUserInitial()}
            </div>
            <div className="hidden lg:block">
              <p className="font-semibold text-sm">{getUserDisplayName()}</p>
              <p className="text-xs text-blue-100">{user?.role === 'admin' ? 'Administrator' : user?.role === 'doctor' ? 'Senior Cardiologist' : 'Healthcare Professional'}</p>
            </div>
            <button 
              onClick={handleLogout} 
              disabled={logoutLoading}
              className="bg-cyan-500 hover:bg-cyan-600 px-3 md:px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50 text-sm md:text-base"
            >
              {logoutLoading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
