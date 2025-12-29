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

	// Close sidebar when clicking outside on mobile
	useEffect(() => {
		if (!isSidebarCollapsed && isMobile) {
			const handleClickOutside = (e) => {
				if (!e.target.closest('aside') && !e.target.closest('button[aria-label="Toggle sidebar"]')) {
					setIsSidebarCollapsed(true);
				}
			};
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	}, [isSidebarCollapsed, isMobile]);

	return (
		<div className="h-screen flex flex-col bg-[#F5F8FF] overflow-hidden">
			{/* Header/Navbar */}
			<Header onSidebarToggle={toggleSidebar} />

			<div className="flex flex-1 relative min-h-0">
				{/* Sidebar */}
				<Sidebar onLogout={onLogout} isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

				{/* Main Content Area */}
				<div
					className={`
						flex-1 flex flex-col w-full min-h-0
						transition-all duration-300 ease-in-out
						${isMobile ? 'ml-0' : isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}
					`}
				>
					{/* Main Content */}
					<main className="flex-1 flex flex-col min-h-0 px-4 sm:px-6 lg:px-8 py-4 lg:py-6 overflow-y-auto">
						{children}
					</main>
				</div>
			</div>
		</div>
	);
}
