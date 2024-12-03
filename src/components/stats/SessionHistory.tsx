import React from 'react';
import { Calendar, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import SessionChart from './SessionChart';
import TrainingProgressChart from './TrainingProgressChart';
import { transformSessionToChartData } from './utils';
import type { Session } from '../../types';

interface SessionHistoryProps {
  sessions: Session[];
  expandedSession: string | null;
  onSessionClick: (sessionId: string) => void;
}

const SessionHistory: React.FC<SessionHistoryProps> = ({
  sessions,
  expandedSession,
  onSessionClick,
}) => (
  <div className="space-y-6">
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg w-full transition-colors duration-200">
      <div className="flex items-center mb-4">
        <TrendingUp className="mr-2 text-gray-600 dark:text-gray-400" size={20} />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Training Progress</h2>
      </div>
      <TrainingProgressChart sessions={sessions} />
    </div>

    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg w-full transition-colors duration-200">
      <div className="flex items-center mb-4">
        <Calendar className="mr-2 text-gray-600 dark:text-gray-400" size={20} />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Training History</h2>
      </div>
      
      <div className="space-y-4">
        {sessions.slice(-5).reverse().map((session) => (
          <div key={session.id} className="border-b dark:border-gray-700 pb-4">
            <button
              onClick={() => onSessionClick(session.id)}
              className="w-full"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {new Date(session.date).toLocaleDateString()}
                </span>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                    {session.rounds.filter(r => r.type === 'work').length} rounds
                  </span>
                  {expandedSession === session.id ? 
                    <ChevronUp className="text-gray-500" size={16} /> : 
                    <ChevronDown className="text-gray-500" size={16} />
                  }
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Work: {session.rounds
                  .filter(r => r.type === 'work')
                  .reduce((acc, r) => acc + r.duration, 0)}s
              </div>
            </button>
            
            {expandedSession === session.id && (
              <div className="mt-4">
                <SessionChart data={transformSessionToChartData(session)} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SessionHistory;