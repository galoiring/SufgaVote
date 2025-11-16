import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Trophy } from 'lucide-react';

const ResultsValidator = ({ couples, sufganiot, votingOpen, onPublish }) => {
  const [checks, setChecks] = useState([]);
  const [canPublish, setCanPublish] = useState(false);

  useEffect(() => {
    const newChecks = [];

    // Check 1: Voting is closed
    const votingClosed = !votingOpen;
    newChecks.push({
      label: 'Voting is closed',
      status: votingClosed ? 'pass' : 'fail',
      message: votingClosed ? 'Ready to publish' : 'Close voting first',
    });

    // Check 2: Has couples
    const hasCouples = couples.length > 0;
    newChecks.push({
      label: 'Has participating couples',
      status: hasCouples ? 'pass' : 'fail',
      message: hasCouples ? `${couples.length} couples` : 'No couples found',
    });

    // Check 3: Has sufganiot
    const hasSufganiot = sufganiot.length > 0;
    newChecks.push({
      label: 'Has sufganiot to rank',
      status: hasSufganiot ? 'pass' : 'fail',
      message: hasSufganiot ? `${sufganiot.length} sufganiot` : 'No sufganiot found',
    });

    // Check 4: Has votes
    const votedCouples = couples.filter(c => c.hasVoted);
    const hasVotes = votedCouples.length > 0;
    newChecks.push({
      label: 'Has received votes',
      status: hasVotes ? 'pass' : 'fail',
      message: hasVotes ? `${votedCouples.length} couples voted` : 'No votes yet',
    });

    // Check 5: Good participation (optional warning)
    const participationRate = couples.length > 0 ? (votedCouples.length / couples.length) * 100 : 0;
    const goodParticipation = participationRate >= 50;
    newChecks.push({
      label: 'Good participation rate',
      status: goodParticipation ? 'pass' : 'warning',
      message: `${participationRate.toFixed(0)}% participation`,
    });

    setChecks(newChecks);

    // Can publish if all critical checks pass (not counting warnings)
    const allCriticalPass = newChecks
      .filter(c => c.status !== 'warning')
      .every(c => c.status === 'pass');
    setCanPublish(allCriticalPass);

  }, [couples, sufganiot, votingOpen]);

  const getIcon = (status) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pass':
        return 'bg-green-400/10 border-green-400/20';
      case 'fail':
        return 'bg-red-400/10 border-red-400/20';
      case 'warning':
        return 'bg-amber-400/10 border-amber-400/20';
      default:
        return 'bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-purple-400" />
        <h3 className="font-semibold text-slate-200">Results Ready Checklist</h3>
      </div>

      <div className="space-y-2 mb-4">
        {checks.map((check, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg border ${getStatusColor(check.status)}`}
          >
            {getIcon(check.status)}
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-200">{check.label}</p>
              <p className="text-xs text-slate-400">{check.message}</p>
            </div>
          </div>
        ))}
      </div>

      {canPublish ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg p-3">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>All checks passed! Ready to publish results.</span>
          </div>
          <button
            onClick={onPublish}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all shadow-lg"
          >
            Publish Results
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg p-3">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Complete all critical checks before publishing.</span>
        </div>
      )}
    </div>
  );
};

export default ResultsValidator;
