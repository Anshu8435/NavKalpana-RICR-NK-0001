import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

function Result({ setselectedtab }) {
  const [predictionData, setPredictionData] = useState(null);

  useEffect(() => {
    // Load prediction data from localStorage
    const storedPrediction = localStorage.getItem('latestPrediction');
    if (storedPrediction) {
      const parsed = JSON.parse(storedPrediction);
      setPredictionData(parsed);
    }
  }, []);

  // Helper to get risk probability (handles 0 as valid value)
  const getRiskProbability = () => {
    if (!predictionData) return null;
    const visitProb = predictionData.visit?.prediction?.risk_probability;
    const predProb = predictionData.prediction?.risk_probability;
    const reportProb = predictionData.report?.prediction?.risk_probability;
    const mlProb = predictionData.report?.mlResponse?.risk_probability;
    
    // Return first non-null value
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

  // AI-Powered Recommendations from ML engine
  const recommendations = predictionData?.visit?.prediction?.recommendations ||
                          predictionData?.prediction?.recommendations ||
                          predictionData?.report?.prediction?.recommendations ||
                          predictionData?.report?.mlResponse?.recommendations || [];

  // Counterfactual explanations (what-if scenarios)
  const counterfactuals = predictionData?.visit?.prediction?.counterfactuals ||
                          predictionData?.prediction?.counterfactuals ||
                          predictionData?.report?.prediction?.counterfactuals ||
                          predictionData?.report?.mlResponse?.counterfactuals || [];

  // Specialist referral suggestion
  const referral = predictionData?.visit?.prediction?.referral ||
                   predictionData?.prediction?.referral ||
                   predictionData?.report?.prediction?.referral ||
                   predictionData?.report?.mlResponse?.referral || null;

  // All SHAP contributions for global view
  const shapContributions = predictionData?.visit?.prediction?.shap_contributions ||
                            predictionData?.prediction?.shap_contributions ||
                            predictionData?.report?.prediction?.shap_contributions ||
                            predictionData?.report?.mlResponse?.shap_contributions || {};

  let riskBg;
  // Use riskCategory from backend - it's the source of truth
  const riskLabel = riskCategory;

  if (riskCategory === 'Low Risk') {
    riskBg = "bg-[#3c6382]";
  } else if (riskCategory === 'Moderate Risk') {
    riskBg = "bg-[#ff6b4a]";
  } else if (riskCategory === 'High Risk') {
    riskBg = "bg-red-500";
  } else {
    riskBg = "bg-gray-500";
  }

  // Map cholesterol value
  const cholesterolLabel = patientInfo.cholesterol === 1 ? 'Normal' : 
                          patientInfo.cholesterol === 2 ? 'Above Normal' : 
                          patientInfo.cholesterol === 3 ? 'High' : 'N/A';

  // Format feature name for display
  const formatFeatureName = (name) => {
    const featureLabels = {
      'age': 'Age',
      'ap_hi': 'Systolic BP',
      'ap_lo': 'Diastolic BP',
      'cholesterol': 'Cholesterol Level',
      'gluc': 'Glucose Level',
      'smoke': 'Smoking',
      'alco': 'Alcohol Consumption',
      'active': 'Physical Activity',
      'bmi': 'Body Mass Index',
      'pulse_pressure': 'Pulse Pressure',
      'age_bp_interaction': 'Age-BP Interaction',
      'glucose_bmi': 'Glucose-BMI Factor',
      'weight': 'Weight',
      'height': 'Height',
      'gender': 'Gender'
    };
    return featureLabels[name] || name.replace(/_/g, ' ');
  };

  const generatePDF = () => {
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
    doc.text(`Patient ID: ${patientId}`, 20, y);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 20, y, { align: 'right' });
    
    y += 15;
    
    // Risk Summary Box
    if (riskLabel === 'High Risk') {
      doc.setFillColor(239, 68, 68);
    } else if (riskLabel === 'Moderate Risk') {
      doc.setFillColor(245, 158, 11);
    } else {
      doc.setFillColor(34, 197, 94);
    }
    doc.roundedRect(20, y, pageWidth - 40, 30, 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Risk Assessment: ${risk}% - ${riskLabel}`, pageWidth / 2, y + 18, { align: 'center' });
    
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
    
    const patientInfoData = [
      ['Age', `${patientInfo.age || 'N/A'} years`],
      ['Gender', patientInfo.gender === 1 ? 'Male' : patientInfo.gender === 0 ? 'Female' : 'N/A'],
      ['Height', `${patientInfo.height || 'N/A'} cm`],
      ['Weight', `${patientInfo.weight || 'N/A'} kg`],
      ['Blood Pressure', `${patientInfo.ap_hi || 'N/A'}/${patientInfo.ap_lo || 'N/A'} mmHg`],
      ['Cholesterol', cholesterolLabel],
    ];
    
    patientInfoData.forEach(([label, value], i) => {
      const xPos = i % 2 === 0 ? 25 : pageWidth / 2;
      if (i % 2 === 0 && i > 0) y += 12;
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, xPos, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value, xPos + 50, y);
    });
    
    y += 25;
    
    // SHAP Risk Factors
    if (topRiskFactors.length > 0) {
      doc.setTextColor(10, 61, 98);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('AI Risk Factor Analysis (SHAP)', 20, y);
      
      y += 10;
      doc.line(20, y, pageWidth - 20, y);
      
      y += 12;
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      
      topRiskFactors.forEach((factor) => {
        const impact = factor.impact;
        const sign = impact > 0 ? '+' : '';
        const color = impact > 0 ? [239, 68, 68] : [34, 197, 94];
        
        doc.setFont('helvetica', 'normal');
        doc.text(`• ${formatFeatureName(factor.feature)}`, 25, y);
        
        doc.setTextColor(...color);
        doc.setFont('helvetica', 'bold');
        doc.text(`${sign}${impact.toFixed(4)}`, pageWidth - 40, y);
        doc.setTextColor(60, 60, 60);
        
        y += 10;
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
        doc.setTextColor(10, 61, 98);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text(`${rec.icon || ''} ${rec.title}`, 20, y);

        y += 8;
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.setFont('helvetica', 'normal');
        const descLines = doc.splitTextToSize(rec.description, pageWidth - 45);
        doc.text(descLines, 25, y);
        y += descLines.length * 5;

        if (rec.actions && rec.actions.length > 0) {
          y += 3;
          rec.actions.forEach((action) => {
            if (y > 270) {
              doc.addPage();
              y = 20;
            }
            doc.setFontSize(9);
            doc.text(`  • ${action}`, 28, y);
            y += 5;
          });
        }
        y += 5;
      });
    } else if (recommendation) {
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
      const splitText = doc.splitTextToSize(recommendation, pageWidth - 45);
      doc.text(splitText, 25, y);
    }
    
    // Footer on last page
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('This report is generated by CardioShield AI and is for informational purposes only.', pageWidth / 2, pageHeight - 15, { align: 'center' });
    doc.text('Please consult a healthcare professional for medical advice.', pageWidth / 2, pageHeight - 9, { align: 'center' });
    
    // Save
    doc.save(`CardioShield_Report_${patientId}.pdf`);
  };

  return (
    <main className="flex-1 overflow-y-auto bg-[#eef2f7] p-4 md:p-6 lg:p-10 w-full">
      <div className="max-w-[1300px] mx-auto bg-white p-6 md:p-10 rounded-[30px] shadow-xl">

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setselectedtab && setselectedtab('dashboard')}
            className="flex items-center gap-2 text-[#0a3d62] hover:text-[#3c6382] font-medium text-sm transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <button
            onClick={() => setselectedtab && setselectedtab('analysis')}
            className="flex items-center gap-2 bg-[#0a3d62] hover:bg-[#083050] text-white px-4 py-2 rounded-lg font-medium text-sm transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Assessment
          </button>
        </div>

        {!predictionData ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Prediction Data</h3>
            <p className="text-gray-500 mb-6">Submit a health analysis to see your risk assessment results here.</p>
            <button
              onClick={() => setselectedtab && setselectedtab('analysis')}
              className="bg-[#0a3d62] hover:bg-[#083050] text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Go to Heart Analysis
            </button>
          </div>
        ) : (
        <>

        <div className="text-[26px] font-semibold mb-8 text-[#0a3d62]">
          Patient Heart Risk Dashboard
        </div>

        {/* Patient Info */}
        <div className="bg-gradient-to-r from-[#0a3d62] to-[#3c6382] p-5 md:p-8 rounded-[25px] text-white mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">

            <div className="bg-white/10 p-5 rounded-[15px]">
              <h4 className="text-[13px] opacity-80 mb-1">Patient ID</h4>
              <p className="text-[20px] font-semibold">{patientId}</p>
            </div>

            <div className="bg-white/10 p-5 rounded-[15px]">
              <h4 className="text-[13px] opacity-80 mb-1">Age</h4>
              <p className="text-[20px] font-semibold">{patientInfo.age || 'N/A'} Years</p>
            </div>

            <div className="bg-white/10 p-5 rounded-[15px]">
              <h4 className="text-[13px] opacity-80 mb-1">Height</h4>
              <p className="text-[20px] font-semibold">{patientInfo.height || 'N/A'} cm</p>
            </div>

            <div className="bg-white/10 p-5 rounded-[15px]">
              <h4 className="text-[13px] opacity-80 mb-1">Weight</h4>
              <p className="text-[20px] font-semibold">{patientInfo.weight || 'N/A'} kg</p>
            </div>

            <div className="bg-white/10 p-5 rounded-[15px]">
              <h4 className="text-[13px] opacity-80 mb-1">Blood Pressure</h4>
              <p className="text-[20px] font-semibold">{patientInfo.ap_hi || 'N/A'}/{patientInfo.ap_lo || 'N/A'}</p>
            </div>

            <div className="bg-white/10 p-5 rounded-[15px]">
              <h4 className="text-[13px] opacity-80 mb-1">Cholesterol</h4>
              <p className="text-[20px] font-semibold">{cholesterolLabel}</p>
            </div>

          </div>
        </div>

        {/* Risk Score + SHAP Factors */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

          {/* Risk Score */}
          <div className={`${riskBg} rounded-[25px] p-8 text-white text-center flex flex-col justify-center`}>
            <h3 className="text-lg mb-2">Cardiovascular Risk</h3>
            <div className="text-[70px] font-bold leading-none">{risk}%</div>
            <div className="text-[18px] mt-3 font-medium">{riskLabel}</div>
          </div>

          {/* SHAP Explainability */}
          <div className="lg:col-span-2 bg-[#0a3d62] p-6 rounded-[25px] text-white">
            <h3 className="text-lg font-semibold mb-4">SHAP Explainability - Top Risk Factors</h3>
            <p className="text-xs opacity-70 mb-4">SHAP values show how each feature contributes to the prediction. Positive values increase risk, negative values decrease risk.</p>
            
            {topRiskFactors.length > 0 ? (
              <div className="space-y-4">
                {topRiskFactors.map((factor, index) => {
                  const impact = factor.impact;
                  const isPositive = impact > 0;
                  const absImpact = Math.abs(impact);
                  const barWidth = Math.min(absImpact * 500, 100); // Scale for visualization
                  
                  return (
                    <div key={index} className="bg-white/10 p-4 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium capitalize">{formatFeatureName(factor.feature)}</span>
                        <span className={`font-bold ${isPositive ? 'text-red-400' : 'text-green-400'}`}>
                          {isPositive ? '+' : ''}{impact.toFixed(4)}
                        </span>
                      </div>
                      <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${isPositive ? 'bg-red-400' : 'bg-green-400'}`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                      <p className="text-xs mt-1 opacity-70">
                        {isPositive ? 'Increases' : 'Decreases'} cardiovascular risk
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white/10 p-6 rounded-xl text-center">
                <p className="opacity-70">SHAP analysis data not available for this prediction.</p>
              </div>
            )}
          </div>

        </div>

        {/* AI-Powered Recommendations */}
        <div className="mb-8">
          <h3 className="text-xl md:text-2xl font-bold text-[#0a3d62] mb-6">
            AI-Powered Health Recommendations
          </h3>

          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {recommendations.map((rec, index) => {
                const severityStyles = {
                  high: 'border-l-red-500 bg-red-50',
                  moderate: 'border-l-yellow-500 bg-yellow-50',
                  low: 'border-l-green-500 bg-green-50',
                };
                const style = severityStyles[rec.severity] || 'border-l-blue-500 bg-blue-50';

                return (
                  <div
                    key={index}
                    className={`border-l-4 ${style} rounded-xl p-4 md:p-5 shadow-sm`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl flex-shrink-0">{rec.icon}</span>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm md:text-base">{rec.title}</h4>
                        <span className="text-xs text-gray-500 uppercase font-semibold">{rec.category}</span>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 mb-3">{rec.description}</p>
                    {rec.actions && rec.actions.length > 0 && (
                      <ul className="space-y-1.5">
                        {rec.actions.map((action, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-gray-700">
                            <span className="text-[#0a3d62] mt-0.5">&#10003;</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gradient-to-r from-[#0a3d62] to-[#3c6382] p-6 md:p-8 rounded-[25px] text-white">
              <h4 className="text-md font-medium mb-3 opacity-90">Recommended Actions:</h4>
              <ul className="mt-4 space-y-2 text-sm md:text-base">
                <li>• {riskLabel === 'High Risk' ? 'Immediate consultation with cardiologist required' : 'Regular monitoring recommended'}</li>
                <li>• Reduce salt intake and maintain healthy diet</li>
                <li>• Exercise 30 minutes daily (consult doctor first if high risk)</li>
                <li>• Avoid smoking and limit alcohol consumption</li>
                <li>• Monitor blood pressure regularly</li>
                {riskLabel === 'High Risk' && (
                  <li className="font-bold text-yellow-300">• Schedule specialist appointment within 7 days</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Counterfactual Explanations - What-If Scenarios */}
        {counterfactuals.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-[#0a3d62] mb-6">
              What-If Scenarios (Counterfactual Analysis)
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              These show how your risk would change if specific health factors improved.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {counterfactuals.map((cf, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm md:text-base">{cf.change_description}</h4>
                      <span className="text-xs text-gray-500 uppercase font-semibold">{cf.label}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">Current Risk</div>
                      <div className="text-lg font-bold text-red-500">{Math.round(cf.current_risk * 100)}%</div>
                    </div>
                    <div className="text-xl text-gray-400">→</div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">Potential Risk</div>
                      <div className="text-lg font-bold text-green-600">{Math.round(cf.new_risk * 100)}%</div>
                    </div>
                    <div className="flex-1 text-right">
                      <div className="text-xs text-gray-500 mb-1">Reduction</div>
                      <div className="text-lg font-bold text-[#0a3d62]">-{Math.round(cf.risk_reduction * 100)}%</div>
                    </div>
                  </div>
                  {cf.new_category !== riskCategory && (
                    <div className="mt-2 text-xs text-green-700 font-medium bg-green-100 rounded-md px-2 py-1 inline-block">
                      Risk category would change to: {cf.new_category}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All SHAP Contributions Bar Chart */}
        {Object.keys(shapContributions).length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-[#0a3d62] mb-6">
              Complete SHAP Feature Contributions
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              All features and their impact on this prediction. Red bars increase risk, green bars decrease risk.
            </p>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              {Object.entries(shapContributions)
                .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                .map(([feature, value], index) => {
                  const isPositive = value > 0;
                  const absValue = Math.abs(value);
                  const maxVal = Math.max(...Object.values(shapContributions).map(v => Math.abs(v)));
                  const barWidth = maxVal > 0 ? Math.min((absValue / maxVal) * 100, 100) : 0;
                  return (
                    <div key={index} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                      <div className="w-40 text-sm font-medium text-gray-700 text-right truncate">
                        {formatFeatureName(feature)}
                      </div>
                      <div className="flex-1 flex items-center">
                        <div className="w-full h-5 bg-gray-100 rounded-full overflow-hidden relative">
                          <div
                            className={`h-full rounded-full ${isPositive ? 'bg-red-400' : 'bg-green-400'}`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                      <div className={`w-20 text-sm font-bold text-right ${isPositive ? 'text-red-500' : 'text-green-600'}`}>
                        {isPositive ? '+' : ''}{value.toFixed(4)}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Specialist Referral Suggestion */}
        {referral && referral.specialists && referral.specialists.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-[#0a3d62] mb-6">
              Specialist Referral Suggestion
            </h3>
            <div className={`border-l-4 rounded-xl p-6 shadow-sm ${
              referral.urgency === 'urgent' ? 'border-l-red-500 bg-red-50' :
              referral.urgency === 'soon' ? 'border-l-yellow-500 bg-yellow-50' :
              'border-l-green-500 bg-green-50'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{referral.urgency === 'urgent' ? '🚨' : referral.urgency === 'soon' ? '⚠️' : '✅'}</span>
                <span className={`text-sm font-bold uppercase ${
                  referral.urgency === 'urgent' ? 'text-red-700' :
                  referral.urgency === 'soon' ? 'text-yellow-700' :
                  'text-green-700'
                }`}>
                  {referral.urgency} — {referral.timeline}
                </span>
              </div>
              <div className="space-y-3">
                {referral.specialists.map((spec, i) => (
                  <div key={i} className="bg-white/70 rounded-lg p-3">
                    <div className="font-bold text-gray-900">{spec.type}</div>
                    <div className="text-sm text-gray-600">{spec.reason}</div>
                  </div>
                ))}
              </div>
              {referral.tests_recommended && referral.tests_recommended.length > 0 && (
                <div className="mt-4">
                  <div className="font-semibold text-gray-800 text-sm mb-2">Recommended Tests:</div>
                  <ul className="space-y-1">
                    {referral.tests_recommended.map((test, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="text-[#0a3d62]">•</span>
                        <span>{test}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Download PDF Button */}
        <button
          onClick={generatePDF}
          className="w-full bg-[#0a3d62] hover:bg-[#083050] text-white py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF Report
        </button>

        </>
        )}
      </div>
    </main>
  );
}

export default Result;