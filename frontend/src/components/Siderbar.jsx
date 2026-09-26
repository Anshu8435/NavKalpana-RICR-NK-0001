import React, { useState } from "react";
import { 
  LayoutDashboard, 
  HeartPulse, 
  Users, 
  FileText, 
  UserCheck, 
  ChevronLeft, 
  ChevronRight,
  Activity
} from "lucide-react";

function Sidebar({ selectedtab, setselectedtab }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const tabs = [
    { name: "Dashboard", key: "dashboard", icon: LayoutDashboard, badge: null },
    { name: "Heart Analysis", key: "analysis", icon: HeartPulse, badge: "AI" },
    { name: "Patients", key: "admin", icon: Users, badge: null },
    { name: "Clinical Records", key: "reports", icon: FileText, badge: null },
    { name: "Doctor Profile", key: "profile", icon: UserCheck, badge: null },
  ];

  return (
    <aside 
      className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-[#06121E] via-[#0B1F33] to-[#0D253D] text-white transition-all duration-300 ease-in-out flex flex-col h-screen border-r border-[#1B3654]/50 shadow-navy-glow select-none z-30 shrink-0`}
    >
      {/* Brand Header */}
      <div className="h-20 px-5 flex items-center gap-3.5 border-b border-[#1B3654]/60">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#13B8A6] to-[#0F766E] flex items-center justify-center text-white shadow-teal-glow shrink-0">
          <Activity className="w-6 h-6 animate-pulse" />
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden transition-all duration-300">
            <h1 className="font-display font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              CardioShield
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#20D9C2]/20 text-[#20D9C2] border border-[#20D9C2]/30">
                AI
              </span>
            </h1>
            <p className="text-[11px] font-medium tracking-wider uppercase text-[#8D9FB1]">Cardio Intelligence</p>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        {tabs.map((item) => {
          const Icon = item.icon;
          const isActive = selectedtab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setselectedtab(item.key)}
              title={!sidebarOpen ? item.name : undefined}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 group text-left relative ${
                isActive
                  ? 'bg-gradient-to-r from-[#13B8A6]/25 to-[#20D9C2]/10 text-white font-semibold border-l-[3px] border-[#20D9C2] shadow-sm'
                  : 'text-[#8D9FB1] hover:text-white hover:bg-white/[0.06] font-medium'
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'text-[#20D9C2]' : 'text-[#8D9FB1] group-hover:text-white'}`}>
                <Icon className="w-5 h-5 shrink-0" />
              </div>

              {sidebarOpen && (
                <div className="flex-1 flex items-center justify-between overflow-hidden">
                  <span className="text-sm truncate tracking-tight">{item.name}</span>
                  {item.badge && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-[#13B8A6]/30 text-[#20D9C2] border border-[#20D9C2]/30">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-[#1B3654]/60">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          type="button"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-[#8D9FB1] hover:text-white hover:bg-white/[0.08] transition-colors text-xs font-semibold"
        >
          {sidebarOpen ? (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
