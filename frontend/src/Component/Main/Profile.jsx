import React, { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import api from "../../utils/api";

const Profile = () => {
  const [openModal, setOpenModal] = useState(false);
  const [step, setStep] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [editData, setEditData] = useState({ name: '', phoneNumber: '', gender: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try { setUser(JSON.parse(storedUser)); } catch {}
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const getUserInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    return 'U';
  };

  const handleOpenEdit = () => {
    setEditData({
      name: user?.name || '',
      phoneNumber: user?.phoneNumber || '',
      gender: user?.gender || '',
    });
    setSaveMessage('');
    setOpenModal(true);
    setStep(1);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    setSaveMessage('');
    try {
      const response = await api.put('/auth/profile', editData);
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setSaveMessage('Profile updated successfully!');
        setTimeout(() => { setOpenModal(false); setSaveMessage(''); }, 1500);
      }
    } catch (err) {
      setSaveMessage(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <p className="text-slate-500 text-lg">Loading profile...</p>
      </div>
    );
  }

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
                  {getUserInitial()}
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-[#0a3d62]">
                    {user?.name || 'Doctor'}
                  </h2>
                  <p className="text-slate-600 mt-2 text-lg">
                    {user?.email || ''}
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
                  onClick={handleOpenEdit}
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
                label="Full Name"
                value={user?.name || 'N/A'}
              />
              <Info label="Email" value={user?.email || 'N/A'} />
              <Info label="Gender" value={user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not set'} />
              <Info label="Phone Number" value={user?.phoneNumber || 'Not set'} />
              <Info
                label="Account Status"
                value={user?.isEmailVerified ? 'Verified' : 'Not Verified'}
              />
              <Info label="Member Since" value={formatDate(user?.createdAt)} />

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
                Step 1: Personal
              </div>
              <div
                className={`px-4 py-1 rounded-full text-sm font-medium ${step === 2 ? "bg-[#0a3d62] text-white" : "bg-gray-200 text-gray-600"}`}
              >
                Step 2: Additional
              </div>
            </div>

            {saveMessage && (
              <div className={`mb-6 p-3 rounded-xl text-sm text-center ${saveMessage.includes('success') ? 'bg-green-50 border border-green-300 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                {saveMessage}
              </div>
            )}

            {/* STEP 1 CONTENT */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-semibold text-[#0a3d62] mb-6">
                  Personal Details
                </h2>

                <div className="space-y-5">
                  <Input label="Full Name" name="name" value={editData.name} onChange={handleEditChange} />
                  <div>
                    <label className="text-sm text-slate-500">Email</label>
                    <input
                      type="text"
                      value={user?.email || ''}
                      readOnly
                      className="w-full mt-2 p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <Input label="Phone Number" name="phoneNumber" value={editData.phoneNumber} onChange={handleEditChange} />
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
                  Additional Information
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="text-sm text-slate-500">Gender</label>
                    <select
                      name="gender"
                      value={editData.gender}
                      onChange={handleEditChange}
                      className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a3d62] bg-white"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="bg-gray-200 px-6 py-2 rounded-xl hover:bg-gray-300"
                  >
                    ← Back
                  </button>

                  <button
                    onClick={handleSaveProfile}
                    disabled={saveLoading}
                    className="bg-[#ff6b4a] text-white px-6 py-2 rounded-xl hover:bg-[#e85c3d] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saveLoading ? 'Saving...' : 'Save Changes'}
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
