import { useState, useEffect } from "react";
import api from "../../utils/api";

function Records() {
  const [searchId, setSearchId] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalReports: 0 });
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchReports = async (page = 1) => {
    setLoading(true);
    try {
      let url = `/predictions/reports?page=${page}&limit=10&sortBy=createdAt&order=desc`;
      if (searchCategory) url += `&riskCategory=${encodeURIComponent(searchCategory)}`;
      const response = await api.get(url);
      if (response.data.success) {
        setReports(response.data.data.reports || []);
        setPagination(response.data.data.pagination || {});
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSearch = () => {
    fetchReports(1);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getCategoryBadge = (category) => {
    if (category === 'High Risk') return 'bg-red-500';
    if (category === 'Moderate Risk') return 'bg-amber-500';
    return 'bg-green-500';
  };

  const handleView = (report) => {
    setSelectedReport(report);
  };

  const handleDelete = async (reportId) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    try {
      await api.delete(`/predictions/reports/${reportId}`);
      fetchReports(pagination.currentPage);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete report');
    }
  };

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
                Risk Category
              </label>
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#1f4a6e] focus:ring-2 focus:ring-[#1f4a6e]/30 outline-none transition bg-white"
              >
                <option value="">All Categories</option>
                <option value="Low Risk">Low Risk</option>
                <option value="Moderate Risk">Moderate Risk</option>
                <option value="High Risk">High Risk</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Report ID
              </label>
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Report ID"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#1f4a6e] focus:ring-2 focus:ring-[#1f4a6e]/30 outline-none transition"
              />
            </div>

            <div className="flex items-end">
              <button onClick={handleSearch} className="bg-[#e74c3c] hover:bg-[#c0392b] text-white px-6 py-3 rounded-xl w-full text-center text-sm font-medium transition">
                Search
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">

              <thead>
                <tr className="bg-slate-100 text-[#1f4a6e] text-sm uppercase tracking-wide">
                  <th className="px-6 py-4 text-left">Report ID</th>
                  <th className="px-6 py-4 text-left">Age</th>
                  <th className="px-6 py-4 text-left">Gender</th>
                  <th className="px-6 py-4 text-left">Risk %</th>
                  <th className="px-6 py-4 text-left">Category</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody className="text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                      Loading reports...
                    </td>
                  </tr>
                ) : reports.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                      No matching records found
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr
                      key={report._id}
                      className="border-b border-slate-200 hover:bg-slate-50 transition"
                    >
                      <td className="px-6 py-4 font-medium text-xs">{report._id?.slice(-8).toUpperCase()}</td>
                      <td className="px-6 py-4">{report.visitId?.patientData?.age || 'N/A'}</td>
                      <td className="px-6 py-4">{report.visitId?.patientData?.gender === 1 ? 'Male' : 'Female'}</td>
                      <td className="px-6 py-4">{report.prediction?.risk_probability ? Math.round(report.prediction.risk_probability * 100) + '%' : 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-4 py-1.5 rounded-full text-xs font-medium text-white ${getCategoryBadge(report.prediction?.risk_category)}`}
                        >
                          {report.prediction?.risk_category || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">{formatDate(report.createdAt)}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <button onClick={() => handleView(report)} className="bg-[#1f4a6e] hover:bg-[#163854] text-white px-5 py-2 rounded-lg text-sm font-medium transition">
                          View
                        </button>
                        <button onClick={() => handleDelete(report._id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => fetchReports(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-slate-600">
                Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalReports} total)
              </span>
              <button
                onClick={() => fetchReports(pagination.currentPage + 1)}
                disabled={!pagination.hasMore}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* View Report Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-10 relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setSelectedReport(null)} className="absolute top-5 right-6 text-gray-400 hover:text-black text-xl">✕</button>
              <h2 className="text-2xl font-bold text-[#0a3d62] mb-6">Report Details</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-xs text-slate-500">Risk Category</p>
                    <p className={`text-lg font-bold ${selectedReport.prediction?.risk_category === 'High Risk' ? 'text-red-600' : selectedReport.prediction?.risk_category === 'Moderate Risk' ? 'text-orange-500' : 'text-green-600'}`}>{selectedReport.prediction?.risk_category}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-xs text-slate-500">Risk Probability</p>
                    <p className="text-lg font-bold text-[#0a3d62]">{selectedReport.prediction?.risk_probability ? Math.round(selectedReport.prediction.risk_probability * 100) + '%' : 'N/A'}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-xs text-slate-500 mb-2">Patient Data</p>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div><span className="text-slate-500">Age:</span> <span className="font-medium">{selectedReport.visitId?.patientData?.age}</span></div>
                    <div><span className="text-slate-500">Gender:</span> <span className="font-medium">{selectedReport.visitId?.patientData?.gender === 1 ? 'Male' : 'Female'}</span></div>
                    <div><span className="text-slate-500">Height:</span> <span className="font-medium">{selectedReport.visitId?.patientData?.height} cm</span></div>
                    <div><span className="text-slate-500">Weight:</span> <span className="font-medium">{selectedReport.visitId?.patientData?.weight} kg</span></div>
                    <div><span className="text-slate-500">BP:</span> <span className="font-medium">{selectedReport.visitId?.patientData?.ap_hi}/{selectedReport.visitId?.patientData?.ap_lo}</span></div>
                    <div><span className="text-slate-500">Cholesterol:</span> <span className="font-medium">{selectedReport.visitId?.patientData?.cholesterol === 1 ? 'Normal' : selectedReport.visitId?.patientData?.cholesterol === 2 ? 'Above Normal' : 'High'}</span></div>
                  </div>
                </div>

                {selectedReport.prediction?.top_risk_factors?.length > 0 && (
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-xs text-slate-500 mb-2">Top Risk Factors</p>
                    <ul className="space-y-1">
                      {selectedReport.prediction.top_risk_factors.map((factor, i) => (
                        <li key={i} className="flex justify-between text-sm">
                          <span className="capitalize">{factor.feature.replace('_', ' ')}</span>
                          <span className="font-medium">{(factor.impact * 100).toFixed(1)}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedReport.prediction?.recommendation && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <p className="text-xs text-blue-500 mb-1">AI Recommendation</p>
                    <p className="text-sm text-blue-800">{selectedReport.prediction.recommendation}</p>
                  </div>
                )}

                <p className="text-xs text-slate-400 text-right">Created: {formatDate(selectedReport.createdAt)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Records;