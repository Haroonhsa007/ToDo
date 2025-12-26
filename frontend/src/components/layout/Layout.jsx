import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function Layout({ children, onLogout }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarCollapsed(true); // Collapse on mobile by default
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div>
      {/* Header/Navbar */}
      <Header />

      <div className="min-h-screen flex bg-[#F8F8F8]">
        {/* Sidebar */}
        <Sidebar onLogout={onLogout} isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

        {/* Main Content Area */}
        <div
          className={`
          flex-1 flex flex-col min-h-screen w-full
          transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'ml-0 lg:ml-20' : 'ml-0 lg:ml-72'}
        `}
        >
          {/* Main Content */}
          <main
            className={`
            flex-1 overflow-y-auto
            transition-all duration-300 ease-in-out
            pt-16 
            px-4 sm:px-6 lg:px-8 py-6 lg:py-8
          `}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
