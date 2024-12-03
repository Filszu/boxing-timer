import React, { useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Maximize, Minimize, Volume2, VolumeX } from 'lucide-react';
import CircularProgress from './CircularProgress';
import { formatTime } from '../utils/timeUtils';

interface TimerProps {
  isActive: boolean;
  currentRound: number;
  timeLeft: number;
  totalRounds: number;
  isRest: boolean;
  roundTime: number;
  restTime: number;
  showProgress: boolean;
  onToggle: () => void;
  onReset: () => void;
  onMuteToggle: () => void;
  isMuted: boolean;
}

const Timer: React.FC<TimerProps> = ({
  isActive,
  currentRound,
  timeLeft,
  totalRounds,
  isRest,
  roundTime,
  restTime,
  showProgress,
  onToggle,
  onReset,
  onMuteToggle,
  isMuted,
}) => {
  const timerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [fullscreenAvailable, setFullscreenAvailable] = React.useState(false);
  const [showPulse, setShowPulse] = React.useState(false);
  const isFinished = timeLeft === 0 && currentRound === totalRounds && !isRest;

  // Calculate progress percentage
  const progress = timeLeft / (isRest ? restTime : roundTime);

  // Calculate responsive size based on viewport
  const getCircleSize = () => {
    if (isFullscreen) return Math.min(window.innerWidth, window.innerHeight) * 0.7;
    return Math.min(window.innerWidth * 0.8, 400);
  };

  const [circleSize, setCircleSize] = React.useState(getCircleSize());

  useEffect(() => {
    const handleResize = () => {
      setCircleSize(getCircleSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFullscreen]);

  useEffect(() => {
    setFullscreenAvailable(document.fullscreenEnabled);
  }, []);

  useEffect(() => {
    setShowPulse(timeLeft <= 10 && isActive && !isFinished);
  }, [timeLeft, isActive, isFinished]);

  const toggleFullscreen = async () => {
    if (!fullscreenAvailable) return;

    try {
      if (!document.fullscreenElement) {
        await timerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (isActive && !isFullscreen && fullscreenAvailable) {
      toggleFullscreen().catch(console.warn);
    }
  }, [isActive]);

  return (
    <div
      ref={timerRef}
      className={`flex flex-col items-center justify-center space-y-6 bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-8 shadow-lg w-full transition-colors duration-200
        ${isFullscreen ? 'fixed inset-0 rounded-none z-50' : 'max-w-full sm:max-w-2xl mx-auto'}`}
    >
      <div className={`relative ${showPulse ? 'animate-pulse' : ''}`}>
        {showProgress && (
          <CircularProgress
            progress={progress}
            size={circleSize}
            isRest={isRest}
            pulseAnimation={showPulse}
          />
        )}
        <div className={`${showProgress ? 'absolute inset-0' : ''} flex flex-col items-center justify-center`}>
          {isFinished ? (
            <div className="text-4xl sm:text-6xl md:text-8xl font-bold text-green-500 dark:text-green-400 animate-bounce">
              FINISHED!
            </div>
          ) : (
            <>
              <div className={`text-4xl sm:text-6xl md:text-8xl font-bold tracking-wider ${
                isRest ? 'text-green-500 dark:text-green-400' : 'text-blue-500 dark:text-blue-400'
              } ${isFullscreen ? 'text-9xl' : ''} transition-colors duration-300`}>
                {formatTime(timeLeft)}
              </div>
              
              <div className={`text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-600 dark:text-gray-300 mt-4 ${
                isFullscreen ? 'text-5xl' : ''
              }`}>
                Round {currentRound}/{totalRounds}
              </div>
              
              <div className={`text-xl sm:text-2xl md:text-3xl font-medium mt-2 ${
                isRest ? 'text-green-500 dark:text-green-400' : 'text-blue-500 dark:text-blue-400'
              } ${isFullscreen ? 'text-4xl' : ''}`}>
                {isRest ? 'Rest Period' : 'Work Period'}
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <button
          onClick={onToggle}
          className={`${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} 
            dark:bg-blue-600 dark:hover:bg-blue-700 text-white p-4 sm:p-6 rounded-full transition-all duration-300 transform hover:scale-105`}
        >
          {isActive ? <Pause size={24} className="sm:w-8 sm:h-8" /> : <Play size={24} className="sm:w-8 sm:h-8" />}
        </button>
        
        <button
          onClick={onReset}
          className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 p-4 sm:p-6 rounded-full transition-all duration-300 transform hover:scale-105"
        >
          <RotateCcw size={24} className="sm:w-8 sm:h-8" />
        </button>

        <button
          onClick={onMuteToggle}
          className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 p-4 sm:p-6 rounded-full transition-all duration-300 transform hover:scale-105"
        >
          {isMuted ? 
            <VolumeX size={24} className="sm:w-8 sm:h-8" /> : 
            <Volume2 size={24} className="sm:w-8 sm:h-8" />
          }
        </button>

        {fullscreenAvailable && (
          <button
            onClick={toggleFullscreen}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 p-4 sm:p-6 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            {isFullscreen ? 
              <Minimize size={24} className="sm:w-8 sm:h-8" /> : 
              <Maximize size={24} className="sm:w-8 sm:h-8" />
            }
          </button>
        )}
      </div>

      {isFullscreen && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400">
          Press ESC to exit fullscreen
        </div>
      )}
    </div>
  );
};

export default Timer;