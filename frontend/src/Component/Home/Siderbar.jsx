function Sidebar({ selectedtab, setselectedtab }) {
  const tabs = [
    { name: "Dashboard", key: "dashboard" },
    { name: "Patients", key: "admin" },
    { name: "Analytics", key: "analysis" },
    { name: "Results", key: "result" },
    { name: "Reports", key: "reports" },
    { name: "MyProfile", key: "profile" },
  ];

  return (
    <aside className="w-full lg:w-60 bg-gradient-to-b from-[#0a3d62] to-[#3c6382] text-white lg:min-h-screen p-6">
      <nav className="flex lg:flex-col gap-3 overflow-x-auto">
        {tabs.map((item) => (
          <button
            key={item.key}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition
                        ${selectedtab === item.key ? "bg-[#ff6b4a] shadow-lg" : "hover:bg-[#ff6b4a]/70"}`}
            onClick={() => setselectedtab(item.key)}
          >
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;