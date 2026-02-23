import React, { useState } from "react";
import { Settings } from "lucide-react";

const Profile = () => {
  const [openModal, setOpenModal] = useState(false);
  const [step, setStep] = useState(1);
  return (
    <>
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
        {/* FULL WIDTH WRAPPER */}
        <div className="w-full px-8 lg:px-16 py-10">
          {/* MAIN CARD */}
          <div className="w-full bg-white rounded-3xl shadow-2xl p-12">
            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 border-b border-slate-200 pb-10 mb-10">
              <div className="flex items-center gap-6">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#0a3d62] to-[#3c6382] text-white flex items-center justify-center text-4xl font-bold shadow-lg">
                  R
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-[#0a3d62]">
                    Dr. Rishabh Malviya
                  </h2>
                  <p className="text-slate-600 mt-2 text-lg">
                    Senior Interventional Cardiologist
                  </p>

                  <span className="inline-block mt-4 bg-blue-50 text-[#0a3d62] px-5 py-1.5 rounded-full text-sm font-medium shadow-sm">
                    Cardiology | Preventive Heart Care | AI Cardiac Analytics
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition shadow-sm">
                  <Settings size={20} className="text-[#0a3d62]" />
                </button>

                <button
                  onClick={() => {
                    setOpenModal(true);
                    setStep(1);
                  }}
                  className="bg-[#ff6b4a] hover:bg-[#e85c3d] transition text-white px-7 py-3 rounded-xl font-medium shadow-lg"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* SUB NAV */}
            <div className="flex gap-8 border-b border-slate-200 pb-6 mb-10 text-sm font-medium">
              <button className="text-[#0a3d62] border-b-2 border-[#ff6b4a] pb-2">
                Contact Info
              </button>
              <button className="text-slate-500 hover:text-[#0a3d62] transition">
                Professional Info
              </button>
              <button className="text-slate-500 hover:text-[#0a3d62] transition">
                Certifications
              </button>
              <button className="text-slate-500 hover:text-[#0a3d62] transition">
                Security
              </button>
            </div>

            {/* CONTENT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10">
              <Info
                label="Medical Registration No"
                value="MCI-DEL-2016-45872"
              />
              <Info label="Qualification" value="MBBS, MD (Cardiology)" />
              <Info label="Experience" value="8+ Years Clinical Practice" />
              <Info label="Specialization" value="Interventional Cardiology" />
              <Info
                label="Current Hospital"
                value="CardioCare Multispeciality Hospital"
              />
              <Info label="Department" value="Advanced Cardiac Sciences" />

              <div className="md:col-span-2">
                <Info
                  label="Research & Clinical Focus"
                  value="AI-Based Early Cardiac Risk Detection, Preventive Cardiology, ECG Analytics & Predictive Monitoring"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {openModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-10 relative">
            {/* CLOSE */}
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-5 right-6 text-gray-400 hover:text-black text-xl"
            >
              ✕
            </button>

            {/* STEP INDICATOR */}
            <div className="flex items-center justify-center gap-6 mb-10">
              <div
                className={`px-4 py-1 rounded-full text-sm font-medium ${step === 1 ? "bg-[#0a3d62] text-white" : "bg-gray-200 text-gray-600"}`}
              >
                Step 1: Contact
              </div>
              <div
                className={`px-4 py-1 rounded-full text-sm font-medium ${step === 2 ? "bg-[#0a3d62] text-white" : "bg-gray-200 text-gray-600"}`}
              >
                Step 2: Professional
              </div>
            </div>

            {/* STEP 1 CONTENT */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-semibold text-[#0a3d62] mb-6">
                  Contact Details
                </h2>

                <div className="space-y-5">
                  <Input label="Full Name" defaultValue="Dr. Rishabh Malviya" />
                  <Input label="Email" defaultValue="rishabh@email.com" />
                  <Input label="Phone Number" defaultValue="+91 9876543210" />
                  <Input
                    label="Clinic Address"
                    defaultValue="Bhopal, Madhya Pradesh"
                  />
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => setStep(2)}
                    className="bg-[#0a3d62] text-white px-6 py-2 rounded-xl hover:bg-[#08304d]"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 CONTENT */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-semibold text-[#0a3d62] mb-6">
                  Professional Information
                </h2>

                <div className="space-y-5">
                  <Input
                    label="Qualification"
                    defaultValue="MBBS, MD (Cardiology)"
                  />
                  <Input
                    label="Experience"
                    defaultValue="8+ Years Clinical Practice"
                  />
                  <Input
                    label="Specialization"
                    defaultValue="Interventional Cardiology"
                  />
                  <Input
                    label="Hospital"
                    defaultValue="CardioCare Multispeciality Hospital"
                  />
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="bg-gray-200 px-6 py-2 rounded-xl hover:bg-gray-300"
                  >
                    ← Back
                  </button>

                  <button
                    onClick={() => setOpenModal(false)}
                    className="bg-[#ff6b4a] text-white px-6 py-2 rounded-xl hover:bg-[#e85c3d]"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-slate-500 mb-2">{label}</p>
    <p className="text-base font-semibold text-[#0a3d62]">{value}</p>
  </div>
);
const Input = ({ label, name, value, onChange }) => (
  <div>
    <label className="text-sm text-slate-500">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a3d62]"
    />
  </div>
);
export default Profile;
