import { MdMenu, MdNotifications, MdSearch } from 'react-icons/md';
import { APP_NAME } from '../../constants';

export function Header({ onSidebarToggle, isSidebarCollapsed }) {
  return (
    <header 
      className={`
        fixed top-0 right-0 h-16 bg-white shadow-sm border-b border-gray-200 z-30
        transition-all duration-300 ease-in-out
        ${isSidebarCollapsed 
          ? 'left-0 lg:left-20' 
          : 'left-0 lg:left-72'
        }
      `}
    >
      <div className="h-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {/* Left Section - Menu Toggle & Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={onSidebarToggle}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors lg:hidden"
              aria-label="Toggle sidebar"
            >
              <MdMenu className="text-2xl" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
              {APP_NAME}
            </h1>
          </div>

          {/* Right Section - Search & Notifications */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
              <MdSearch className="text-xl text-gray-600" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-500 w-32 lg:w-48"
              />
            </div>

            {/* Notifications */}
            <button
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors relative"
              aria-label="Notifications"
            >
              <MdNotifications className="text-2xl" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Avatar */}
            <div className="w-10 h-10 rounded-full bg-sidebar flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
              <span className="text-white text-sm font-bold">SG</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
