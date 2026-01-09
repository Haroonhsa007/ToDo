import { NavLink } from 'react-router-dom';
import {
  MdDashboard,
  MdSettings,
  MdHelp,
  MdLogout,
  MdChevronLeft,
  MdChevronRight,
} from 'react-icons/md';
import { BsExclamationLg } from 'react-icons/bs';
import { FaRegCheckSquare, FaListUl } from 'react-icons/fa';

const menuItems = [
  { icon: MdDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BsExclamationLg, label: 'Vital Task', path: '/vital-task' },
  { icon: FaRegCheckSquare, label: 'My Task', path: '/my-task' },
  { icon: FaListUl, label: 'Task Categories', path: '/categories' },
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
          fixed left-0 bg-[#FF6767] flex flex-col
          transition-all duration-300 ease-in-out z-20
          top-[64px] lg:top-[80px]
          ${isCollapsed ? 'w-20 -translate-x-full lg:translate-x-0' : 'w-72 translate-x-0'}
          h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)]
          rounded-tr-[20px] rounded-br-[20px]
        `}
      >
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="absolute -right-4 top-8 bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-shadow z-10 hidden lg:flex items-center justify-center w-8 h-8"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <MdChevronRight className="text-[#FF6767] text-xl" />
          ) : (
            <MdChevronLeft className="text-[#FF6767] text-xl" />
          )}
        </button>

        {/* Profile Section */}
        <div
          className={`
            flex flex-col items-center pt-6 pb-4 transition-all duration-300
            ${isCollapsed ? 'px-2' : 'px-6'}
          `}
        >
          {/* Profile Photo */}
          <div className={`rounded-full overflow-hidden border-[3px] border-white shadow-md ${isCollapsed ? 'w-12 h-12' : 'w-20 h-20'}`}>
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {!isCollapsed && (
            <>
              <h3 className="mt-3 text-white font-semibold text-sm">
                Sundar Gurung
              </h3>
              <p className="text-white/80 text-xs">
                sundargurung360@gmail.com
              </p>
            </>
          )}
        </div>

        {/* Navigation Menu */}
        <nav
          className={`
            flex-1 space-y-1 transition-all duration-300 overflow-y-auto
            ${isCollapsed ? 'px-2' : 'px-4'}
          `}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive
                    ? 'bg-white text-[#FF6767] font-semibold shadow-sm'
                    : 'text-white hover:bg-white/10'
                  }
                  ${isCollapsed ? 'justify-center px-2' : ''}
                  `
                }
                title={isCollapsed ? item.label : ''}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`text-xl shrink-0 ${isActive ? 'text-[#FF6767]' : 'text-white'}`}
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

        {/* Logout Button */}
        <div
          className={`
            py-8 transition-all duration-300
            ${isCollapsed ? 'px-2 flex justify-center' : 'px-4'}
          `}
        >
          <button
            onClick={onLogout}
            className={`
              flex items-center gap-4 text-white text-sm hover:opacity-80 transition-opacity
              ${isCollapsed ? 'justify-center' : 'px-4'}
            `}
            title="Logout"
          >
            <MdLogout className="text-xl shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
