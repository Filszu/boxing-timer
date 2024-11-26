import React, { useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Maximize, Minimize, Volume2, VolumeX } from 'lucide-react';
import CircularProgress from './CircularProgress';

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
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [fullscreenAvailable, setFullscreenAvailable] = React.useState(false);
  const [showPulse, setShowPulse] = React.useState(false);

  // Calculate progress percentage
  const progress = timeLeft / (isRest ? restTime : roundTime);

  useEffect(() => {
    setFullscreenAvailable(document.fullscreenEnabled);
  }, []);

  // Add pulse animation when time is low
  useEffect(() => {
    setShowPulse(timeLeft <= 10 && isActive);
  }, [timeLeft, isActive]);

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
  }, [isActive, isFullscreen, fullscreenAvailable]);

  return (
    <div
      ref={timerRef}
      className={`flex flex-col items-center justify-center space-y-6 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg w-full transition-colors duration-200
        ${isFullscreen ? 'fixed inset-0 rounded-none z-50' : 'max-w-md'}`}
    >
      <div className={`relative ${showPulse ? 'animate-pulse' : ''}`}>
        {showProgress && (
          <CircularProgress
            progress={progress}
            size={isFullscreen ? 600 : 400}
            isRest={isRest}
            pulseAnimation={showPulse}
          />
        )}
        <div className={`${showProgress ? 'absolute inset-0' : ''} flex flex-col items-center justify-center`}>
          <div className={`text-8xl font-bold tracking-wider ${isRest ? 'text-green-500 dark:text-green-400' : 'text-blue-500 dark:text-blue-400'} ${isFullscreen ? 'text-9xl' : ''} transition-colors duration-300`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          
          <div className={`text-4xl font-semibold text-gray-600 dark:text-gray-300 mt-4 ${isFullscreen ? 'text-5xl' : ''}`}>
            Round {currentRound}/{totalRounds}
          </div>
          
          <div className={`text-3xl font-medium mt-2 ${isRest ? 'text-green-500 dark:text-green-400' : 'text-blue-500 dark:text-blue-400'} ${isFullscreen ? 'text-4xl' : ''}`}>
            {isRest ? 'Rest Period' : 'Work Period'}
          </div>
        </div>
      </div>
      
      <div className="flex space-x-4 mt-8">
        <button
          onClick={onToggle}
          className={`${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} 
            dark:bg-blue-600 dark:hover:bg-blue-700 text-white p-6 rounded-full transition-all duration-300 transform hover:scale-105`}
        >
          {isActive ? <Pause size={32} /> : <Play size={32} />}
        </button>
        
        <button
          onClick={onReset}
          className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 p-6 rounded-full transition-all duration-300 transform hover:scale-105"
        >
          <RotateCcw size={32} />
        </button>

        <button
          onClick={onMuteToggle}
          className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 p-6 rounded-full transition-all duration-300 transform hover:scale-105"
        >
          {isMuted ? <VolumeX size={32} /> : <Volume2 size={32} />}
        </button>

        {fullscreenAvailable && (
          <button
            onClick={toggleFullscreen}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 p-6 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            {isFullscreen ? <Minimize size={32} /> : <Maximize size={32} />}
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