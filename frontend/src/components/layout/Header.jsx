import { useState, useEffect, useMemo } from 'react';
import { MdMenu, MdNotifications, MdSearch, MdCalendarToday, MdAdd } from 'react-icons/md';
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
    <header className="bg-[#F8F8F8] px-8 py-4 sticky top-0 z-10 ">
      <div className="flex items-center justify-between mt-2">
        {/* Left - App Title */}
        <div className="shrink-0 mr-6 flex items-center gap-2">
          <button
            onClick={onSidebarToggle}
            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors lg:hidden"
            aria-label="Toggle sidebar"
          >
            <MdMenu className="text-2xl" />
          </button>
          <h1 className="text-4xl font-bold">
            <span className="text-[#ff6161]">
              Dash
            </span>
            <span className="text-black ml-1">
              board
            </span>
          </h1>
        </div>

        {/* Center - Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative shadow-md rounded-xl bg-[#f8fafe] transition-all">
            <input
              type="text"
              placeholder="Search your task here"
              className="w-full text text-center px-5 py-2.5 pr-12 rounded-xl bg-[#f8fafe] outline-none border-none text-neutral-text placeholder-neutral-text-muted transition-all duration-200 ease-in-out hover:bg-[#e7e1e1] hover:shadow-lg focus:bg-white focus:shadow-lg"
              style={{ boxShadow: '0 4px 14px 0 rgba(78, 88, 186, 0.07)' }}
            />
          </div>
        </div>

        {/* Right Section - Icons and Date */}
        <div className="flex items-center gap-3 ml-6">
          {/* <button className="p-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm">
            <MdSearch size={20} />
          </button> */}
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
          <div className="ml-2 flex flex-col text-center items-center">
            <p className="text-black text-sm font-medium">{dateTime.day}</p>
            <p className="text-[#3ABEFF] text-sm font-medium">{dateTime.date}</p>
            <p className="text-red-600 text-sm font-medium">{dateTime.time}</p>
          </div>
        </div>
      </div>


    </header>
  );
}
