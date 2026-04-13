export type ActiveTrainingMode = 'off' | 'acceleration' | 'beep';

export interface Preset {
  id: string;
  name: string;
  roundTime: number;
  restTime: number;
  totalRounds: number;
  roundEndWarning: number;
  restEndWarning: number;
  /** Seconds before round 1; 0 disables pre-round countdown */
  preRoundTime: number;
  /** Work-round only: random accelerations (red) or random beep cues */
  activeTrainingMode: ActiveTrainingMode;
  /** Acceleration length when not using random duration */
  accelDurationFixed: number;
  accelDurationRandom: boolean;
  accelDurationMin: number;
  accelDurationMax: number;
  /** Gap before first / between accelerations when not random */
  accelBreakFixed: number;
  accelBreakRandom: boolean;
  accelBreakMin: number;
  accelBreakMax: number;
  /** Active beep mode: delay between beeps (seconds) */
  beepGapMin: number;
  beepGapMax: number;
  /** Show a small countdown for time left in the current acceleration window */
  showAccelSubtimer: boolean;
}

export interface Round {
  round: number;
  duration: number;
  type: 'work' | 'rest';
  timestamp: number;
}

export interface Session {
  id: string;
  date: string;
  rounds: Round[];
  presetUsed: string;
}