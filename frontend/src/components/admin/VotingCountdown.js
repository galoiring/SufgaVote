import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

const VotingCountdown = ({ votingEndsAt, votingOpen }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [showSetTime, setShowSetTime] = useState(false);
  const [newEndTime, setNewEndTime] = useState('');

  useEffect(() => {
    if (!votingEndsAt) {
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
  }, [votingEndsAt]);

  const handleSetEndTime = async () => {
    if (!newEndTime) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3001/api/admin/voting/end-time', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ votingEndsAt: newEndTime }),
      });

      const data = await response.json();
      if (data.success) {
        window.location.reload(); // Reload to get updated settings
      }
    } catch (error) {
      console.error('Error setting end time:', error);
    }
  };

  if (!votingOpen) {
    return null; // Don't show countdown if voting is closed
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 backdrop-blur-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-blue-400" />
        <h3 className="font-semibold text-slate-200">Voting Countdown</h3>
      </div>

      {!votingEndsAt ? (
        <div className="space-y-3">
          <p className="text-sm text-slate-400">No deadline set</p>
          {!showSetTime ? (
            <button
              onClick={() => setShowSetTime(true)}
              className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Set End Time
            </button>
          ) : (
            <div className="space-y-2">
              <input
                type="datetime-local"
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-blue-400"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSetEndTime}
                  className="flex-1 text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Set
                </button>
                <button
                  onClick={() => setShowSetTime(false)}
                  className="flex-1 text-sm px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ) : timeLeft?.expired ? (
        <div className="text-center py-4">
          <p className="text-lg font-semibold text-red-400">Voting Time Expired!</p>
          <p className="text-sm text-slate-400 mt-1">
            Ended: {new Date(votingEndsAt).toLocaleString()}
          </p>
        </div>
      ) : timeLeft ? (
        <div>
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-blue-400">{timeLeft.days}</div>
              <div className="text-xs text-slate-400 uppercase">Days</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-blue-400">{timeLeft.hours}</div>
              <div className="text-xs text-slate-400 uppercase">Hours</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-blue-400">{timeLeft.minutes}</div>
              <div className="text-xs text-slate-400 uppercase">Mins</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-blue-400">{timeLeft.seconds}</div>
              <div className="text-xs text-slate-400 uppercase">Secs</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="h-3 w-3" />
            <span>Ends: {new Date(votingEndsAt).toLocaleString()}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default VotingCountdown;
