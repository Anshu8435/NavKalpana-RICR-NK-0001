import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

function Result() {
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
      ['Gender', patientInfo.gender === 1 ? 'Male' : 'Female'],
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
    
    // Recommendation
    if (recommendation) {
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
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('This report is generated by CardioShield AI and is for informational purposes only.', pageWidth / 2, 280, { align: 'center' });
    doc.text('Please consult a healthcare professional for medical advice.', pageWidth / 2, 286, { align: 'center' });
    
    // Save
    doc.save(`CardioShield_Report_${patientId}.pdf`);
  };

  return (
    <div className="flex-1 bg-[#eef2f7] p-6 lg:p-10 w-full">
      <div className="max-w-[1300px] mx-auto bg-white p-10 rounded-[30px] shadow-xl">

        <div className="text-[26px] font-semibold mb-8 text-[#0a3d62]">
          Patient Heart Risk Dashboard
        </div>

        {/* Patient Info */}
        <div className="bg-gradient-to-r from-[#0a3d62] to-[#3c6382] p-8 rounded-[25px] text-white mb-8">
          <div className="grid grid-cols-3 gap-5">

            <div className="bg-white/10 p-5 rounded-[15px]">
              <h4 className="text-[13px] opacity-80 mb-1">Patient ID</h4>
              <p className="text-[20px] font-semibold">{patientId}</p>
            </div>

            <div className="bg-white/10 p-5 rounded-[15px]">
              <h4 className="text-[13px] opacity-80 mb-1">Age</h4>
              <p className="text-[20px] font-semibold">{patientInfo.age || 52} Years</p>
            </div>

            <div className="bg-white/10 p-5 rounded-[15px]">
              <h4 className="text-[13px] opacity-80 mb-1">Height</h4>
              <p className="text-[20px] font-semibold">{patientInfo.height || 172} cm</p>
            </div>

            <div className="bg-white/10 p-5 rounded-[15px]">
              <h4 className="text-[13px] opacity-80 mb-1">Weight</h4>
              <p className="text-[20px] font-semibold">{patientInfo.weight || 75} kg</p>
            </div>

            <div className="bg-white/10 p-5 rounded-[15px]">
              <h4 className="text-[13px] opacity-80 mb-1">Blood Pressure</h4>
              <p className="text-[20px] font-semibold">{patientInfo.ap_hi || 150}/{patientInfo.ap_lo || 95}</p>
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

        {/* Tips */}
        <div className="bg-gradient-to-r from-[#0a3d62] to-[#3c6382] p-8 rounded-[25px] text-white mb-8">
          <h3 className="text-xl font-semibold mb-4">AI-Generated Risk Analysis</h3>

          <h4 className="text-md font-medium mb-3 opacity-90">Recommended Actions:</h4>
          <ul className="mt-4 space-y-2">
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

      </div>
    </div>
  );
}

export default Result;