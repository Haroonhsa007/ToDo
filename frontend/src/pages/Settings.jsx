import { Link } from 'react-router-dom';

export function Settings() {
  return (
    <div className="w-full h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="mb-4 sm:mb-6 shrink-0">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#000000]">Settings</h1>
      </div>
      
      {/* Settings Grid */}
      <div className="flex-1 min-h-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-4xl">
          <Link
            to="/account-info"
            className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-[#D9D9D9] hover:shadow-md transition-shadow text-left block"
          >
            <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-[#000000] mb-1 sm:mb-2">Account Information</h3>
            <p className="text-[#747474] text-xs sm:text-sm">Update your profile information</p>
          </Link>
          <Link
            to="/change-password"
            className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-[#D9D9D9] hover:shadow-md transition-shadow text-left block"
          >
            <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-[#000000] mb-1 sm:mb-2">Change Password</h3>
            <p className="text-[#747474] text-xs sm:text-sm">Update your account password</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
