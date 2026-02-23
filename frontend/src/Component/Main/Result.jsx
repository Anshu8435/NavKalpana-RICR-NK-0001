import React, { useEffect, useRef } from "react";

function Result() {
  const canvasRef = useRef(null);

  const risk = 78;

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

  if (risk < 40) {
    riskBg = "bg-[#3c6382]";
    riskLabel = "Low Risk";
  } else if (risk < 70) {
    riskBg = "bg-[#ff6b4a]";
    riskLabel = "Moderate Risk";
  } else {
    riskBg = "bg-red-500";
    riskLabel = "High Risk";
  }

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
              <p className="text-[20px] font-semibold">PT-4821</p>
            </div>

            <div className="bg-white/10 p-5 rounded-[15px]">
              <h4 className="text-[13px] opacity-80 mb-1">Age</h4>
              <p className="text-[20px] font-semibold">52 Years</p>
            </div>

            <div className="bg-white/10 p-5 rounded-[15px]">
              <h4 className="text-[13px] opacity-80 mb-1">Height</h4>
              <p className="text-[20px] font-semibold">172 cm</p>
            </div>

            <div className="bg-white/10 p-5 rounded-[15px]">
              <h4 className="text-[13px] opacity-80 mb-1">Heart Rate</h4>
              <p className="text-[20px] font-semibold">96 bpm</p>
            </div>

            <div className="bg-white/10 p-5 rounded-[15px]">
              <h4 className="text-[13px] opacity-80 mb-1">Blood Pressure</h4>
              <p className="text-[20px] font-semibold">150/95</p>
            </div>

            <div className="bg-white/10 p-5 rounded-[15px]">
              <h4 className="text-[13px] opacity-80 mb-1">Cholesterol</h4>
              <p className="text-[20px] font-semibold">High</p>
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
          <h3>AI Suggested Tips</h3>
          <ul className="mt-4 space-y-2">
            <li>Reduce salt intake</li>
            <li>Exercise 30 minutes daily</li>
            <li>Avoid smoking</li>
            <li>Monitor BP weekly</li>
            <li>Consult cardiologist regularly</li>
          </ul>
        </div>

      </div>
    </div>
  );
}

export default Result;