import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDelete, MdEdit, MdMoreHoriz } from 'react-icons/md';

export function Vitals() {
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState(0);

  const tasks = [
    {
      id: 1,
      title: 'Walk the dog',
      description: 'Take the dog to the park and bring treats as well.....',
      priority: 'Extreme',
      status: 'Not Started',
      createdAt: '20/06/2023',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200',
      fullDescription: `Take the dog to the park and bring treats as well.

Take Luffy and Jiro for a leisurely stroll around the neighborhood. Enjoy the fresh air and give them the exercise and mental stimulation they need for a happy and healthy day. Don't forget to bring along squeaky and fluffy for some extra fun along the way!

1. Listen to a podcast or audiobook
2. Practice mindfulness or meditation
3. Take photos of interesting sights along the way
4. Practice obedience training with your dog
5. Chat with neighbors or other dog walkers
6. Listen to music or an upbeat playlist`,
    },
    {
      id: 2,
      title: 'Take grandma to hospital',
      description: 'Go back home and take grandma to the hosp....',
      priority: 'Moderate',
      status: 'In Progress',
      createdAt: '20/06/2023',
      image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=200',
      fullDescription: 'Go back home and take grandma to the hospital for her regular checkup.',
    },
  ];

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

  const currentTask = tasks[selectedTask];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Two-panel layout */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 flex-1 min-h-0">
        {/* Left Panel - Task List */}
        <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0 flex flex-col min-h-0">
          <div className="bg-white rounded-xl lg:rounded-2xl border border-[#D3D3D3] p-4 lg:p-6 flex flex-col flex-1 min-h-0">
            {/* Header with underline */}
            <h2 className="text-base lg:text-xl font-bold text-[#000000] border-b-2 border-[#FF6767] pb-1 mb-4 lg:mb-6 inline-block self-start">
              Vital Tasks
            </h2>

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
                      {task.image && (
                        <div className="w-16 lg:w-20 h-12 lg:h-16 rounded-lg overflow-hidden mb-2">
                          <img src={task.image} alt="" className="w-full h-full object-cover" />
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
                        <span className="text-[#A1A3AB]">Created on: {task.createdAt}</span>
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
              {currentTask.image && (
                <div className="w-24 h-24 lg:w-[140px] lg:h-[120px] rounded-xl overflow-hidden shrink-0">
                  <img 
                    src={currentTask.image} 
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
                  <p className="text-xs text-[#A1A3AB]">Created on: {currentTask.createdAt}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="flex-1 overflow-y-auto min-h-0 pb-16">
              <div className="text-xs lg:text-sm text-[#747474] leading-relaxed whitespace-pre-line">
                {currentTask.fullDescription}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-4 lg:bottom-6 right-4 lg:right-6 flex items-center gap-2 lg:gap-3">
              <button
                onClick={() => {/* Handle delete */}}
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
