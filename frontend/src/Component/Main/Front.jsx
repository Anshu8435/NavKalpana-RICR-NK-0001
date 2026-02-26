import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { predictionService } from "../../services/apiService";
import { useAuth } from "../../context/AuthContext";
import { LoadingSpinner } from "../../components/Loading";
import { Alert } from "../../components/Alert";

function Front({ setselectedtab }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await predictionService.getUserStatistics();
        if (response.success) {
          setStats(response.data);
        }
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStatistics();
  }, []);

  const totalReports = stats?.totalReports || 0;
  const riskDist = stats?.riskDistribution || {};
  const highRisk = riskDist['High Risk'] || 0;
  const moderateRisk = riskDist['Moderate Risk'] || 0;
  const lowRisk = riskDist['Low Risk'] || 0;
  const recentReports = stats?.recentReports || [];

  const avgRiskScore = totalReports > 0 
    ? Math.round(((highRisk * 80 + moderateRisk * 45 + lowRisk * 15) / totalReports))
    : 32;

  const criticalAlerts = highRisk;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRiskBadgeColor = (category) => {
    if (category === 'High Risk') return 'bg-red-100 text-red-700 border border-red-300';
    if (category === 'Moderate Risk') return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
    return 'bg-green-100 text-green-700 border border-green-300';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      {/* Greeting Section */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          {getGreeting()}, {user?.name?.split(' ')[0] || 'Doctor'}
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          You have <span className="text-red-600 font-semibold">{criticalAlerts} critical alerts</span> pending.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError('')}
          className="mb-6"
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Patients */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-3xl opacity-10">👥</div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm font-medium">Total Patients</span>
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-1">
                  {loading ? '...' : totalReports.toLocaleString()}
                </h3>
              </div>
            </div>

            {/* Critical Alerts */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-3xl opacity-10">⚠️</div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm font-medium">Critical Alerts</span>
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-1">
                  {loading ? '...' : criticalAlerts}
                </h3>
              </div>
            </div>

            {/* Avg Risk Score */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-3xl opacity-10">📈</div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm font-medium">Avg Risk Score</span>
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-1">
                  {loading ? '...' : avgRiskScore + '%'}
                </h3>
              </div>
            </div>

            {/* Reports Ready */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-3xl opacity-10">📋</div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm font-medium">Reports Ready</span>
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-1">
                  {loading ? '...' : totalReports}
                </h3>
              </div>
            </div>
          </div>

      {/* Recent Patients & Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Patients Table */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Recent Patients</h2>
                  <p className="text-sm text-gray-500">Latest cardiovascular risk assessments</p>
                </div>
                <button 
                  onClick={() => setselectedtab('reports')}
                  className="text-red-500 hover:text-red-600 font-semibold text-sm"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Vitals</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Risk Level</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <LoadingSpinner />
                        </td>
                      </tr>
                    ) : recentReports.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          No patient records yet. Start by creating a new assessment.
                        </td>
                      </tr>
                    ) : (
                      recentReports.slice(0, 5).map((report, index) => {
                        const patientData = report.visitId?.patientData || {};
                        const age = patientData.age || 'N/A';
                        const gender = patientData.gender === 1 ? 'Male' : patientData.gender === 0 ? 'Female' : 'N/A';
                        const riskCategory = report.prediction?.risk_category || 'N/A';
                        const riskProb = report.prediction?.risk_probability 
                          ? Math.round(report.prediction.risk_probability * 100) 
                          : 0;
                        
                        return (
                          <tr key={report._id || index} className="border-b border-gray-50 hover:bg-gray-50 transition">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-sm">
                                  {gender === 'Male' ? 'M' : 'F'}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800">Patient #{index + 1}</p>
                                  <p className="text-xs text-gray-500">{age} yrs • {gender}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm">
                                <p className="text-gray-600">❤️ {patientData.ap_hi || 'N/A'}/{patientData.ap_lo || 'N/A'} mmHg</p>
                                <p className="text-gray-600">🩺 BP {patientData.ap_hi && patientData.ap_lo ? (patientData.ap_hi >= 140 || patientData.ap_lo >= 90 ? 'High' : patientData.ap_hi >= 120 ? 'Elevated' : 'Normal') : 'N/A'}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskBadgeColor(riskCategory)}`}>
                                {riskCategory}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-bold text-gray-800">Score</p>
                                <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      riskCategory === 'High Risk' ? 'bg-red-600' :
                                      riskCategory === 'Moderate Risk' ? 'bg-yellow-500' :
                                      'bg-green-600'
                                    }`}
                                    style={{ width: `${riskProb}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{riskProb}%</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <button 
                                onClick={() => {
                                  // Load this report into localStorage and switch to result tab
                                  const predictionPayload = {
                                    report: report,
                                    patientId: report.patientId || `P${String(index + 1).padStart(3, '0')}`,
                                    patientData: patientData,
                                  };
                                  localStorage.setItem('latestPrediction', JSON.stringify(predictionPayload));
                                  setselectedtab('result');
                                }}
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                              >
                                →
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Risk Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-1">Risk Distribution</h2>
                <p className="text-sm text-gray-500">Overall</p>
              </div>

              {loading ? (
                <div className="h-48 flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : (
                <>
                  {/* Pie Chart Visualization */}
                  <div className="flex justify-center mb-6">
                    <div className="relative w-48 h-48">
                      {/* Simple pie chart representation */}
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-red-100 via-yellow-100 to-green-100 flex items-center justify-center text-center">
                        <div className="bg-white w-28 h-28 rounded-full flex items-center justify-center">
                          <div>
                            <p className="text-3xl font-bold text-red-600">{totalReports > 0 ? Math.round((highRisk/totalReports)*100) : 0}%</p>
                            <p className="text-xs text-gray-600">High Risk Patients</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">{totalReports > 0 ? Math.round((highRisk/totalReports)*100) : 0}% High Risk</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">{totalReports > 0 ? Math.round((moderateRisk/totalReports)*100) : 0}% Moderate Risk</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">{totalReports > 0 ? Math.round((lowRisk/totalReports)*100) : 0}% Low Risk</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

    
    </main>
  );
}

export default Front;
