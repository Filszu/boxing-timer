export interface Preset {
  id: string;
  name: string;
  roundTime: number;
  restTime: number;
  totalRounds: number;
  roundEndWarning: number;
  restEndWarning: number;
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