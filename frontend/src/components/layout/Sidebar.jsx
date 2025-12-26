import { NavLink, useLocation } from 'react-router-dom';
import {
  MdDashboard,
  MdCheckCircle,
  MdTask,
  MdCategory,
  MdSettings,
  MdHelp,
  MdLogout,
  MdNotifications,
  MdCalendarToday,
  MdMenu,
  MdChevronLeft
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

export function Sidebar({ onLogout, isCollapsed, onToggle }) {
  const location = useLocation();
  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen bg-sidebar flex flex-col shadow-xl overflow-y-auto z-50
          transition-all duration-300 ease-in-out
          ${isCollapsed 
            ? 'w-20 -translate-x-full lg:translate-x-0' 
            : 'w-72 translate-x-0'
          }
        `}
      >
        {/* Toggle Button */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-4'} pt-4 pb-2`}>
          {!isCollapsed && (
            <h1 className="text-2xl lg:text-3xl font-bold text-white truncate">
              Dashboard
            </h1>
          )}
          <button
            onClick={onToggle}
            className={`p-2 rounded-lg text-white hover:bg-white/10 transition-colors ${isCollapsed ? '' : 'ml-auto lg:ml-0'}`}
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? (
              <MdMenu className="text-2xl" />
            ) : (
              <MdChevronLeft className="text-2xl" />
            )}
          </button>
        </div>

        {/* User Profile Section */}
        {!isCollapsed && (
          <div className="px-6 pb-6">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-3 ring-2 ring-white/20 bg-white/20 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">SG</span>
              </div>
              <h3 className="text-white font-semibold text-base text-center">Sundar Gurung</h3>
              <p className="text-white/70 text-xs mt-1 text-center">sundargurung360@gmail.com</p>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="px-4 pb-6 pt-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/20 bg-white/20 flex items-center justify-center">
                <span className="text-white text-lg font-bold">SG</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-4'} space-y-1.5 overflow-y-auto`}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive: isNavActive }) => `
                  w-full flex items-center gap-3 rounded-lg transition-all duration-200
                  ${isCollapsed ? 'justify-center px-3 py-3' : 'px-5 py-3'}
                  ${isNavActive || isActive
                    ? 'bg-white text-neutral-text shadow-lg font-semibold'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }
                `}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className={`text-xl flex-shrink-0 ${isActive ? 'text-primary' : 'text-white'}`} />
                {!isCollapsed && (
                  <span className="font-medium text-sm truncate">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className={`${isCollapsed ? 'p-2' : 'p-4'} border-t border-white/10 mt-auto`}>
          <button
            onClick={() => onLogout?.()}
            className={`
              w-full flex items-center gap-3 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200
              ${isCollapsed ? 'justify-center px-3 py-3' : 'px-5 py-3'}
            `}
            title={isCollapsed ? 'Logout' : ''}
          >
            <MdLogout className="text-xl flex-shrink-0" />
            {!isCollapsed && (
              <span className="font-medium text-sm">Logout</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
