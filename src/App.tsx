import { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import Timer from "./components/Timer";
import Settings from "./components/Settings";
import Stats from "./components/stats/Stats";
import Presets from "./components/Presets";
import { Dumbbell, Moon, Sun, Bell } from "lucide-react";
import useSound from "use-sound";
import { useNotification } from "./hooks/useNotification";
import type { Preset, Session, Round, ActiveTrainingMode } from "./types";
import {
  computeAccelRanges,
  computeBeepTimes,
  getAccelRemainingSeconds,
  isInsideAccelRange,
} from "./utils/activeTraining";
import SupporterTile from "./components/SupporterTile";

const DEFAULT_SETTINGS: Omit<Preset, "id" | "name"> = {
  roundTime: 180,
  restTime: 60,
  totalRounds: 3,
  roundEndWarning: 10,
  restEndWarning: 5,
  preRoundTime: 0,
  activeTrainingMode: "off",
  accelDurationFixed: 3,
  accelDurationRandom: false,
  accelDurationMin: 1,
  accelDurationMax: 3,
  accelBreakFixed: 10,
  accelBreakRandom: false,
  accelBreakMin: 8,
  accelBreakMax: 15,
  beepGapMin: 5,
  beepGapMax: 15,
  showAccelSubtimer: false,
};

function normalizePresetTraining(
  p: Partial<Preset> & Pick<Preset, "id" | "name">
): Preset {
  return {
    ...DEFAULT_SETTINGS,
    ...p,
    preRoundTime: p.preRoundTime ?? 0,
    activeTrainingMode: p.activeTrainingMode ?? "off",
    accelDurationFixed: p.accelDurationFixed ?? DEFAULT_SETTINGS.accelDurationFixed,
    accelDurationRandom: p.accelDurationRandom ?? false,
    accelDurationMin: p.accelDurationMin ?? DEFAULT_SETTINGS.accelDurationMin,
    accelDurationMax: p.accelDurationMax ?? DEFAULT_SETTINGS.accelDurationMax,
    accelBreakFixed: p.accelBreakFixed ?? DEFAULT_SETTINGS.accelBreakFixed,
    accelBreakRandom: p.accelBreakRandom ?? false,
    accelBreakMin: p.accelBreakMin ?? DEFAULT_SETTINGS.accelBreakMin,
    accelBreakMax: p.accelBreakMax ?? DEFAULT_SETTINGS.accelBreakMax,
    beepGapMin: p.beepGapMin ?? DEFAULT_SETTINGS.beepGapMin,
    beepGapMax: p.beepGapMax ?? DEFAULT_SETTINGS.beepGapMax,
    showAccelSubtimer: p.showAccelSubtimer ?? false,
  };
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true";
    }
    return false;
  });

  const { permission, requestPermission, showNotification } = useNotification();

  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("boxingNotificationsEnabled");
    if (stored === null) return true;
    return stored === "true";
  });

  // Timer state
  const [roundTime, setRoundTime] = useState(DEFAULT_SETTINGS.roundTime);
  const [restTime, setRestTime] = useState(DEFAULT_SETTINGS.restTime);
  const [totalRounds, setTotalRounds] = useState(DEFAULT_SETTINGS.totalRounds);
  const [roundEndWarning, setRoundEndWarning] = useState(
    DEFAULT_SETTINGS.roundEndWarning
  );
  const [restEndWarning, setRestEndWarning] = useState(
    DEFAULT_SETTINGS.restEndWarning
  );
  const [preRoundTime, setPreRoundTime] = useState(DEFAULT_SETTINGS.preRoundTime);
  const [showProgress, setShowProgress] = useState(true);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(roundTime);
  const [isActive, setIsActive] = useState(false);
  const [isRest, setIsRest] = useState(false);
  const [isPrep, setIsPrep] = useState(false);
  const [preRoundConsumed, setPreRoundConsumed] = useState(false);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  const [activeTrainingMode, setActiveTrainingMode] = useState<ActiveTrainingMode>(
    DEFAULT_SETTINGS.activeTrainingMode
  );
  const [accelDurationFixed, setAccelDurationFixed] = useState(
    DEFAULT_SETTINGS.accelDurationFixed
  );
  const [accelDurationRandom, setAccelDurationRandom] = useState(
    DEFAULT_SETTINGS.accelDurationRandom
  );
  const [accelDurationMin, setAccelDurationMin] = useState(DEFAULT_SETTINGS.accelDurationMin);
  const [accelDurationMax, setAccelDurationMax] = useState(DEFAULT_SETTINGS.accelDurationMax);
  const [accelBreakFixed, setAccelBreakFixed] = useState(DEFAULT_SETTINGS.accelBreakFixed);
  const [accelBreakRandom, setAccelBreakRandom] = useState(DEFAULT_SETTINGS.accelBreakRandom);
  const [accelBreakMin, setAccelBreakMin] = useState(DEFAULT_SETTINGS.accelBreakMin);
  const [accelBreakMax, setAccelBreakMax] = useState(DEFAULT_SETTINGS.accelBreakMax);
  const [beepGapMin, setBeepGapMin] = useState(DEFAULT_SETTINGS.beepGapMin);
  const [beepGapMax, setBeepGapMax] = useState(DEFAULT_SETTINGS.beepGapMax);
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [showAccelSubtimer, setShowAccelSubtimer] = useState(
    DEFAULT_SETTINGS.showAccelSubtimer
  );

  const accelRangesRef = useRef<{ start: number; end: number }[]>([]);
  const beepTimesRef = useRef<number[]>([]);
  const lastWorkElapsedRef = useRef(-1);
  const activeTrainingModeRef = useRef<ActiveTrainingMode>("off");

  // Presets and sessions state
  const [presets, setPresets] = useState<Preset[]>(() => {
    const saved = localStorage.getItem("boxingPresets");
    if (!saved) return [];
    const parsed: Preset[] = JSON.parse(saved);
    return parsed.map((p) => normalizePresetTraining(p as Partial<Preset> & Pick<Preset, "id" | "name">));
  });

  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem("boxingSessions");
    return saved ? JSON.parse(saved) : [];
  });

  // Sound effects with volume control
  // Sound effects with volume control
  const [playStart] = useSound("/sounds/start1.mp3", {
    volume: isMuted ? 0 : 10,
  });
  const [playEnd] = useSound("/sounds/bell.wav", {
    volume: isMuted ? 0 : 10,
  });
  const [playWarning] = useSound(
    "https://assets.mixkit.co/active_storage/sfx/1862/1862-preview.mp3",
    {
      volume: isMuted ? 0 : 7,
    }
  );
  const [playTick] = useSound(
    "https://assets.mixkit.co/active_storage/sfx/2002/2002-preview.mp3",
    {
      volume: isMuted ? 0 : 3,
    }
  );
  const [playBeep] = useSound("/sounds/beep.mp3", {
    volume: isMuted ? 0 : 8,
  });
  const [playBeepOff] = useSound("/sounds/beepOff.mp3", {
    volume: isMuted ? 0 : 8,
  });

  useEffect(() => {
    activeTrainingModeRef.current = activeTrainingMode;
  }, [activeTrainingMode]);

  useLayoutEffect(() => {
    if (isRest || isPrep) {
      accelRangesRef.current = [];
      beepTimesRef.current = [];
    }
  }, [isRest, isPrep]);

  useLayoutEffect(() => {
    if (!isActive || isRest || isPrep || timeLeft !== roundTime) {
      return;
    }
    if (activeTrainingMode === "acceleration") {
      accelRangesRef.current = computeAccelRanges(
        roundTime,
        accelDurationFixed,
        accelDurationRandom,
        accelDurationMin,
        accelDurationMax,
        accelBreakFixed,
        accelBreakRandom,
        accelBreakMin,
        accelBreakMax
      );
      beepTimesRef.current = [];
    } else if (activeTrainingMode === "beep") {
      beepTimesRef.current = computeBeepTimes(roundTime, beepGapMin, beepGapMax);
      accelRangesRef.current = [];
    } else {
      accelRangesRef.current = [];
      beepTimesRef.current = [];
    }
    lastWorkElapsedRef.current = -1;
  }, [
    isActive,
    isRest,
    isPrep,
    timeLeft,
    roundTime,
    activeTrainingMode,
    accelDurationFixed,
    accelDurationRandom,
    accelDurationMin,
    accelDurationMax,
    accelBreakFixed,
    accelBreakRandom,
    accelBreakMin,
    accelBreakMax,
    beepGapMin,
    beepGapMax,
  ]);

  useEffect(() => {
    if (!isActive || isRest || isPrep) {
      setIsAccelerating(false);
      return;
    }

    const mode = activeTrainingMode;
    const elapsed = roundTime - timeLeft;

    if (timeLeft === roundTime) {
      lastWorkElapsedRef.current = -1;
    }

    const prev = lastWorkElapsedRef.current;

    if (mode === "acceleration") {
      if (prev < 0) {
        for (const r of accelRangesRef.current) {
          if (-1 < r.start && elapsed >= r.start) playBeep();
          if (-1 < r.end && elapsed >= r.end) playBeepOff();
        }
        setIsAccelerating(isInsideAccelRange(accelRangesRef.current, elapsed));
        lastWorkElapsedRef.current = elapsed;
        return;
      }
      for (const r of accelRangesRef.current) {
        if (prev < r.start && elapsed >= r.start) playBeep();
        if (prev < r.end && elapsed >= r.end) playBeepOff();
      }
      setIsAccelerating(isInsideAccelRange(accelRangesRef.current, elapsed));
    } else {
      setIsAccelerating(false);
      if (prev < 0) {
        if (mode === "beep") {
          for (const te of beepTimesRef.current) {
            if (-1 < te && elapsed >= te) playBeep();
          }
        }
        lastWorkElapsedRef.current = elapsed;
        return;
      }
      if (mode === "beep") {
        for (const te of beepTimesRef.current) {
          if (prev < te && elapsed >= te) playBeep();
        }
      }
    }

    lastWorkElapsedRef.current = elapsed;
  }, [
    timeLeft,
    roundTime,
    isActive,
    isRest,
    isPrep,
    activeTrainingMode,
    playBeep,
    playBeepOff,
  ]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("darkMode", isDarkMode.toString());
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("boxingNotificationsEnabled", String(notificationsEnabled));
  }, [notificationsEnabled]);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("boxingPresets", JSON.stringify(presets));
  }, [presets]);

  useEffect(() => {
    localStorage.setItem("boxingSessions", JSON.stringify(sessions));
  }, [sessions]);

  const handleSettingsChange = (setting: string, value: string | number | boolean) => {
    switch (setting) {
      case "roundTime":
        setRoundTime(value as number);
        if (!isActive) setTimeLeft(value as number);
        break;
      case "restTime":
        setRestTime(value as number);
        break;
      case "totalRounds":
        setTotalRounds(value as number);
        break;
      case "roundEndWarning":
        setRoundEndWarning(value as number);
        break;
      case "restEndWarning":
        setRestEndWarning(value as number);
        break;
      case "showProgress":
        setShowProgress(value as boolean);
        break;
      case "preRoundTime": {
        const n = typeof value === "number" ? value : 0;
        setPreRoundTime(Math.min(120, Math.max(0, Number.isFinite(n) ? n : 0)));
        break;
      }
      case "notificationsEnabled":
        setNotificationsEnabled(value as boolean);
        break;
      case "activeTrainingMode":
        if (value === "off" || value === "acceleration" || value === "beep") {
          setActiveTrainingMode(value);
        }
        break;
      case "accelDurationFixed":
        setAccelDurationFixed(Math.max(1, Math.min(60, Number(value) || 1)));
        break;
      case "accelDurationRandom":
        setAccelDurationRandom(!!value);
        break;
      case "accelDurationMin":
        setAccelDurationMin(Math.max(1, Math.min(120, Number(value) || 1)));
        break;
      case "accelDurationMax":
        setAccelDurationMax(Math.max(1, Math.min(120, Number(value) || 1)));
        break;
      case "accelBreakFixed":
        setAccelBreakFixed(Math.max(0, Math.min(300, Number(value) || 0)));
        break;
      case "accelBreakRandom":
        setAccelBreakRandom(!!value);
        break;
      case "accelBreakMin":
        setAccelBreakMin(Math.max(1, Math.min(300, Number(value) || 1)));
        break;
      case "accelBreakMax":
        setAccelBreakMax(Math.max(1, Math.min(300, Number(value) || 1)));
        break;
      case "beepGapMin":
        setBeepGapMin(Math.max(1, Math.min(600, Number(value) || 1)));
        break;
      case "beepGapMax":
        setBeepGapMax(Math.max(1, Math.min(600, Number(value) || 1)));
        break;
      case "showAccelSubtimer":
        setShowAccelSubtimer(!!value);
        break;
    }
  };

  const handlePresetSelect = (preset: Preset) => {
    const p = normalizePresetTraining(preset);
    setRoundTime(p.roundTime);
    setRestTime(p.restTime);
    setTotalRounds(p.totalRounds);
    setRoundEndWarning(p.roundEndWarning);
    setRestEndWarning(p.restEndWarning);
    setPreRoundTime(p.preRoundTime);
    setActiveTrainingMode(p.activeTrainingMode);
    setAccelDurationFixed(p.accelDurationFixed);
    setAccelDurationRandom(p.accelDurationRandom);
    setAccelDurationMin(p.accelDurationMin);
    setAccelDurationMax(p.accelDurationMax);
    setAccelBreakFixed(p.accelBreakFixed);
    setAccelBreakRandom(p.accelBreakRandom);
    setAccelBreakMin(p.accelBreakMin);
    setAccelBreakMax(p.accelBreakMax);
    setBeepGapMin(p.beepGapMin);
    setBeepGapMax(p.beepGapMax);
    setShowAccelSubtimer(p.showAccelSubtimer);
    setIsPrep(false);
    setPreRoundConsumed(false);
    if (!isActive) setTimeLeft(p.roundTime);
  };

  const handlePresetSave = (preset: Omit<Preset, "id">) => {
    const id = Date.now().toString();
    const merged = normalizePresetTraining({
      ...preset,
      id,
      name: preset.name,
    });
    setPresets((prev) => [...prev, merged]);
  };

  const handlePresetDelete = (id: string) => {
    setPresets((prev) => prev.filter((preset) => preset.id !== id));
  };

  const saveSession = useCallback(() => {
    if (rounds.length > 0) {
      // Add the current round to the rounds array if the timer is still active
      if (isActive && !isPrep) {
        const currentRoundData: Round = {
          round: currentRound,
          duration: isRest ? restTime - timeLeft : roundTime - timeLeft,
          type: isRest ? "rest" : "work",
          timestamp: Date.now(),
        };
        rounds.push(currentRoundData);
      }

      const session: Session = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        rounds: [...rounds],
        presetUsed: "custom",
      };
      setSessions((prev) => [...prev, session]);
      setRounds([]);

      // Show completion notification
      if (notificationsEnabled && permission === "granted") {
        showNotification("Workout Complete! 🎉", {
          body: `Great job! You completed ${totalRounds} rounds.`,
        });
      }
    }
  }, [
    rounds,
    totalRounds,
    isActive,
    currentRound,
    roundTime,
    restTime,
    timeLeft,
    isRest,
    isPrep,
    permission,
    notificationsEnabled,
    showNotification,
  ]);

  const reset = useCallback(() => {
    if (rounds.length > 0) {
      saveSession();
    }
    setIsActive(false);
    setCurrentRound(1);
    setTimeLeft(roundTime);
    setIsRest(false);
    setIsPrep(false);
    setPreRoundConsumed(false);
    setIsAccelerating(false);
  }, [roundTime, rounds, saveSession]);

  const handleToggle = useCallback(() => {
    if (isActive) {
      setIsActive(false);
      return;
    }
    if (
      preRoundTime > 0 &&
      currentRound === 1 &&
      !isRest &&
      !isPrep &&
      timeLeft === roundTime &&
      !preRoundConsumed
    ) {
      setIsPrep(true);
      setTimeLeft(preRoundTime);
      setPreRoundConsumed(true);
    }
    setIsActive(true);
  }, [
    isActive,
    preRoundTime,
    currentRound,
    isRest,
    isPrep,
    timeLeft,
    roundTime,
    preRoundConsumed,
  ]);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => {
          const muteDuringAccel =
            activeTrainingModeRef.current === "acceleration" &&
            isInsideAccelRange(accelRangesRef.current, roundTime - time);

          if (
            !isPrep &&
            !muteDuringAccel &&
            ((!isRest && time === roundEndWarning + 1) ||
              (isRest && time === restEndWarning + 1)) &&
            time > 1
          ) {
            playWarning();
            if (notificationsEnabled && permission === "granted") {
              showNotification(
                isRest ? "Rest Period Ending!" : "Round Ending!",
                {
                  body: `${time - 1} seconds remaining`,
                  silent: true,
                }
              );
            }
          } else if (!muteDuringAccel && time <= 3 && time > 0) {
            playTick();
          }
          return time - 1;
        });
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      if (isPrep) {
        playStart();
        setIsPrep(false);
        setTimeLeft(roundTime);
        if (notificationsEnabled && permission === "granted") {
          showNotification("Round 1 — go! 🥊", {
            body: "Pre-round finished. Fight!",
          });
        }
      } else if (!isRest && currentRound <= totalRounds) {
        playEnd();
        setRounds((prev) => [
          ...prev,
          {
            round: currentRound,
            duration: roundTime,
            type: "work",
            timestamp: Date.now(),
          },
        ]);
        if (currentRound < totalRounds) {
          setIsRest(true);
          setTimeLeft(restTime);
          if (notificationsEnabled && permission === "granted") {
            showNotification("Round Complete! 🥊", {
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
        setCurrentRound((r) => r + 1);
        setTimeLeft(roundTime);
        setRounds((prev) => [
          ...prev,
          {
            round: currentRound,
            duration: restTime,
            type: "rest",
            timestamp: Date.now(),
          },
        ]);
        if (notificationsEnabled && permission === "granted") {
          showNotification("Rest Complete! 🔔", {
            body: `Get ready for Round ${currentRound + 1}!`,
          });
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isActive,
    timeLeft,
    currentRound,
    totalRounds,
    isRest,
    roundTime,
    restTime,
    roundEndWarning,
    restEndWarning,
    playStart,
    playEnd,
    playWarning,
    playTick,
    saveSession,
    permission,
    notificationsEnabled,
    showNotification,
    isPrep,
  ]);

  const workElapsedForAccel =
    isActive && !isRest && !isPrep ? roundTime - timeLeft : -1;
  const accelRemainingSeconds =
    showAccelSubtimer &&
    activeTrainingMode === "acceleration" &&
    isAccelerating &&
    workElapsedForAccel >= 0
      ? getAccelRemainingSeconds(accelRangesRef.current, workElapsedForAccel)
      : null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 sm:py-12 px-4 transition-colors duration-200">
      <main className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="text-center mb-8 sm:mb-12 relative px-8">
          <div className="absolute right-0 top-0 flex items-center gap-2">
            {notificationsEnabled && permission !== "granted" && (
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
                <Sun
                  className={`absolute transition-all duration-300 ${
                    isDarkMode ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                  }`}
                />
                <Moon
                  className={`absolute transition-all duration-300 ${
                    isDarkMode ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                  }`}
                />
              </div>
            </button>
          </div>
          <div className="flex items-center justify-center mb-4">
            <Dumbbell className="text-blue-500 dark:text-blue-400 mr-2 w-6 h-6 sm:w-8 sm:h-8" />
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-white truncate">
              Boxing Timer Pro
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Professional Boxing Training Timer
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8">
          <div className="space-y-6 sm:space-y-8 xl:col-span-8">
            <Timer
              isActive={isActive}
              currentRound={currentRound}
              timeLeft={timeLeft}
              totalRounds={totalRounds}
              isRest={isRest}
              isPrep={isPrep}
              isAccelerating={isAccelerating}
              accelRemainingSeconds={accelRemainingSeconds}
              roundTime={roundTime}
              restTime={restTime}
              preRoundTime={preRoundTime}
              onToggle={handleToggle}
              onReset={reset}
              showProgress={showProgress}
              onMuteToggle={() => setIsMuted(!isMuted)}
              isMuted={isMuted}
            />

            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
              <Settings
                roundTime={roundTime}
                restTime={restTime}
                totalRounds={totalRounds}
                roundEndWarning={roundEndWarning}
                restEndWarning={restEndWarning}
                preRoundTime={preRoundTime}
                notificationsEnabled={notificationsEnabled}
                showProgress={showProgress}
                activeTrainingMode={activeTrainingMode}
                accelDurationFixed={accelDurationFixed}
                accelDurationRandom={accelDurationRandom}
                accelDurationMin={accelDurationMin}
                accelDurationMax={accelDurationMax}
                accelBreakFixed={accelBreakFixed}
                accelBreakRandom={accelBreakRandom}
                accelBreakMin={accelBreakMin}
                accelBreakMax={accelBreakMax}
                beepGapMin={beepGapMin}
                beepGapMax={beepGapMax}
                showAccelSubtimer={showAccelSubtimer}
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
                  preRoundTime,
                  activeTrainingMode,
                  accelDurationFixed,
                  accelDurationRandom,
                  accelDurationMin,
                  accelDurationMax,
                  accelBreakFixed,
                  accelBreakRandom,
                  accelBreakMin,
                  accelBreakMax,
                  beepGapMin,
                  beepGapMax,
                  showAccelSubtimer,
                }}
                onPresetSelect={handlePresetSelect}
                onPresetSave={handlePresetSave}
                onPresetDelete={handlePresetDelete}
              />

              <div className="2xl:col-span-2">
                <SupporterTile />
              </div>
            </div>
          </div>

          <div className="xl:col-span-4">
            <Stats rounds={rounds} sessions={sessions} />
          </div>
        </div>
      </main>
      <footer className="text-center w-full my-10 text-gray-800 dark:text-white ">
        <h3>
          Created with ❣️ by{" "}
          <a
            href={"https://filszu.vercel.app?utm_source=boxing"}
            className="link-underline text-primary"
          >
            Filszu
          </a>{" "}
          2024-2026
        </h3>
        <h3 className="">
          Give a ⭐ on{" "}
          <a
            href={"https://github.com/Filszu/boxing-timer"}
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
