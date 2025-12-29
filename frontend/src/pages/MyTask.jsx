import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDelete, MdEdit, MdMoreHoriz } from 'react-icons/md';

export function MyTask() {
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState(0);

  const tasks = [
    {
      id: 1,
      title: 'Submit Documents',
      description: 'Make sure to submit all the necessary docum.....',
      priority: 'Extreme',
      status: 'Not Started',
      createdAt: '20/06/2023',
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=200',
      fullDescription: `Task Title: Document Submission.

Objective: To submit required documents for something important

Task Description: Review the list of documents required for submission and ensure all necessary documents are ready. Organize the documents accordingly and scan them if physical copies need to be submitted digitally. Rename the scanned files appropriately for easy identification and verify the accepted file formats. Upload the documents securely to the designated platform, double-check for accuracy, and obtain confirmation of successful submission. Follow up if necessary to ensure proper processing.

Additional Notes:
• Ensure that the documents are authentic and up-to-date.
• Maintain confidentiality and security of sensitive information during the submission process.
• If there are specific guidelines or deadlines for submission, adhere to them diligently.

Deadline for Submission: End of Day`,
    },
    {
      id: 2,
      title: 'Complete assignments',
      description: 'The assignments must be completed to pass final year....',
      priority: 'Moderate',
      status: 'In Progress',
      createdAt: '20/06/2023',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=200',
      fullDescription: 'Complete all pending assignments for final year evaluation.',
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
              My Tasks
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
