import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { predictionService } from "../../services/apiService";
import { LoadingButton } from "../../components/Loading";
import { Alert } from "../../components/Alert";

function Analatics({ setselectedtab }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    patientId: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    ap_hi: '',
    ap_lo: '',
    cholesterol: '',
    gluc: '',
    smoke: '',
    alco: '',
    active: '',
  });

  // Auto-fill patient ID and age from localStorage if available
  useEffect(() => {
    const currentPatient = localStorage.getItem('currentPatient');
    if (currentPatient) {
      try {
        const patient = JSON.parse(currentPatient);
        setFormData(prev => ({
          ...prev,
          patientId: patient.patientId || '',
          age: patient.age || ''
        }));
      } catch (err) {
        console.error('Error loading patient data:', err);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate form data
      if (!formData.patientId.trim()) {
        throw new Error('Patient ID is required');
      }

      // Map form data to API format
      const predictionData = {
        age: parseInt(formData.age),
        height: parseInt(formData.height),
        weight: parseInt(formData.weight),
        gender: formData.gender === 'male' ? 1 : 0,
        ap_hi: parseInt(formData.ap_hi),
        ap_lo: parseInt(formData.ap_lo),
        cholesterol: parseInt(formData.cholesterol),
        gluc: parseInt(formData.gluc),
        smoke: formData.smoke === 'yes' ? 1 : 0,
        alco: formData.alco === 'yes' ? 1 : 0,
        active: formData.active === 'active' ? 1 : 0,
      };

      const response = await predictionService.createPrediction(predictionData);

      if (response.success) {
        // Store prediction result for Result component
        localStorage.setItem('latestPrediction', JSON.stringify({
          ...response.data,
          patientId: formData.patientId,
          patientData: predictionData
        }));
        
        // Switch to result tab
        if (setselectedtab) {
          setselectedtab('result');
        } else {
          navigate('/home?tab=result');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Prediction failed. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="w-full max-w-6xl mx-auto">
        
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

              {error && (
                <Alert 
                  type="error" 
                  message={error} 
                  onClose={() => setError('')}
                  className="mb-6"
                />
              )}
             
              <form onSubmit={handleSubmit}>

                {/* ALL INPUTS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                  {/* Patient ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                    <input
                      type="text"
                      name="patientId"
                      placeholder="Patient ID"
                      value={formData.patientId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3d62]/30 focus:border-[#0a3d62]"
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age (years)</label>
                    <input
                      type="number"
                      name="age"
                      placeholder="Age"
                      value={formData.age}
                      onChange={handleChange}
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
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
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
                      name="height"
                      placeholder="Height"
                      value={formData.height}
                      onChange={handleChange}
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
                      name="weight"
                      placeholder="Weight"
                      value={formData.weight}
                      onChange={handleChange}
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
                      name="ap_hi"
                      placeholder="Systolic"
                      value={formData.ap_hi}
                      onChange={handleChange}
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
                      name="ap_lo"
                      placeholder="Diastolic"
                      value={formData.ap_lo}
                      onChange={handleChange}
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
                      name="cholesterol"
                      value={formData.cholesterol}
                      onChange={handleChange}
                      required
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
                      name="gluc"
                      value={formData.gluc}
                      onChange={handleChange}
                      required
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
                      name="smoke"
                      value={formData.smoke}
                      onChange={handleChange}
                      required
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
                      name="alco"
                      value={formData.alco}
                      onChange={handleChange}
                      required
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
                      name="active"
                      value={formData.active}
                      onChange={handleChange}
                      required
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
                  <LoadingButton
                    type="submit"
                    loading={loading}
                    className="w-full bg-[#e74c3c] hover:bg-[#c0392b] text-white font-semibold text-lg py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl focus:ring-4 focus:ring-[#e74c3c]/30"
                  >
                    Predict Cardiovascular Risk
                  </LoadingButton>
                </div>

              </form>
            </div>
          </div>
        </div>
    </main>
  );
}

export default Analatics;

