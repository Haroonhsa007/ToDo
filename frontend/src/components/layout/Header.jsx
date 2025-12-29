import { useState, useEffect, useMemo } from 'react';
import { MdMenu, MdSearch, MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export function Header({ onSidebarToggle }) {
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  const dateTime = useMemo(() => {
    const date = currentDateTime;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[date.getDay()];
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    // 12-hour format
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return {
      day: dayName,
      date: `${day}/${month}/${year}`,
      time: `${hours}:${minutes}:${seconds} ${ampm}`
    };
  }, [currentDateTime]);

  return (
    <header className="bg-[#F8F8F8] px-4 sm:px-6 lg:px-8 py-3 lg:py-4 sticky top-0 z-30 border-b border-gray-200/50">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-0">
        {/* Top Row - Mobile: Title and Menu */}
        <div className="w-full lg:w-auto flex items-center justify-between lg:justify-start">
          {/* Left - App Title */}
          <div className="shrink-0 flex items-center gap-2 lg:mr-6">
            <button
              onClick={onSidebarToggle}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors lg:hidden"
              aria-label="Toggle sidebar"
            >
              <MdMenu className="text-2xl" />
            </button>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              <span className="text-[#ff6161]">
                Dash
              </span>
              <span className="text-black ml-1">
                board
              </span>
            </h1>
          </div>

          {/* Right Section - Icons and Date (Mobile) */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => navigate('/notifications')}
              className="transition-opacity hover:opacity-80 p-1"
            >
              <img 
                src="/site_svgs/nav-bar/Notifications.svg" 
                alt="Notifications" 
                className="w-6 h-6"
              />
            </button>
            <button
              onClick={() => navigate('/calendar')}
              className="transition-opacity hover:opacity-80 p-1"
            >
              <img 
                src="/site_svgs/nav-bar/Cal.svg" 
                alt="Calendar" 
                className="w-6 h-6"
              />
            </button>
          </div>
        </div>

        {/* Center - Search Bar */}
        <div className="w-full lg:flex-1 lg:max-w-2xl order-3 lg:order-2">
          <div className="relative shadow-md rounded-xl bg-[#e7e1e1] transition-all">
            <input
              type="text"
              placeholder="Search your task here"
              className="w-full text-center px-4 sm:px-5 py-2 sm:py-2.5 pr-10 sm:pr-12 rounded-xl bg-[#e7e1e1] outline-none border-none text-sm sm:text-base text-neutral-text placeholder-neutral-text-muted transition-all duration-200 ease-in-out hover:bg-[#f8fafe] hover:shadow-lg focus:bg-white focus:shadow-lg"
              style={{ boxShadow: '0 6px 14px 0 rgba(78, 88, 186, 0.09)' }}
            />
          </div>
        </div>

        {/* Right Section - Icons and Date (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 ml-6 order-3">
          <button
            onClick={() => navigate('/notifications')}
            className="transition-opacity hover:opacity-80"
          >
            <img 
              src="/site_svgs/nav-bar/Notifications.svg" 
              alt="Notifications" 
              className="w-[34px] h-[34px]"
            />
          </button>
          <button
            onClick={() => navigate('/calendar')}
            className="transition-opacity hover:opacity-80"
          >
            <img 
              src="/site_svgs/nav-bar/Cal.svg" 
              alt="Calendar" 
              className="w-[34px] h-[34px]"
            />
          </button>
          <div className="ml-2 flex flex-col text-center items-center">
            <p className="text-black text-xs lg:text-sm font-medium">{dateTime.day}</p>
            <p className="text-[#3ABEFF] text-xs lg:text-sm font-medium">{dateTime.date}</p>
            <p className="text-red-600 text-xs lg:text-sm font-medium">{dateTime.time}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
