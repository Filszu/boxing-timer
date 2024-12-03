import React, { useState, useEffect, useCallback } from 'react';
import Timer from './components/Timer';
import Settings from './components/Settings';
import Stats from './components/stats/Stats';
import Presets from './components/Presets';
import { Dumbbell, Moon, Sun, Bell } from 'lucide-react';
import useSound from 'use-sound';
import { useNotification } from './hooks/useNotification';
import type { Preset, Session, Round } from './types';

const DEFAULT_SETTINGS: Omit<Preset, 'id' | 'name'> = {
  roundTime: 180,
  restTime: 60,
  totalRounds: 3,
  roundEndWarning: 10,
  restEndWarning: 5,
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  const { permission, requestPermission, showNotification } = useNotification();

  // Timer state
  const [roundTime, setRoundTime] = useState(DEFAULT_SETTINGS.roundTime);
  const [restTime, setRestTime] = useState(DEFAULT_SETTINGS.restTime);
  const [totalRounds, setTotalRounds] = useState(DEFAULT_SETTINGS.totalRounds);
  const [roundEndWarning, setRoundEndWarning] = useState(DEFAULT_SETTINGS.roundEndWarning);
  const [restEndWarning, setRestEndWarning] = useState(DEFAULT_SETTINGS.restEndWarning);
  const [showProgress, setShowProgress] = useState(true);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(roundTime);
  const [isActive, setIsActive] = useState(false);
  const [isRest, setIsRest] = useState(false);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  // Presets and sessions state
  const [presets, setPresets] = useState<Preset[]>(() => {
    const saved = localStorage.getItem('boxingPresets');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem('boxingSessions');
    return saved ? JSON.parse(saved) : [];
  });

  // Sound effects with volume control
  // Sound effects with volume control
  const [playStart] = useSound('/sounds/alarm2.mp3', { 
    volume: isMuted ? 0 : 10
  });
  const [playEnd] = useSound('/sounds/bell.wav', { 
    volume: isMuted ? 0 : 10
  });
  const [playWarning] = useSound('https://assets.mixkit.co/active_storage/sfx/1862/1862-preview.mp3', { 
    volume: isMuted ? 0 : 7
  });
  const [playTick] = useSound('https://assets.mixkit.co/active_storage/sfx/2002/2002-preview.mp3', { 
    volume: isMuted ? 0 : 3
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('boxingPresets', JSON.stringify(presets));
  }, [presets]);

  useEffect(() => {
    localStorage.setItem('boxingSessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleSettingsChange = (setting: string, value: number | boolean) => {
    switch (setting) {
      case 'roundTime':
        setRoundTime(value as number);
        if (!isActive) setTimeLeft(value as number);
        break;
      case 'restTime':
        setRestTime(value as number);
        break;
      case 'totalRounds':
        setTotalRounds(value as number);
        break;
      case 'roundEndWarning':
        setRoundEndWarning(value as number);
        break;
      case 'restEndWarning':
        setRestEndWarning(value as number);
        break;
      case 'showProgress':
        setShowProgress(value as boolean);
        break;
    }
  };

  const handlePresetSelect = (preset: Preset) => {
    setRoundTime(preset.roundTime);
    setRestTime(preset.restTime);
    setTotalRounds(preset.totalRounds);
    setRoundEndWarning(preset.roundEndWarning);
    setRestEndWarning(preset.restEndWarning);
    if (!isActive) setTimeLeft(preset.roundTime);
  };

  const handlePresetSave = (preset: Omit<Preset, 'id'>) => {
    const newPreset = {
      ...preset,
      id: Date.now().toString(),
    };
    setPresets(prev => [...prev, newPreset]);
  };

  const handlePresetDelete = (id: string) => {
    setPresets(prev => prev.filter(preset => preset.id !== id));
  };

  const saveSession = useCallback(() => {
    if (rounds.length > 0) {
      const session: Session = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        rounds: [...rounds],
        presetUsed: 'custom',
      };
      setSessions(prev => [...prev, session]);
      setRounds([]);

      // Show completion notification
      if (permission === 'granted') {
        showNotification('Workout Complete! 🎉', {
          body: `Great job! You completed ${totalRounds} rounds.`,
          // vibrate: [200, 100, 200],
        });
      }
    }
  }, [rounds, totalRounds, permission, showNotification]);

  const reset = useCallback(() => {
    if (rounds.length > 0) {
      saveSession();
    }
    setIsActive(false);
    setCurrentRound(1);
    setTimeLeft(roundTime);
    setIsRest(false);
  }, [roundTime, rounds, saveSession]);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => {
          if (
            ((!isRest && time === roundEndWarning + 1) ||
             (isRest && time === restEndWarning + 1)) &&
            time > 1
          ) {
            playWarning();
            if (permission === 'granted') {
              showNotification(isRest ? 'Rest Period Ending!' : 'Round Ending!', {
                body: `${time - 1} seconds remaining`,
                silent: true,
              });
            }
          } else if (time <= 3 && time > 0) {
            playTick();
          }
          return time - 1;
        });
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      if (!isRest && currentRound <= totalRounds) {
        playEnd();
        setRounds(prev => [...prev, {
          round: currentRound,
          duration: roundTime,
          type: 'work',
          timestamp: Date.now(),
        }]);
        if (currentRound < totalRounds) {
          setIsRest(true);
          setTimeLeft(restTime);
          if (permission === 'granted') {
            showNotification('Round Complete! 🥊', {
              body: `Round ${currentRound} finished! Time to rest.`,
            });
          }
        } else {
          setIsActive(false);
          saveSession();
        }
      } else if (isRest) {
        playStart();
        setIsRest(false);
        setCurrentRound(r => r + 1);
        setTimeLeft(roundTime);
        setRounds(prev => [...prev, {
          round: currentRound,
          duration: restTime,
          type: 'rest',
          timestamp: Date.now(),
        }]);
        if (permission === 'granted') {
          showNotification('Rest Complete! 🔔', {
            body: `Get ready for Round ${currentRound + 1}!`,
          });
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, currentRound, totalRounds, isRest, roundTime, restTime,
      roundEndWarning, restEndWarning, playStart, playEnd, playWarning, playTick, 
      saveSession, permission, showNotification]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 sm:py-12 px-4 transition-colors duration-200">
      <main className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="text-center mb-8 sm:mb-12 relative px-8">
          <div className="absolute right-0 top-0 flex items-center gap-2">
            {permission !== 'granted' && (
              <button
                onClick={requestPermission}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                title="Enable notifications"
              >
                <Bell size={20} />
              </button>
            )}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              <div className="relative w-6 h-6">
                <Sun className={`absolute transition-all duration-300 ${isDarkMode ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                <Moon className={`absolute transition-all duration-300 ${isDarkMode ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
              </div>
            </button>
          </div>
          <div className="flex items-center justify-center mb-4">
            <Dumbbell className="text-blue-500 dark:text-blue-400 mr-2 w-6 h-6 sm:w-8 sm:h-8" />
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-white truncate">Boxing Timer Pro</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Professional Boxing Training Timer</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-6 sm:space-y-8">
            <Timer
              isActive={isActive}
              currentRound={currentRound}
              timeLeft={timeLeft}
              totalRounds={totalRounds}
              isRest={isRest}
              roundTime={roundTime}
              restTime={restTime}
              onToggle={() => setIsActive(!isActive)}
              onReset={reset}
              showProgress={showProgress}
              onMuteToggle={() => setIsMuted(!isMuted)}
              isMuted={isMuted}
            />
            
            <Settings
              roundTime={roundTime}
              restTime={restTime}
              totalRounds={totalRounds}
              roundEndWarning={roundEndWarning}
              restEndWarning={restEndWarning}
              showProgress={showProgress}
              onSettingsChange={handleSettingsChange}
            />

            <Presets
              presets={presets}
              currentSettings={{
                roundTime,
                restTime,
                totalRounds,
                roundEndWarning,
                restEndWarning,
              }}
              onPresetSelect={handlePresetSelect}
              onPresetSave={handlePresetSave}
              onPresetDelete={handlePresetDelete}
            />
          </div>
          
          <Stats rounds={rounds} sessions={sessions} />
        </div>
      </main>
      <footer className="text-center w-full my-10 text-gray-800 dark:text-white ">
                    <h3>
                        Created with ❣️ by{' '}
                        <a
                            href={'https://lessons.ciac.me/'}
                            className="link-underline text-primary"
                        >
                            Filszu
                        </a>{' '}
                       2024
                    </h3>
                    <h3 className="">
                        Give a ⭐ on{' '}
                        <a
                            href={'https://github.com/Filszu/'}
                            className="link-underline text-primary"
                        >
                            {/* <FiGithub size={10} />  */}
                            Github repo
                        </a>
                    </h3>
                </footer>
    </div>
  );
}

export default App;