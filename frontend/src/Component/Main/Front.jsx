function Front() {
  return (
    <>
      <main className="flex-1 p-6 lg:p-10">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            
            {[
              {title:"Total Patients",value:"120"},
              {title:"Active Alerts",value:"8"},
              {title:"Reports Generated",value:"32"},
              {title:"AI Accuracy",value:"98%"},
            ].map((card,index)=>(
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-2 hover:shadow-2xl transition border border-slate-100">
                <h3 className="text-3xl font-bold text-[#0a3d62]">{card.value}</h3>
                <p className="text-slate-600 mt-1">{card.title}</p>
                <button className="mt-4 bg-[#ff6b4a] hover:bg-[#e55039] text-white px-4 py-2 rounded-md text-sm">
                  View
                </button>
              </div>
            ))}

          </div>

          {/* ECG + Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
            
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-[#0a3d62] mb-4">
                Live ECG Monitor
              </h2>
              <div className="h-48 bg-slate-200 rounded-lg flex items-center justify-center">
                ECG Chart Area
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-[#0a3d62] mb-4">
                Active Alerts
              </h2>
              <ul className="space-y-3 text-sm">
                <li className="text-red-600 font-medium">⚠ Rahul - Arrhythmia</li>
                <li className="text-orange-500 font-medium">⚠ Neha - High BP</li>
                <li className="text-yellow-600 font-medium">⚠ Aman - Low Oxygen</li>
              </ul>
            </div>

          </div>

          {/* Reports Table */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-[#0a3d62] mb-5">
              Recent ECG Reports
            </h2>

            <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-slate-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0a3d62] text-white">
                    <th className="px-6 py-4 text-left">Patient</th>
                    <th className="px-6 py-4 text-left">Age</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-slate-50">
                    <td className="px-6 py-4">Rahul Verma</td>
                    <td className="px-6 py-4">54</td>
                    <td className="px-6 py-4 text-red-600 font-medium">Arrhythmia</td>
                    <td className="px-6 py-4">22 Feb 2026</td>
                  </tr>
                  <tr className="border-b hover:bg-slate-50">
                    <td className="px-6 py-4">Neha Singh</td>
                    <td className="px-6 py-4">47</td>
                    <td className="px-6 py-4 text-green-600 font-medium">Normal</td>
                    <td className="px-6 py-4">22 Feb 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

        </main>
    </>
  );
}

export default Front;
