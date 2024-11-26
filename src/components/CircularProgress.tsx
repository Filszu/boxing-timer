import React from 'react';

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  isRest?: boolean;
  pulseAnimation?: boolean;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 400,
  strokeWidth = 12,
  isRest = false,
  pulseAnimation = false,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <div className={`relative ${pulseAnimation ? 'animate-pulse' : ''}`} style={{ width: size, height: size }}>
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
          className={`${isRest ? 'text-green-500' : 'text-blue-500'} transition-all duration-500 ease-in-out`}
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