import { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdSearch } from 'react-icons/md';

export function TaskCategories() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 1, name: 'Work', color: '#4A90E2', taskCount: 12 },
    { id: 2, name: 'Personal', color: '#9B59B6', taskCount: 8 },
    { id: 3, name: 'Shopping', color: '#FF8787', taskCount: 5 },
    { id: 4, name: 'Health', color: '#04C400', taskCount: 3 },
    { id: 5, name: 'Education', color: '#FFA500', taskCount: 7 },
  ];

  return (
    <div className="flex-1 bg-white min-h-screen overflow-y-auto">
      {/* Header */}
      <header className="bg-white border-b border-neutral-border px-8 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-neutral-text">Task Categories</h1>
          <button className="px-5 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-all duration-200 flex items-center gap-2 shadow-md">
            <MdAdd size={20} />
            Create Category
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 pr-12 rounded-lg bg-neutral-bg border border-neutral-border focus:outline-none focus:border-primary transition-colors text-neutral-text placeholder-neutral-text-muted"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition-colors">
              <MdSearch size={20} />
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <div
              key={category.id}
              className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-border/20 hover:shadow-medium transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-neutral-text">{category.name}</h3>
                    <p className="text-sm text-neutral-text-muted">{category.taskCount} tasks</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-neutral-text-muted hover:text-primary transition-colors">
                    <MdEdit size={18} />
                  </button>
                  <button className="p-2 text-neutral-text-muted hover:text-status-not-started transition-colors">
                    <MdDelete size={18} />
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

