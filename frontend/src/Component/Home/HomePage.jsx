import Header from "./Header";
import Sidebar from "./Siderbar";
import Front from "../Main/Front";
import Registration from "../Main/Registeration";
import Analatics from "../Main/Analatics";
import Records from "../Main/Records";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import  Profile  from "../Main/Profile";
import Result from "../Main/Result";
function HomePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedtab , setselectedtab] = useState('dashboard')

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
    <div className="bg-slate-100 font-sans antialiased min-h-screen">
      {/* HEADER */}
      <Header />

      <div className="flex flex-col lg:flex-row">
        {/* SIDEBAR (Header ke niche) */}
        <Sidebar
          selectedtab={selectedtab}
          setselectedtab={setselectedtab}
        ></Sidebar>

        {/* MAIN CONTENT */}

        {selectedtab === "dashboard" && <Front />}
        {selectedtab === "admin" && <Registration />}
        {selectedtab === "analysis" && <Analatics />}
        {selectedtab === "reports" && <Records />}
        {selectedtab === "profile" && <Profile />}
        {selectedtab === "result" && <Result />}
      </div>
    </div>
  );
}

export default HomePage;
