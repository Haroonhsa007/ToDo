import { useNavigate } from 'react-router-dom';
import { MdMoreHoriz } from 'react-icons/md';

// Exact colors from design
const CARD_BORDER_COLOR = '#D3D3D3';

// Status colors - from design
const statusColors = {
  'Not Started': '#F21E1E',  // Red
  'In Progress': '#0225FF',   // Blue
  'Completed': '#04C400',     // Green
};

// Priority colors - from design (Moderate is cyan, not blue)
const priorityColors = {
  Extreme: '#F21E1E',    // Red
  Moderate: '#42ADE2',   // Cyan/Light Blue
  Low: '#05A301',        // Green
};

export function TaskCard({
  title,
  description,
  priority = 'Moderate',
  status = 'Not Started',
  image,
  createdAt,
  isCompleted = false,
  ...taskProps
}) {
  const navigate = useNavigate();
  const statusColor = statusColors[status] || statusColors['Not Started'];
  const priorityColor = priorityColors[priority] || priorityColors['Moderate'];

  const handleCardClick = () => {
    navigate('/view-task', {
      state: {
        task: { title, description, priority, status, image, createdAt, ...taskProps }
      }
    });
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-transparent rounded-[14px] p-4 cursor-pointer transition-all duration-150 hover:shadow-md"
      style={{ border: `1px solid ${CARD_BORDER_COLOR}` }}
    >
      {/* Top Row - Circle, Title, Menu, Image */}
      <div className="flex gap-4">
        {/* Left - Circle and Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-2">
            {/* Status Circle */}
            <div
              className="w-3 h-3 rounded-full border-2 shrink-0 mt-1"
              style={{ borderColor: statusColor }}
            />
            
            {/* Title and Menu */}
            <div className="flex-1 min-w-0 flex items-start justify-between">
              <h3 className="font-semibold text-[#000000] text-base leading-tight pr-2">{title}</h3>
              <button
                onClick={(e) => e.stopPropagation()}
                className="text-[#A1A3AB] hover:text-[#747474] shrink-0"
              >
                <MdMoreHoriz size={16} />
              </button>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-[#747474] text-sm leading-[100.4%] mb-3 ml-7 line-clamp-2">{description}</p>
          
          {/* Meta Row */}
          <div className="flex items-center gap-6 text-[10px] ml-7 flex-wrap">
            <span>
              <span className="text-[#000000]">Priority: </span>
              <span className="font-medium" style={{ color: priorityColor }}>{priority}</span>
            </span>
            <span>
              <span className="text-[#000000]">Status: </span>
              <span className="font-medium" style={{ color: statusColor }}>{status}</span>
            </span>
            {createdAt && (
              <span className="text-[#A1A3AB] ml-auto">Created on: {createdAt}</span>
            )}
          </div>
        </div>

        {/* Right - Large Image */}
        {image && (
          <div className="w-[88px] h-[88px] rounded-[14px] overflow-hidden shrink-0">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function CompletedTaskCard({ title, description, image, completedAt }) {
  return (
    <div
      className="bg-transparent rounded-[14px] p-4"
      style={{ border: `1px solid ${CARD_BORDER_COLOR}` }}
    >
      <div className="flex gap-4">
        {/* Left Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-2">
            {/* Completed Circle with Check */}
            <div
              className="w-3 h-3 rounded-full shrink-0 mt-1 flex items-center justify-center"
              style={{ backgroundColor: statusColors['Completed'] }}
            >
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            
            {/* Title and Menu */}
            <div className="flex-1 min-w-0 flex items-start justify-between">
              <h3 className="font-semibold text-[#000000] text-base leading-tight">{title}</h3>
              <button className="text-[#A1A3AB] hover:text-[#747474] shrink-0">
                <MdMoreHoriz size={16} />
              </button>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-[#747474] text-sm leading-relaxed mb-2 ml-7 line-clamp-2">{description}</p>
          
          {/* Status */}
          <p className="text-[10px] font-medium ml-7 mb-1" style={{ color: statusColors['Completed'] }}>
            Status: <span style={{ color: '#05A301' }}>Completed</span>
          </p>
          
          {/* Completed Date */}
          {completedAt && (
            <p className="text-[10px] text-[#747474] font-medium ml-7">{completedAt}</p>
          )}
        </div>

        {/* Right - Image */}
        {image && (
          <div className="w-[88px] h-[88px] rounded-[14px] overflow-hidden shrink-0">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}
