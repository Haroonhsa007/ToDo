import { MdMenu, MdNotifications, MdSearch, MdCalendarToday, MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export function Header({ onSidebarToggle }) {
  const navigate = useNavigate();

  return (
    // <header className="bg-[#F8F8F8] px-8 py-4 sticky top-0 z-10">
    <header className="bg-red-500 px-8 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* Left - App Title */}
        <div className="shrink-0 mr-6 flex items-center gap-2">
          <button
            onClick={onSidebarToggle}
            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors lg:hidden"
            aria-label="Toggle sidebar"
          >
            <MdMenu className="text-2xl" />
          </button>
          <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        </div>

        {/* Center - Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search your task here..."
              className="w-full px-5 py-3 pr-12 rounded-lg bg-neutral-bg border border-neutral-border focus:outline-none focus:border-primary transition-colors text-neutral-text placeholder-neutral-text-muted"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition-colors">
              <MdSearch size={20} />
            </button>
          </div>
        </div>

        {/* Right Section - Icons and Date */}
        <div className="flex items-center gap-3 ml-6">
          <button className="p-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">
            <MdSearch size={20} />
          </button>
          <button
            onClick={() => navigate('/notifications')}
            className="p-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
          >
            <MdNotifications size={20} />
          </button>
          <button
            onClick={() => navigate('/calendar')}
            className="p-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
          >
            <MdCalendarToday size={20} />
          </button>
          <p className="text-neutral-text ml-2 text-sm font-medium">Tuesday 20/06/2023</p>
        </div>
      </div>


    </header>
  );
}
