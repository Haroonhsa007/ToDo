import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdNotifications, MdCalendarToday, MdAdd } from 'react-icons/md';
import { TaskCard, CompletedTaskCard } from '../components/features/TaskCard';
import { TaskStatusChart } from '../components/features/TaskStatusChart';

export function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // Sample tasks data
  const tasks = [
    {
      title: "Attend Nischal's Birthday Party",
      description:
        "Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements).....",
      priority: 'Moderate',
      status: 'Not Started',
      image: 'https://images.unsplash.com/photo-1464347744102-11db6282f854?w=200',
      createdAt: '20/06/2023',
    },
    {
      title: 'Landing Page Design for TravelDays',
      description:
        'Get the work done by EOD and discuss with client before leaving. (4 PM | Meeting Room)',
      priority: 'Moderate',
      status: 'In Progress',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200',
      createdAt: '20/06/2023',
    },
    {
      title: 'Presentation on Final Product',
      description:
        'Make sure everything is functioning and all the necessities are properly met. Prepare the team and get the documents ready for...',
      priority: 'Moderate',
      status: 'In Progress',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200',
      createdAt: '19/06/2023',
    },
  ];

  const completedTasks = [
    {
      title: 'Walk the dog',
      description: 'Take the dog to the park and bring treats as well.',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200',
      completedAt: 'Completed 2 days ago.',
    },
    {
      title: 'Conduct meeting',
      description: 'Meet with the client and finalize requirements.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200',
      completedAt: 'Completed 2 days ago.',
    },
  ];

  return (
    // <div className="flex-1 bg-white min-h-screen overflow-y-auto">
    <div className="flex-1 bg-yellow-500 min-h-screen overflow-y-auto">


      {/* Welcome Section */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold text-neutral-text">
              Welcome back, Sundar
            </h1>
            <span className="text-4xl">👋</span>
          </div>

          {/* Team Members Row */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm bg-gray-200">
                  <img
                    src={`https://i.pravatar.cc/150?img=${i}`}
                    alt={`Team member ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-white bg-neutral-bg flex items-center justify-center shadow-sm">
              <span className="text-neutral-text-muted text-xs font-semibold">+4</span>
            </div>
            <button className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md">
              <MdAdd size={20} />
              Invite
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - To-Do Tasks */}
          <div className="lg:col-span-2 space-y-6">
            {/* To-Do Section */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-border/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-neutral-border rounded-sm shrink-0"></div>
                  <h2 className="text-neutral-text text-xl font-semibold">To-Do</h2>
                  <span className="text-neutral-text-muted text-sm">20 June • Today</span>
                </div>
                <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all duration-200 flex items-center gap-1.5 text-sm shadow-sm">
                  <MdAdd size={18} />
                  Add task
                </button>
              </div>

              <div className="space-y-4">
                {tasks.map((task, index) => (
                  <TaskCard key={index} {...task} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Task Status */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-border/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-6 shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-text">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h2 className="text-neutral-text text-xl font-semibold">Task Status</h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <TaskStatusChart percentage={84} label="Completed" color="completed" />
                <TaskStatusChart percentage={46} label="In Progress" color="progress" />
                <TaskStatusChart percentage={13} label="Not Started" color="not-started" />
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-border/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-6 rounded-full bg-status-completed flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-neutral-text text-xl font-semibold">Completed Task</h2>
              </div>

              <div className="space-y-4">
                {completedTasks.map((task, index) => (
                  <CompletedTaskCard key={index} {...task} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
