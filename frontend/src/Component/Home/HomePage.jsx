import Header from "./Header";
import Sidebar from "./Siderbar";
import Front from "../Main/Front";
import Registration from "../Main/Registeration";
import Analatics from "../Main/Analatics";
import Records from "../Main/Records";
import { useState } from "react";
import  Profile  from "../Main/Profile";
import Result from "../Main/Result";
function HomePage() {
  const [selectedtab , setselectedtab] = useState('dashboard')
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
      </div>
    </div>
  );
}

export default HomePage;
