import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAPI } from '../hooks/useAPI';
import { useAuth } from '../contexts/AuthContext';

export function ChangePassword() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading, execute } = useAPI();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    const passwordData = {
      oldPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    };

    await execute(() => userAPI.changePassword(passwordData), 'Password changed successfully!');

    // Clear form
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    navigate(-1);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Main Container */}
      <div className="bg-white rounded-xl lg:rounded-2xl border border-[#D3D3D3] p-4 sm:p-6 lg:p-8 flex-1 flex flex-col min-h-0 relative">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#000000] border-b-2 border-[#FF6767] pb-1">
            Change Password
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="text-[#000000] hover:text-[#747474] transition-colors text-sm font-medium underline"
          >
            Go Back
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* User Profile Section */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-[#D9D9D9] shrink-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user?.name ? user.name.charAt(0).toUpperCase() : user?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#000000]">
                {user?.name || user?.username || 'User'}
              </h2>
              <p className="text-sm text-[#747474]">{user?.email || ''}</p>
            </div>
          </div>

          {/* Form Container */}
          <form onSubmit={handleSubmit}>
            <div className="border border-[#D3D3D3] rounded-xl p-4 sm:p-6 max-w-2xl">
              {/* Current Password */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-[#000000] mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full max-w-md h-11 px-4 rounded-lg bg-white border border-[#D3D3D3] focus:outline-none focus:border-[#A1A3AB] transition-colors text-[#000000] text-sm"
                />
              </div>

              {/* New Password */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-[#000000] mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full max-w-md h-11 px-4 rounded-lg bg-white border border-[#D3D3D3] focus:outline-none focus:border-[#A1A3AB] transition-colors text-[#000000] text-sm"
                />
              </div>

              {/* Confirm Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#000000] mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full max-w-md h-11 px-4 rounded-lg bg-white border border-[#D3D3D3] focus:outline-none focus:border-[#A1A3AB] transition-colors text-[#000000] text-sm"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#FF6767] hover:bg-[#F24E1E] text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-2.5 bg-[#FF6767] hover:bg-[#F24E1E] text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
