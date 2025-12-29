import { useNavigate, useLocation } from 'react-router-dom';
import { MdDelete, MdEdit, MdPriorityHigh } from 'react-icons/md';

export function ViewTask() {
  const navigate = useNavigate();
  const location = useLocation();
  const task = location.state?.task;
  
  const taskData = task || {
    title: "Attend Nischal's Birthday Party",
    description: `Buy gifts on the way and pick up cake from the bakery. (6 PM | Fresh Elements)

1. A cake, with candles to blow out. (Layer cake, cupcake, flat sheet cake)
2. The birthday song.
3. A place to collect gifts.

Optional:
• Paper cone-shaped party hats, paper whistles that unroll.
• Games, activities (carry an object with your knees, then drop it into a milk bottle.)
• Lunch: sandwich halves, or pizza slices, juice, pretzels, potato chips...THEN cake & candles and the song.`,
    priority: 'Moderate',
    status: 'Not Started',
    createdAt: '20/06/2023',
    image: 'https://images.unsplash.com/photo-1529543544277-750e1a88dfc5?w=400',
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

  return (
    <div className="w-full h-full flex flex-col">
      {/* Main Container */}
      <div className="bg-white rounded-xl lg:rounded-2xl border border-[#D3D3D3] p-4 sm:p-6 lg:p-8 flex-1 flex flex-col min-h-0 relative">
        {/* Go Back Link - top right */}
        <div className="absolute top-4 sm:top-6 lg:top-8 right-4 sm:right-6 lg:right-8">
          <button
            onClick={() => navigate(-1)}
            className="text-[#000000] hover:text-[#747474] transition-colors text-sm font-medium underline"
          >
            Go Back
          </button>
        </div>

        {/* Header - Image and Details side by side */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
          {/* Image */}
          {taskData.image && (
            <div className="w-full sm:w-[180px] lg:w-[200px] h-40 sm:h-[160px] lg:h-[180px] rounded-xl overflow-hidden shrink-0">
              <img 
                src={taskData.image} 
                alt={taskData.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title and Meta */}
          <div className="flex-1 min-w-0 pt-0 sm:pt-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#000000] mb-3 pr-20">
              {taskData.title}
            </h1>

            <div className="space-y-2">
              <p className="text-sm lg:text-base">
                <span className="text-[#000000]">Priority: </span>
                <span style={{ color: priorityColors[taskData.priority] }}>{taskData.priority}</span>
              </p>
              <p className="text-sm lg:text-base">
                <span className="text-[#000000]">Status: </span>
                <span style={{ color: statusColors[taskData.status] }}>{taskData.status}</span>
              </p>
              <p className="text-xs lg:text-sm text-[#A1A3AB]">Created on: {taskData.createdAt}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="flex-1 overflow-y-auto min-h-0 pb-16">
          <div className="text-sm lg:text-base text-[#747474] leading-relaxed whitespace-pre-line">
            {taskData.description}
          </div>
        </div>

        {/* Action Buttons - bottom right */}
        <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 right-4 sm:right-6 lg:right-8 flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {/* Handle delete */}}
            className="w-10 h-10 lg:w-11 lg:h-11 bg-[#FF6767] hover:bg-[#F24E1E] text-white rounded-lg flex items-center justify-center transition-colors"
          >
            <MdDelete size={22} />
          </button>
          <button
            onClick={() => navigate('/edit-task', { state: { task: taskData } })}
            className="w-10 h-10 lg:w-11 lg:h-11 bg-[#FF6767] hover:bg-[#F24E1E] text-white rounded-lg flex items-center justify-center transition-colors"
          >
            <MdEdit size={22} />
          </button>
          <button
            onClick={() => {/* Handle vital/priority */}}
            className="w-10 h-10 lg:w-11 lg:h-11 bg-[#FF6767] hover:bg-[#F24E1E] text-white rounded-lg flex items-center justify-center transition-colors"
          >
            <MdPriorityHigh size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
