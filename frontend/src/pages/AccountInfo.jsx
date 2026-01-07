import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAPI } from '../hooks/useAPI';
import { useAuth } from '../contexts/AuthContext';

export function AccountInfo() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { loading, execute } = useAPI();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
      });
      // Set existing profile picture preview
      if (user.profile_picture_url) {
        setProfilePicturePreview(user.profile_picture_url);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setProfilePicture(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const userData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
    };

    // Add profile picture if selected
    if (profilePicture) {
      userData.profile_picture = profilePicture;
    }

    try {
      const updated = await execute(() => userAPI.updateProfile(userData), 'Profile updated successfully!');
      if (updated) {
        updateUser(updated); // Update auth context
        // Update form with latest data
        setFormData({
          firstName: updated.first_name || '',
          lastName: updated.last_name || '',
          email: updated.email || '',
        });
        // Update profile picture preview
        if (updated.profile_picture_url) {
          setProfilePicturePreview(updated.profile_picture_url);
        }
        // Clear selected file
        setProfilePicture(null);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Main Container */}
      <div className="bg-white rounded-xl lg:rounded-2xl border border-[#D3D3D3] p-4 sm:p-6 lg:p-8 flex-1 flex flex-col min-h-0 relative">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#000000] border-b-2 border-[#FF6767] pb-1">
            Account Information
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
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-[#D9D9D9] shrink-0 flex items-center justify-center">
                {profilePicturePreview ? (
                  <img
                    src={profilePicturePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-white">
                    {user?.name ? user.name.charAt(0).toUpperCase() : user?.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <label
                htmlFor="profile-picture-input"
                className="absolute bottom-0 right-0 w-6 h-6 bg-[#FF6767] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#F24E1E] transition-colors"
                title="Change profile picture"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
              <input
                id="profile-picture-input"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#000000]">
                {user?.name || user?.username || 'User'}
              </h2>
              <p className="text-sm text-[#747474]">{user?.email || ''}</p>
              {profilePicture && (
                <p className="text-xs text-[#FF6767] mt-1">New photo selected</p>
              )}
            </div>
          </div>

          {/* Form Container */}
          <form onSubmit={handleSubmit}>
            <div className="border border-[#D3D3D3] rounded-xl p-4 sm:p-6 max-w-2xl">
              {/* First Name */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-[#000000] mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full max-w-md h-11 px-4 rounded-lg bg-white border border-[#D3D3D3] focus:outline-none focus:border-[#A1A3AB] transition-colors text-[#000000] text-sm"
                />
              </div>

              {/* Last Name */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-[#000000] mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full max-w-md h-11 px-4 rounded-lg bg-white border border-[#D3D3D3] focus:outline-none focus:border-[#A1A3AB] transition-colors text-[#000000] text-sm"
                />
              </div>

              {/* Email Address */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#000000] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full max-w-md h-11 px-4 rounded-lg bg-white border border-[#D3D3D3] focus:outline-none focus:border-[#A1A3AB] transition-colors text-[#000000] text-sm"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#FF6767] hover:bg-[#F24E1E] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Info'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/change-password')}
                  className="px-6 py-2.5 bg-[#FF6767] hover:bg-[#F24E1E] text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Change Password
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
