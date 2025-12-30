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
          fixed left-0 bg-[#ff6767] flex flex-col
          transition-all duration-300 ease-in-out z-20
          top-[100px] lg:top-[100px]
          ${isCollapsed ? 'w-20 -translate-x-full lg:translate-x-0' : 'w-[365px] translate-x-0'}
          h-[calc(100vh-100px)] lg:h-[calc(100vh-100px)]
          rounded-tr-[8px] rounded-br-[8px]
          shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)]
        `}
      >
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="absolute -right-4 top-8 bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-shadow z-10 hidden lg:flex items-center justify-center w-8 h-8"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <MdChevronRight className="text-[#ff6767] text-xl" />
          ) : (
            <MdChevronLeft className="text-[#ff6767] text-xl" />
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
          <div className={`rounded-full overflow-hidden ${isCollapsed ? 'w-12 h-12' : 'w-[86px] h-[86px]'}`}>
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {!isCollapsed && (
            <>
              <h3 className="mt-3 text-white font-semibold text-base leading-normal">
                Sundar Gurung
              </h3>
              <p className="text-white text-xs leading-normal mt-1">
                sundargurung360@gmail.com
              </p>
            </>
          )}
        </div>

        {/* Navigation Menu */}
        <nav
          className={`
            flex-1 flex flex-col transition-all duration-300 overflow-y-auto
            ${isCollapsed ? 'px-2' : 'px-[21px]'}
          `}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center transition-all duration-200
                  ${isCollapsed 
                    ? 'justify-center px-2 h-12 rounded-lg' 
                    : 'h-[59px] w-[288px] px-[20px] rounded-[14px]'
                  }
                  ${isActive
                    ? 'bg-white text-[#ff6767] font-medium'
                    : 'text-white hover:bg-white/10 bg-transparent'
                  }
                  `
                }
                title={isCollapsed ? item.label : ''}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`text-xl shrink-0 ${isActive ? 'text-[#ff6767]' : 'text-white'}`}
                    />
                    {!isCollapsed && (
                      <span className="text-base font-medium leading-normal ml-4 whitespace-nowrap">
                        {item.label}
                      </span>
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
            transition-all duration-300 mb-8
            ${isCollapsed ? 'px-2 flex justify-center' : 'px-[21px]'}
          `}
        >
          <button
            onClick={onLogout}
            className={`
              flex items-center text-white hover:opacity-80 transition-opacity
              ${isCollapsed 
                ? 'justify-center h-12 w-full rounded-lg' 
                : 'h-[59px] w-[288px] px-[20px] rounded-[14px]'
              }
            `}
            title="Logout"
          >
            <MdLogout className="text-xl shrink-0" />
            {!isCollapsed && (
              <span className="text-base font-medium leading-normal ml-4">
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
