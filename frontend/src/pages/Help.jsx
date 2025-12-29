export function Help() {
  return (
    <div className="w-full h-full flex flex-col min-h-0">
      {/* Header */}
      <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#000000] mb-3 sm:mb-4 shrink-0">
        Help & Support
      </h1>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-3 sm:space-y-4 max-w-4xl">
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-[#D9D9D9]">
          <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-[#000000] mb-2 sm:mb-3">Getting Started</h2>
          <p className="text-xs sm:text-sm text-[#747474] leading-relaxed">
            Welcome to the Task Management System! This guide will help you get started with managing your tasks efficiently.
          </p>
        </div>
        
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-[#D9D9D9]">
          <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-[#000000] mb-2 sm:mb-3">FAQs</h2>
          <div className="space-y-3">
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-[#000000] mb-1">How do I create a task?</h3>
              <p className="text-xs sm:text-sm text-[#747474] leading-relaxed">Click on the "Add Task" button in the Dashboard or My Tasks page.</p>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-[#000000] mb-1">How do I organize tasks?</h3>
              <p className="text-xs sm:text-sm text-[#747474] leading-relaxed">You can create categories and assign tasks to them for better organization.</p>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-[#000000] mb-1">How do I mark a task as vital?</h3>
              <p className="text-xs sm:text-sm text-[#747474] leading-relaxed">Open the task and click the priority icon to mark it as vital.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-[#D9D9D9]">
          <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-[#000000] mb-2 sm:mb-3">Contact Support</h2>
          <p className="text-xs sm:text-sm text-[#747474] leading-relaxed">
            Need more help? Reach out to our support team at <a href="mailto:support@todo.com" className="text-[#008BD9] hover:underline">support@todo.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
