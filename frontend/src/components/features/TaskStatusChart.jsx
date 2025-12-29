export function TaskStatusChart({ percentage, label, color }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colors = {
    'completed': '#04C400',
    'progress': '#0225FF',
    'not-started': '#F21E1E',
    'stroke-Color': '#D9D9D9',
  };

  const strokeColor = colors[color] || colors.completed;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg className="transform -rotate-90 w-28 h-28">
          {/* Background circle */}
          <circle
            cx="56"
            cy="56"
            r="45"
            stroke={colors['stroke-Color']}
            strokeWidth="10"
            fill="none"
            className="text-stroke-Color"
          />
          {/* Progress circle */}
          <circle
            cx="56"
            cy="56"
            r="45"
            stroke={strokeColor}
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-neutral-text">{percentage}%</span>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: strokeColor }}
        />
        <span className={`text-sm font-medium ${color === 'completed' ? 'text-status-completed' : color === 'progress' ? 'text-secondary-blue' : 'text-status-not-started'}`}>{label}</span>
      </div>
    </div>
  );
}
