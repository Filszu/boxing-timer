import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, Calendar } from 'lucide-react';
import type { Session } from '../types';

interface StatsProps {
  rounds: Array<{
    round: number;
    duration: number;
    type: 'work' | 'rest';
  }>;
  sessions: Session[];
}

const Stats: React.FC<StatsProps> = ({ rounds, sessions }) => {
  const chartData = rounds.map((round) => ({
    id: `${round.round}-${round.type}-${round.timestamp}`,
    name: `Round ${round.round}`,
    'Work Time': round.type === 'work' ? round.duration : 0,
    'Rest Time': round.type === 'rest' ? round.duration : 0,
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg w-full transition-colors duration-200">
        <div className="flex items-center mb-4">
          <Activity className="mr-2 text-gray-600 dark:text-gray-400" size={20} />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Current Session</h2>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar 
                dataKey="Work Time" 
                fill="#3B82F6"
                isAnimationActive={false}
                name="Work Time"
              />
              <Bar 
                dataKey="Rest Time" 
                fill="#10B981"
                isAnimationActive={false}
                name="Rest Time"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg w-full transition-colors duration-200">
        <div className="flex items-center mb-4">
          <Calendar className="mr-2 text-gray-600 dark:text-gray-400" size={20} />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Training History</h2>
        </div>
        
        <div className="space-y-4">
          {sessions.slice(-5).reverse().map((session) => (
            <div key={session.id} className="border-b dark:border-gray-700 pb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {new Date(session.date).toLocaleDateString()}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {session.rounds.filter(r => r.type === 'work').length} rounds
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Work: {session.rounds
                  .filter(r => r.type === 'work')
                  .reduce((acc, r) => acc + r.duration, 0)}s
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;