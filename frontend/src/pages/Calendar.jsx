import { useState } from 'react';
import { MdChevronLeft, MdChevronRight, MdAdd, MdEvent } from 'react-icons/md';

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

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

  // Sample tasks for demonstration
  const tasksByDate = {
    20: [{ title: "Attend Nischal's Birthday Party", time: '6 PM' }],
    21: [{ title: 'Landing Page Design', time: '4 PM' }],
    25: [{ title: 'Team Meeting', time: '2 PM' }],
  };

  return (
    <div className="flex-1 bg-white min-h-screen overflow-y-auto">
      {/* Header */}
      <header className="bg-white border-b border-neutral-border px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MdEvent className="text-primary" size={32} />
            <h1 className="text-3xl font-bold text-neutral-text">Calendar</h1>
          </div>
          <button className="px-5 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all duration-200 flex items-center gap-2 shadow-md">
            <MdAdd size={20} />
            Add Event
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8">
        <div className="bg-white rounded-2xl p-8 shadow-soft border border-neutral-border/20">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-neutral-bg rounded-lg transition-colors"
            >
              <MdChevronLeft size={24} className="text-neutral-text" />
            </button>
            <h2 className="text-2xl font-bold text-neutral-text">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-neutral-bg rounded-lg transition-colors"
            >
              <MdChevronRight size={24} className="text-neutral-text" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {dayNames.map(day => (
              <div key={day} className="text-center font-semibold text-neutral-text-muted py-2">
                {day}
              </div>
            ))}
            {days.map((day, index) => {
              const isToday = day === new Date().getDate() &&
                            currentDate.getMonth() === new Date().getMonth() &&
                            currentDate.getFullYear() === new Date().getFullYear();
              const isSelected = day === selectedDate.getDate() &&
                                currentDate.getMonth() === selectedDate.getMonth() &&
                                currentDate.getFullYear() === selectedDate.getFullYear();
              const hasTasks = day && tasksByDate[day];

              return (
                <div
                  key={index}
                  onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                  className={`
                    aspect-square p-2 rounded-lg cursor-pointer transition-colors
                    ${!day ? 'invisible' : ''}
                    ${isToday ? 'bg-primary/10 border-2 border-primary' : ''}
                    ${isSelected && !isToday ? 'bg-primary/5 border border-primary' : ''}
                    ${!isToday && !isSelected ? 'hover:bg-neutral-bg' : ''}
                  `}
                >
                  <div className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-neutral-text'}`}>
                    {day}
                  </div>
                  {hasTasks && (
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mx-auto mt-1"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected Date Tasks */}
          {selectedDate && tasksByDate[selectedDate.getDate()] && (
            <div className="border-t border-neutral-border pt-6">
              <h3 className="font-semibold text-lg text-neutral-text mb-4">
                Tasks for {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]}
              </h3>
              <div className="space-y-3">
                {tasksByDate[selectedDate.getDate()].map((task, index) => (
                  <div key={index} className="bg-neutral-bg rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-neutral-text">{task.title}</p>
                        <p className="text-sm text-neutral-text-muted">{task.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

