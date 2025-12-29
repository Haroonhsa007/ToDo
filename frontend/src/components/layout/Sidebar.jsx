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
    <aside
      className={`
        fixed left-0 top-32 h-[calc(100vh-80px)] bg-[#FF6B6B] flex flex-col rounded-r-[16px]
        transition-all duration-300 ease-in-out z-20
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 bg-white rounded-full p-1.5 shadow-md hover:shadow-lg transition-shadow z-10"
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
          flex flex-col items-center pt-6 pb-8 transition-all duration-300
          ${isCollapsed ? 'px-2' : 'px-6'}
        `}
      >
        <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center shrink-0">
          {isCollapsed ? (
            <span className="text-black text-xs font-medium">SG</span>
          ) : (
            <span className="text-black text-sm font-medium">Profile</span>
          )}
        </div>

        {!isCollapsed && (
          <>
            <h3 className="mt-4 text-white font-semibold text-sm">
              Sundar Gurung
            </h3>
            <p className="text-white/80 text-xs text-center px-2">
              sundargurung360@gmail.com
            </p>
          </>
        )}
      </div>

      {/* Menu */}
      <nav
        className={`
          flex-1 space-y-2 transition-all duration-300
          ${isCollapsed ? 'px-2' : 'px-6'}
        `}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-3 rounded-xl transition
                ${
                  isActive
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
                    className={`text-xl shrink-0 ${isActive ? 'text-[#FF6B6B]' : 'text-white'}`}
                  />
                  {!isCollapsed && (
                    <span className="text-sm whitespace-nowrap">{item.label}</span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div
        className={`
          mt-auto pb-6 transition-all duration-300
          ${isCollapsed ? 'px-2 flex justify-center' : 'px-12'}
        `}
      >
        <button
          onClick={onLogout}
          className={`
            flex items-center gap-4 text-white text-sm opacity-90 hover:opacity-100
            ${isCollapsed ? 'justify-center' : ''}
          `}
          title={isCollapsed ? 'Logout' : ''}
        >
          <MdLogout className="text-xl shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
