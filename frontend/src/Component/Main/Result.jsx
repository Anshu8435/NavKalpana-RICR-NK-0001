import React, { useEffect, useRef, useState } from "react";

function Result() {
  const canvasRef = useRef(null);
  const [predictionData, setPredictionData] = useState(null);

  useEffect(() => {
    // Load prediction data from localStorage
    const storedPrediction = localStorage.getItem('latestPrediction');
    if (storedPrediction) {
      setPredictionData(JSON.parse(storedPrediction));
    }
  }, []);

  // Use prediction data or fallback to demo values
  const risk = predictionData 
    ? Math.round(predictionData.visit?.prediction?.risk_probability * 100 || 
        predictionData.prediction?.risk_probability * 100 || 
        predictionData.report?.prediction?.risk_probability * 100 || 78)
    : 78;

  const riskCategory = predictionData
    ? predictionData.visit?.prediction?.risk_category || 
      predictionData.prediction?.risk_category || 
      predictionData.report?.prediction?.risk_category || 
      'Moderate Risk'
    : 'Moderate Risk';

  const patientInfo = predictionData?.patientData || {};
  const topRiskFactors = predictionData?.visit?.prediction?.top_risk_factors || 
                        predictionData?.prediction?.top_risk_factors ||
                        predictionData?.report?.prediction?.top_risk_factors ||
                        [];
  
  const patientId = predictionData?.patientId || 'PT-4821';

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.offsetWidth;
    canvas.height = 220;

    let ecgColor;

    if (risk < 40) {
      ecgColor = "white";
    } else if (risk < 70) {
      ecgColor = "blue";
    } else {
      ecgColor = "red";
    }

    let x = 0;

    function drawECG() {
      ctx.fillStyle = "#0a3d62";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);

      for (let i = 0; i < x; i++) {
        let base = canvas.height / 2;
        let wave =
          Math.sin(i * 0.04) * 15 + (Math.random() * 6 - 3);

        if (i % 70 === 0) {
          wave -= 60;
        }

        ctx.lineTo(i, base - wave);
      }

      ctx.strokeStyle = ecgColor;
      ctx.lineWidth = 2;
      ctx.shadowColor = ecgColor;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      x += 3;
      if (x > canvas.width) x = 0;

      requestAnimationFrame(drawECG);
    }

    drawECG();
  }, []);

  let riskBg;
  let riskLabel;

  if (risk < 30) {
    riskBg = "bg-[#3c6382]";
    riskLabel = "Low Risk";
  } else if (risk < 70) {
    riskBg = "bg-[#ff6b4a]";
    riskLabel = "Moderate Risk";
  } else {
    riskBg = "bg-red-500";
    riskLabel = "High Risk";
  }

  // Calculate BMI if data available
  const bmi = patientInfo.weight && patientInfo.height 
    ? (patientInfo.weight / ((patientInfo.height / 100) ** 2)).toFixed(1)
    : 'N/A';

  // Map cholesterol value
  const cholesterolLabel = patientInfo.cholesterol === 1 ? 'Normal' : 
                          patientInfo.cholesterol === 2 ? 'Above Normal' : 
                          patientInfo.cholesterol === 3 ? 'High' : 'N/A';

  return (
    <div className="bg-[#eef2f7] min-h-screen p-10">
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

        {/* ECG + Risk */}
        <div className="grid grid-cols-3 gap-8 mb-8">

          <div className="col-span-2 bg-[#0a3d62] p-6 rounded-[25px] text-white">
            <h3 className="mb-4">Live ECG Monitor</h3>
            <canvas ref={canvasRef} className="w-full h-[220px]" />
          </div>

          <div className={`${riskBg} rounded-[25px] p-8 text-white text-center flex flex-col justify-center`}>
            <h3>Heart Risk</h3>
            <div className="text-[60px] font-semibold">{risk}%</div>
            <div className="text-[16px] mt-2">{riskLabel}</div>
          </div>

        </div>

        {/* Tips */}
        <div className="bg-gradient-to-r from-[#0a3d62] to-[#3c6382] p-8 rounded-[25px] text-white">
          <h3 className="text-xl font-semibold mb-4">AI-Generated Risk Analysis</h3>
          
          {topRiskFactors.length > 0 ? (
            <div className="mb-6">
              <h4 className="text-md font-medium mb-3 opacity-90">Top Risk Factors:</h4>
              <ul className="space-y-2">
                {topRiskFactors.map((factor, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="capitalize">{factor.feature.replace('_', ' ')}</span>
                    <span className="font-semibold">{(factor.impact * 100).toFixed(1)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

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

      </div>
    </div>
  );
}

export default Result;