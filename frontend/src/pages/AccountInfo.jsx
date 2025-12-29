import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function AccountInfo() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    position: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle update
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
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-[#D9D9D9] shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200" 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#000000]">Sundar Gurung</h2>
              <p className="text-sm text-[#747474]">sundargurung360@gmail.com</p>
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
              <div className="mb-5">
                <label className="block text-sm font-medium text-[#000000] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full max-w-md h-11 px-4 rounded-lg bg-white border border-[#D3D3D3] focus:outline-none focus:border-[#A1A3AB] transition-colors text-[#000000] text-sm"
                />
              </div>

              {/* Contact Number */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-[#000000] mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full max-w-md h-11 px-4 rounded-lg bg-white border border-[#D3D3D3] focus:outline-none focus:border-[#A1A3AB] transition-colors text-[#000000] text-sm"
                />
              </div>

              {/* Position */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#000000] mb-2">
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
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
                  Update Info
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
