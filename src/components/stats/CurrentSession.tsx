import React from 'react';
import { Activity } from 'lucide-react';
import SessionChart from './SessionChart';
import { transformRoundsToChartData } from './utils';
import type { Round } from '../../types';

interface CurrentSessionProps {
  rounds: Round[];
}

const CurrentSession: React.FC<CurrentSessionProps> = ({ rounds }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg w-full transition-colors duration-200">
    <div className="flex items-center mb-4">
      <Activity className="mr-2 text-gray-600 dark:text-gray-400" size={20} />
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Current Session</h2>
    </div>
    <SessionChart data={transformRoundsToChartData(rounds)} />
  </div>
);

export default CurrentSession;