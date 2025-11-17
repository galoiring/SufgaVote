import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

const VotingCountdownBanner = ({ votingEndsAt, votingOpen }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!votingEndsAt || !votingOpen) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const difference = new Date(votingEndsAt) - new Date();

      if (difference <= 0) {
        setTimeLeft({ expired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [votingEndsAt, votingOpen]);

  // Don't show if voting is closed or no deadline set
  if (!votingOpen || !votingEndsAt || !timeLeft) {
    return null;
  }

  // Show warning if expired
  if (timeLeft.expired) {
    return (
      <div className="px-4 pb-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 border border-red-400/30 text-red-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="text-xs font-medium">Voting time has expired</span>
        </div>
      </div>
    );
  }

  // Determine urgency level
  const totalHours = timeLeft.days * 24 + timeLeft.hours;
  const isUrgent = totalHours < 2;
  const isWarning = totalHours < 24 && !isUrgent;

  return (
    <div className="px-4 pb-2">
      <div
        className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${
          isUrgent
            ? 'bg-red-500/20 border-red-400/30 text-red-200'
            : isWarning
            ? 'bg-amber-500/20 border-amber-400/30 text-amber-200'
            : 'bg-blue-500/20 border-blue-400/30 text-blue-200'
        }`}
      >
        <Clock className="h-4 w-4 shrink-0" />
        <div className="flex-1 flex items-center gap-2 text-xs font-medium">
          <span>Time left:</span>
          <div className="flex items-center gap-1.5">
            {timeLeft.days > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-white/20 font-mono">
                {timeLeft.days}d
              </span>
            )}
            <span className="px-1.5 py-0.5 rounded bg-white/20 font-mono">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span className="px-1.5 py-0.5 rounded bg-white/20 font-mono">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            <span className="px-1.5 py-0.5 rounded bg-white/20 font-mono">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingCountdownBanner;
