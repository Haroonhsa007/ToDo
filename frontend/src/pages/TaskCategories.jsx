import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAdd, MdEdit, MdDelete, MdSearch } from 'react-icons/md';

export function TaskCategories() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 1, name: 'Work', color: '#4A90E2', taskCount: 12 },
    { id: 2, name: 'Personal', color: '#9B59B6', taskCount: 8 },
    { id: 3, name: 'Shopping', color: '#FF8787', taskCount: 5 },
    { id: 4, name: 'Health', color: '#04C400', taskCount: 3 },
    { id: 5, name: 'Education', color: '#FFA500', taskCount: 7 },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-text">Task Categories</h1>
        <button 
          onClick={() => navigate('/create-category')}
          className="px-3 sm:px-5 py-2 bg-primary text-white rounded-lg text-sm sm:text-base font-medium hover:bg-primary-dark transition-all duration-200 flex items-center gap-1.5 sm:gap-2 shadow-md w-full sm:w-auto justify-center"
        >
          <MdAdd size={18} className="sm:w-5 sm:h-5" />
          <span>Create Category</span>
        </button>
      </div>

      {/* Main Content */}
      <div>
        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 sm:px-5 py-2.5 sm:py-3 pr-10 sm:pr-12 rounded-lg bg-neutral-bg border border-neutral-border focus:outline-none focus:border-primary transition-colors text-sm sm:text-base text-neutral-text placeholder-neutral-text-muted"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-1.5 sm:p-2 rounded-lg hover:bg-primary-dark transition-colors">
              <MdSearch size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map(category => (
            <div
              key={category.id}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft border border-neutral-border/20 hover:shadow-medium transition-shadow"
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-white font-bold text-base sm:text-lg shrink-0"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg text-neutral-text truncate">{category.name}</h3>
                    <p className="text-xs sm:text-sm text-neutral-text-muted">{category.taskCount} tasks</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                  <button className="p-1.5 sm:p-2 text-neutral-text-muted hover:text-primary transition-colors">
                    <MdEdit size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                  <button className="p-1.5 sm:p-2 text-neutral-text-muted hover:text-status-not-started transition-colors">
                    <MdDelete size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

