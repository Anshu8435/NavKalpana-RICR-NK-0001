import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Siderbar";
import Front from "../Main/Front";
import Registration from "../Main/Registeration";
import Analatics from "../Main/Analatics";
import Records from "../Main/Records";
import Profile from "../Main/Profile";
import Result from "../Main/Result";
import { 
  LayoutDashboard, 
  Activity, 
  UserPlus, 
  FileText, 
  User as UserIcon,
  PieChart
} from "lucide-react";

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedtab, setselectedtab] = useState(() => {
    return searchParams.get('tab') || 'dashboard';
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Sync: when selectedtab state changes, update the URL to match
  useEffect(() => {
    const currentTab = searchParams.get('tab');
    if (currentTab !== selectedtab) {
      setSearchParams({ tab: selectedtab }, { replace: true });
    }
  }, [selectedtab]);

  // Sync: when URL changes (browser back/forward, navigate()), update state to match
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== selectedtab) {
      setselectedtab(tabFromUrl);
    }
  }, [searchParams, navigate]);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'analysis', label: 'Stratify', icon: Activity },
    { id: 'admin', label: 'Patient', icon: UserPlus },
    { id: 'reports', label: 'Records', icon: FileText },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <div className="flex h-screen bg-[#F5F8FC] overflow-hidden antialiased">
      {/* SIDEBAR - Hidden on mobile, visible on md+ */}
      <div className="hidden md:block flex-shrink-0 z-30">
        <Sidebar
          selectedtab={selectedtab}
          setselectedtab={setselectedtab}
        />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pb-16 md:pb-0">
        {/* HEADER */}
        <Header 
          setselectedtab={setselectedtab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedtab={selectedtab}
        />

        {/* TAB ROUTING CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#F5F8FC] scroll-smooth">
          {selectedtab === "dashboard" && <Front setselectedtab={setselectedtab} />}
          {selectedtab === "admin" && <Registration setselectedtab={setselectedtab} />}
          {selectedtab === "analysis" && <Analatics setselectedtab={setselectedtab} />}
          {selectedtab === "reports" && <Records searchQuery={searchQuery} setSearchQuery={setSearchQuery} setselectedtab={setselectedtab} />}
          {selectedtab === "profile" && <Profile />}
          {selectedtab === "result" && <Result setselectedtab={setselectedtab} />}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0B1F33]/95 backdrop-blur-lg border-t border-white/10 z-50 shadow-2xl safe-area-inset-bottom">
        <div className="flex justify-around items-center px-2 py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = selectedtab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setselectedtab(item.id)}
                className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all duration-200 relative ${
                  isActive 
                    ? 'text-[#20D9C2]' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon size={20} className={isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'} />
                <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-[#20D9C2] font-semibold' : ''}`}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 w-8 h-0.5 bg-[#20D9C2] rounded-full shadow-[0_0_8px_#20D9C2]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default HomePage;
