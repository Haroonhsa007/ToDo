import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdArrowBack, MdEdit, MdDelete, MdCalendarToday, MdFlag, MdImage } from 'react-icons/md';

export function ViewTask() {
  const navigate = useNavigate();
  const location = useLocation();
  const task = location.state?.task;
  
  const taskData = task || {
    title: "Attend Nischal's Birthday Party",
    description: "Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements)",
    priority: 'Moderate',
    status: 'Not Started',
    category: 'Personal',
    createdAt: '20/06/2023',
    dueDate: '20/06/2023',
    image: 'https://images.unsplash.com/photo-1464347744102-11db6282f854?w=200',
  };

  const statusColors = {
    'Not Started': 'text-status-not-started',
    'In Progress': 'text-status-progress',
    Completed: 'text-status-completed',
  };

  const priorityColors = {
    Extreme: 'text-red-600',
    Moderate: 'text-secondary-blue',
    Low: 'text-status-completed',
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-neutral-bg rounded-lg transition-colors shrink-0"
          >
            <MdArrowBack size={20} className="sm:w-6 sm:h-6 text-neutral-text" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-text">Task Details</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => navigate('/edit-task', { state: { task } })}
            className="px-3 sm:px-4 py-2 border-2 border-primary text-primary rounded-lg text-sm sm:text-base font-medium hover:bg-primary hover:text-white transition-all duration-200 flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial justify-center"
          >
            <MdEdit size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => { /* Handle delete */ navigate(-1); }}
            className="px-3 sm:px-4 py-2 border-2 border-status-not-started text-status-not-started rounded-lg text-sm sm:text-base font-medium hover:bg-status-not-started hover:text-white transition-all duration-200 flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial justify-center"
          >
            <MdDelete size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-soft border border-neutral-border/20">
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-text mb-3 sm:mb-4">{taskData.title}</h2>

          {/* Status and Priority */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <span className="text-neutral-text-muted">Status:</span>
              <span className={`font-semibold ${statusColors[taskData.status] || statusColors['Not Started']}`}>
                {taskData.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MdFlag className="text-neutral-text-muted" />
              <span className="text-neutral-text-muted">Priority:</span>
              <span className={`font-semibold ${priorityColors[taskData.priority] || priorityColors['Moderate']}`}>
                {taskData.priority}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-text mb-2">Description</h3>
            <p className="text-neutral-text-light leading-relaxed">{taskData.description}</p>
          </div>

          {/* Image */}
          {taskData.image && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-neutral-text mb-2">
                <MdImage className="inline mr-2" />
                Attached Image
              </h3>
              <div className="rounded-xl overflow-hidden shadow-md max-w-md">
                <img src={taskData.image} alt={taskData.title} className="w-full h-auto" />
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-neutral-text-muted mb-1">Category</h3>
              <p className="text-neutral-text font-medium">{taskData.category || 'Uncategorized'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-text-muted mb-1">
                <MdCalendarToday className="inline mr-2" />
                Created On
              </h3>
              <p className="text-neutral-text font-medium">{taskData.createdAt}</p>
            </div>
            {taskData.dueDate && (
              <div>
                <h3 className="text-sm font-medium text-neutral-text-muted mb-1">
                  <MdCalendarToday className="inline mr-2" />
                  Due Date
                </h3>
                <p className="text-neutral-text font-medium">{taskData.dueDate}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

