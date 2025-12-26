import {
  MdDashboard,
  MdCheckCircle,
  MdTask,
  MdCategory,
  MdSettings,
  MdHelp,
  MdLogout,
  MdNotifications,
  MdCalendarToday
} from 'react-icons/md';

const menuItems = [
  { icon: MdDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: MdCheckCircle, label: 'Vital Task', path: '/vital-task' },
  { icon: MdTask, label: 'My Task', path: '/my-task' },
  { icon: MdCategory, label: 'Task Categories', path: '/categories' },
  { icon: MdNotifications, label: 'Notifications', path: '/notifications' },
  { icon: MdCalendarToday, label: 'Calendar', path: '/calendar' },
  { icon: MdSettings, label: 'Settings', path: '/settings' },
  { icon: MdHelp, label: 'Help', path: '/help' },
];

export function Sidebar({ activeItem = 'Dashboard', onNavigate, onLogout }) {
  return (
    <div className="w-72 bg-sidebar h-screen flex flex-col shadow-xl overflow-y-auto">
      {/* Logo/Brand */}
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-3xl font-bold text-white">
          Dashboard
        </h1>
      </div>

      {/* User Profile Section */}
      <div className="px-6 pb-6">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-3 ring-2 ring-white/20 bg-white/20 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">SG</span>
          </div>
          <h3 className="text-white font-semibold text-base">Sundar Gurung</h3>
          <p className="text-white/70 text-xs mt-1">sundargurung360@gmail.com</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.label === activeItem;

          return (
            <button
              key={item.label}
              onClick={() => onNavigate?.(item.label)}
              className={`
                w-full flex items-center gap-3 px-5 py-3 rounded-lg
                transition-all duration-200
                ${isActive
                  ? 'bg-white text-neutral-text shadow-lg font-semibold'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <Icon className={`text-xl ${isActive ? 'text-primary' : 'text-white'}`} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/10 mt-auto">
        <button
          onClick={() => onLogout?.()}
          className="w-full flex items-center gap-3 px-5 py-3 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          <MdLogout className="text-xl" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
