import React, { useState } from 'react';
import CurrentSession from './CurrentSession';
import SessionHistory from './SessionHistory';
import type { Round, Session } from '../../types';

interface StatsProps {
  rounds: Round[];
  sessions: Session[];
}

const Stats: React.FC<StatsProps> = ({ rounds, sessions }) => {
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  const handleSessionClick = (sessionId: string) => {
    setExpandedSession(expandedSession === sessionId ? null : sessionId);
  };

  return (
    <div className="space-y-6">
      <CurrentSession rounds={rounds} />
      <SessionHistory
        sessions={sessions}
        expandedSession={expandedSession}
        onSessionClick={handleSessionClick}
      />
    </div>
  );
};

export default Stats;