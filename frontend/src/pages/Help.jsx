export function Help() {
  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-text mb-4 sm:mb-6">Help & Support</h1>
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft border border-neutral-border/20">
          <h2 className="text-lg sm:text-xl font-semibold text-neutral-text mb-3 sm:mb-4">Getting Started</h2>
          <p className="text-sm sm:text-base text-neutral-text-light">
            Welcome to the Task Management System! This guide will help you get started with managing your tasks efficiently.
          </p>
        </div>
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft border border-neutral-border/20">
          <h2 className="text-lg sm:text-xl font-semibold text-neutral-text mb-3 sm:mb-4">FAQs</h2>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h3 className="font-medium text-neutral-text mb-2">How do I create a task?</h3>
              <p className="text-neutral-text-light">Click on the "Add Task" button in the Dashboard or My Tasks page.</p>
            </div>
            <div>
              <h3 className="font-medium text-neutral-text mb-2">How do I organize tasks?</h3>
              <p className="text-neutral-text-light">You can create categories and assign tasks to them for better organization.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

