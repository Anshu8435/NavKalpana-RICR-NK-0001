import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { 
  Activity, 
  ArrowLeft, 
  PlusCircle, 
  Download, 
  Heart, 
  User, 
  Droplet, 
  Scale, 
  Ruler, 
  Calendar, 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  ArrowRight,
  Stethoscope,
  Info
} from "lucide-react";

function Result({ setselectedtab }) {
  const [predictionData, setPredictionData] = useState(null);

  useEffect(() => {
    const storedPrediction = localStorage.getItem('latestPrediction');
    if (storedPrediction) {
      try {
        const parsed = JSON.parse(storedPrediction);
        setPredictionData(parsed);
      } catch (err) {
        console.error('Error parsing stored prediction:', err);
      }
    }
  }, []);

  const getRiskProbability = () => {
    if (!predictionData) return null;
    const visitProb = predictionData.visit?.prediction?.risk_probability;
    const predProb = predictionData.prediction?.risk_probability;
    const reportProb = predictionData.report?.prediction?.risk_probability;
    const mlProb = predictionData.report?.mlResponse?.risk_probability;
    
    if (visitProb != null) return visitProb;
    if (predProb != null) return predProb;
    if (reportProb != null) return reportProb;
    if (mlProb != null) return mlProb;
    return null;
  };

  const riskProb = getRiskProbability();
  const risk = riskProb != null ? Math.round(riskProb * 100) : 0;

  const riskCategory = predictionData
    ? predictionData.visit?.prediction?.risk_category || 
      predictionData.prediction?.risk_category || 
      predictionData.report?.prediction?.risk_category ||
      predictionData.report?.mlResponse?.risk_category ||
      'Unknown'
    : 'Unknown';

  const patientInfo = predictionData?.patientData || {};
  const topRiskFactors = predictionData?.visit?.prediction?.top_risk_factors || 
                        predictionData?.prediction?.top_risk_factors ||
                        predictionData?.report?.prediction?.top_risk_factors ||
                        predictionData?.report?.mlResponse?.top_risk_factors ||
                        [];
  
  const patientId = predictionData?.patientId || 'N/A';
  const reportId = predictionData?.report?._id || predictionData?.visit?._id || 'N/A';
  const recommendation = predictionData?.visit?.prediction?.recommendation || 
                        predictionData?.prediction?.recommendation ||
                        predictionData?.report?.prediction?.recommendation ||
                        predictionData?.report?.mlResponse?.recommendation || '';

  const recommendations = predictionData?.visit?.prediction?.recommendations ||
                          predictionData?.prediction?.recommendations ||
                          predictionData?.report?.prediction?.recommendations ||
                          predictionData?.report?.mlResponse?.recommendations || [];

  const counterfactuals = predictionData?.visit?.prediction?.counterfactuals ||
                          predictionData?.prediction?.counterfactuals ||
                          predictionData?.report?.prediction?.counterfactuals ||
                          predictionData?.report?.mlResponse?.counterfactuals || [];

  const referral = predictionData?.visit?.prediction?.referral ||
                   predictionData?.prediction?.referral ||
                   predictionData?.report?.prediction?.referral ||
                   predictionData?.report?.mlResponse?.referral || null;

  const shapContributions = predictionData?.visit?.prediction?.shap_contributions ||
                            predictionData?.prediction?.shap_contributions ||
                            predictionData?.report?.prediction?.shap_contributions ||
                            predictionData?.report?.mlResponse?.shap_contributions || {};

  const riskLabel = riskCategory;

  const cholesterolLabel = patientInfo.cholesterol === 1 ? 'Normal' : 
                          patientInfo.cholesterol === 2 ? 'Above Normal' : 
                          patientInfo.cholesterol === 3 ? 'High' : 'N/A';

  const formatFeatureName = (name) => {
    const featureLabels = {
      'age': 'Age Factor',
      'ap_hi': 'Systolic Blood Pressure',
      'ap_lo': 'Diastolic Blood Pressure',
      'cholesterol': 'Serum Cholesterol',
      'gluc': 'Fasting Blood Glucose',
      'smoke': 'Tobacco / Smoking',
      'alco': 'Alcohol Consumption',
      'active': 'Physical Activity Level',
      'bmi': 'Body Mass Index (BMI)',
      'pulse_pressure': 'Hemodynamic Pulse Pressure',
      'age_bp_interaction': 'Age & BP Interaction',
      'glucose_bmi': 'Metabolic Interaction (Glucose/BMI)',
      'weight': 'Body Weight',
      'height': 'Stature / Height',
      'gender': 'Biological Sex'
    };
    return featureLabels[name] || name.replace(/_/g, ' ');
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(11, 31, 51);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('CardioShield AI', 20, 25);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Clinical Cardiovascular Risk Stratification', pageWidth - 20, 25, { align: 'right' });
    
    let y = 55;
    doc.setFontSize(10);
    doc.setTextColor(98, 116, 135);
    doc.text(`Patient ID: ${patientId}`, 20, y);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`, pageWidth - 20, y, { align: 'right' });
    
    y += 15;
    
    // Risk Box
    if (riskLabel === 'High Risk') {
      doc.setFillColor(217, 79, 89);
    } else if (riskLabel === 'Moderate Risk') {
      doc.setFillColor(212, 154, 39);
    } else {
      doc.setFillColor(22, 134, 106);
    }
    doc.roundedRect(20, y, pageWidth - 40, 28, 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text(`Risk Assessment: ${risk}% — ${riskLabel}`, pageWidth / 2, y + 17, { align: 'center' });
    
    y += 42;
    
    // Patient Information
    doc.setTextColor(11, 31, 51);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Patient Baseline Parameters', 20, y);
    
    y += 8;
    doc.setDrawColor(224, 232, 240);
    doc.line(20, y, pageWidth - 20, y);
    
    y += 12;
    doc.setTextColor(23, 43, 58);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const patientInfoData = [
      ['Age', `${patientInfo.age || 'N/A'} years`],
      ['Biological Sex', patientInfo.gender === 1 ? 'Male' : patientInfo.gender === 0 ? 'Female' : 'N/A'],
      ['Height', `${patientInfo.height || 'N/A'} cm`],
      ['Weight', `${patientInfo.weight || 'N/A'} kg`],
      ['Blood Pressure', `${patientInfo.ap_hi || 'N/A'} / ${patientInfo.ap_lo || 'N/A'} mmHg`],
      ['Cholesterol', cholesterolLabel],
    ];
    
    patientInfoData.forEach(([label, value], i) => {
      const xPos = i % 2 === 0 ? 25 : pageWidth / 2;
      if (i % 2 === 0 && i > 0) y += 10;
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, xPos, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value, xPos + 45, y);
    });
    
    y += 22;
    
    // SHAP Risk Factors
    if (topRiskFactors.length > 0) {
      doc.setTextColor(11, 31, 51);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('Explainable AI Attribution (TreeSHAP)', 20, y);
      
      y += 8;
      doc.line(20, y, pageWidth - 20, y);
      y += 10;
      doc.setFontSize(9);
      doc.setTextColor(23, 43, 58);
      
      topRiskFactors.forEach((factor) => {
        const impact = factor.impact;
        const sign = impact > 0 ? '+' : '';
        const color = impact > 0 ? [217, 79, 89] : [22, 134, 106];
        
        doc.setFont('helvetica', 'normal');
        doc.text(`• ${formatFeatureName(factor.feature)}`, 25, y);
        
        doc.setTextColor(...color);
        doc.setFont('helvetica', 'bold');
        doc.text(`${sign}${impact.toFixed(4)}`, pageWidth - 35, y);
        doc.setTextColor(23, 43, 58);
        
        y += 8;
      });
      y += 5;
    }
    
    // AI Recommendations
    if (recommendations.length > 0) {
      recommendations.forEach((rec) => {
        if (y > 250) {
          doc.addPage();
          y = 20;
        }
        y += 5;
        doc.setTextColor(11, 31, 51);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`${rec.title}`, 20, y);

        y += 7;
        doc.setFontSize(9);
        doc.setTextColor(98, 116, 135);
        doc.setFont('helvetica', 'normal');
        const descLines = doc.splitTextToSize(rec.description, pageWidth - 45);
        doc.text(descLines, 25, y);
        y += descLines.length * 4.5;

        if (rec.actions && rec.actions.length > 0) {
          y += 2;
          rec.actions.forEach((action) => {
            if (y > 270) {
              doc.addPage();
              y = 20;
            }
            doc.setFontSize(8.5);
            doc.text(`  • ${action}`, 28, y);
            y += 4.5;
          });
        }
        y += 4;
      });
    }
    
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Generated by CardioShield AI • Clinical Decision Support System • Not a substitute for diagnostic judgment.', pageWidth / 2, pageHeight - 12, { align: 'center' });
    
    doc.save(`CardioShield_Stratification_${patientId}.pdf`);
  };

  const getRiskTheme = () => {
    if (riskCategory === 'High Risk') {
      return {
        pillBg: 'bg-rose-50 text-[#D94F59] border-rose-200',
        strokeColor: '#D94F59',
        cardBg: 'from-[#D94F59]/10 via-[#D94F59]/5 to-transparent',
        badge: 'High Risk Alert (&ge; 50%)',
        desc: 'Urgent clinical intervention and cardiology referral recommended.'
      };
    }
    if (riskCategory === 'Moderate Risk') {
      return {
        pillBg: 'bg-amber-50 text-[#D49A27] border-amber-200',
        strokeColor: '#D49A27',
        cardBg: 'from-[#D49A27]/10 via-[#D49A27]/5 to-transparent',
        badge: 'Moderate Risk Tier (20–49%)',
        desc: 'Elevated cardiovascular susceptibility. Lifestyle modification & scheduled review advised.'
      };
    }
    return {
      pillBg: 'bg-teal-50 text-[#16866A] border-teal-200',
      strokeColor: '#16866A',
      cardBg: 'from-[#16866A]/10 via-[#16866A]/5 to-transparent',
      badge: 'Low Risk Tier (< 20%)',
      desc: 'Hemodynamic and metabolic biomarkers indicate optimal cardiovascular stability.'
    };
  };

  const theme = getRiskTheme();
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (risk / 100) * circumference;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => setselectedtab && setselectedtab('dashboard')}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#627487] hover:text-[#0B1F33] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Return to Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setselectedtab && setselectedtab('analysis')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#E8F8F4] text-[#13B8A6] hover:bg-teal-100/70 border border-teal-200 transition-all"
          >
            <PlusCircle size={15} />
            <span>New Patient Assessment</span>
          </button>
          
          {predictionData && (
            <button
              onClick={generatePDF}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-[#0B1F33] hover:bg-[#123B5D] text-white shadow-md transition-all active:scale-95"
            >
              <Download size={15} />
              <span>Export Clinical PDF</span>
            </button>
          )}
        </div>
      </div>

      {!predictionData ? (
        <div className="bg-white rounded-3xl border border-[#E0E8F0] p-12 text-center max-w-md mx-auto my-12 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 text-[#13B8A6] flex items-center justify-center mx-auto">
            <Activity size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#0B1F33]">No Current Stratification Data</h3>
          <p className="text-xs text-[#627487] leading-relaxed">
            Record a patient's vitals in the Heart Analysis terminal to render the explainable AI risk report.
          </p>
          <button
            onClick={() => setselectedtab && setselectedtab('analysis')}
            className="w-full py-3 bg-gradient-to-r from-[#13B8A6] to-[#20D9C2] text-[#0B1F33] font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Launch Heart Risk Analysis
          </button>
        </div>
      ) : (
        <>
          {/* Patient Baseline Banner */}
          <div className="bg-gradient-to-r from-[#0B1F33] via-[#0E2A44] to-[#123B5D] text-white p-6 md:p-8 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-[#20D9C2]">
                    <User size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-slate-300 font-medium">Assessed Patient Identifier</span>
                    <h2 className="text-xl font-bold font-mono text-white tracking-wide">{patientId}</h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Model Stratification Completed</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/10 border border-white/10 font-mono">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Patient Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Age</span>
                  <span className="text-sm font-bold font-mono text-white">{patientInfo.age || '—'} yrs</span>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Sex</span>
                  <span className="text-sm font-bold text-white">
                    {patientInfo.gender === 1 ? 'Male' : patientInfo.gender === 0 ? 'Female' : '—'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Height / Weight</span>
                  <span className="text-sm font-bold font-mono text-white">
                    {patientInfo.height || '—'}cm / {patientInfo.weight || '—'}kg
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Blood Pressure</span>
                  <span className="text-sm font-bold font-mono text-[#20D9C2]">
                    {patientInfo.ap_hi || '—'} / {patientInfo.ap_lo || '—'} <span className="text-[10px] text-slate-400 font-normal">mmHg</span>
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Cholesterol</span>
                  <span className="text-sm font-bold text-white">{cholesterolLabel}</span>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Tobacco Intake</span>
                  <span className="text-sm font-bold text-white">{patientInfo.smoke === 1 ? 'Active Smoker' : 'Non-Smoker'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Results Section: Circular Risk Gauge (Left) + Top SHAP Contributors (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Circular Risk Gauge Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E0E8F0] shadow-sm p-6 sm:p-8 flex flex-col items-center justify-between text-center relative overflow-hidden">
              <div className="w-full text-left mb-2">
                <span className="text-[11px] font-bold text-[#627487] uppercase tracking-wider block">
                  Probability of Adverse Event
                </span>
                <h3 className="text-lg font-extrabold text-[#0B1F33] font-display">
                  5-10 Year Cardiovascular Risk
                </h3>
              </div>

              {/* Animated SVG Circular Progress Gauge */}
              <div className="relative my-4 flex items-center justify-center">
                <svg width="200" height="200" className="transform -rotate-90">
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    stroke="#E0E8F0"
                    strokeWidth="14"
                    fill="transparent"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    stroke={theme.strokeColor}
                    strokeWidth="14"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-extrabold font-display text-[#0B1F33] tracking-tight">
                    {risk}%
                  </span>
                  <span className="text-[11px] text-[#627487] font-medium uppercase mt-0.5">
                    Calculated Risk
                  </span>
                </div>
              </div>

              {/* Risk Category Pill & Summary */}
              <div className="space-y-2 w-full pt-2 border-t border-[#E0E8F0]">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${theme.pillBg}`}>
                  <span>{theme.badge}</span>
                </div>
                <p className="text-xs text-[#627487] leading-relaxed max-w-sm mx-auto">
                  {theme.desc}
                </p>
              </div>
            </div>

            {/* Top SHAP Drivers Card */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E0E8F0] shadow-sm p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E0E8F0]">
                  <div>
                    <span className="text-[11px] font-bold text-[#627487] uppercase tracking-wider block">
                      Explainable Machine Learning
                    </span>
                    <h3 className="text-lg font-extrabold text-[#0B1F33] font-display">
                      Top TreeSHAP Biomarker Attributions
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="flex items-center gap-1 text-[#D94F59] font-semibold">
                      <span className="w-2 h-2 rounded-full bg-[#D94F59]"></span> Risk Enhancers
                    </span>
                    <span className="flex items-center gap-1 text-[#16866A] font-semibold">
                      <span className="w-2 h-2 rounded-full bg-[#16866A]"></span> Protective
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#627487] mb-4">
                  Shapley values decompose the individual contribution of each vital sign to the final risk probability.
                </p>

                {topRiskFactors.length > 0 ? (
                  <div className="space-y-3">
                    {topRiskFactors.map((factor, index) => {
                      const impact = factor.impact;
                      const isPositive = impact > 0;
                      const absImpact = Math.abs(impact);
                      const barWidth = Math.min(absImpact * 450, 100);

                      return (
                        <div key={index} className="p-3 rounded-xl bg-[#F5F8FC] border border-[#E0E8F0]">
                          <div className="flex justify-between items-center text-xs mb-1.5">
                            <span className="font-bold text-[#0B1F33]">
                              {formatFeatureName(factor.feature)}
                            </span>
                            <span className={`font-mono font-bold ${isPositive ? 'text-[#D94F59]' : 'text-[#16866A]'}`}>
                              {isPositive ? '+' : ''}{impact.toFixed(4)}
                            </span>
                          </div>
                          
                          <div className="h-2 w-full bg-[#E0E8F0] rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-700 ${
                                isPositive ? 'bg-[#D94F59]' : 'bg-[#16866A]'
                              }`}
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>

                          <div className="flex justify-between text-[10px] text-[#627487] mt-1">
                            <span>{isPositive ? 'Positively drives risk upward' : 'Exerts protective downward pressure'}</span>
                            <span className="capitalize">{factor.feature}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-[#627487] bg-[#F5F8FC] rounded-2xl border border-[#E0E8F0]">
                    Attribution weights not returned in payload.
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#E0E8F0] text-[11px] text-[#627487] flex items-center justify-between">
                <span>Calculated via Local Model Explainer</span>
                <span className="font-mono text-[#0B1F33]">Sum of SHAP = Log-Odds Shift</span>
              </div>
            </div>

          </div>

          {/* Counterfactual "What-If" Analysis */}
          {counterfactuals.length > 0 && (
            <div className="bg-white rounded-3xl border border-[#E0E8F0] shadow-sm p-6 sm:p-8 space-y-4">
              <div>
                <span className="text-[11px] font-bold text-[#13B8A6] uppercase tracking-wider block">
                  Actionable Intervention Pathways
                </span>
                <h3 className="text-xl font-extrabold text-[#0B1F33] font-display">
                  Counterfactual What-If Simulations
                </h3>
                <p className="text-xs text-[#627487] mt-1">
                  Simulated outcomes demonstrating potential risk reduction if target biomarkers are normalized.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {counterfactuals.map((cf, index) => {
                  const currentPct = Math.round(cf.current_risk * 100);
                  const newPct = Math.round(cf.new_risk * 100);
                  const reductionPct = Math.round(cf.risk_reduction * 100);

                  return (
                    <div 
                      key={index} 
                      className="p-5 rounded-2xl bg-gradient-to-br from-[#E8F8F4]/50 to-white border border-teal-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#13B8A6] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            {cf.label}
                          </span>
                          <h4 className="text-sm font-bold text-[#0B1F33] mt-1.5">
                            {cf.change_description}
                          </h4>
                        </div>
                        <span className="text-xs font-extrabold font-mono text-[#16866A] bg-teal-100/70 px-2 py-1 rounded-lg">
                          -{reductionPct}% Risk
                        </span>
                      </div>

                      <div className="flex items-center gap-4 pt-2 border-t border-teal-100/60 text-xs">
                        <div>
                          <span className="text-[10px] text-[#627487] block uppercase">Current Baseline</span>
                          <span className="font-mono font-bold text-[#D94F59] text-base">{currentPct}%</span>
                        </div>
                        <ArrowRight size={16} className="text-teal-600 shrink-0" />
                        <div>
                          <span className="text-[10px] text-[#627487] block uppercase">Projected Target</span>
                          <span className="font-mono font-bold text-[#16866A] text-base">{newPct}%</span>
                        </div>

                        {cf.new_category !== riskCategory && (
                          <div className="ml-auto text-right">
                            <span className="text-[10px] text-teal-800 font-semibold block">Tier Shift:</span>
                            <span className="text-[11px] font-bold text-teal-900 bg-white px-2 py-0.5 rounded-full border border-teal-200">
                              {cf.new_category}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI-Powered Recommendations */}
          <div className="bg-white rounded-3xl border border-[#E0E8F0] shadow-sm p-6 sm:p-8 space-y-5">
            <div>
              <span className="text-[11px] font-bold text-[#123B5D] uppercase tracking-wider block">
                Evidence-Based Protocol
              </span>
              <h3 className="text-xl font-extrabold text-[#0B1F33] font-display">
                Clinical Intervention Guidelines
              </h3>
              <p className="text-xs text-[#627487] mt-1">
                Personalized directives tailored to the patient’s biomarker pattern.
              </p>
            </div>

            {recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((rec, index) => {
                  const borderClass = rec.severity === 'high' 
                    ? 'border-l-[#D94F59] bg-rose-50/40' 
                    : rec.severity === 'moderate' 
                    ? 'border-l-[#D49A27] bg-amber-50/40' 
                    : 'border-l-[#16866A] bg-teal-50/40';

                  return (
                    <div
                      key={index}
                      className={`border-l-4 ${borderClass} rounded-2xl p-5 border border-[#E0E8F0] shadow-sm space-y-3`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{rec.icon}</span>
                        <div>
                          <h4 className="font-bold text-[#0B1F33] text-sm">{rec.title}</h4>
                          <span className="text-[10px] text-[#627487] uppercase font-semibold">
                            {rec.category}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-[#627487] leading-relaxed">{rec.description}</p>

                      {rec.actions && rec.actions.length > 0 && (
                        <div className="space-y-1 pt-2 border-t border-[#E0E8F0]/60">
                          {rec.actions.map((act, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-[#172B3A]">
                              <CheckCircle2 size={13} className="text-[#13B8A6] shrink-0 mt-0.5" />
                              <span>{act}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[#F5F8FC] border border-[#E0E8F0] text-xs text-[#627487] space-y-2">
                <p className="font-semibold text-[#0B1F33]">Standard Recommendations:</p>
                <p>• Schedule routine longitudinal lipid and hemodynamic re-evaluation in 6 months.</p>
                <p>• Recommend dietary adherence to Mediterranean or DASH protocols low in saturated fats and sodium.</p>
              </div>
            )}
          </div>

          {/* Specialist Referral Urgency Box */}
          {referral && referral.specialists && referral.specialists.length > 0 && (
            <div className={`rounded-3xl p-6 sm:p-8 border shadow-sm ${
              referral.urgency === 'urgent' 
                ? 'bg-rose-50/70 border-rose-200' 
                : referral.urgency === 'soon' 
                ? 'bg-amber-50/70 border-amber-200' 
                : 'bg-teal-50/70 border-teal-200'
            }`}>
              <div className="flex items-center gap-2.5 mb-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${
                  referral.urgency === 'urgent' ? 'bg-[#D94F59]' : referral.urgency === 'soon' ? 'bg-[#D49A27]' : 'bg-[#16866A]'
                }`}>
                  <Stethoscope size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0B1F33] uppercase tracking-wider">
                    Specialist Referral Triage: {referral.urgency}
                  </h4>
                  <span className="text-xs text-[#627487]">{referral.timeline}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {referral.specialists.map((spec, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white border border-[#E0E8F0] text-xs space-y-1">
                    <span className="font-bold text-[#0B1F33] block">{spec.type}</span>
                    <span className="text-[#627487]">{spec.reason}</span>
                  </div>
                ))}
              </div>

              {referral.tests_recommended && referral.tests_recommended.length > 0 && (
                <div className="p-4 rounded-xl bg-white/80 border border-[#E0E8F0] text-xs">
                  <span className="font-bold text-[#0B1F33] block mb-2">Recommended Diagnostic Workup:</span>
                  <div className="flex flex-wrap gap-2">
                    {referral.tests_recommended.map((t, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-[#F5F8FC] border border-[#E0E8F0] text-[#172B3A] font-medium text-[11px]">
                        • {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Export PDF Bottom Button */}
          <div className="pt-2">
            <button
              onClick={generatePDF}
              className="w-full py-4 bg-gradient-to-r from-[#0B1F33] to-[#123B5D] text-white rounded-2xl font-bold text-sm shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
            >
              <Download size={18} />
              <span>Download Complete Clinical Report (PDF)</span>
            </button>
          </div>

        </>
      )}

    </div>
  );
}

export default Result;
