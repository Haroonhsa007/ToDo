export function TaskStatusChart({ percentage, label, color }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Exact colors from design
  const colors = {
    'completed': '#04C400',    // Green
    'progress': '#0225FF',      // Blue
    'not-started': '#F21E1E',   // Red
    'stroke-bg': '#D9D9D9',     // Gray background
  };

  const strokeColor = colors[color] || colors.completed;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 sm:w-28 sm:h-28">
        <svg className="transform -rotate-90 w-24 h-24 sm:w-28 sm:h-28">
          {/* Background circle */}
          <circle
            cx="50%"
            cy="50%"
            r="40%"
            stroke={colors['stroke-bg']}
            strokeWidth="10"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="50%"
            cy="50%"
            r="40%"
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
          <span className="text-xl sm:text-2xl font-bold text-[#000000]">{percentage}%</span>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2 sm:mt-3">
        <div
          className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0"
          style={{ backgroundColor: strokeColor }}
        />
        <span className="text-xs sm:text-sm font-medium text-[#000000]">{label}</span>
      </div>
    </div>
  );
}
