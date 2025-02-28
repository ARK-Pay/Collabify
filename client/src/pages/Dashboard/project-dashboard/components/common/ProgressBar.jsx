import { getProgressColor } from "../../utils/helpers";

export const ProgressBar = ({ progress }) => {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = (progress / 100) * circumference;

  return (
    <div className="flex items-center gap-3">
      {/* Circle progress bar for all views */}
      <svg width="40" height="40" className="transform -rotate-90">
        <circle
          cx="20"
          cy="20"
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx="20"
          cy="20"
          r={radius}
          stroke={progress >= 70 ? '#22C55E' : progress >= 40 ? '#EAB308' : '#F97316'}
          strokeWidth="4"
          fill="none"
          strokeDasharray={`${strokeDasharray} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="text-sm">{progress}%</span>
    </div>
  );
};
