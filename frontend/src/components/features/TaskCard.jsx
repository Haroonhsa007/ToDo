import { BsThreeDotsVertical } from 'react-icons/bs';

const statusColors = {
  'Not Started': 'text-status-not-started',
  'In Progress': 'text-secondary-blue',
  Completed: 'text-status-completed',
};

const priorityColors = {
  Extreme: 'text-status-not-started',
  Moderate: 'text-secondary-blue',
  Low: 'text-status-completed',
};

export function TaskCard({
  title,
  description,
  priority = 'Moderate',
  status = 'Not Started',
  image,
  createdAt,
  isCompleted = false,
}) {
  const statusColor = statusColors[status] || statusColors['Not Started'];
  const priorityColor = priorityColors[priority] || priorityColors['Moderate'];

  // Get radio button color based on status
  const getRadioButtonColor = () => {
    if (status === 'Completed') return 'border-status-completed';
    if (status === 'In Progress') return 'border-secondary-blue';
    return 'border-status-not-started'; // Not Started
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-soft hover:shadow-medium transition-all border border-neutral-border/20">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 ${getRadioButtonColor()}`}
          >
          </div>
        </div>
        <button className="text-neutral-text-muted hover:text-neutral-text transition-colors p-1 flex-shrink-0">
          <BsThreeDotsVertical size={18} />
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-neutral-text mb-2 leading-tight">{title}</h3>
          <p className="text-neutral-text-light text-sm line-clamp-2 mb-3 leading-relaxed">{description}</p>

          <div className="flex items-center gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-text-muted text-sm">Priority:</span>
              <span className={`font-bold text-sm ${priorityColor}`}>{priority}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-text-muted text-sm">Status:</span>
              <span className={`font-bold text-sm ${statusColor}`}>{status}</span>
            </div>
          </div>

          {createdAt && (
            <p className="text-xs text-neutral-text-muted mt-2">Created on: {createdAt}</p>
          )}
        </div>

        {image && (
          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}

export function CompletedTaskCard({ title, description, image, completedAt }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-soft border border-neutral-border/20">
      <div className="flex gap-4">
        <div className="flex items-start">
          <div className="w-5 h-5 rounded-full bg-status-completed border-2 border-status-completed flex items-center justify-center mt-1">
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
          <p className="text-xs text-status-completed font-semibold">Status: Completed</p>
          {completedAt && (
            <p className="text-xs text-neutral-text-muted mt-1">{completedAt}</p>
          )}
        </div>

        {image && (
          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}
