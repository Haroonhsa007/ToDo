import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdCalendarToday, MdFlag, MdImage } from 'react-icons/md';

export function AddTask() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Moderate',
    status: 'Not Started',
    dueDate: '',
    category: '',
  });

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Handle task creation
    navigate(-1);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-neutral-bg rounded-lg transition-colors shrink-0"
        >
          <MdArrowBack size={20} className="sm:w-6 sm:h-6 text-neutral-text" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-text">Add New Task</h1>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-text mb-2">
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
              className="w-full px-4 py-3 rounded-lg bg-neutral-bg border border-neutral-border focus:outline-none focus:border-primary transition-colors text-neutral-text"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-text mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows={5}
              className="w-full px-4 py-3 rounded-lg bg-neutral-bg border border-neutral-border focus:outline-none focus:border-primary transition-colors text-neutral-text resize-none"
            />
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-text mb-2">
                <MdFlag className="inline mr-2" />
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-neutral-bg border border-neutral-border focus:outline-none focus:border-primary transition-colors text-neutral-text"
              >
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="Extreme">Extreme</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-text mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-neutral-bg border border-neutral-border focus:outline-none focus:border-primary transition-colors text-neutral-text"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-neutral-text mb-2">
              <MdCalendarToday className="inline mr-2" />
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-neutral-bg border border-neutral-border focus:outline-none focus:border-primary transition-colors text-neutral-text"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-neutral-text mb-2">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter category"
              className="w-full px-4 py-3 rounded-lg bg-neutral-bg border border-neutral-border focus:outline-none focus:border-primary transition-colors text-neutral-text"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-text mb-2">
              <MdImage className="inline mr-2" />
              Attach Image
            </label>
            <div className="border-2 border-dashed border-neutral-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <MdImage size={48} className="mx-auto text-neutral-text-muted mb-2" />
              <p className="text-neutral-text-muted">Click to upload or drag and drop</p>
              <p className="text-sm text-neutral-text-light mt-1">PNG, JPG up to 10MB</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4">
            <button
              type="submit"
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-primary text-white rounded-lg text-sm sm:text-base font-medium hover:bg-primary-dark transition-colors shadow-md w-full sm:w-auto"
            >
              Create Task
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-neutral-border text-neutral-text rounded-lg text-sm sm:text-base font-medium hover:bg-neutral-bg transition-colors w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

