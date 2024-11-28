import type { Round, Session } from '../../types';
import type { ChartData } from './types';

export const transformRoundsToChartData = (rounds: Round[]): ChartData[] => {
  return rounds.map((round) => ({
    name: `Round ${round.round}`,
    'Work Time': round.type === 'work' ? round.duration : 0,
    'Rest Time': round.type === 'rest' ? round.duration : 0,
  }));
};

export const transformSessionToChartData = (session: Session): ChartData[] => {
  return transformRoundsToChartData(session.rounds);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { 
    month: 'short', 
    day: 'numeric'
  });
};