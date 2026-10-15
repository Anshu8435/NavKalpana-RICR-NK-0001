import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { predictionService } from "../../services/apiService";
import { LoadingButton } from "../../components/Loading";
import { Alert } from "../../components/Alert";
import { 
  Activity, 
  User, 
  Heart, 
  Droplet, 
  Dna, 
  Cigarette, 
  Wine, 
  Zap, 
  Scale, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  ShieldCheck,
  ChevronRight,
  ArrowRight
} from "lucide-react";

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

  // Calculated helper metrics for clinical insight
  const calculateBMI = () => {
    const h = parseFloat(formData.height);
    const w = parseFloat(formData.weight);
    if (!h || !w || h <= 0 || w <= 0) return null;
    const bmi = w / ((h / 100) * (h / 100));
    return bmi.toFixed(1);
  };

  const bmiValue = calculateBMI();
  const getBMICategory = (bmi) => {
    if (!bmi) return null;
    const b = parseFloat(bmi);
    if (b < 18.5) return { text: 'Underweight', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (b < 25) return { text: 'Optimal BMI', color: 'text-teal-700 bg-teal-50 border-teal-200' };
    if (b < 30) return { text: 'Overweight', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { text: 'Obese (Class I+)', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };
  const bmiBadge = getBMICategory(bmiValue);

  const calculatePulsePressure = () => {
    const hi = parseInt(formData.ap_hi);
    const lo = parseInt(formData.ap_lo);
    if (isNaN(hi) || isNaN(lo)) return null;
    return Math.abs(hi - lo);
  };
  const pulsePressure = calculatePulsePressure();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.patientId.trim()) {
        throw new Error('Patient ID is required');
      }

      let ap_hi = parseInt(formData.ap_hi);
      let ap_lo = parseInt(formData.ap_lo);

      if (isNaN(ap_hi) || isNaN(ap_lo)) {
        throw new Error('Please enter valid numerical values for Blood Pressure.');
      }

      if (ap_lo > ap_hi) {
        const temp = ap_hi;
        ap_hi = ap_lo;
        ap_lo = temp;
      } else if (ap_lo === ap_hi) {
        throw new Error('Diastolic BP (lower reading) must be less than Systolic BP (upper reading). E.g., 120/80');
      }

      const predictionData = {
        age: parseInt(formData.age),
        height: parseInt(formData.height),
        weight: parseInt(formData.weight),
        gender: formData.gender === 'male' ? 1 : 0,
        ap_hi,
        ap_lo,
        cholesterol: parseInt(formData.cholesterol),
        gluc: parseInt(formData.gluc),
        smoke: formData.smoke === 'yes' ? 1 : 0,
        alco: formData.alco === 'yes' ? 1 : 0,
        active: formData.active === 'active' ? 1 : 0,
      };

      const response = await predictionService.createPrediction(predictionData);

      if (response.success) {
        localStorage.setItem('latestPrediction', JSON.stringify({
          ...response.data,
          patientId: formData.patientId,
          patientData: predictionData
        }));
        
        if (setselectedtab) {
          setselectedtab('result');
        } else {
          navigate('/home?tab=result');
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.errors?.length
        ? err.response.data.errors.map((e) => e.message).join('; ')
        : (err.response?.data?.message || err.message || 'Prediction failed. Please check your inputs and try again.');
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-[#0B1F33] via-[#0E2A44] to-[#123B5D] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#13B8A6]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/25 text-[#20D9C2] text-xs font-semibold">
              <Sparkles size={14} />
              <span>Calibrated Diagnostic Protocol</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
              Cardiovascular Risk Stratification
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Input patient hemodynamic parameters and metabolic biomarkers. 
              The system computes a probabilistic risk score paired with explainable TreeSHAP attributions.
            </p>
          </div>

          <div className="hidden lg:flex flex-col items-end text-xs text-slate-300 space-y-1">
            <span className="font-semibold text-white">Model: Calibrated XGBoost</span>
            <span>Target: 5–10 Year Event Stratification</span>
            <span className="text-[#20D9C2] font-mono">13 Engineered Features</span>
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

      {/* Form Container */}
      <div className="bg-white rounded-3xl border border-[#E0E8F0] shadow-md overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">

          {/* Section 1: Demographics & Biometrics */}
          <div>
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#E0E8F0]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-[#13B8A6]">
                  <User size={16} />
                </div>
                <h3 className="text-sm font-bold text-[#0B1F33] uppercase tracking-wider">
                  1. Patient Identification & Biometrics
                </h3>
              </div>

              {bmiValue && bmiBadge && (
                <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${bmiBadge.color} flex items-center gap-1.5`}>
                  <Scale size={13} />
                  <span>BMI: <strong>{bmiValue} kg/m²</strong> ({bmiBadge.text})</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              
              {/* Patient ID */}
              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1.5 uppercase tracking-wider">
                  Patient ID / File #
                </label>
                <input
                  type="text"
                  name="patientId"
                  placeholder="e.g. PT-2026-081"
                  value={formData.patientId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E0E8F0] text-sm text-[#172B3A] placeholder-slate-400 bg-[#F5F8FC]/50 focus:bg-white focus:outline-none focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20 transition-all duration-200"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1.5 uppercase tracking-wider">
                  Age (Years)
                </label>
                <input
                  type="number"
                  name="age"
                  placeholder="e.g. 52"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="20"
                  max="120"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E0E8F0] text-sm text-[#172B3A] placeholder-slate-400 bg-[#F5F8FC]/50 focus:bg-white focus:outline-none focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20 transition-all duration-200"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1.5 uppercase tracking-wider">
                  Biological Sex
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E0E8F0] text-sm text-[#172B3A] bg-[#F5F8FC]/50 focus:bg-white focus:outline-none focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20 transition-all duration-200 cursor-pointer"
                >
                  <option value="" disabled>Select Biological Sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Height */}
              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1.5 uppercase tracking-wider">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  placeholder="e.g. 175"
                  value={formData.height}
                  onChange={handleChange}
                  required
                  min="100"
                  max="250"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E0E8F0] text-sm text-[#172B3A] placeholder-slate-400 bg-[#F5F8FC]/50 focus:bg-white focus:outline-none focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20 transition-all duration-200"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1.5 uppercase tracking-wider">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  placeholder="e.g. 78"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  min="30"
                  max="300"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E0E8F0] text-sm text-[#172B3A] placeholder-slate-400 bg-[#F5F8FC]/50 focus:bg-white focus:outline-none focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20 transition-all duration-200"
                />
              </div>

            </div>
          </div>

          {/* Section 2: Hemodynamics */}
          <div>
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#E0E8F0]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-[#D94F59]">
                  <Heart size={16} />
                </div>
                <h3 className="text-sm font-bold text-[#0B1F33] uppercase tracking-wider">
                  2. Hemodynamics & Arterial Pressure
                </h3>
              </div>

              {pulsePressure !== null && (
                <div className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#123B5D] border border-blue-200">
                  Pulse Pressure: <strong>{pulsePressure} mmHg</strong>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Systolic BP */}
              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1.5 uppercase tracking-wider">
                  Systolic Blood Pressure (mmHg)
                  <span className="text-[10px] text-[#627487] block font-normal normal-case">
                    Upper reading during ventricular contraction (e.g. 120)
                  </span>
                </label>
                <input
                  type="number"
                  name="ap_hi"
                  placeholder="e.g. 120"
                  value={formData.ap_hi}
                  onChange={handleChange}
                  required
                  min="70"
                  max="250"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E0E8F0] text-sm text-[#172B3A] placeholder-slate-400 bg-[#F5F8FC]/50 focus:bg-white focus:outline-none focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20 transition-all duration-200"
                />
              </div>

              {/* Diastolic BP */}
              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1.5 uppercase tracking-wider">
                  Diastolic Blood Pressure (mmHg)
                  <span className="text-[10px] text-[#627487] block font-normal normal-case">
                    Lower reading during ventricular relaxation (e.g. 80)
                  </span>
                </label>
                <input
                  type="number"
                  name="ap_lo"
                  placeholder="e.g. 80"
                  value={formData.ap_lo}
                  onChange={handleChange}
                  required
                  min="40"
                  max="150"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E0E8F0] text-sm text-[#172B3A] placeholder-slate-400 bg-[#F5F8FC]/50 focus:bg-white focus:outline-none focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20 transition-all duration-200"
                />
              </div>

            </div>

            {formData.ap_hi && formData.ap_lo && Number(formData.ap_lo) > Number(formData.ap_hi) && (
              <div className="mt-3 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-[#123B5D] flex items-center gap-2">
                <Info size={16} className="text-[#13B8A6] shrink-0" />
                <span>
                  Clinical auto-adjust: Diastolic reading is currently higher than Systolic. 
                  CardioShield AI will automatically calibrate swapped values.
                </span>
              </div>
            )}
          </div>

          {/* Section 3: Biomarkers */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-[#E0E8F0]">
              <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-[#13B8A6]">
                <Droplet size={16} />
              </div>
              <h3 className="text-sm font-bold text-[#0B1F33] uppercase tracking-wider">
                3. Metabolic Biomarkers
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Cholesterol */}
              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1.5 uppercase tracking-wider">
                  Total Serum Cholesterol
                </label>
                <select
                  name="cholesterol"
                  value={formData.cholesterol}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E0E8F0] text-sm text-[#172B3A] bg-[#F5F8FC]/50 focus:bg-white focus:outline-none focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20 transition-all duration-200 cursor-pointer"
                >
                  <option value="" disabled>Select Level</option>
                  <option value="1">Normal (&lt; 200 mg/dL)</option>
                  <option value="2">Above Normal (200 - 239 mg/dL)</option>
                  <option value="3">Well Above Normal (&ge; 240 mg/dL)</option>
                </select>
              </div>

              {/* Glucose */}
              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1.5 uppercase tracking-wider">
                  Fasting Blood Glucose
                </label>
                <select
                  name="gluc"
                  value={formData.gluc}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E0E8F0] text-sm text-[#172B3A] bg-[#F5F8FC]/50 focus:bg-white focus:outline-none focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20 transition-all duration-200 cursor-pointer"
                >
                  <option value="" disabled>Select Level</option>
                  <option value="1">Normal (&lt; 100 mg/dL)</option>
                  <option value="2">Above Normal (100 - 125 mg/dL)</option>
                  <option value="3">Well Above Normal (&ge; 126 mg/dL)</option>
                </select>
              </div>

            </div>
          </div>

          {/* Section 4: Lifestyle */}
          <div>
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-[#E0E8F0]">
              <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-[#13B8A6]">
                <Activity size={16} />
              </div>
              <h3 className="text-sm font-bold text-[#0B1F33] uppercase tracking-wider">
                4. Behavioral & Lifestyle Indicators
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              
              {/* Tobacco */}
              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1.5 uppercase tracking-wider">
                  Tobacco / Smoking
                </label>
                <select
                  name="smoke"
                  value={formData.smoke}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E0E8F0] text-sm text-[#172B3A] bg-[#F5F8FC]/50 focus:bg-white focus:outline-none focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20 transition-all duration-200 cursor-pointer"
                >
                  <option value="" disabled>Select Status</option>
                  <option value="no">Non-Smoker</option>
                  <option value="yes">Active Smoker</option>
                </select>
              </div>

              {/* Alcohol */}
              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1.5 uppercase tracking-wider">
                  Alcohol Intake
                </label>
                <select
                  name="alco"
                  value={formData.alco}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E0E8F0] text-sm text-[#172B3A] bg-[#F5F8FC]/50 focus:bg-white focus:outline-none focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20 transition-all duration-200 cursor-pointer"
                >
                  <option value="" disabled>Select Status</option>
                  <option value="no">None / Occasional</option>
                  <option value="yes">Regular Intake</option>
                </select>
              </div>

              {/* Physical Activity */}
              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1.5 uppercase tracking-wider">
                  Physical Activity
                </label>
                <select
                  name="active"
                  value={formData.active}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E0E8F0] text-sm text-[#172B3A] bg-[#F5F8FC]/50 focus:bg-white focus:outline-none focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20 transition-all duration-200 cursor-pointer"
                >
                  <option value="" disabled>Select Activity</option>
                  <option value="active">Active (&ge; 150 min/wk)</option>
                  <option value="inactive">Sedentary / Inactive</option>
                </select>
              </div>

            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-[#E0E8F0]">
            <LoadingButton
              type="submit"
              loading={loading}
              className="w-full py-4 px-8 bg-gradient-to-r from-[#13B8A6] to-[#20D9C2] text-[#0B1F33] font-extrabold text-base rounded-2xl shadow-lg shadow-[#20D9C2]/25 hover:shadow-xl hover:shadow-[#20D9C2]/40 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              <span>Execute Calibrated Risk Stratification</span>
              <ArrowRight size={18} />
            </LoadingButton>

            <p className="text-center text-xs text-[#627487] mt-3">
              Data transmitted via TLS 1.3 encrypted channel • Output stored in patient's longitudinal audit log
            </p>
          </div>

        </form>
      </div>

    </div>
  );
}

export default Analatics;
