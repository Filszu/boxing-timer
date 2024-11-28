import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { formatDate } from './utils';
import type { Session } from '../../types';

interface TrainingProgressChartProps {
  sessions: Session[];
}

const TrainingProgressChart: React.FC<TrainingProgressChartProps> = ({ sessions }) => {
  const data = sessions.map(session => ({
    date: formatDate(session.date),
    'Total Work Time': session.rounds
      .filter(r => r.type === 'work')
      .reduce((acc, r) => acc + r.duration, 0),
    'Number of Rounds': session.rounds.filter(r => r.type === 'work').length,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#888888" opacity={0.2} />
          <XAxis 
            dataKey="date" 
            stroke="#888888"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="left"
            stroke="#3B82F6"
            tick={{ fontSize: 12 }}
            label={{ 
              value: 'Total Work Time (s)', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: '#3B82F6' }
            }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            stroke="#10B981"
            tick={{ fontSize: 12 }}
            label={{ 
              value: 'Number of Rounds', 
              angle: 90, 
              position: 'insideRight',
              style: { fill: '#10B981' }
            }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="Total Work Time"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: '#3B82F6' }}
            activeDot={{ r: 8 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="Number of Rounds"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ fill: '#10B981' }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrainingProgressChart;