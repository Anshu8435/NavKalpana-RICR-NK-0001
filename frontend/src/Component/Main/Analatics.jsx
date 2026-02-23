import { useState } from "react";

function Analatics() {
  const [openstate , setOpenstate] = useState(false);
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col w-full">
      <div className="flex-1 py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8">
        
        <div>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
              <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0a3d62] tracking-tight">
            AI-Based Early Cardiovascular Risk Screening
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-3xl mx-auto">
            Low-cost screening for heart attack & stroke risk (5–10 year prediction)
          </p>
          <p className="mt-2 text-sm text-gray-500 italic">
            CardioShield AI provides explainable risk stratification to assist early intervention.{" "}
            <strong>Not a diagnostic replacement.</strong>
          </p>
        </div>
             
              <form onSubmit={(e) => e.preventDefault()}>

                {/* ALL INPUTS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                  {/* Patient ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                    <input
                      type="text"
                      placeholder="Patient ID"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3d62]/30 focus:border-[#0a3d62]"
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age (years)</label>
                    <input
                      type="number"
                      placeholder="Age"
                      required
                      min="20"
                      max="120"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3d62]/30 focus:border-[#0a3d62]"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      required
                      defaultValue=""
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3d62]/30 focus:border-[#0a3d62] bg-white"
                    >
                      <option value="" disabled>Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  {/* Height */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                    <input
                      type="number"
                      placeholder="Height"
                      required
                      min="100"
                      max="250"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3d62]/30 focus:border-[#0a3d62]"
                    />
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      placeholder="Weight"
                      required
                      min="30"
                      max="300"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3d62]/30 focus:border-[#0a3d62]"
                    />
                  </div>

                  {/* Systolic */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Systolic BP</label>
                    <input
                      type="number"
                      placeholder="Systolic"
                      required
                      min="70"
                      max="250"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3d62]/30 focus:border-[#0a3d62]"
                    />
                  </div>

                  {/* Diastolic */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Diastolic BP</label>
                    <input
                      type="number"
                      placeholder="Diastolic"
                      required
                      min="40"
                      max="150"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3d62]/30 focus:border-[#0a3d62]"
                    />
                  </div>

                  {/* Cholesterol */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cholesterol</label>
                    <select
                      required
                      defaultValue=""
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3d62]/30 focus:border-[#0a3d62] bg-white"
                    >
                      <option value="" disabled>Select</option>
                      <option value="1">Normal</option>
                      <option value="2">Above normal</option>
                      <option value="3">Well above normal</option>
                    </select>
                  </div>

                  {/* Glucose */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Glucose</label>
                    <select
                      required
                      defaultValue=""
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3d62]/30 focus:border-[#0a3d62] bg-white"
                    >
                      <option value="" disabled>Select</option>
                      <option value="1">Normal</option>
                      <option value="2">Above normal</option>
                      <option value="3">Well above normal</option>
                    </select>
                  </div>

                  {/* Smoking */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Smoking</label>
                    <select
                      required
                      defaultValue=""
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3d62]/30 focus:border-[#0a3d62] bg-white"
                    >
                      <option value="" disabled>Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  {/* Alcohol */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alcohol</label>
                    <select
                      required
                      defaultValue=""
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3d62]/30 focus:border-[#0a3d62] bg-white"
                    >
                      <option value="" disabled>Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  {/* Physical Activity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Physical Activity</label>
                    <select
                      required
                      defaultValue=""
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3d62]/30 focus:border-[#0a3d62] bg-white"
                    >
                      <option value="" disabled>Select</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                </div>

                {/* Submit Button */}
                <div className="pt-10">
                  <button
                    type="submit"
                    className="w-full bg-[#e74c3c] hover:bg-[#c0392b] text-white font-semibold text-lg py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl focus:ring-4 focus:ring-[#e74c3c]/30"
                  >
                    Predict Cardiovascular Risk
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Analatics;

