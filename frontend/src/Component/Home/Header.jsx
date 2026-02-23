import React from "react";

function Header({ selectedtab, setselectedtab }) {
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
              R
            </div>
            <span className="font-medium">Dr. Rishabh</span>
          </div>

          <button className="bg-[#ff6b4a] hover:bg-[#e55039] px-4 py-2 rounded-md font-medium transition">
            Logout
          </button>
        </div>
      </header>
    </>
  );
}

export default Header;
