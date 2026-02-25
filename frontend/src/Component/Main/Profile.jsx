import React, { useState, useEffect } from "react";
import { User, Shield, Edit2, Lock } from "lucide-react";
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
    return 'U';
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
        setSaveMessage('Profile updated successfully!');
        setTimeout(() => { setOpenEditModal(false); setSaveMessage(''); }, 1500);
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
      setSaveMessage('Passwords do not match');
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
        setSaveMessage('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => { setOpenPasswordModal(false); setSaveMessage(''); }, 1500);
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
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const tabs = [
    { id: 'contact', label: 'Contact Info', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  if (!user) {
    return <PageLoading message="Loading profile..." />;
  }

  return (
    <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* MAIN CARD */}
        <div className="w-full bg-white rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 lg:p-12">
          {/* HEADER */}
          <div className="flex flex-col gap-6 md:gap-8 border-b border-gray-200 pb-6 md:pb-8 mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#2c5f7c] to-[#3d7a99] text-white flex items-center justify-center text-2xl md:text-3xl font-bold shadow-lg">
                {getUserInitial()}
              </div>

              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {user?.name || 'Doctor'}
                </h2>
                <p className="text-gray-600 mt-1 text-base md:text-lg break-all">
                  {user?.email || ''}
                </p>
                <span className="inline-block mt-3 bg-blue-50 text-blue-700 px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium">
                  Cardiology • Preventive Care • AI Analytics
                </span>
              </div>
            </div>

            <div className="flex justify-center sm:justify-start">
              <button 
                onClick={handleOpenEdit}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold shadow-lg transition-all text-sm md:text-base"
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* TABS */}
          <div className="flex gap-2 border-b border-gray-200 mb-6 md:mb-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 font-medium transition-all whitespace-nowrap text-sm md:text-base ${
                    activeTab === tab.id
                      ? 'text-cyan-600 border-b-2 border-cyan-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT */}
          <div className="min-h-[400px]">
            {/* Contact Info Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
                  <InfoField label="Full Name" value={user?.name || 'N/A'} />
                  <InfoField label="Email Address" value={user?.email || 'N/A'} />
                
                  <InfoField 
                    label="Gender" 
                    value={user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not set'} 
                  />
                  <InfoField 
                    label="Account Status" 
                    value={
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user?.isEmailVerified 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {user?.isEmailVerified ? '✓ Verified' : 'Not Verified'}
                      </span>
                    } 
                  />
                  <InfoField label="Member Since" value={formatDate(user?.createdAt)} />
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Security Settings</h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <Shield className="text-blue-600 mt-1" size={24} />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Account Security</h4>
                      <p className="text-blue-700 text-sm">
                        Keep your account secure by using a strong password.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:shadow-md transition">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Lock className="text-white" size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Password</h4>
                      <p className="text-sm text-gray-600">Change your account password</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setOpenPasswordModal(true)}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {openEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 relative">
            <button
              onClick={() => setOpenEditModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>

            {saveMessage && (
              <Alert 
                type={messageType} 
                message={saveMessage} 
                onClose={() => setSaveMessage('')}
                className="mb-6"
              />
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

            

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={editData.gender}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setOpenEditModal(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition"
              >
                Cancel
              </button>
              <LoadingButton
                onClick={handleSaveProfile}
                loading={saveLoading}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-lg font-medium transition"
              >
                Save Changes
              </LoadingButton>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {openPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative">
            <button
              onClick={() => {
                setOpenPasswordModal(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setSaveMessage('');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Lock className="text-white" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
            </div>

            {saveMessage && (
              <Alert 
                type={messageType} 
                message={saveMessage} 
                onClose={() => setSaveMessage('')}
                className="mb-6"
              />
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter new password"
                />
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => {
                  setOpenPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setSaveMessage('');
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition"
              >
                Cancel
              </button>
              <LoadingButton
                onClick={handleChangePassword}
                loading={passwordLoading}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium transition"
              >
                Change Password
              </LoadingButton>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};


// Helper Components
const InfoField = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500 mb-2 font-medium">{label}</p>
    <p className="text-base font-semibold text-gray-800">{value}</p>
  </div>
);

export default Profile;

