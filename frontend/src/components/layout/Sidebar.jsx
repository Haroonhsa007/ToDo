import { NavLink } from 'react-router-dom';
import {
  MdDashboard,
  MdCheckCircle,
  MdTask,
  MdCategory,
  MdSettings,
  MdHelp,
  MdLogout,
  MdMenu,
  MdChevronLeft,
  MdChevronRight,
} from 'react-icons/md';

const menuItems = [
  { icon: MdDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: MdCheckCircle, label: 'Vital Task', path: '/vital-task' },
  { icon: MdTask, label: 'My Task', path: '/my-task' },
  { icon: MdCategory, label: 'Task Categories', path: '/categories' },
  { icon: MdSettings, label: 'Settings', path: '/settings' },
  { icon: MdHelp, label: 'Help', path: '/help' },
];

export function Sidebar({ onLogout, isCollapsed, onToggle }) {
  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}
      <aside
        className={`
          fixed left-0 bg-[#FF6B6B] flex flex-col rounded-r-[16px]
          transition-all duration-300 ease-in-out z-20 top-32
          ${isCollapsed ? 'w-16 sm:w-20 -translate-x-full lg:translate-x-0' : 'w-64 sm:w-72 translate-x-0'}
          h-[calc(100vh-64px)] sm:h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)]
        `}
      >
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="absolute -right-6 top-6 bg-white rounded-full p-1.5 shadow-md hover:shadow-lg transition-shadow z-10 hidden lg:flex"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <MdChevronRight className="text-[#FF6B6B] text-xl" />
          ) : (
            <MdChevronLeft className="text-[#FF6B6B] text-xl" />
          )}
        </button>

        {/* Profile */}
        <div
          className={`
            flex flex-col items-center pt-6 pb-6 lg:pt-8 lg:pb-8 transition-all duration-300
            ${isCollapsed ? 'px-2' : 'px-4 lg:px-6'}
          `}
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-18 lg:h-18 rounded-full border-4 border-white flex items-center justify-center shrink-0">
            {isCollapsed ? (
              <span className="text-black text-xs font-medium">SG</span>
            ) : (
              <span className="text-black text-xs lg:text-sm font-medium">SG</span>
            )}
          </div>

          {!isCollapsed && (
            <>
              <h3 className="mt-3 lg:mt-4 text-white font-semibold text-xs lg:text-sm">
                Sundar Gurung
              </h3>
              <p className="text-white/80 text-xs text-center px-2 line-clamp-2">
                sundargurung360@gmail.com
              </p>
            </>
          )}
        </div>

        {/* Menu */}
        <nav
          className={`
            flex-1 space-y-2 transition-all duration-300 overflow-y-auto
            ${isCollapsed ? 'px-2' : 'px-4 lg:px-6'}
          `}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 sm:gap-3 lg:gap-4 px-2 sm:px-3 lg:px-5 py-2 sm:py-2.5 lg:py-3 rounded-xl transition
                  ${isActive
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-white hover:bg-white/10'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                  `
                }
                title={isCollapsed ? item.label : ''}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`text-lg lg:text-xl shrink-0 ${isActive ? 'text-[#FF6B6B]' : 'text-white'}`}
                    />
                    {!isCollapsed && (
                      <span className="text-xs lg:text-sm whitespace-nowrap">{item.label}</span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div
          className={`mt-auto py-28 lg:py-18 transition-all duration-300 ${isCollapsed ? 'px-2 flex justify-center' : 'px-4 lg:px-12'
            }`}
        >
          <button
            onClick={onLogout}
            className={`
                flex items-center gap-2 sm:gap-3 lg:gap-4 text-white text-xs lg:text-sm opacity-90 xs:py-20 hover:opacity-50 w-full
                ${isCollapsed ? 'justify-center' : ''}
              `}
            title={isCollapsed ? 'Logout' : 'Logout'}
          >
            <MdLogout className="text-lg lg:text-xl shrink-0" />
            <span className={`${isCollapsed ? 'hidden' : ''}`}>Logout</span>
          </button>
        </div>

      </aside>
    </>
  );
}

