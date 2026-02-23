import { useState, useEffect } from "react";

const initialPatients = [
  {
    id: "CS101",
    name: "Rahul Sharma",
    age: 52,
    risk: "78%",
    category: "High",
    date: "22 Feb 2026",
  },
  {
    id: "CS102",
    name: "Anita Verma",
    age: 45,
    risk: "48%",
    category: "Moderate",
    date: "20 Feb 2026",
  },
  {
    id: "CS103",
    name: "Vikas Singh",
    age: 38,
    risk: "18%",
    category: "Low",
    date: "18 Feb 2026",
  },
];

function Records() {
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [filteredPatients, setFilteredPatients] = useState(initialPatients);

  useEffect(() => {
    const lowerId = searchId.trim().toLowerCase();
    const lowerName = searchName.trim().toLowerCase();

    const results = initialPatients.filter((patient) => {
      const matchId = !lowerId || patient.id.toLowerCase().includes(lowerId);
      const matchName =
        !lowerName || patient.name.toLowerCase().includes(lowerName);
      return matchId && matchName;
    });

    setFilteredPatients(results);
  }, [searchId, searchName]);

  return (
    <div className="px-6 md:px-10 lg:px-14 py-10 w-full">

      {/* Page Container */}
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1f4a6e]">
            Patient Screening Records
          </h1>
          <p className="text-slate-500 mt-2">
            Search and manage cardiovascular risk screening data
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-10">

          {/* Search Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Patient ID
              </label>
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Patient ID"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#1f4a6e] focus:ring-2 focus:ring-[#1f4a6e]/30 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Patient Name
              </label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Enter Patient Name"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#1f4a6e] focus:ring-2 focus:ring-[#1f4a6e]/30 outline-none transition"
              />
            </div>

            <div className="flex items-end">
              <div className="bg-[#e74c3c] text-white  px-6 py-3 rounded-xl w-full text-center text-sm">
                Search
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">

              <thead>
                <tr className="bg-slate-100 text-[#1f4a6e] text-sm uppercase tracking-wide">
                  <th className="px-6 py-4 text-left">ID</th>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Age</th>
                  <th className="px-6 py-4 text-left">Risk %</th>
                  <th className="px-6 py-4 text-left">Category</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody className="text-slate-700">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                      No matching records found
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="border-b border-slate-200 hover:bg-slate-50 transition"
                    >
                      <td className="px-6 py-4 font-medium">{patient.id}</td>
                      <td className="px-6 py-4">{patient.name}</td>
                      <td className="px-6 py-4">{patient.age}</td>
                      <td className="px-6 py-4">{patient.risk}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-4 py-1.5 rounded-full text-xs font-medium text-white ${
                            patient.category === "High"
                              ? "bg-red-500"
                              : patient.category === "Moderate"
                              ? "bg-amber-500"
                              : "bg-green-500"
                          }`}
                        >
                          {patient.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">{patient.date}</td>
                      <td className="px-6 py-4">
                        <button className="bg-[#1f4a6e] hover:bg-[#163854] text-white px-5 py-2 rounded-lg text-sm font-medium transition">
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Records;