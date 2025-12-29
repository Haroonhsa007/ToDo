import { NavLink } from 'react-router-dom';
import {
  MdDashboard,
  MdCheckCircle,
  MdTask,
  MdCategory,
  MdSettings,
  MdHelp,
  MdLogout,
} from 'react-icons/md';

const menuItems = [
  { icon: MdDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: MdCheckCircle, label: 'Vital Task', path: '/vital-task' },
  { icon: MdTask, label: 'My Task', path: '/my-task' },
  { icon: MdCategory, label: 'Task Categories', path: '/categories' },
  { icon: MdSettings, label: 'Settings', path: '/settings' },
  { icon: MdHelp, label: 'Help', path: '/help' },
];

export function Sidebar({ onLogout }) {
  return (
    <aside className="fixed left-0 top-20 w-72 h-[calc(100vh-80px)] bg-[#FF6B6B] flex flex-col rounded-r-[16px]">
      {/* Profile */}
      <div className="flex flex-col items-center pt-6 pb-8">
        <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center">
          <span className="text-black text-sm font-medium">Profile</span>
        </div>

        <h3 className="mt-4 text-white font-semibold text-sm">
          Sundar Gurung
        </h3>
        <p className="text-white/80 text-xs">
          sundargurung360@gmail.com
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-6 space-y-2">
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
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`text-xl ${isActive ? 'text-[#FF6B6B]' : 'text-white'}`}
                  />
                  <span className="text-sm">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-12 pb-25 mt-auto">
        <button
          onClick={onLogout}
          className="flex items-center gap-4 text-white text-sm opacity-90 hover:opacity-100"
        >
          <MdLogout className="text-xl" />
          Logout
        </button>
      </div>
    </aside>
  );
}
