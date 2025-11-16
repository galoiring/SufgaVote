import React, { useState, useEffect } from 'react';
import { Activity, Users, Upload, FileText, Play, StopCircle, Trophy, MessageSquare } from 'lucide-react';

const LiveActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3001/api/admin/activities?limit=15', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setActivities(data.data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();

    // Poll every 5 seconds
    const interval = setInterval(fetchActivities, 5000);
    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'vote':
        return <FileText className="h-4 w-4" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4" />;
      case 'couple_created':
        return <Users className="h-4 w-4" />;
      case 'sufgania_created':
        return <Activity className="h-4 w-4" />;
      case 'photo_uploaded':
        return <Upload className="h-4 w-4" />;
      case 'voting_opened':
        return <Play className="h-4 w-4" />;
      case 'voting_closed':
        return <StopCircle className="h-4 w-4" />;
      case 'results_published':
        return <Trophy className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'vote':
        return 'text-blue-400 bg-blue-400/10';
      case 'comment':
        return 'text-purple-400 bg-purple-400/10';
      case 'couple_created':
        return 'text-green-400 bg-green-400/10';
      case 'sufgania_created':
        return 'text-amber-400 bg-amber-400/10';
      case 'photo_uploaded':
        return 'text-pink-400 bg-pink-400/10';
      case 'voting_opened':
        return 'text-emerald-400 bg-emerald-400/10';
      case 'voting_closed':
        return 'text-red-400 bg-red-400/10';
      case 'results_published':
        return 'text-yellow-400 bg-yellow-400/10';
      default:
        return 'text-slate-400 bg-slate-400/10';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-800/40 backdrop-blur-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-green-400" />
          <h3 className="font-semibold text-slate-200">Live Activity Feed</h3>
        </div>
        <div className="text-center text-slate-400 py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/40 backdrop-blur-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-green-400" />
        <h3 className="font-semibold text-slate-200">Live Activity Feed</h3>
        <div className="ml-auto flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-slate-400">Live</span>
        </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {activities.length === 0 ? (
          <div className="text-center text-slate-400 py-8">No activities yet</div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity._id}
              className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
            >
              <div className={`p-2 rounded-lg shrink-0 ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200">
                  <span className="font-medium text-white">{activity.actor}</span>
                  {' '}
                  <span className="text-slate-300">{activity.details}</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {formatTime(activity.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LiveActivityFeed;
