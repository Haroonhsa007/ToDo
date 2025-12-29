import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdAdd } from 'react-icons/md';
import { TaskCard } from '../components/features/TaskCard';

export function Vitals() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const vitalTasks = [
    {
      title: 'Critical System Update',
      description: 'Update all production servers with latest security patches. This is urgent and must be completed today.',
      priority: 'Extreme',
      status: 'Not Started',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200',
      createdAt: '20/06/2023',
    },
    {
      title: 'Client Presentation',
      description: 'Finalize the quarterly presentation for the board meeting scheduled for tomorrow.',
      priority: 'Extreme',
      status: 'In Progress',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200',
      createdAt: '20/06/2023',
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-text">Vital Tasks</h1>
          <p className="text-neutral-text-muted mt-1 text-sm sm:text-base">High priority tasks that need immediate attention</p>
        </div>
        <button 
          onClick={() => navigate('/add-task')}
          className="px-3 sm:px-5 py-2 bg-primary text-white rounded-lg text-sm sm:text-base font-medium hover:bg-primary-dark transition-all duration-200 flex items-center gap-1.5 sm:gap-2 shadow-md w-full sm:w-auto justify-center"
        >
          <MdAdd size={18} className="sm:w-5 sm:h-5" />
          <span>Add Vital Task</span>
        </button>
      </div>

      {/* Main Content */}
      <div>
        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              placeholder="Search vital tasks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 sm:px-5 py-2.5 sm:py-3 pr-10 sm:pr-12 rounded-lg bg-neutral-bg border border-neutral-border focus:outline-none focus:border-primary transition-colors text-sm sm:text-base text-neutral-text placeholder-neutral-text-muted"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-1.5 sm:p-2 rounded-lg hover:bg-primary-dark transition-colors">
              <MdSearch size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Vital Tasks List */}
        <div className="space-y-4">
          {vitalTasks.map((task, index) => (
            <TaskCard key={index} {...task} />
          ))}
        </div>
      </div>
    </div>
  );
}

