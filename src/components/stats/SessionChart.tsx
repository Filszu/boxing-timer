import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ChartData } from './types';

interface SessionChartProps {
  data: ChartData[];
}

const SessionChart: React.FC<SessionChartProps> = ({ data }) => (
  <div className="h-64">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
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
);

export default SessionChart;