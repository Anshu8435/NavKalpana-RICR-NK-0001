import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
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
        const reportsData = response.data.data.reports || [];
        // ALWAYS prefer mlResponse as it contains the raw ML data
        // The prediction field may have mongoose schema transformation issues
        const processedReports = reportsData.map(report => {
          if (report.mlResponse && report.mlResponse.risk_probability != null) {
            return { ...report, prediction: report.mlResponse };
          }
          return report;
        });
        setReports(processedReports);
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

  const generatePDF = (report) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(10, 61, 98);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('CardioShield AI', 20, 25);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Cardiovascular Risk Assessment Report', pageWidth - 20, 25, { align: 'right' });
    
    // Report Info
    doc.setTextColor(0, 0, 0);
    let y = 55;
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Report ID: ${report._id}`, 20, y);
    doc.text(`Generated: ${formatDate(report.createdAt)}`, pageWidth - 20, y, { align: 'right' });
    
    y += 15;
    
    // Risk Summary Box
    const riskProb = report.prediction?.risk_probability;
    const riskCategory = report.prediction?.risk_category || 'N/A';
    const riskPercent = riskProb ? Math.round(riskProb * 100) : 'N/A';
    
    if (riskCategory === 'High Risk') {
      doc.setFillColor(239, 68, 68);
    } else if (riskCategory === 'Moderate Risk') {
      doc.setFillColor(245, 158, 11);
    } else {
      doc.setFillColor(34, 197, 94);
    }
    doc.roundedRect(20, y, pageWidth - 40, 30, 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Risk Assessment: ${riskPercent}% - ${riskCategory}`, pageWidth / 2, y + 18, { align: 'center' });
    
    y += 45;
    
    // Patient Information Section
    doc.setTextColor(10, 61, 98);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Patient Information', 20, y);
    
    y += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, pageWidth - 20, y);
    
    y += 12;
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const patientData = report.visitId?.patientData || {};
    const patientInfo = [
      ['Age', `${patientData.age || 'N/A'} years`],
      ['Gender', patientData.gender === 1 ? 'Male' : 'Female'],
      ['Height', `${patientData.height || 'N/A'} cm`],
      ['Weight', `${patientData.weight || 'N/A'} kg`],
      ['Blood Pressure', `${patientData.ap_hi || 'N/A'}/${patientData.ap_lo || 'N/A'} mmHg`],
      ['Cholesterol', patientData.cholesterol === 1 ? 'Normal' : patientData.cholesterol === 2 ? 'Above Normal' : 'High'],
    ];
    
    patientInfo.forEach(([label, value], i) => {
      const xPos = i % 2 === 0 ? 25 : pageWidth / 2;
      if (i % 2 === 0 && i > 0) y += 12;
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, xPos, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value, xPos + 50, y);
    });
    
    y += 25;
    
    // SHAP Risk Factors
    if (report.prediction?.top_risk_factors?.length > 0) {
      doc.setTextColor(10, 61, 98);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('AI Risk Factor Analysis (SHAP)', 20, y);
      
      y += 10;
      doc.line(20, y, pageWidth - 20, y);
      
      y += 12;
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      
      report.prediction.top_risk_factors.forEach((factor) => {
        const impact = factor.impact;
        const sign = impact > 0 ? '+' : '';
        const color = impact > 0 ? [239, 68, 68] : [34, 197, 94];
        
        doc.setFont('helvetica', 'normal');
        doc.text(`• ${factor.feature.replace(/_/g, ' ')}`, 25, y);
        
        doc.setTextColor(...color);
        doc.setFont('helvetica', 'bold');
        doc.text(`${sign}${impact.toFixed(4)}`, pageWidth - 40, y);
        doc.setTextColor(60, 60, 60);
        
        y += 10;
      });
      
      y += 5;
    }
    
    // Recommendation
    if (report.prediction?.recommendation) {
      y += 5;
      doc.setTextColor(10, 61, 98);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('AI Recommendation', 20, y);
      
      y += 10;
      doc.line(20, y, pageWidth - 20, y);
      
      y += 12;
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'normal');
      
      const splitText = doc.splitTextToSize(report.prediction.recommendation, pageWidth - 45);
      doc.text(splitText, 25, y);
    }
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('This report is generated by CardioShield AI and is for informational purposes only.', pageWidth / 2, 280, { align: 'center' });
    doc.text('Please consult a healthcare professional for medical advice.', pageWidth / 2, 286, { align: 'center' });
    
    // Save
    doc.save(`CardioShield_Report_${report._id.slice(-8)}.pdf`);
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
                      <td className="px-6 py-4">{report.prediction?.risk_probability != null ? Math.round(report.prediction.risk_probability * 100) + '%' : 'N/A'}</td>
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
                    <p className={`text-lg font-bold ${selectedReport.prediction?.risk_category === 'High Risk' ? 'text-red-600' : selectedReport.prediction?.risk_category === 'Moderate Risk' ? 'text-orange-500' : 'text-green-600'}`}>{selectedReport.prediction?.risk_category || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-xs text-slate-500">Risk Probability</p>
                    <p className="text-lg font-bold text-[#0a3d62]">{selectedReport.prediction?.risk_probability != null ? Math.round(selectedReport.prediction.risk_probability * 100) + '%' : 'N/A'}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-xs text-slate-500 mb-2">Patient Data</p>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div><span className="text-slate-500">Age:</span> <span className="font-medium">{selectedReport.visitId?.patientData?.age || 'N/A'}</span></div>
                    <div><span className="text-slate-500">Gender:</span> <span className="font-medium">{selectedReport.visitId?.patientData?.gender === 1 ? 'Male' : 'Female'}</span></div>
                    <div><span className="text-slate-500">Height:</span> <span className="font-medium">{selectedReport.visitId?.patientData?.height || 'N/A'} cm</span></div>
                    <div><span className="text-slate-500">Weight:</span> <span className="font-medium">{selectedReport.visitId?.patientData?.weight || 'N/A'} kg</span></div>
                    <div><span className="text-slate-500">BP:</span> <span className="font-medium">{selectedReport.visitId?.patientData?.ap_hi || 'N/A'}/{selectedReport.visitId?.patientData?.ap_lo || 'N/A'}</span></div>
                    <div><span className="text-slate-500">Cholesterol:</span> <span className="font-medium">{selectedReport.visitId?.patientData?.cholesterol === 1 ? 'Normal' : selectedReport.visitId?.patientData?.cholesterol === 2 ? 'Above Normal' : 'High'}</span></div>
                  </div>
                </div>

                {selectedReport.prediction?.top_risk_factors?.length > 0 && (
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-xs text-slate-500 mb-2">SHAP Risk Factor Analysis</p>
                    <p className="text-[10px] text-slate-400 mb-3">Positive values increase risk, negative values decrease risk</p>
                    <ul className="space-y-2">
                      {selectedReport.prediction.top_risk_factors.map((factor, i) => {
                        const isPositive = factor.impact > 0;
                        return (
                          <li key={i} className="flex justify-between items-center">
                            <span className="capitalize text-sm">{factor.feature.replace(/_/g, ' ')}</span>
                            <span className={`font-bold text-sm ${isPositive ? 'text-red-600' : 'text-green-600'}`}>
                              {isPositive ? '+' : ''}{factor.impact.toFixed(4)}
                            </span>
                          </li>
                        );
                      })}
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

                {/* Download PDF Button */}
                <button
                  onClick={() => generatePDF(selectedReport)}
                  className="w-full bg-[#0a3d62] hover:bg-[#083050] text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Records;