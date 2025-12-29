import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdChevronLeft, MdChevronRight, MdClose, MdKeyboardBackspace } from 'react-icons/md';

export function Calendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2023, 5, 6)); // June 6, 2023
  const [selectedDate, setSelectedDate] = useState(new Date(2023, 5, 6));
  const [dateInput, setDateInput] = useState('June 6, 2023');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const dayNamesMobile = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get day of week, adjusting for Monday start (0 = Monday, 6 = Sunday)
    let startingDayOfWeek = firstDay.getDay() - 1;
    if (startingDayOfWeek < 0) startingDayOfWeek = 6;

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentDate);

  const isSelected = (day) => {
    return day === selectedDate.getDate() &&
           currentDate.getMonth() === selectedDate.getMonth() &&
           currentDate.getFullYear() === selectedDate.getFullYear();
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      {/* Calendar Card */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-[#D9D9D9] p-4 sm:p-6 w-full max-w-sm sm:max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-base sm:text-xl font-bold text-[#000000]">Calendar</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-[#FF6767] hover:text-[#F24E1E] transition-colors"
          >
            <MdKeyboardBackspace size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Date Input */}
        <div className="relative mb-4 sm:mb-6">
          <input
            type="text"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-8 sm:pr-10 rounded-lg bg-[#F8F8F8] border border-[#D9D9D9] focus:outline-none focus:border-[#A1A3AB] transition-colors text-[#000000] text-xs sm:text-sm"
          />
          <button
            onClick={() => setDateInput('')}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-[#A1A3AB] hover:text-[#747474]"
          >
            <MdClose size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <button
            onClick={goToPreviousMonth}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border border-[#D9D9D9] hover:bg-[#F8F8F8] transition-colors"
          >
            <MdChevronLeft size={18} className="text-[#747474]" />
          </button>
          <h2 className="text-xs sm:text-base font-semibold text-[#000000]">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={goToNextMonth}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border border-[#D9D9D9] hover:bg-[#F8F8F8] transition-colors"
          >
            <MdChevronRight size={18} className="text-[#747474]" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
          {/* Day Headers */}
          {dayNames.map((day, index) => (
            <div key={day} className="text-center text-[10px] sm:text-xs font-medium text-[#A1A3AB] py-1 sm:py-2">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{dayNamesMobile[index]}</span>
            </div>
          ))}
          
          {/* Days */}
          {days.map((day, index) => (
            <div
              key={index}
              onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
              className={`
                aspect-square flex items-center justify-center cursor-pointer rounded-full text-xs sm:text-sm transition-colors
                ${!day ? 'invisible' : ''}
                ${isSelected(day) ? 'bg-[#5B5FC7] text-white' : 'text-[#747474] hover:bg-[#F8F8F8]'}
              `}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
