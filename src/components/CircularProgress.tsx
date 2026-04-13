import React from 'react';

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  isRest?: boolean;
  isPrep?: boolean;
  isAccelerating?: boolean;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 400,
  strokeWidth = 12,
  isRest = false,
  isPrep = false,
  isAccelerating = false,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg
        className="absolute transform -rotate-90"
        width={size}
        height={size}
      >
        <circle
          className="text-gray-200 dark:text-gray-700 transition-colors duration-300"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="none"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className={`${
            isAccelerating
              ? 'text-red-500'
              : isPrep
                ? 'text-yellow-500'
                : isRest
                  ? 'text-green-500'
                  : 'text-blue-500'
          } transition-colors duration-300`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="none"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
    </div>
  );
};

export default CircularProgress;