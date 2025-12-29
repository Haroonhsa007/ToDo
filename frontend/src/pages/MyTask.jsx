import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdAdd, MdFilterList } from 'react-icons/md';
import { TaskCard } from '../components/features/TaskCard';

export function MyTask() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const tasks = [
    {
      title: "Attend Nischal's Birthday Party",
      description: "Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements).....",
      priority: 'Moderate',
      status: 'Not Started',
      image: 'https://images.unsplash.com/photo-1464347744102-11db6282f854?w=200',
      createdAt: '20/06/2023',
    },
    {
      title: 'Landing Page Design for TravelDays',
      description: 'Get the work done by EOD and discuss with client before leaving. (4 PM | Meeting Room)',
      priority: 'Moderate',
      status: 'In Progress',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200',
      createdAt: '20/06/2023',
    },
    {
      title: 'Presentation on Final Product',
      description: 'Make sure everything is functioning and all the necessities are properly met.',
      priority: 'Extreme',
      status: 'In Progress',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200',
      createdAt: '19/06/2023',
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-text">My Tasks</h1>
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <button className="px-3 sm:px-5 py-2 border-2 border-primary text-primary rounded-lg text-sm sm:text-base font-medium hover:bg-primary hover:text-white transition-all duration-200 flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial justify-center">
            <MdFilterList size={18} className="sm:w-5 sm:h-5" />
            <span>Filter</span>
          </button>
          <button 
            onClick={() => navigate('/add-task')}
            className="px-3 sm:px-5 py-2 bg-primary text-white rounded-lg text-sm sm:text-base font-medium hover:bg-primary-dark transition-all duration-200 flex items-center gap-1.5 sm:gap-2 shadow-md flex-1 sm:flex-initial justify-center"
          >
            <MdAdd size={18} className="sm:w-5 sm:h-5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div>
        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              placeholder="Search your task here..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 sm:px-5 py-2.5 sm:py-3 pr-10 sm:pr-12 rounded-lg bg-neutral-bg border border-neutral-border focus:outline-none focus:border-primary transition-colors text-sm sm:text-base text-neutral-text placeholder-neutral-text-muted"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-1.5 sm:p-2 rounded-lg hover:bg-primary-dark transition-colors">
              <MdSearch size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {tasks.map((task, index) => (
            <TaskCard key={index} {...task} />
          ))}
        </div>
      </div>
    </div>
  );
}

