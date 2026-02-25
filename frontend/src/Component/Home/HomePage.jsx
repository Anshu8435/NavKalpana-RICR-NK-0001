import Header from "../../components/Header";
import Sidebar from "../../components/Siderbar";
import Front from "../Main/Front";
import Registration from "../Main/Registeration";
import Analatics from "../Main/Analatics";
import Records from "../Main/Records";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import  Profile  from "../Main/Profile";
import Result from "../Main/Result";
import { MdDashboard } from "react-icons/md";
import { FaHeartbeat, FaUserInjured, FaFileMedical, FaUserCircle } from "react-icons/fa";

function HomePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedtab , setselectedtab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      setselectedtab(tabFromUrl);
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* SIDEBAR - Hidden on mobile, visible on md+ */}
      <div className="hidden md:block">
        <Sidebar
          selectedtab={selectedtab}
          setselectedtab={setselectedtab}
        />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        {/* HEADER */}
        <Header 
          setselectedtab={setselectedtab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedtab={selectedtab}
        />

        {/* MAIN CONTENT */}
        {selectedtab === "dashboard" && <Front />}
        {selectedtab === "admin" && <Registration />}
        {selectedtab === "analysis" && <Analatics />}
        {selectedtab === "reports" && <Records searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
        {selectedtab === "profile" && <Profile />}
        {selectedtab === "result" && <Result />}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
        <div className="flex justify-around items-center py-2">
          <button
            onClick={() => setselectedtab('dashboard')}
            className={`flex flex-col items-center px-3 py-2 ${
              selectedtab === 'dashboard' ? 'text-cyan-600' : 'text-gray-500'
            }`}
          >
            <MdDashboard size={24} />
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          <button
            onClick={() => setselectedtab('analysis')}
            className={`flex flex-col items-center px-3 py-2 ${
              selectedtab === 'analysis' ? 'text-cyan-600' : 'text-gray-500'
            }`}
          >
            <FaHeartbeat size={24} />
            <span className="text-xs mt-1">Analysis</span>
          </button>
          <button
            onClick={() => setselectedtab('admin')}
            className={`flex flex-col items-center px-3 py-2 ${
              selectedtab === 'admin' ? 'text-cyan-600' : 'text-gray-500'
            }`}
          >
            <FaUserInjured size={24} />
            <span className="text-xs mt-1">Patients</span>
          </button>
          <button
            onClick={() => setselectedtab('reports')}
            className={`flex flex-col items-center px-3 py-2 ${
              selectedtab === 'reports' ? 'text-cyan-600' : 'text-gray-500'
            }`}
          >
            <FaFileMedical size={24} />
            <span className="text-xs mt-1">Records</span>
          </button>
          <button
            onClick={() => setselectedtab('profile')}
            className={`flex flex-col items-center px-3 py-2 ${
              selectedtab === 'profile' ? 'text-cyan-600' : 'text-gray-500'
            }`}
          >
            <FaUserCircle size={24} />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
