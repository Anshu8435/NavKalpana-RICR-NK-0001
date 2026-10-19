import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { predictionService } from "../../services/apiService";
import { LoadingSpinner } from "../../components/Loading";
import { Alert, EmptyState } from "../../components/Alert";
import { 
  Search, 
  Download, 
  UserPlus, 
  ChevronRight, 
  X, 
  Activity, 
  FileText, 
  User, 
  Heart, 
  Scale, 
  Droplet, 
  CheckCircle2, 
  Filter,
  ArrowRight
} from "lucide-react";

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
        if (processedReports.length > 0 && !selectedReport) {
          setSelectedReport(processedReports[0]);
        }
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

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(report => {
        const reportId = report._id?.slice(-8).toLowerCase() || '';
        const patientId = report.patientId?.toLowerCase() || '';
        return reportId.includes(searchLower) || patientId.includes(searchLower);
      });
    }

    if (riskFilter) {
      filtered = filtered.filter(report => 
        report.prediction?.risk_category === riskFilter
      );
    }

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
    if (category === 'High Risk') return 'bg-rose-50 text-[#D94F59] border-rose-200';
    if (category === 'Moderate Risk') return 'bg-amber-50 text-[#D49A27] border-amber-200';
    return 'bg-teal-50 text-[#16866A] border-teal-200';
  };

  const exportAllReports = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    doc.setFillColor(11, 31, 51);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('CardioShield AI - Clinical Cohort Records', pageWidth / 2, 25, { align: 'center' });

    y = 55;
    doc.setTextColor(23, 43, 58);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Longitudinal Records: ${filteredReports.length}`, 20, y);

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
      doc.text(`${report.patientId} - Age: ${patientData.age || 'N/A'}y`, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`Sex: ${patientData.gender === 1 ? 'Male' : patientData.gender === 0 ? 'Female' : 'N/A'} | BP: ${patientData.ap_hi || '—'}/${patientData.ap_lo || '—'} mmHg`, 20, y + 5);
      doc.text(`Risk: ${report.prediction?.risk_category || 'N/A'} (${riskScore}%)`, 20, y + 10);
      
      y += 20;
    });

    doc.save(`CardioShield_Clinical_Records_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-[#0B1F33] via-[#0E2A44] to-[#123B5D] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/25 text-[#20D9C2] text-xs font-semibold mb-2">
              <FileText size={14} />
              <span>Audited Clinical Registry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
              Patient Assessment Archive
            </h1>
            <p className="text-sm text-slate-300">
              Longitudinal tracking of all executed cardiovascular risk models and SHAP explanations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportAllReports}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-xl font-semibold text-xs transition-all"
            >
              <Download size={15} />
              <span>Export Registry (PDF)</span>
            </button>
            <button
              onClick={() => { if (setselectedtab) setselectedtab('admin'); }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-[#13B8A6] to-[#20D9C2] text-[#0B1F33] rounded-xl font-bold text-xs shadow-md shadow-[#20D9C2]/20 hover:shadow-lg transition-all"
            >
              <UserPlus size={15} />
              <span>New Patient</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError('')}
        />
      )}

      {/* Master-Detail Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Patient List with Filters */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E0E8F0] shadow-sm p-5 space-y-4">
          
          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#13B8A6]" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Patient ID or Report Code..."
              className="w-full pl-10 pr-4 py-2.5 text-xs text-[#172B3A] placeholder-slate-400 bg-[#F5F8FC]/50 rounded-xl border border-[#E0E8F0] focus:bg-white focus:outline-none focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20 transition-all duration-200"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-2 gap-3">
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-3 py-2 border border-[#E0E8F0] rounded-xl text-xs text-[#172B3A] bg-[#F5F8FC]/50 focus:bg-white focus:border-[#13B8A6] focus:outline-none transition-all cursor-pointer"
            >
              <option value="">All Risk Tiers</option>
              <option value="Low Risk">Low Risk (&lt; 20%)</option>
              <option value="Moderate Risk">Moderate Risk (20-49%)</option>
              <option value="High Risk">High Risk (&ge; 50%)</option>
            </select>

            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="px-3 py-2 border border-[#E0E8F0] rounded-xl text-xs text-[#172B3A] bg-[#F5F8FC]/50 focus:bg-white focus:border-[#13B8A6] focus:outline-none transition-all cursor-pointer"
            >
              <option value="">All Biological Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Records Counter */}
          <div className="text-[11px] text-[#627487] font-medium flex items-center justify-between px-1">
            <span>Filtering: <strong className="text-[#0B1F33]">{filteredReports.length}</strong> of {reports.length} records</span>
          </div>

          {/* Patient Scroll List */}
          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {loading ? (
              <div className="text-center py-12">
                <LoadingSpinner size="md" message="Loading records..." />
              </div>
            ) : filteredReports.length === 0 ? (
              <EmptyState
                title="No Matching Records"
                message="Adjust filters or search keywords to view records."
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
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-[#13B8A6] bg-teal-50/50 shadow-sm' 
                        : 'border-[#E0E8F0] hover:border-teal-200 hover:bg-[#F5F8FC]/70'
                    }`}
                  >
                    {/* Avatar Badge */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0B1F33] to-[#123B5D] text-white flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                      {getInitials(index)}
                    </div>

                    {/* Patient Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-bold text-xs text-[#0B1F33] truncate">
                          Patient {report.patientId}
                        </h4>
                        <span className="text-[10px] font-mono text-[#627487]">
                          {report._id?.slice(-6).toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#627487]">
                        {patientData.age || '—'}y • {patientData.gender === 1 ? 'Male' : patientData.gender === 0 ? 'Female' : '—'} • {patientData.ap_hi || '—'}/{patientData.ap_lo || '—'} mmHg
                      </p>
                    </div>

                    {/* Risk Badge */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRiskBadgeClass(report.prediction?.risk_category)}`}>
                        {report.prediction?.risk_category?.split(' ')[0] || 'N/A'}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#0B1F33]">
                        {riskScore}%
                      </span>
                    </div>

                    <ChevronRight 
                      size={16} 
                      className={`shrink-0 ${isSelected ? 'text-[#13B8A6]' : 'text-slate-300'}`} 
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Patient Record Detail */}
        <div className="lg:col-span-7">
          {selectedReport ? (
            <div className="bg-white rounded-3xl border border-[#E0E8F0] shadow-sm p-6 sm:p-8 space-y-6">
              
              {/* Detail Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E0E8F0]">
                <div>
                  <span className="text-[11px] font-bold text-[#627487] uppercase tracking-wider block">
                    Longitudinal Case Record
                  </span>
                  <h2 className="text-xl font-bold font-display text-[#0B1F33]">
                    {selectedReport.patientId} Overview
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskBadgeClass(selectedReport.prediction?.risk_category)}`}>
                    {selectedReport.prediction?.risk_category || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Vitals Summary Grid */}
              <div>
                <h3 className="text-xs font-bold text-[#627487] uppercase tracking-wider mb-3">
                  Clinical Metrics
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#F5F8FC] border border-[#E0E8F0]">
                    <span className="text-[10px] text-[#627487] block uppercase font-medium">Age & Sex</span>
                    <span className="font-bold text-[#0B1F33]">
                      {selectedReport.visitId?.patientData?.age || '—'}y • {selectedReport.visitId?.patientData?.gender === 1 ? 'Male' : 'Female'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F5F8FC] border border-[#E0E8F0]">
                    <span className="text-[10px] text-[#627487] block uppercase font-medium">Blood Pressure</span>
                    <span className="font-bold font-mono text-[#0B1F33]">
                      {selectedReport.visitId?.patientData?.ap_hi || '—'} / {selectedReport.visitId?.patientData?.ap_lo || '—'} mmHg
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F5F8FC] border border-[#E0E8F0]">
                    <span className="text-[10px] text-[#627487] block uppercase font-medium">Height / Weight</span>
                    <span className="font-bold text-[#0B1F33]">
                      {selectedReport.visitId?.patientData?.height || '—'}cm / {selectedReport.visitId?.patientData?.weight || '—'}kg
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F5F8FC] border border-[#E0E8F0]">
                    <span className="text-[10px] text-[#627487] block uppercase font-medium">Calculated BMI</span>
                    <span className="font-bold text-[#0B1F33]">
                      {selectedReport.visitId?.patientData?.height && selectedReport.visitId?.patientData?.weight
                        ? ((selectedReport.visitId.patientData.weight / Math.pow(selectedReport.visitId.patientData.height / 100, 2)).toFixed(1)) + ' kg/m²'
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Risk Stratification Breakdown */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0B1F33] to-[#123B5D] text-white flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-300 font-medium block">Machine Learning Probability</span>
                  <div className="text-3xl font-extrabold font-display mt-0.5">
                    {selectedReport.prediction?.risk_probability 
                      ? Math.round(selectedReport.prediction.risk_probability * 100) 
                      : 0}%
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-300 font-medium block">Stratification Tier</span>
                  <span className="text-base font-bold text-[#20D9C2]">
                    {selectedReport.prediction?.risk_category || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Top SHAP Contributors */}
              {selectedReport.prediction?.top_risk_factors?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-[#627487] uppercase tracking-wider mb-2.5">
                    Key TreeSHAP Attributions
                  </h3>
                  <div className="space-y-2">
                    {selectedReport.prediction.top_risk_factors.slice(0, 4).map((factor, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5F8FC] border border-[#E0E8F0] text-xs"
                      >
                        <span className="font-semibold text-[#0B1F33] capitalize">
                          {factor.feature.replace(/_/g, ' ')}
                        </span>
                        <span className={`font-mono font-bold ${
                          factor.impact > 0 ? 'text-[#D94F59]' : 'text-[#16866A]'
                        }`}>
                          {factor.impact > 0 ? '+' : ''}{factor.impact.toFixed(4)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Report Action */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    const predictionPayload = {
                      report: selectedReport,
                      patientId: selectedReport.patientId || 'N/A',
                      patientData: selectedReport.visitId?.patientData || {},
                    };
                    localStorage.setItem('latestPrediction', JSON.stringify(predictionPayload));
                    if (setselectedtab) setselectedtab('result');
                  }}
                  className="w-full py-3 bg-gradient-to-r from-[#13B8A6] to-[#20D9C2] text-[#0B1F33] rounded-xl font-bold text-xs shadow-md shadow-[#20D9C2]/20 hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Open Full Interactive Report in Dashboard</span>
                  <ArrowRight size={15} />
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#E0E8F0] p-12 text-center text-[#627487] space-y-2">
              <p className="text-sm font-semibold text-[#0B1F33]">No Patient Selected</p>
              <p className="text-xs">Click on any patient record in the archive to preview vitals and SHAP attribution.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default Records;
