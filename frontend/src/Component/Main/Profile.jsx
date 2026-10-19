import React, { useState, useEffect } from "react";
import { User, Shield, Edit2, Lock, ShieldCheck, Mail, Phone, Calendar, CheckCircle2, KeyRound, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/apiService";
import { LoadingButton, PageLoading } from "../../components/Loading";
import { Alert } from "../../components/Alert";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('contact');
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [editData, setEditData] = useState({ name: '', phoneNumber: '', gender: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || '',
        phoneNumber: user.phoneNumber || '',
        gender: user.gender || '',
      });
    }
  }, [user]);

  const getUserInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    return 'D';
  };

  const handleOpenEdit = () => {
    setEditData({
      name: user?.name || '',
      phoneNumber: user?.phoneNumber || '',
      gender: user?.gender || '',
    });
    setSaveMessage('');
    setOpenEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    setSaveMessage('');
    try {
      const response = await authService.updateProfile(editData);
      if (response.success) {
        updateUser(response.user);
        setMessageType('success');
        setSaveMessage('Clinical profile updated successfully!');
        setTimeout(() => { setOpenEditModal(false); setSaveMessage(''); }, 1400);
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setMessageType('error');
      setSaveMessage(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessageType('error');
      setSaveMessage('Entered passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessageType('error');
      setSaveMessage('Password must be at least 8 characters');
      return;
    }

    setPasswordLoading(true);
    setSaveMessage('');
    try {
      const response = await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      if (response.success) {
        setMessageType('success');
        setSaveMessage('Password credentials changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => { setOpenPasswordModal(false); setSaveMessage(''); }, 1400);
      }
    } catch (err) {
      console.error('Password change error:', err);
      setMessageType('error');
      setSaveMessage(err.response?.data?.message || err.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const tabs = [
    { id: 'contact', label: 'Clinical Profile', icon: User },
    { id: 'security', label: 'Security & Auth', icon: Shield },
  ];

  if (!user) {
    return <PageLoading message="Loading practitioner profile..." />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-[#0B1F33] via-[#0E2A44] to-[#123B5D] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#13B8A6]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#13B8A6] to-[#20D9C2] text-[#0B1F33] flex items-center justify-center text-3xl font-extrabold shadow-lg shadow-[#20D9C2]/20 font-display">
              {getUserInitial()}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-bold font-display text-white">
                  {user?.name || 'Dr. Practitioner'}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#20D9C2]/20 text-[#20D9C2] border border-[#20D9C2]/30 uppercase">
                  {user?.role || 'Clinician'}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">{user?.email}</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/10 text-[11px] text-slate-200">
                <ShieldCheck size={13} className="text-[#20D9C2]" />
                <span>Cardiovascular Risk Screening • Staff Attending</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleOpenEdit}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-[#13B8A6] to-[#20D9C2] text-[#0B1F33] rounded-xl font-bold text-xs shadow-md shadow-[#20D9C2]/20 hover:shadow-lg transition-all"
          >
            <Edit2 size={14} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Container */}
      <div className="bg-white rounded-3xl border border-[#E0E8F0] shadow-sm overflow-hidden">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E0E8F0] px-6 pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-4 font-semibold text-xs border-b-2 transition-all relative ${
                  isActive 
                    ? 'border-[#13B8A6] text-[#13B8A6]' 
                    : 'border-transparent text-[#627487] hover:text-[#0B1F33]'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8 min-h-[350px]">
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-[#0B1F33] uppercase tracking-wider mb-1">
                  Practitioner Credentials
                </h3>
                <p className="text-xs text-[#627487]">
                  Information on record for this authenticated clinical terminal.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#F5F8FC] border border-[#E0E8F0]">
                  <span className="text-[10px] text-[#627487] uppercase font-bold block mb-1">Full Clinical Name</span>
                  <span className="text-sm font-bold text-[#0B1F33]">{user?.name || 'N/A'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5F8FC] border border-[#E0E8F0]">
                  <span className="text-[10px] text-[#627487] uppercase font-bold block mb-1">Email Identifier</span>
                  <span className="text-sm font-bold font-mono text-[#0B1F33]">{user?.email || 'N/A'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5F8FC] border border-[#E0E8F0]">
                  <span className="text-[10px] text-[#627487] uppercase font-bold block mb-1">Contact Phone</span>
                  <span className="text-sm font-bold text-[#0B1F33]">{user?.phoneNumber || 'Not provided'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5F8FC] border border-[#E0E8F0]">
                  <span className="text-[10px] text-[#627487] uppercase font-bold block mb-1">Gender</span>
                  <span className="text-sm font-bold text-[#0B1F33]">
                    {user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not specified'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5F8FC] border border-[#E0E8F0]">
                  <span className="text-[10px] text-[#627487] uppercase font-bold block mb-1">Verification Status</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    user?.isEmailVerified 
                      ? 'bg-teal-50 text-[#16866A] border border-teal-200' 
                      : 'bg-amber-50 text-[#D49A27] border border-amber-200'
                  }`}>
                    {user?.isEmailVerified ? '✓ Verified Practitioner' : 'Verification Pending'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5F8FC] border border-[#E0E8F0]">
                  <span className="text-[10px] text-[#627487] uppercase font-bold block mb-1">Active Since</span>
                  <span className="text-sm font-bold text-[#0B1F33]">{formatDate(user?.createdAt)}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-[#0B1F33] uppercase tracking-wider mb-1">
                  Access & Cryptographic Security
                </h3>
                <p className="text-xs text-[#627487]">
                  Manage password authentication and session access credentials.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F5F8FC] border border-[#E0E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#13B8A6]">
                    <Lock size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0B1F33]">Password Credentials</h4>
                    <p className="text-[11px] text-[#627487]">Regular credential rotation protects sensitive patient data</p>
                  </div>
                </div>

                <button
                  onClick={() => setOpenPasswordModal(true)}
                  className="px-4 py-2 bg-[#0B1F33] hover:bg-[#123B5D] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Change Password
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Edit Profile Modal */}
      {openEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#E0E8F0] p-6 sm:p-8 relative">
            <button
              onClick={() => setOpenEditModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold font-display text-[#0B1F33] mb-4">
              Update Practitioner Profile
            </h3>

            {saveMessage && (
              <Alert 
                type={messageType} 
                message={saveMessage} 
                onClose={() => setSaveMessage('')}
                className="mb-4"
              />
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#172B3A] mb-1 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  className="w-full px-3.5 py-2.5 border border-[#E0E8F0] rounded-xl text-xs text-[#172B3A] focus:border-[#13B8A6] focus:outline-none"
                  placeholder="Dr. Full Name"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#172B3A] mb-1 uppercase tracking-wider">Email (Locked)</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full px-3.5 py-2.5 border border-[#E0E8F0] rounded-xl text-xs text-slate-400 bg-slate-50 cursor-not-allowed font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#172B3A] mb-1 uppercase tracking-wider">Contact Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={editData.phoneNumber}
                  onChange={handleEditChange}
                  className="w-full px-3.5 py-2.5 border border-[#E0E8F0] rounded-xl text-xs text-[#172B3A] focus:border-[#13B8A6] focus:outline-none"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#172B3A] mb-1 uppercase tracking-wider">Gender</label>
                <select
                  name="gender"
                  value={editData.gender}
                  onChange={handleEditChange}
                  className="w-full px-3.5 py-2.5 border border-[#E0E8F0] rounded-xl text-xs text-[#172B3A] focus:border-[#13B8A6] focus:outline-none bg-white cursor-pointer"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#E0E8F0]">
              <button
                onClick={() => setOpenEditModal(false)}
                className="px-4 py-2 border border-[#E0E8F0] rounded-xl text-xs font-semibold text-[#627487] hover:bg-slate-50"
              >
                Cancel
              </button>
              <LoadingButton
                onClick={handleSaveProfile}
                loading={saveLoading}
                className="px-5 py-2 bg-gradient-to-r from-[#13B8A6] to-[#20D9C2] text-[#0B1F33] rounded-xl font-bold text-xs shadow-md"
              >
                Save Details
              </LoadingButton>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {openPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#E0E8F0] p-6 sm:p-8 relative">
            <button
              onClick={() => {
                setOpenPasswordModal(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setSaveMessage('');
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold font-display text-[#0B1F33] mb-4">
              Update Security Password
            </h3>

            {saveMessage && (
              <Alert 
                type={messageType} 
                message={saveMessage} 
                onClose={() => setSaveMessage('')}
                className="mb-4"
              />
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#172B3A] mb-1 uppercase tracking-wider">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3.5 py-2.5 border border-[#E0E8F0] rounded-xl text-xs text-[#172B3A] focus:border-[#13B8A6] focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#172B3A] mb-1 uppercase tracking-wider">New Password (8+ characters)</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3.5 py-2.5 border border-[#E0E8F0] rounded-xl text-xs text-[#172B3A] focus:border-[#13B8A6] focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#172B3A] mb-1 uppercase tracking-wider">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3.5 py-2.5 border border-[#E0E8F0] rounded-xl text-xs text-[#172B3A] focus:border-[#13B8A6] focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#E0E8F0]">
              <button
                onClick={() => {
                  setOpenPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setSaveMessage('');
                }}
                className="px-4 py-2 border border-[#E0E8F0] rounded-xl text-xs font-semibold text-[#627487] hover:bg-slate-50"
              >
                Cancel
              </button>
              <LoadingButton
                onClick={handleChangePassword}
                loading={passwordLoading}
                className="px-5 py-2 bg-gradient-to-r from-[#13B8A6] to-[#20D9C2] text-[#0B1F33] rounded-xl font-bold text-xs shadow-md"
              >
                Save New Password
              </LoadingButton>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
