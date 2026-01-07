import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDelete, MdEdit, MdMoreHoriz, MdAdd } from 'react-icons/md';
import { todoAPI } from '../services/api';
import { useAPI } from '../hooks/useAPI';

export function Vitals() {
  const navigate = useNavigate();
  const { loading, execute } = useAPI();
  const [selectedTask, setSelectedTask] = useState(0);
  const [tasks, setTasks] = useState([]);

  // Fetch all tasks on mount (vital tasks include all priorities)
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const data = await execute(() => todoAPI.getAll());
    const taskList = data?.results || data || [];
    setTasks(taskList);
    // Reset selected task if list changes
    if (taskList.length > 0 && selectedTask >= taskList.length) {
      setSelectedTask(0);
    }
  };

  // Handle delete task
  const handleDelete = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    await execute(() => todoAPI.delete(taskId), 'Task deleted successfully!');
    fetchTasks(); // Refresh list
  };

  // Exact colors from design
  const priorityColors = {
    Extreme: '#F21E1E',
    Moderate: '#42ADE2',
    Low: '#05A301',
  };

  const statusColors = {
    'Not Started': '#F21E1E',
    'In Progress': '#0225FF',
    'Completed': '#05A301',
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const currentTask = tasks[selectedTask];

  // Show loading or empty state
  if (loading && tasks.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500">Loading vital tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No tasks found. Create your first task!</p>
          <button
            onClick={() => navigate('/add-task')}
            className="px-6 py-2.5 bg-[#FF6767] hover:bg-[#F24E1E] text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
          >
            <MdAdd size={20} />
            Add Task
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Two-panel layout */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 flex-1 min-h-0">
        {/* Left Panel - Task List */}
        <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0 flex flex-col min-h-0">
          <div className="bg-white rounded-xl lg:rounded-2xl border border-[#D3D3D3] p-4 lg:p-6 flex flex-col flex-1 min-h-0">
            {/* Header with Add Task button */}
            <div className="flex items-center justify-between mb-4 lg:mb-6 shrink-0">
              <h2 className="text-base lg:text-xl font-bold text-[#000000] border-b-2 border-[#FF6767] pb-1">
                Vital Tasks
              </h2>
              <button
                onClick={() => navigate('/add-task')}
                className="flex items-center gap-1 text-[#FF6767] hover:text-[#F24E1E] transition-colors"
              >
                <MdAdd size={18} />
                <span className="text-xs font-medium">Add Task</span>
              </button>
            </div>

            {/* Task List */}
            <div className="space-y-3 lg:space-y-4 overflow-y-auto flex-1 min-h-0 pr-1">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(index)}
                  className={`border rounded-xl p-3 lg:p-4 cursor-pointer transition-all ${
                    selectedTask === index 
                      ? 'border-[#FF6767] bg-[#FFF8F8]' 
                      : 'border-[#D3D3D3] hover:border-[#A1A3AB]'
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Priority Circle */}
                    <div className="mt-1 shrink-0">
                      <div 
                        className="w-4 h-4 rounded-full border-2"
                        style={{ borderColor: priorityColors[task.priority] }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-bold text-[#000000] text-sm lg:text-base">{task.title}</h3>
                        <button 
                          className="text-[#A1A3AB] hover:text-[#747474] shrink-0 ml-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MdMoreHoriz size={18} />
                        </button>
                      </div>
                      <p className="text-xs lg:text-sm text-[#747474] mb-2 line-clamp-2">{task.description}</p>

                      {/* Image */}
                      {task.image_url && (
                        <div className="w-16 lg:w-20 h-12 lg:h-16 rounded-lg overflow-hidden mb-2">
                          <img src={task.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}

                      {/* Meta info */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                        <span>
                          <span className="text-[#A1A3AB]">Priority: </span>
                          <span style={{ color: priorityColors[task.priority] }}>{task.priority}</span>
                        </span>
                        <span>
                          <span className="text-[#A1A3AB]">Status: </span>
                          <span style={{ color: statusColors[task.status] }}>{task.status}</span>
                        </span>
                        <span className="text-[#A1A3AB]">Created on: {formatDate(task.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Task Detail */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="bg-white rounded-xl lg:rounded-2xl border border-[#D3D3D3] p-4 lg:p-6 flex-1 flex flex-col min-h-0 relative">
            {/* Header section */}
            <div className="flex gap-4 lg:gap-6 mb-4 lg:mb-6">
              {/* Image */}
              {currentTask.image_url && (
                <div className="w-24 h-24 lg:w-[140px] lg:h-[120px] rounded-xl overflow-hidden shrink-0">
                  <img
                    src={currentTask.image_url}
                    alt={currentTask.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Title and meta */}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg lg:text-xl font-bold text-[#000000] mb-2">{currentTask.title}</h2>
                <div className="space-y-1">
                  <p className="text-xs lg:text-sm">
                    <span className="text-[#000000]">Priority: </span>
                    <span style={{ color: priorityColors[currentTask.priority] }}>{currentTask.priority}</span>
                  </p>
                  <p className="text-xs lg:text-sm">
                    <span className="text-[#000000]">Status: </span>
                    <span style={{ color: statusColors[currentTask.status] }}>{currentTask.status}</span>
                  </p>
                  <p className="text-xs text-[#A1A3AB]">Created on: {formatDate(currentTask.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="flex-1 overflow-y-auto min-h-0 pb-16">
              <div className="text-xs lg:text-sm text-[#747474] leading-relaxed whitespace-pre-line">
                {currentTask.description}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-4 lg:bottom-6 right-4 lg:right-6 flex items-center gap-2 lg:gap-3">
              <button
                onClick={() => handleDelete(currentTask.id)}
                className="w-9 h-9 lg:w-10 lg:h-10 bg-[#FF6767] hover:bg-[#F24E1E] text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <MdDelete size={20} />
              </button>
              <button
                onClick={() => navigate('/edit-task', { state: { task: currentTask } })}
                className="w-9 h-9 lg:w-10 lg:h-10 bg-[#FF6767] hover:bg-[#F24E1E] text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <MdEdit size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
