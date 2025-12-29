import { useNavigate } from 'react-router-dom';
import { BsThreeDotsVertical } from 'react-icons/bs';

// Custom border color for the card as per #A1A3AB
const CARD_BORDER_COLOR = '#A1A3AB';
const CARD_TEXT_COLOR = '#747474';

const statusColors = {
  'Not Started': '#F21E1E',
  'In Progress': '#0225FF',
  'Completed': '#05A301',
};

const priorityColors = {
  Extreme: '#F21E1E',
  Moderate: '#42ADE2',
  Low: '#05A301',
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
      className="bg-white rounded-2xl px-4 py-[18px] shadow-soft cursor-pointer transition-all duration-150 hover:shadow-medium"
      style={{
        minHeight: '116px',
        boxSizing: 'border-box',
        border: `1px solid ${CARD_BORDER_COLOR}`,
      }}
    >
      <div className="flex gap-4 items-center">
        {/* Main Content Left */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-[6px]">
            <div className="flex items-center gap-[8px] flex-1 min-w-0">
              {/* Radio Button */}
              <span
                className="w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors shrink-0"
                style={{
                  minWidth: '16px',
                  minHeight: '16px',
                  marginTop: '2px',
                  borderColor: statusColor
                }}
              >
                {/* The circle is empty for not started/progress; could add check for completed */}
              </span>
              <h3 className="font-bold text-[18px] leading-[1.1] text-neutral-text truncate">{title}</h3>
            </div>
            <button
              onClick={e => e.stopPropagation()}
              className="text-[#A0AFC0] hover:text-neutral-text transition-colors p-1 shrink-0 relative"
              tabIndex={-1}
              style={{
                marginRight: '2px',
                marginTop: '0px'
              }}
            >
              {/* Hidden dots for pixel-perfect but empty spot */}
              <BsThreeDotsVertical size={18} className="opacity-0 pointer-events-none" />
            </button>
          </div>
          <p className="text-[#A0AFC0] text-[15px] font-normal leading-[21px] mb-2 truncate">{description}</p>
          <div className="flex items-center gap-5 text-[13px] mt-1 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-[#8896ab] text-[13px] leading-none">Priority:</span>
              <span className="font-bold text-[13px] leading-none" style={{ color: priorityColor }}>{priority}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#8896ab] text-[13px] leading-none">Status:</span>
              <span className="font-bold text-[13px] leading-none" style={{ color: statusColor }}>{status}</span>
            </div>
            {createdAt && (
              <div className="flex items-center ml-1">
                <span className="text-[#BAC3CF] text-[13px] leading-none">Created on: {createdAt}</span>
              </div>
            )}
          </div>
        </div>
        {/* Main Content Right - Image */}
        {image && (
          <div className="w-[86px] h-[86px] rounded-[14px] overflow-hidden shrink-0 bg-gray-200 shadow-[0_1px_2px_rgba(16,24,40,0.05)] flex items-center justify-center">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              draggable={false}
              style={{ pointerEvents: 'none' }}
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
      className="bg-white rounded-2xl p-5 shadow-soft"
      style={{ border: `1px solid ${CARD_BORDER_COLOR}` }}
    >
      <div className="flex gap-4">
        <div className="flex items-start">
          <div 
            className="w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1"
            style={{ 
              backgroundColor: statusColors['Completed'],
              borderColor: statusColors['Completed']
            }}
          >
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-lg text-neutral-text mb-1">{title}</h3>
          <p className="text-neutral-text-light text-sm mb-2">{description}</p>
          <p className="text-xs font-semibold" style={{ color: statusColors['Completed'] }}>Status: Completed</p>
          {completedAt && (
            <p className="text-xs text-neutral-text-muted mt-1">{completedAt}</p>
          )}
        </div>

        {image && (
          <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 shadow-sm">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}

