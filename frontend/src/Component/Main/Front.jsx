import { useState, useEffect } from "react";
import api from "../../utils/api";

function Front() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await api.get('/predictions/statistics');
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatistics();
  }, []);

  const totalReports = stats?.totalReports || 0;
  const riskDist = stats?.riskDistribution || {};
  const highRisk = riskDist['High Risk'] || 0;
  const recentReports = stats?.recentReports || [];

  const cards = [
    { title: "Total Patients", value: totalReports },
    { title: "High Risk Alerts", value: highRisk },
    { title: "Reports Generated", value: totalReports },
    { title: "AI Accuracy", value: "98%" },
  ];

  const getRiskColor = (category) => {
    if (category === 'High Risk') return 'text-red-600 font-medium';
    if (category === 'Moderate Risk') return 'text-orange-500 font-medium';
    return 'text-green-600 font-medium';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <>
      <main className="flex-1 p-6 lg:p-10">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            
            {cards.map((card,index)=>(
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-2 hover:shadow-2xl transition border border-slate-100">
                <h3 className="text-3xl font-bold text-[#0a3d62]">{loading ? '...' : card.value}</h3>
                <p className="text-slate-600 mt-1">{card.title}</p>
                <button className="mt-4 bg-[#ff6b4a] hover:bg-[#e55039] text-white px-4 py-2 rounded-md text-sm">
                  View
                </button>
              </div>
            ))}

          </div>

          {/* Risk Distribution + Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
            
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-[#0a3d62] mb-4">
                Risk Distribution
              </h2>
              {loading ? (
                <div className="h-48 bg-slate-200 rounded-lg flex items-center justify-center">Loading...</div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 p-6 rounded-xl text-center border border-green-200">
                    <h3 className="text-3xl font-bold text-green-600">{riskDist['Low Risk'] || 0}</h3>
                    <p className="text-green-700 mt-1 text-sm font-medium">Low Risk</p>
                  </div>
                  <div className="bg-orange-50 p-6 rounded-xl text-center border border-orange-200">
                    <h3 className="text-3xl font-bold text-orange-500">{riskDist['Moderate Risk'] || 0}</h3>
                    <p className="text-orange-600 mt-1 text-sm font-medium">Moderate Risk</p>
                  </div>
                  <div className="bg-red-50 p-6 rounded-xl text-center border border-red-200">
                    <h3 className="text-3xl font-bold text-red-600">{riskDist['High Risk'] || 0}</h3>
                    <p className="text-red-700 mt-1 text-sm font-medium">High Risk</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-[#0a3d62] mb-4">
                Active Alerts
              </h2>
              <ul className="space-y-3 text-sm">
                {highRisk > 0 ? (
                  <li className="text-red-600 font-medium">⚠ {highRisk} High Risk patient{highRisk > 1 ? 's' : ''} detected</li>
                ) : (
                  <li className="text-green-600 font-medium">✓ No high risk alerts</li>
                )}
                {(riskDist['Moderate Risk'] || 0) > 0 && (
                  <li className="text-orange-500 font-medium">⚠ {riskDist['Moderate Risk']} Moderate Risk patient{riskDist['Moderate Risk'] > 1 ? 's' : ''}</li>
                )}
                {totalReports === 0 && (
                  <li className="text-slate-500">No screenings yet. Start by registering a patient.</li>
                )}
              </ul>
            </div>

          </div>

          {/* Reports Table */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-[#0a3d62] mb-5">
              Recent Screening Reports
            </h2>

            <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-slate-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0a3d62] text-white">
                    <th className="px-6 py-4 text-left">Patient Age</th>
                    <th className="px-6 py-4 text-left">Gender</th>
                    <th className="px-6 py-4 text-left">Risk Category</th>
                    <th className="px-6 py-4 text-left">Risk %</th>
                    <th className="px-6 py-4 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
                  ) : recentReports.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No reports yet. Submit a patient screening to see results here.</td></tr>
                  ) : (
                    recentReports.map((report, index) => (
                      <tr key={report._id || index} className="border-b hover:bg-slate-50">
                        <td className="px-6 py-4">{report.visitId?.patientData?.age || 'N/A'} yrs</td>
                        <td className="px-6 py-4">{report.visitId?.patientData?.gender === 1 ? 'Male' : 'Female'}</td>
                        <td className={`px-6 py-4 ${getRiskColor(report.prediction?.risk_category)}`}>{report.prediction?.risk_category || 'N/A'}</td>
                        <td className="px-6 py-4">{report.prediction?.risk_probability ? Math.round(report.prediction.risk_probability * 100) + '%' : 'N/A'}</td>
                        <td className="px-6 py-4">{formatDate(report.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </main>
    </>
  );
}

export default Front;
