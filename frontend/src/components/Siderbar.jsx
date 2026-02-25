import logo from "../assets/logo.png";
import { useState } from "react";
import { MdDashboard } from "react-icons/md";
import { FaHeartbeat, FaUserInjured, FaFileMedical, FaUserCircle } from "react-icons/fa";

function Sidebar({ selectedtab, setselectedtab }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
 const tabs = [
  { name: "Dashboard", key: "dashboard", icon: <MdDashboard /> },
  { name: "Heart Analysis", key: "analysis", icon: <FaHeartbeat /> },
  { name: "Patients", key: "admin", icon: <FaUserInjured /> },
  { name: "Records", key: "reports", icon: <FaFileMedical /> },
  { name: "Profile", key: "profile", icon: <FaUserCircle /> },
];

  return (
    <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-[#2c5f7c] to-[#1a3f54] text-white transition-all duration-300 flex flex-col min-h-screen`}>
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <img src={logo} alt="Logo" className="w-10 h-10" />
        {sidebarOpen && (
          <div>
            <h1 className="font-bold text-lg">CardioShield</h1>
            <p className="text-xs text-blue-200">AI DIAGNOSTICS</p>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-6">
        {tabs.map((item) => (
          <button
            key={item.key}
            onClick={() => setselectedtab(item.key)}
            className={`w-full flex items-center gap-4 px-6 py-3.5 transition-all ${
              selectedtab === item.key
                ? 'bg-white/10 border-l-4 border-cyan-400 text-white'
                : 'text-blue-100 hover:bg-white/5'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {sidebarOpen && <span className="font-medium">{item.name}</span>}
          </button>
        ))}
      </nav>

      {/* Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-4 text-center text-blue-200 hover:bg-white/5 border-t border-white/10"
      >
        {sidebarOpen ? '◀' : '▶'}
      </button>
    </aside>
  );
}

export default Sidebar;