import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  UserPlus, 
  IdCard, 
  Phone, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Activity,
  ShieldCheck
} from "lucide-react";

function Registration({ setselectedtab }) {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    age: "",
    address: "",
  });

  const [patientId, setPatientId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [showProceedButton, setShowProceedButton] = useState(false);

  const generatePatientID = () => {
    const year = new Date().getFullYear();
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `PT-${year}-${randomNumber}`;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";

    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required";

    if (!formData.contact.trim())
      newErrors.contact = "Contact number is required";

    if (!formData.age.trim())
      newErrors.age = "Age is required";
    else if (Number(formData.age) < 1)
      newErrors.age = "Age must be at least 1";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const newID = generatePatientID();
    setPatientId(newID);

    const patientInfo = {
      patientId: newID,
      firstName: formData.firstName,
      lastName: formData.lastName,
      fullName: `${formData.firstName} ${formData.lastName}`,
      contact: formData.contact,
      age: formData.age,
      address: formData.address,
      registeredAt: new Date().toISOString(),
      registeredBy: JSON.parse(localStorage.getItem('user') || '{}')._id || 'Unknown'
    };

    localStorage.setItem('currentPatient', JSON.stringify(patientInfo));

    const existingPatients = JSON.parse(localStorage.getItem('registeredPatients') || '[]');
    existingPatients.push(patientInfo);
    localStorage.setItem('registeredPatients', JSON.stringify(existingPatients));

    setSuccessMessage(
      `Patient intake registered successfully.\nAssigned Master ID: ${newID}`
    );

    setShowProceedButton(true);

    setFormData({
      firstName: "",
      lastName: "",
      contact: "",
      age: "",
      address: "",
    });

    setTimeout(() => {
      setSuccessMessage("");
      setShowProceedButton(false);
    }, 15000);
  };

  const handleProceedToAnalysis = () => {
    if (setselectedtab) {
      setselectedtab('analysis');
    } else {
      navigate('/home?tab=analysis');
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
              <UserPlus size={14} />
              <span>Clinical Registry Intake</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
              Patient Registration & Intake
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Establish a new clinical profile. Upon submission, a unique Master Patient Index (MPI) token is generated for longitudinal tracking.
            </p>
          </div>

          <div className="hidden lg:flex flex-col items-end text-xs text-slate-300 space-y-1">
            <span className="font-semibold text-white">Auto MPI Tokenization</span>
            <span>Pre-fills Heart Analysis</span>
            <span className="text-[#20D9C2] font-mono">HIPAA Compliant</span>
          </div>
        </div>
      </div>

      {/* Main Registration Form Card */}
      <div className="bg-white rounded-3xl border border-[#E0E8F0] shadow-md p-6 sm:p-10 space-y-8">
        
        <div className="flex items-center justify-between pb-4 border-b border-[#E0E8F0]">
          <div>
            <h2 className="text-lg font-bold text-[#0B1F33] font-display">
              Patient Demographic Details
            </h2>
            <p className="text-xs text-[#627487]">
              Fields marked with an asterisk (<span className="text-rose-500">*</span>) are mandatory
            </p>
          </div>

          {patientId && (
            <div className="px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-[#16866A] font-bold font-mono">
              Active ID: {patientId}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-xs font-semibold text-[#172B3A] mb-1.5 uppercase tracking-wider">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                placeholder="e.g. John"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#172B3A] placeholder-slate-400 bg-[#F5F8FC]/50 focus:bg-white focus:outline-none transition-all duration-200 ${
                  errors.firstName 
                    ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20" 
                    : "border-[#E0E8F0] focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20"
                }`}
              />
              {errors.firstName && (
                <p className="text-rose-600 text-xs mt-1 font-medium">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-xs font-semibold text-[#172B3A] mb-1.5 uppercase tracking-wider">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                placeholder="e.g. Doe"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#172B3A] placeholder-slate-400 bg-[#F5F8FC]/50 focus:bg-white focus:outline-none transition-all duration-200 ${
                  errors.lastName 
                    ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20" 
                    : "border-[#E0E8F0] focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20"
                }`}
              />
              {errors.lastName && (
                <p className="text-rose-600 text-xs mt-1 font-medium">{errors.lastName}</p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label htmlFor="contact" className="block text-xs font-semibold text-[#172B3A] mb-1.5 uppercase tracking-wider">
                Contact Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative group">
                <Phone size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#13B8A6]" />
                <input
                  type="tel"
                  id="contact"
                  placeholder="+1 (555) 019-2834"
                  value={formData.contact}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-[#172B3A] placeholder-slate-400 bg-[#F5F8FC]/50 focus:bg-white focus:outline-none transition-all duration-200 ${
                    errors.contact 
                      ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20" 
                      : "border-[#E0E8F0] focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20"
                  }`}
                />
              </div>
              {errors.contact && (
                <p className="text-rose-600 text-xs mt-1 font-medium">{errors.contact}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label htmlFor="age" className="block text-xs font-semibold text-[#172B3A] mb-1.5 uppercase tracking-wider">
                Age (Years) <span className="text-rose-500">*</span>
              </label>
              <div className="relative group">
                <Calendar size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#13B8A6]" />
                <input
                  type="number"
                  id="age"
                  min="1"
                  max="125"
                  placeholder="e.g. 54"
                  value={formData.age}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-[#172B3A] placeholder-slate-400 bg-[#F5F8FC]/50 focus:bg-white focus:outline-none transition-all duration-200 ${
                    errors.age 
                      ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20" 
                      : "border-[#E0E8F0] focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20"
                  }`}
                />
              </div>
              {errors.age && (
                <p className="text-rose-600 text-xs mt-1 font-medium">{errors.age}</p>
              )}
            </div>

            {/* Residential / Clinic Address */}
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-xs font-semibold text-[#172B3A] mb-1.5 uppercase tracking-wider">
                Residential Address / Clinic Location
              </label>
              <div className="relative group">
                <MapPin size={17} className="absolute left-3.5 top-3 text-slate-400 group-focus-within:text-[#13B8A6]" />
                <textarea
                  id="address"
                  rows={2}
                  placeholder="Street Address, City, State/Province, ZIP"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E0E8F0] text-sm text-[#172B3A] placeholder-slate-400 bg-[#F5F8FC]/50 focus:bg-white focus:outline-none focus:border-[#13B8A6] focus:ring-2 focus:ring-[#20D9C2]/20 transition-all duration-200"
                />
              </div>
            </div>

          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-[#E0E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#627487]">
              Submitting registers patient into current session cache & local registry.
            </span>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#13B8A6] to-[#20D9C2] text-[#0B1F33] rounded-xl font-bold text-sm shadow-md shadow-[#20D9C2]/25 hover:shadow-lg hover:shadow-[#20D9C2]/40 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <UserPlus size={16} />
              <span>Complete Patient Intake</span>
            </button>
          </div>

          {/* Success Banner & Proceed Button */}
          {successMessage && (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#16866A] space-y-4 animate-fadeIn">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
                <div className="text-sm font-semibold whitespace-pre-line leading-relaxed">
                  {successMessage}
                </div>
              </div>

              {showProceedButton && (
                <div className="pt-2 flex justify-start">
                  <button
                    type="button"
                    onClick={handleProceedToAnalysis}
                    className="px-6 py-2.5 bg-[#0B1F33] hover:bg-[#123B5D] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Proceed to Heart Analysis with this Patient</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

        </form>

      </div>

    </div>
  );
}

export default Registration;
