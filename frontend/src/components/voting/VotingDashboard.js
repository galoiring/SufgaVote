import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { votingAPI, resultsAPI } from '../../services/api';
import { getImageUrl } from '../../utils/imageUtils';
import { toast } from 'sonner';
import VotingCountdownBanner from './VotingCountdownBanner';
import {
  Cookie,
  Star,
  Sparkles,
  Trophy,
  GripVertical,
  LogOut,
  CandyCane,
  ImageIcon,
  Medal,
} from 'lucide-react';

const VotingDashboard = () => {
  const [category, setCategory] = useState('taste');
  const [sufganiot, setSufganiot] = useState([]);
  const [rankings, setRankings] = useState({
    taste: [],
    creativity: [],
    presentation: [],
  });
  const [votingOpen, setVotingOpen] = useState(false);
  const [votingEndsAt, setVotingEndsAt] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statusRes, sufganiotRes] = await Promise.all([
        votingAPI.getStatus(),
        votingAPI.getSufganiot(),
      ]);

      setVotingOpen(statusRes.data.data.votingOpen);
      setVotingEndsAt(statusRes.data.data.votingEndsAt);
      const sufganiotData = sufganiotRes.data.data;
      setSufganiot(sufganiotData);

      // Load existing votes
      const votesRes = await votingAPI.getMyVotes();
      const existingVotes = votesRes.data.data;

      // Initialize rankings from existing votes or with all sufganiot
      const newRankings = {
        taste: [],
        creativity: [],
        presentation: [],
      };

      ['taste', 'creativity', 'presentation'].forEach((cat) => {
        if (existingVotes[cat] && existingVotes[cat].length > 0) {
          newRankings[cat] = existingVotes[cat].map((v) =>
            sufganiotData.find((s) => (s._id || s.id) === v.sufganiaId)
          ).filter(Boolean);
        } else {
          newRankings[cat] = [...sufganiotData];
        }
      });

      setRankings(newRankings);

      // Try to load published results
      try {
        const resultsRes = await resultsAPI.getPublished();
        setResults(resultsRes.data.data);
      } catch (error) {
        if (error.response?.status === 403) {
          setResults(null);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error loading data');
    }
    setLoading(false);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(rankings[category]);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setRankings({
      ...rankings,
      [category]: items,
    });
  };

  const handleSaveRankings = async () => {
    if (!votingOpen) {
      toast.error('Voting is currently closed');
      return;
    }

    setSaving(true);
    try {
      const rankingsData = rankings[category].map((sufgania, index) => ({
        sufganiaId: sufgania._id || sufgania.id,
        rank: index + 1,
      }));

      await votingAPI.submitRankings(category, rankingsData);
      toast.success(`Rankings saved for ${category}! Thanks for spreading the sweetness! 🍬`);

      // Show confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);

      // Auto-scroll to footer for completion feel
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 300);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving rankings');
    }
    setSaving(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[radial-gradient(30rem_30rem_at_50%_0%,#22c55e20_0%,transparent_40%),radial-gradient(40rem_40rem_at_50%_110%,#eab30820_0%,transparent_60%),linear-gradient(180deg,#0f172a,#0f172a)] text-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-200">Loading...</p>
        </div>
      </div>
    );
  }

  // If results are published, show only results
  if (results && results.length > 0) {
    return (
      <div className="min-h-screen w-full bg-[radial-gradient(30rem_30rem_at_50%_0%,#22c55e20_0%,transparent_40%),radial-gradient(40rem_40rem_at_50%_110%,#eab30820_0%,transparent_60%),linear-gradient(180deg,#0f172a,#0f172a)] text-slate-50">
        <div className="mx-auto w-full max-w-[480px] px-4 pb-28">
          {/* Header */}
          <header className="sticky top-0 z-20 -mx-4 bg-white/5 backdrop-blur-md border-b border-white/10">
            <div className="px-4 py-3 flex items-center gap-3">
              {/* Logo or festive icons */}
              <div className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="SufgaVote"
                  className="h-10 w-10 rounded-lg object-cover shadow-md"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden items-center gap-2">
                  <Cookie className="h-4 w-4 text-amber-200" />
                  <Star className="h-4 w-4 text-yellow-300" />
                  <CandyCane className="h-4 w-4 text-rose-300" />
                </div>
              </div>

              <div className="flex-1 leading-tight">
                <p className="text-[10px] text-slate-300">Couple</p>
                <h1 className="text-base font-semibold">{user?.coupleName || 'Guest'}</h1>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-rose-500/20 border border-rose-200/20 text-rose-200 hover:bg-rose-500/30 transition-colors"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </header>

          {/* Page title */}
          <div className="mt-6 text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">🏆 Contest Results</h2>
            <p className="text-sm text-slate-300">Congratulations to all participants!</p>
          </div>

          {/* Results */}
          <div className="space-y-3">
            {results.map((r, index) => (
              <div
                key={r._id || r.id}
                className={`p-4 rounded-2xl transition-all ${
                  index === 0
                    ? 'bg-gradient-to-br from-yellow-500/30 to-amber-500/30 border-2 border-yellow-300/40 shadow-lg shadow-yellow-500/20'
                    : index === 1
                    ? 'bg-gradient-to-br from-slate-400/20 to-slate-500/20 border-2 border-slate-300/30'
                    : index === 2
                    ? 'bg-gradient-to-br from-orange-600/20 to-orange-700/20 border-2 border-orange-400/30'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-3xl">
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                        {index > 2 && `#${r.rank}`}
                      </span>
                      <div>
                        <div className="text-xl font-bold leading-tight">{r.name}</div>
                        <div className="text-sm text-slate-300">
                          by {r.couple?.coupleName || 'Unknown'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-300">{r.scores?.total || 0}</div>
                    <div className="text-xs text-slate-400">points</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-xs text-slate-400">Taste</div>
                    <div className="text-sm font-semibold">{r.scores?.taste || 0}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Creativity</div>
                    <div className="text-sm font-semibold">{r.scores?.creativity || 0}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Presentation</div>
                    <div className="text-sm font-semibold">{r.scores?.presentation || 0}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="pt-6 pb-8 text-center text-[11px] text-slate-300 bg-gradient-to-t from-amber-500/10 via-transparent to-transparent rounded-t-2xl">
            <span className="inline-flex items-center gap-1">
              <CandyCane className="h-3 w-3" /> Thanks for participating! ✨
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(30rem_30rem_at_50%_0%,#22c55e20_0%,transparent_40%),radial-gradient(40rem_40rem_at_50%_110%,#eab30820_0%,transparent_60%),linear-gradient(180deg,#0f172a,#0f172a)] text-slate-50 relative overflow-hidden">
      {/* Floating Background Particles */}
      <FloatingParticles />

      <div className="mx-auto w-full max-w-[480px] px-4 pb-28 relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-20 -mx-4 bg-white/5 backdrop-blur-md border-b border-white/10">
          <div className="px-4 py-3 flex items-center gap-3">
            {/* Logo with pulse animation */}
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="SufgaVote"
                className="h-10 w-10 rounded-lg object-cover shadow-md animate-pulse-slow"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="hidden items-center gap-2">
                <Cookie className="h-4 w-4 text-amber-200 animate-bounce-slow" />
                <Star className="h-4 w-4 text-yellow-300 animate-spin-slow" />
                <CandyCane className="h-4 w-4 text-rose-300 animate-wiggle" />
              </div>
            </div>

            <div className="flex-1 leading-tight">
              <p className="text-[10px] text-slate-300">Couple</p>
              <h1 className="text-base font-semibold">{user?.coupleName || 'Guest'}</h1>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-rose-500/20 border border-rose-200/20 text-rose-200 hover:bg-rose-500/30 transition-colors"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>

          {/* Sticky category bar + progress */}
          <div className="px-4 pb-3">
            <div className="grid grid-cols-3 gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
              <button
                onClick={() => setCategory('taste')}
                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm border transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  category === 'taste'
                    ? 'bg-blue-500/20 border-blue-300/20 text-slate-50 shadow-[0_0_10px_#3b82f688] animate-glow-blue'
                    : 'border-white/10 bg-white/0 text-slate-200 hover:bg-white/10 hover:border-blue-200/30'
                }`}
              >
                <Star className={`h-4 w-4 ${category === 'taste' ? 'animate-spin-slow' : ''}`} />
                <span className="font-medium">Taste</span>
              </button>
              <button
                onClick={() => setCategory('creativity')}
                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm border transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  category === 'creativity'
                    ? 'bg-pink-500/20 border-pink-300/20 text-slate-50 shadow-[0_0_10px_#ec4899aa] animate-glow-pink'
                    : 'border-white/10 bg-white/0 text-slate-200 hover:bg-white/10 hover:border-pink-200/30'
                }`}
              >
                <Sparkles className={`h-4 w-4 ${category === 'creativity' ? 'animate-pulse' : ''}`} />
                <span className="font-medium">Creativity</span>
              </button>
              <button
                onClick={() => setCategory('presentation')}
                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm border transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  category === 'presentation'
                    ? 'bg-amber-500/20 border-amber-300/20 text-slate-50 shadow-[0_0_10px_#f59e0baa] animate-glow-amber'
                    : 'border-white/10 bg-white/0 text-slate-200 hover:bg-white/10 hover:border-amber-200/30'
                }`}
              >
                <Trophy className={`h-4 w-4 ${category === 'presentation' ? 'animate-bounce-slow' : ''}`} />
                <span className="font-medium">Presentation</span>
              </button>
            </div>

            {/* Animated Progress bar */}
            <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 transition-all duration-700 animate-gradient-x relative z-10"
                style={{ width: `${(Object.keys(rankings).filter(cat => rankings[cat].length > 0).length / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Countdown banner */}
          <VotingCountdownBanner votingEndsAt={votingEndsAt} votingOpen={votingOpen} />
        </header>

        {/* Page title */}
        <div className="mt-4 text-center">
          <h2 className="text-lg font-semibold">Vote for Your Favorites!</h2>
        </div>

        {!votingOpen && (
          <div className="mt-3 p-3 rounded-xl bg-blue-500/10 border border-blue-300/20 text-center text-sm text-blue-200">
            Voting is currently closed. Please wait for the organizer to open voting.
          </div>
        )}

        {/* VOTING SECTION */}
        <div className="mt-3 space-y-3">
            {/* Ranking list */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <h3 className="text-base font-semibold mb-1">Rank Sufganiot ({category})</h3>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-3">
                <span>Drag the handle to reorder. Top = Best, Bottom = Least favorite</span>
                <span className="text-slate-200">{rankings[category].length} entries</span>
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="rankings">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {rankings[category].map((sufgania, index) => (
                        <Draggable
                          key={sufgania._id || sufgania.id}
                          draggableId={sufgania._id || sufgania.id}
                          index={index}
                          isDragDisabled={!votingOpen}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center gap-3 rounded-xl p-3 shadow transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                                snapshot.isDragging
                                  ? 'bg-white/95 text-slate-900 ring-2 ring-blue-300/60 scale-[1.02] rotate-1'
                                  : index === 0
                                  ? 'relative bg-gradient-to-r from-amber-50 to-yellow-100 text-slate-900 border border-amber-300 ring-1 ring-amber-300 animate-pulse-gold'
                                  : index === 1
                                  ? 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-900 border border-slate-200/50'
                                  : index === 2
                                  ? 'bg-gradient-to-r from-orange-50 to-orange-100 text-slate-900 border border-orange-200/50'
                                  : 'bg-white/95 text-slate-900'
                              }`}
                            >
                              <div className={`rounded-lg px-2 py-1 text-base font-bold shrink-0 border ${
                                index === 0
                                  ? 'bg-gradient-to-b from-yellow-100 to-amber-100 text-amber-700 border-amber-300'
                                  : index === 1
                                  ? 'bg-gradient-to-b from-slate-100 to-slate-200 text-slate-600 border-slate-300'
                                  : index === 2
                                  ? 'bg-gradient-to-b from-orange-100 to-orange-200 text-orange-700 border-orange-300'
                                  : 'bg-gradient-to-b from-blue-50 to-blue-100 text-blue-600 border-blue-200'
                              }`}>
                                {index === 0 ? '🏆 #1' : index === 1 ? '🥈 #2' : index === 2 ? '🥉 #3' : `#${index + 1}`}
                              </div>

                              {/* Image */}
                              {sufgania.photoUrl ? (
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                  <img
                                    src={getImageUrl(sufgania.photoUrl)}
                                    alt={sufgania.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-slate-200"><svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-200 shrink-0 flex items-center justify-center">
                                  <ImageIcon className="w-6 h-6 text-slate-400" />
                                </div>
                              )}

                              <div className="flex-1 min-w-0">
                                <div className="font-semibold leading-tight truncate">{sufgania.name}</div>
                                <div className="text-[12px] text-slate-600 truncate">
                                  by {sufgania.couple?.coupleName || 'Unknown'}
                                </div>
                              </div>

                              <button
                                {...provided.dragHandleProps}
                                aria-label="Drag to reorder"
                                className={`text-slate-400 p-1 -m-1 shrink-0 ${
                                  votingOpen ? 'hover:text-slate-600' : 'opacity-50 cursor-not-allowed'
                                }`}
                                disabled={!votingOpen}
                              >
                                <GripVertical className="h-5 w-5" />
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            {/* Sticky Save CTA with ripple effect */}
            <div className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-[#101726] via-[#101726]/95 to-transparent">
              <div className="mx-auto max-w-[480px] px-4 py-4">
                <button
                  onClick={handleSaveRankings}
                  disabled={!votingOpen || saving}
                  className="w-full h-12 rounded-xl text-base shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      `Save ${category} rankings`
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </button>
              </div>
            </div>
        </div>

        {/* Footer note */}
        <div className="pt-6 pb-8 text-center text-[11px] text-slate-300 bg-gradient-to-t from-amber-500/10 via-transparent to-transparent rounded-t-2xl">
          <span className="inline-flex items-center gap-1">
            <CandyCane className="h-3 w-3" /> Sweet holiday voting ✨
          </span>
        </div>

        {/* Confetti */}
        {showConfetti && <ConfettiBurst />}
      </div>
    </div>
  );
};

// Floating Particles component
function FloatingParticles() {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 10,
    size: 8 + Math.random() * 16,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-float opacity-20"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
        >
          <Cookie className="w-full h-full text-amber-300" />
        </div>
      ))}
    </div>
  );
}

// Confetti component
function ConfettiBurst() {
  const [pieces] = useState(() => Array.from({ length: 24 }, (_, i) => i));
  useEffect(() => {
    const timer = setTimeout(() => {}, 1200);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((i) => (
        <span
          key={i}
          className="absolute block h-2 w-2 rounded-sm"
          style={{
            left: Math.random() * 100 + "%",
            top: "60%",
            background: ["#ef4444","#22c55e","#3b82f6","#eab308","#f472b6"][i % 5],
            animation: `confetti-fall 900ms ease-out ${Math.random()*200}ms forwards`
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0); opacity: 1; }
          100% { transform: translateY(-180px) rotate(200deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default VotingDashboard;
