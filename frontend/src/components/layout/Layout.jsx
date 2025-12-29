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
		<div className="min-h-screen bg-[#F8F8F8]">
			{/* Header/Navbar */}
			<Header onSidebarToggle={toggleSidebar} />

			<div className="flex relative min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-80px)]">
				{/* Sidebar */}
				
				<div className="">
					<Sidebar onLogout={onLogout} isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
				</div>

				{/* Main Content Area */}
				<div
					className={`
						flex-1 flex flex-col
						transition-all duration-300 ease-in-out
						${isMobile ? 'ml-0' : isSidebarCollapsed ? 'ml-20' : 'ml-72'}
					`}
				>
					{/* Main Content */}
					<main
						className={`
							flex-1 overflow-y-auto
							transition-all duration-300 ease-in-out
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
