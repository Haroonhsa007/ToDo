import { useState, useEffect, useMemo } from 'react';
import { MdMenu, MdSearch } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';

export function Header({ onSidebarToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Check if we're on the dashboard
  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dateTime = useMemo(() => {
    const date = currentDateTime;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[date.getDay()];
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return {
      day: dayName,
      date: `${day}/${month}/${year}`,
    };
  }, [currentDateTime]);

  return (
    <header className="bg-[#F8F8F8] px-4 sm:px-6 lg:px-8 py-3 lg:py-5 sticky top-0 z-30 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.07)]">
      <div className="flex items-center justify-between gap-4">
        {/* Left - Logo/Title */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={onSidebarToggle}
            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors lg:hidden"
            aria-label="Toggle sidebar"
          >
            <MdMenu className="text-2xl" />
          </button>
          
          {isDashboard ? (
            <h1 className="text-xl sm:text-2xl lg:text-[32px] font-semibold">
              <span className="text-[#FF6767]">Dash</span>
              <span className="text-[#000000]">board</span>
            </h1>
          ) : (
            <h1 className="text-xl sm:text-2xl lg:text-[32px] font-semibold">
              <span className="text-[#FF6767]">To</span>
              <span className="text-[#000000]">-Do</span>
            </h1>
          )}
        </div>

        {/* Center - Search Bar */}
        <div className="flex-1 max-w-xl mx-4 hidden sm:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search your task here..."
              className="w-full px-4 py-2.5 pr-12 rounded-lg bg-[#F5F8FF] border-none outline-none text-xs text-[#000000] placeholder-[#A1A3AB] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.04)]"
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#FF6767] rounded-lg flex items-center justify-center hover:bg-[#E55A5A] transition-colors">
              <MdSearch className="text-white text-xl" />
            </button>
          </div>
        </div>

        {/* Right - Icons and Date */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <button
            onClick={() => navigate('/notifications')}
            className="w-9 h-9 sm:w-[34px] sm:h-[34px] bg-[#FF6767] rounded-lg flex items-center justify-center hover:bg-[#E55A5A] transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          
          {/* Calendar */}
          <button
            onClick={() => navigate('/calendar')}
            className="w-9 h-9 sm:w-[34px] sm:h-[34px] bg-[#FF6767] rounded-lg flex items-center justify-center hover:bg-[#E55A5A] transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>

          {/* Date Display - Desktop only */}
          <div className="hidden lg:flex flex-col items-end ml-2">
            <span className="text-[#000000] text-[15px] font-medium">{dateTime.day}</span>
            <span className="text-[#3ABEFF] text-sm font-medium">{dateTime.date}</span>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="mt-3 sm:hidden">
        <div className="relative">
          <input
            type="text"
            placeholder="Search your task here..."
            className="w-full px-4 py-2.5 pr-12 rounded-lg bg-[#F5F8FF] border-none outline-none text-xs text-[#000000] placeholder-[#A1A3AB] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.04)]"
          />
          <button className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#FF6767] rounded-lg flex items-center justify-center hover:bg-[#E55A5A] transition-colors">
            <MdSearch className="text-white text-xl" />
          </button>
        </div>
      </div>
    </header>
  );
}
