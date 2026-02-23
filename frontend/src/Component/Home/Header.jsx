import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

function Header({ selectedtab, setselectedtab }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
  }, []);

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
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('currentPatient');
      localStorage.removeItem('latestPrediction');
      localStorage.removeItem('registeredPatients');
      navigate('/login');
    }
  };

  return (
    <>
     <header className="h-[75px] bg-gradient-to-r from-[#0a3d62] to-[#3c6382] text-white flex items-center justify-between px-6 lg:px-10 shadow-xl border-b-4 border-white/30">
        
        <div className="flex items-center gap-4">
          <img src="logo.png" alt="Logo" className="w-9 h-9 object-contain" />
          <h3 className="text-xl lg:text-2xl font-bold tracking-wide">
            CardioShield AI
          </h3>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="relative text-xl cursor-pointer">
            🔔
            <span className="absolute -top-2 -right-3 bg-[#ff6b4a] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              3
            </span>
          </div>

          <div className="flex items-center gap-3 bg-white/20 px-4 py-2 rounded-full backdrop-blur-md">
            <div className="w-9 h-9 bg-white text-[#0a3d62] font-bold flex items-center justify-center rounded-full">
              {getUserInitial()}
            </div>
            <span className="font-medium">{getUserDisplayName()}</span>
          </div>

          <button onClick={handleLogout} disabled={logoutLoading} className="bg-[#ff6b4a] hover:bg-[#e55039] px-4 py-2 rounded-md font-medium transition disabled:opacity-50">
            {logoutLoading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </header>
    </>
  );
}

export default Header;
