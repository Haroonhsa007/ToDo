import { useState } from 'react';
import { MdSearch, MdAdd } from 'react-icons/md';
import { TaskCard } from '../components/features/TaskCard';

export function Vitals() {
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-text">Vital Tasks</h1>
          <p className="text-neutral-text-muted mt-1">High priority tasks that need immediate attention</p>
        </div>
        <button className="px-5 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all duration-200 flex items-center gap-2 shadow-md">
          <MdAdd size={20} />
          Add Vital Task
        </button>
      </div>

      {/* Main Content */}
      <div>
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Search vital tasks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 pr-12 rounded-lg bg-neutral-bg border border-neutral-border focus:outline-none focus:border-primary transition-colors text-neutral-text placeholder-neutral-text-muted"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition-colors">
              <MdSearch size={20} />
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

