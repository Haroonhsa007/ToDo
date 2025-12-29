import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardBackspace } from 'react-icons/md';

export function Notifications() {
  const navigate = useNavigate();

  const [notifications] = useState([
    {
      id: 1,
      title: 'Complete the UI design of Landing Page for FoodVentures.',
      time: '2h',
      priority: 'High',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100',
    },
    {
      id: 2,
      title: 'Complete the UI design of Landing Page for Travel Days.',
      time: '2h',
      priority: 'High',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=100',
    },
    {
      id: 3,
      title: 'Complete the Mobile app design for Pet Warden.',
      time: '2h',
      priority: 'Extremely High',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100',
    },
    {
      id: 4,
      title: 'Complete the entire design for Juice Slider.',
      time: '2h',
      priority: 'High',
      image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=100',
    },
  ]);

  // Exact colors from design
  const priorityColors = {
    'High': '#F21E1E',
    'Extremely High': '#F21E1E',
    'Medium': '#0225FF',
    'Low': '#05A301',
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Main Container */}
      <div className="bg-white rounded-xl lg:rounded-2xl border border-[#D9D9D9] shadow-sm p-4 sm:p-6 flex-1 flex flex-col min-h-0 max-w-lg mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h1 className="text-base sm:text-xl font-bold text-[#000000]">Notifications</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-[#FF6767] hover:text-[#F24E1E] transition-colors"
          >
            <MdKeyboardBackspace size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Today Section */}
        <div className="mb-3 sm:mb-4">
          <p className="text-xs sm:text-sm text-[#A1A3AB] border-b border-[#D9D9D9] pb-2">Today</p>
        </div>

        {/* Notification List - Scrollable */}
        <div className="space-y-3 sm:space-y-4 overflow-y-auto flex-1 min-h-0">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-[#D9D9D9] last:border-b-0"
            >
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-[#000000] leading-relaxed mb-1">
                  {notification.title.split(' ').map((word, idx) => {
                    // Bold certain words
                    if (['UI', 'design', 'Mobile', 'app', 'entire'].includes(word)) {
                      return <strong key={idx}>{word} </strong>;
                    }
                    // Highlight project names
                    if (['FoodVentures.', 'Travel', 'Days.', 'Pet', 'Warden.', 'Juice', 'Slider.'].includes(word)) {
                      return <strong key={idx}>{word} </strong>;
                    }
                    return word + ' ';
                  })}
                  <span className="text-[#A1A3AB] text-[10px] sm:text-xs">{notification.time}</span>
                </p>
                <p className="text-[10px] sm:text-xs">
                  <span className="text-[#A1A3AB]">Priority: </span>
                  <span style={{ color: priorityColors[notification.priority] }}>
                    {notification.priority}
                  </span>
                </p>
              </div>

              {/* Image */}
              <div className="w-12 h-10 sm:w-16 sm:h-12 rounded overflow-hidden shrink-0">
                <img
                  src={notification.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
