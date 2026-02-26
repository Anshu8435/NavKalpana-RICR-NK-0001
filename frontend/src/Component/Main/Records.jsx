import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { predictionService } from "../../services/apiService";
import { LoadingSpinner } from "../../components/Loading";
import { Alert, EmptyState } from "../../components/Alert";
import { Search, Download, UserPlus, ChevronRight, X } from "lucide-react";

function Records({ searchQuery = '', setSearchQuery, setselectedtab }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    filterReports();
  }, [searchTerm, riskFilter, genderFilter, reports]);

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await predictionService.getUserReports({
        page: 1,
        limit: 100,
        sortBy: 'createdAt',
        order: 'desc',
      });
      
      if (response.success) {
        const reportsData = response.data.reports || [];
        const processedReports = reportsData.map((report, index) => {
          const prediction = report.mlResponse && report.mlResponse.risk_probability != null 
            ? report.mlResponse 
            : report.prediction;
          
          return {
            ...report,
            prediction,
            patientId: `P${String(index + 1).padStart(3, '0')}`,
          };
        });
        setReports(processedReports);
        setFilteredReports(processedReports);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load patient records');
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = [...reports];

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(report => {
        const reportId = report._id?.slice(-8).toLowerCase() || '';
        const patientId = report.patientId?.toLowerCase() || '';
        return reportId.includes(searchLower) || patientId.includes(searchLower);
      });
    }

    // Risk filter
    if (riskFilter) {
      filtered = filtered.filter(report => 
        report.prediction?.risk_category === riskFilter
      );
    }

    // Gender filter
    if (genderFilter) {
      const genderValue = genderFilter === 'Male' ? 1 : 0;
      filtered = filtered.filter(report => 
        report.visitId?.patientData?.gender === genderValue
      );
    }

    setFilteredReports(filtered);
  };

  const getInitials = (index) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[index % 26] + letters[(index + 5) % 26];
  };

  const getRiskBadgeClass = (category) => {
    if (category === 'High Risk') return 'bg-red-100 text-red-700';
    if (category === 'Moderate Risk') return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const exportAllReports = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Header
    doc.setFillColor(44, 95, 124);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('CardioShield AI - Patient Records', pageWidth / 2, 25, { align: 'center' });

    y = 55;
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Patients: ${filteredReports.length}`, 20, y);

    y += 15;
    filteredReports.forEach((report, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      const patientData = report.visitId?.patientData || {};
      const riskScore = report.prediction?.risk_probability 
        ? Math.round(report.prediction.risk_probability * 100) 
        : 0;

      doc.setFont('helvetica', 'bold');
      doc.text(`${report.patientId} - Age: ${patientData.age || 'N/A'}`, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`Gender: ${patientData.gender === 1 ? 'Male' : patientData.gender === 0 ? 'Female' : 'N/A'}`, 20, y + 6);
      doc.text(`Risk: ${report.prediction?.risk_category || 'N/A'} (${riskScore}%)`, 20, y + 12);
      
      y += 25;
    });

    doc.save(`CardioShield_Patient_Records_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const generatePDF = (report) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 10;

    // Header
    doc.setFillColor(44, 95, 124);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('CardioShield AI', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Cardiovascular Risk Assessment Report', pageWidth / 2, 30, { align: 'center' });

    y = 55;

    // Patient Info
    doc.setTextColor(44, 95, 124);
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
      ['Patient ID', report.patientId],
      ['Age', `${patientData.age || 'N/A'} years`],
      ['Gender', patientData.gender === 1 ? 'Male' : patientData.gender === 0 ? 'Female' : 'N/A'],
      ['Height', `${patientData.height || 'N/A'} cm`],
      ['Weight', `${patientData.weight || 'N/A'} kg`],
      ['Blood Pressure', `${patientData.ap_hi || 'N/A'}/${patientData.ap_lo || 'N/A'} mmHg`],
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

    // Risk Assessment
    doc.setTextColor(44, 95, 124);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Risk Assessment', 20, y);

    y += 10;
    doc.line(20, y, pageWidth - 20, y);

    y += 12;
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);

    const riskScore = report.prediction?.risk_probability 
      ? Math.round(report.prediction.risk_probability * 100) 
      : 0;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Risk Category:', 25, y);
    doc.setFont('helvetica', 'normal');
    doc.text(report.prediction?.risk_category || 'N/A', 80, y);

    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Risk Score:', 25, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${riskScore}%`, 80, y);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('CardioShield AI - For informational purposes only. Consult a healthcare professional.', pageWidth / 2, 280, { align: 'center' });

    doc.save(`Patient_${report.patientId}_Report.pdf`);
  };

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1e4a6b]">
              Patient Records
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              Manage and view all patient history
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportAllReports}
              className="flex items-center gap-2 px-4 md:px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm md:text-base font-medium text-gray-700"
            >
              <Download size={18} />
              Export
            </button>
            <button
              onClick={() => { if (setselectedtab) setselectedtab('admin'); }}
              className="flex items-center gap-2 px-4 md:px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-lg transition text-sm md:text-base font-semibold shadow-md"
            >
              <UserPlus size={18} />
              Add Patient
            </button>
          </div>
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

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Panel - Patient List */}
          <div className={`${selectedReport ? 'lg:w-1/2' : 'w-full'} transition-all duration-300`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              {/* Search and Filters */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by Patient Name or ID..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-sm md:text-base"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-sm md:text-base bg-white"
                  >
                    <option value="">All Risks</option>
                    <option value="Low Risk">Low Risk</option>
                    <option value="Moderate Risk">Moderate Risk</option>
                    <option value="High Risk">High Risk</option>
                  </select>

                  <select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-sm md:text-base bg-white"
                  >
                    <option value="">All Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              {/* Patient Count */}
              <p className="text-sm text-gray-600 mb-4">
                Showing <span className="font-semibold">{filteredReports.length}</span> of{' '}
                <span className="font-semibold">{reports.length}</span> patients
              </p>

              {/* Patient List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {loading ? (
                  <div className="text-center py-12">
                    <LoadingSpinner className="mx-auto" />
                    <p className="mt-4 text-gray-500">Loading patients...</p>
                  </div>
                ) : filteredReports.length === 0 ? (
                  <EmptyState
                    
                    title="No Patients Found"
                    message="No patients match your search criteria."
                  />
                ) : (
                  filteredReports.map((report, index) => {
                    const patientData = report.visitId?.patientData || {};
                    const riskScore = report.prediction?.risk_probability 
                      ? Math.round(report.prediction.risk_probability * 100) 
                      : 0;
                    const isSelected = selectedReport?._id === report._id;

                    return (
                      <div
                        key={report._id}
                        onClick={() => setSelectedReport(report)}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                          isSelected 
                            ? 'border-cyan-500 bg-cyan-50' 
                            : 'border-gray-200 hover:border-cyan-300'
                        }`}
                      >
                        {/* Avatar */}
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-gradient-to-br from-[#2c5f7c] to-[#1a3f54] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {getInitials(index)}
                        </div>

                        {/* Patient Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                              Patient {report.patientId}
                            </h3>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {report.patientId}
                            </span>
                          </div>
                          <p className="text-xs md:text-sm text-gray-600">
                            {patientData.age || 'N/A'} yrs • {patientData.gender === 1 ? 'Male' : patientData.gender === 0 ? 'Female' : 'N/A'}
                          </p>
                        </div>

                        {/* Risk Badge */}
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskBadgeClass(report.prediction?.risk_category)}`}>
                            {report.prediction?.risk_category?.split(' ')[0] || 'N/A'}
                          </span>
                          <span className="text-xs text-gray-500">Score: {riskScore}%</span>
                        </div>

                        {/* Arrow */}
                        <ChevronRight 
                          size={20} 
                          className={`flex-shrink-0 ${isSelected ? 'text-cyan-600' : 'text-gray-400'}`} 
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Patient Details */}
          {selectedReport ? (
            <div className="lg:w-1/2 w-full">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 sticky top-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
                {/* Close button for mobile */}
                <button
                  onClick={() => setSelectedReport(null)}
                  className="lg:hidden absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                  Patient Details
                </h2>

                {/* Patient Info Section */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <InfoField label="Patient ID" value={selectedReport.patientId} />
                      <InfoField 
                        label="Age" 
                        value={`${selectedReport.visitId?.patientData?.age || 'N/A'} years`} 
                      />
                      <InfoField 
                        label="Gender" 
                        value={selectedReport.visitId?.patientData?.gender === 1 ? 'Male' : selectedReport.visitId?.patientData?.gender === 0 ? 'Female' : 'N/A'} 
                      />
                      <InfoField 
                        label="Height" 
                        value={`${selectedReport.visitId?.patientData?.height || 'N/A'} cm`} 
                      />
                      <InfoField 
                        label="Weight" 
                        value={`${selectedReport.visitId?.patientData?.weight || 'N/A'} kg`} 
                      />
                      <InfoField 
                        label="BMI" 
                        value={
                          selectedReport.visitId?.patientData?.height && selectedReport.visitId?.patientData?.weight
                            ? ((selectedReport.visitId.patientData.weight / Math.pow(selectedReport.visitId.patientData.height / 100, 2)).toFixed(1))
                            : 'N/A'
                        } 
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                      Vital Signs
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <InfoField 
                        label="Systolic BP" 
                        value={`${selectedReport.visitId?.patientData?.ap_hi || 'N/A'} mmHg`} 
                      />
                      <InfoField 
                        label="Diastolic BP" 
                        value={`${selectedReport.visitId?.patientData?.ap_lo || 'N/A'} mmHg`} 
                      />
                      <InfoField 
                        label="Cholesterol" 
                        value={
                          selectedReport.visitId?.patientData?.cholesterol === 1 
                            ? 'Normal' 
                            : selectedReport.visitId?.patientData?.cholesterol === 2 
                            ? 'Above Normal' 
                            : selectedReport.visitId?.patientData?.cholesterol === 3
                            ? 'High'
                            : 'N/A'
                        } 
                      />
                      <InfoField 
                        label="Glucose" 
                        value={
                          selectedReport.visitId?.patientData?.gluc === 1 
                            ? 'Normal' 
                            : selectedReport.visitId?.patientData?.gluc === 2 
                            ? 'Above Normal' 
                            : selectedReport.visitId?.patientData?.gluc === 3
                            ? 'High'
                            : 'N/A'
                        } 
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                      Risk Assessment
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">Risk Category</span>
                        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getRiskBadgeClass(selectedReport.prediction?.risk_category)}`}>
                          {selectedReport.prediction?.risk_category || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">Risk Score</span>
                        <span className="text-2xl font-bold text-gray-900">
                          {selectedReport.prediction?.risk_probability 
                            ? Math.round(selectedReport.prediction.risk_probability * 100) 
                            : 0}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Top Risk Factors */}
                  {selectedReport.prediction?.top_risk_factors?.length > 0 && (
                    <div className="border-t pt-6">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                        Top Risk Factors (SHAP Analysis)
                      </h3>
                      <div className="space-y-2">
                        {selectedReport.prediction.top_risk_factors.slice(0, 5).map((factor, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <span className="text-sm text-gray-700 capitalize">
                              {factor.feature.replace(/_/g, ' ')}
                            </span>
                            <span className={`text-sm font-semibold ${
                              factor.impact > 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {factor.impact > 0 ? '+' : ''}{factor.impact.toFixed(4)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Recommendations */}
                  {(() => {
                    const recs = selectedReport.prediction?.recommendations ||
                                 selectedReport.mlResponse?.recommendations || [];
                    return recs.length > 0 ? (
                      <div className="border-t pt-6">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                          AI Recommendations
                        </h3>
                        <div className="space-y-3">
                          {recs.slice(0, 4).map((rec, idx) => {
                            const sevColors = {
                              high: 'border-l-red-400 bg-red-50',
                              moderate: 'border-l-yellow-400 bg-yellow-50',
                              low: 'border-l-green-400 bg-green-50',
                            };
                            return (
                              <div
                                key={idx}
                                className={`border-l-4 ${sevColors[rec.severity] || 'border-l-blue-400 bg-blue-50'} rounded-lg p-3`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-base">{rec.icon}</span>
                                  <span className="text-sm font-semibold text-gray-900">{rec.title}</span>
                                </div>
                                <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
                                {rec.actions?.length > 0 && (
                                  <ul className="space-y-1">
                                    {rec.actions.slice(0, 3).map((a, i) => (
                                      <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                                        <span className="text-cyan-600 mt-0.5">&#10003;</span>
                                        <span>{a}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null;
                  })()}

                  {/* Action Buttons */}
                  <div className="border-t pt-6 flex gap-3">
                    <button
                      onClick={() => {
                        // Load full report into localStorage and navigate to Result tab
                        const predictionPayload = {
                          report: selectedReport,
                          patientId: selectedReport.patientId || 'N/A',
                          patientData: selectedReport.visitId?.patientData || {},
                        };
                        localStorage.setItem('latestPrediction', JSON.stringify(predictionPayload));
                        if (setselectedtab) setselectedtab('result');
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#0a3d62] hover:bg-[#083050] text-white rounded-lg font-semibold transition shadow-md"
                    >
                      <ChevronRight size={18} />
                      View Full Report
                    </button>
                    <button
                      onClick={() => generatePDF(selectedReport)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-lg font-semibold transition shadow-md"
                    >
                      <Download size={18} />
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
              <div className="text-center text-gray-400">
                <p className="text-lg font-medium">Select a patient to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// Helper Component
const InfoField = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="text-sm font-semibold text-gray-900">{value}</p>
  </div>
);

export default Records;
