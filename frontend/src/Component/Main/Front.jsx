import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { predictionService } from "../../services/apiService";
import { useAuth } from "../../context/AuthContext";
import { LoadingSpinner } from "../../components/Loading";
import { Alert } from "../../components/Alert";
import { 
  Users, 
  AlertTriangle, 
  Activity, 
  FileCheck, 
  ArrowRight, 
  PlusCircle, 
  ShieldAlert, 
  Heart,
  TrendingUp,
  ChevronRight,
  Stethoscope,
  Calendar,
  Sparkles
} from "lucide-react";

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
        setError('Failed to load clinical statistics');
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
    : 24;

  const criticalAlerts = highRisk;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const highPercent = totalReports > 0 ? Math.round((highRisk / totalReports) * 100) : 0;
  const modPercent = totalReports > 0 ? Math.round((moderateRisk / totalReports) * 100) : 0;
  const lowPercent = totalReports > 0 ? Math.round((lowRisk / totalReports) * 100) : 0;

  const getRiskBadge = (category) => {
    if (category === 'High Risk') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-[#D94F59] border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D94F59]"></span>
          High Risk
        </span>
      );
    }
    if (category === 'Moderate Risk') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-[#D49A27] border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D49A27]"></span>
          Moderate Risk
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-[#16866A] border border-teal-200">
        <span className="w-1.5 h-1.5 rounded-full bg-[#16866A]"></span>
        Low Risk
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner: Greeting, Date, & Model Health */}
      <div className="bg-gradient-to-r from-[#0B1F33] via-[#0E2A44] to-[#123B5D] text-white p-6 md:p-8 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        {/* Glow behind greeting */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#13B8A6]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/25 text-[#20D9C2] text-xs font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#20D9C2] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#20D9C2]"></span>
                </span>
                XGBoost ML Engine Online
              </span>
              <span className="text-xs text-slate-400">
                • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'Doctor'}
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              You currently have{' '}
              <span className="text-[#20D9C2] font-semibold">
                {criticalAlerts} high-risk cardiovascular {criticalAlerts === 1 ? 'alert' : 'alerts'}
              </span>{' '}
              flagged for clinical follow-up.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setselectedtab('analysis')}
              className="bg-gradient-to-r from-[#13B8A6] to-[#20D9C2] text-[#0B1F33] px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-[#20D9C2]/20 hover:shadow-lg hover:shadow-[#20D9C2]/35 active:scale-95 transition-all flex items-center gap-2"
            >
              <Activity size={16} />
              <span>Stratify Patient</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => setselectedtab('admin')}
              className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm backdrop-blur-md transition-all flex items-center gap-1.5"
            >
              <PlusCircle size={15} />
              <span>Register Patient</span>
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

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Patients */}
        <div className="bg-white rounded-2xl p-5 border border-[#E0E8F0] shadow-sm hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#627487] uppercase tracking-wider">
              Total Cohort
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#13B8A6] group-hover:scale-105 transition-transform">
              <Users size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#0B1F33] font-display">
            {loading ? '...' : totalReports.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-[#627487] flex items-center gap-1">
            <span className="text-teal-600 font-semibold">Active</span> longitudinal registry
          </div>
        </div>

        {/* Card 2: Critical Alerts */}
        <div className="bg-white rounded-2xl p-5 border border-[#E0E8F0] shadow-sm hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#627487] uppercase tracking-wider">
              Critical Alerts
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#D94F59] group-hover:scale-105 transition-transform">
              <ShieldAlert size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#D94F59] font-display">
            {loading ? '...' : criticalAlerts}
          </div>
          <div className="mt-2 text-[11px] text-[#D94F59] flex items-center gap-1 font-medium">
            <span>&ge; 50% probability</span> requires review
          </div>
        </div>

        {/* Card 3: Avg Risk Score */}
        <div className="bg-white rounded-2xl p-5 border border-[#E0E8F0] shadow-sm hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#627487] uppercase tracking-wider">
              Mean Risk Index
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-[#D49A27] group-hover:scale-105 transition-transform">
              <Activity size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#0B1F33] font-display">
            {loading ? '...' : `${avgRiskScore}%`}
          </div>
          <div className="mt-2 text-[11px] text-[#627487] flex items-center gap-1">
            <span>Population average risk</span>
          </div>
        </div>

        {/* Card 4: Reports Ready */}
        <div className="bg-white rounded-2xl p-5 border border-[#E0E8F0] shadow-sm hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#627487] uppercase tracking-wider">
              Reports Ready
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#123B5D] group-hover:scale-105 transition-transform">
              <FileCheck size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#0B1F33] font-display">
            {loading ? '...' : totalReports}
          </div>
          <div className="mt-2 text-[11px] text-[#627487] flex items-center gap-1">
            <span>SHAP & counterfactuals generated</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Recent Patients (Left) & Risk Distribution (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Patients Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E0E8F0] shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-[#E0E8F0] flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#0B1F33] font-display">
                  Recent Risk Assessments
                </h2>
                <p className="text-xs text-[#627487]">
                  Latest machine learning stratifications and clinical vitals
                </p>
              </div>
              <button 
                onClick={() => setselectedtab('reports')}
                className="text-xs font-bold text-[#13B8A6] hover:text-[#0B1F33] transition-colors flex items-center gap-1"
              >
                <span>View All Records</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#F5F8FC] border-b border-[#E0E8F0]">
                  <tr>
                    <th className="px-5 py-3 text-[11px] font-bold text-[#627487] uppercase tracking-wider">Patient</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-[#627487] uppercase tracking-wider">Vitals (BP)</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-[#627487] uppercase tracking-wider">Stratification</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-[#627487] uppercase tracking-wider">Risk Score</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-[#627487] uppercase tracking-wider text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0E8F0] text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <LoadingSpinner size="md" message="Loading records..." />
                      </td>
                    </tr>
                  ) : recentReports.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-[#627487] text-xs">
                        No patient assessments recorded yet. Click "Stratify Patient" to begin.
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
                        <tr 
                          key={report._id || index} 
                          className="hover:bg-[#F5F8FC]/80 transition-colors"
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-[#E8F8F4] text-[#13B8A6] font-bold text-xs flex items-center justify-center border border-teal-200">
                                {gender === 'Male' ? 'M' : 'F'}
                              </div>
                              <div>
                                <p className="font-semibold text-xs text-[#0B1F33]">
                                  {report.patientId || `Patient #${index + 1}`}
                                </p>
                                <p className="text-[11px] text-[#627487]">{age}y • {gender}</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-3.5">
                            <div className="text-xs">
                              <span className="font-mono font-bold text-[#0B1F33]">
                                {patientData.ap_hi || '—'} / {patientData.ap_lo || '—'}
                              </span>
                              <span className="text-[10px] text-[#627487] ml-1">mmHg</span>
                            </div>
                          </td>

                          <td className="px-5 py-3.5">
                            {getRiskBadge(riskCategory)}
                          </td>

                          <td className="px-5 py-3.5">
                            <div className="w-24">
                              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#0B1F33] mb-1">
                                <span>{riskProb}%</span>
                              </div>
                              <div className="w-full bg-[#E0E8F0] rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    riskCategory === 'High Risk' ? 'bg-[#D94F59]' :
                                    riskCategory === 'Moderate Risk' ? 'bg-[#D49A27]' :
                                    'bg-[#16866A]'
                                  }`}
                                  style={{ width: `${riskProb}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-3.5 text-right">
                            <button 
                              onClick={() => {
                                const predictionPayload = {
                                  report: report,
                                  patientId: report.patientId || `P${String(index + 1).padStart(3, '0')}`,
                                  patientData: patientData,
                                };
                                localStorage.setItem('latestPrediction', JSON.stringify(predictionPayload));
                                setselectedtab('result');
                              }}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#13B8A6] hover:text-[#0B1F33] hover:bg-teal-50 transition-all inline-flex items-center gap-1"
                            >
                              <span>Inspect</span>
                              <ArrowRight size={13} />
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

          <div className="p-3 bg-[#F5F8FC] border-t border-[#E0E8F0] text-center text-xs text-[#627487]">
            Showing most recent 5 patients • Full audit history stored in Records
          </div>
        </div>

        {/* Risk Distribution Card */}
        <div className="bg-white rounded-2xl border border-[#E0E8F0] shadow-sm p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="mb-5">
              <h2 className="text-base sm:text-lg font-bold text-[#0B1F33] font-display">
                Cohort Stratification
              </h2>
              <p className="text-xs text-[#627487]">
                Risk tier proportions across evaluated patients
              </p>
            </div>

            {loading ? (
              <div className="h-48 flex items-center justify-center">
                <LoadingSpinner size="md" />
              </div>
            ) : (
              <div className="space-y-5">
                
                {/* Visual Proportion Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-[#172B3A]">
                    <span>Distribution Bar</span>
                    <span>{totalReports} total</span>
                  </div>
                  <div className="h-3.5 w-full bg-[#E0E8F0] rounded-full overflow-hidden flex">
                    <div style={{ width: `${lowPercent}%` }} className="bg-[#16866A] transition-all" title={`Low Risk: ${lowPercent}%`} />
                    <div style={{ width: `${modPercent}%` }} className="bg-[#D49A27] transition-all" title={`Moderate Risk: ${modPercent}%`} />
                    <div style={{ width: `${highPercent}%` }} className="bg-[#D94F59] transition-all" title={`High Risk: ${highPercent}%`} />
                  </div>
                </div>

                {/* Tier Breakdowns */}
                <div className="space-y-3 pt-2">
                  
                  {/* Low Risk */}
                  <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-[#16866A]"></div>
                      <div>
                        <div className="text-xs font-bold text-[#0B1F33]">Low Risk Tier</div>
                        <div className="text-[10px] text-[#627487]">&lt; 20% predicted probability</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-[#16866A]">{lowPercent}%</span>
                      <span className="text-[11px] text-[#627487] block font-medium">({lowRisk} pts)</span>
                    </div>
                  </div>

                  {/* Moderate Risk */}
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-[#D49A27]"></div>
                      <div>
                        <div className="text-xs font-bold text-[#0B1F33]">Moderate Risk Tier</div>
                        <div className="text-[10px] text-[#627487]">20% - 49% probability</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-[#D49A27]">{modPercent}%</span>
                      <span className="text-[11px] text-[#627487] block font-medium">({moderateRisk} pts)</span>
                    </div>
                  </div>

                  {/* High Risk */}
                  <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-[#D94F59]"></div>
                      <div>
                        <div className="text-xs font-bold text-[#0B1F33]">High Risk Alert</div>
                        <div className="text-[10px] text-[#627487]">&ge; 50% clinical urgency</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-[#D94F59]">{highPercent}%</span>
                      <span className="text-[11px] text-[#627487] block font-medium">({highRisk} pts)</span>
                    </div>
                  </div>

                </div>

              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#E0E8F0] mt-4">
            <button
              onClick={() => setselectedtab('analysis')}
              className="w-full py-2.5 bg-[#F5F8FC] hover:bg-[#E8F8F4] text-[#0B1F33] hover:text-[#13B8A6] rounded-xl text-xs font-bold border border-[#E0E8F0] hover:border-teal-200 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Initiate Risk Evaluation</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Front;
