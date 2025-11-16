import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { couplesAPI, sufganiotAPI, adminAPI } from '../../services/api';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Toggle } from '../ui/toggle';
import { toast } from 'sonner';
import { getImageUrl } from '../../utils/imageUtils';
import LiveActivityFeed from './LiveActivityFeed';
import VotingCountdown from './VotingCountdown';
import ResultsValidator from './ResultsValidator';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Lock,
  Unlock,
  Snowflake,
  Star,
  Trash2,
  CandyCane,
  Cookie,
  Gift,
  Upload,
  LogOut,
  TrendingUp,
  Users,
  BarChart3,
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('couples');
  const [couples, setCouples] = useState([]);
  const [sufganiot, setSufganiot] = useState([]);
  const [settings, setSettings] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newCoupleName, setNewCoupleName] = useState('');
  const [newSufganiaName, setNewSufganiaName] = useState('');
  const [selectedCoupleId, setSelectedCoupleId] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [activeTab]);

  // Auto-refresh results every 5 seconds when on results tab
  useEffect(() => {
    if (activeTab === 'results') {
      const interval = setInterval(() => {
        loadResultsData();
      }, 5000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line
  }, [activeTab]);

  const loadResultsData = async () => {
    try {
      const resultsRes = await adminAPI.getResults();
      setResults(resultsRes.data.data);
    } catch (error) {
      console.error('Error loading results:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [couplesRes, sufganiotRes, settingsRes] = await Promise.all([
        couplesAPI.getAll(),
        sufganiotAPI.getAll(),
        adminAPI.getSettings(),
      ]);

      setCouples(couplesRes.data.data);
      setSufganiot(sufganiotRes.data.data);
      setSettings(settingsRes.data.data);

      if (activeTab === 'results') {
        const resultsRes = await adminAPI.getResults();
        setResults(resultsRes.data.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error(error.response?.data?.message || 'Error loading data');
    }
    setLoading(false);
  };

  const handleAddCouple = async () => {
    if (!newCoupleName.trim()) return;
    try {
      await couplesAPI.create(newCoupleName);
      setNewCoupleName('');
      loadData();
      toast.success('Couple added');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating couple');
    }
  };

  const handleDeleteCouple = async (id) => {
    try {
      await couplesAPI.delete(id);
      loadData();
      toast('Couple removed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting couple');
    }
  };

  const handleAddSufgania = async () => {
    if (!selectedCoupleId || !newSufganiaName.trim()) {
      toast.error('Please select a couple and enter sufgania name');
      return;
    }
    try {
      await sufganiotAPI.create(newSufganiaName, selectedCoupleId);
      setNewSufganiaName('');
      setSelectedCoupleId('');
      loadData();
      toast.success('Sufgania added');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating sufgania');
    }
  };

  const handlePhotoUpload = async (sufganiaId, file) => {
    try {
      await sufganiotAPI.uploadPhoto(sufganiaId, file);
      loadData();
      toast.success('Photo uploaded');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error uploading photo');
    }
  };

  const handleToggleVoting = async (newState) => {
    try {
      if (newState) {
        await adminAPI.openVoting();
        toast('Voting opened');
      } else {
        await adminAPI.closeVoting();
        toast('Voting closed');
      }
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error toggling voting');
    }
  };

  const handleToggleResults = async () => {
    try {
      if (settings.resultsPublished) {
        await adminAPI.unpublishResults();
      } else {
        await adminAPI.publishResults();
      }
      loadData();
      toast('Results visibility updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error toggling results');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[radial-gradient(30rem_30rem_at_50%_0%,#22c55e20_0%,transparent_40%),radial-gradient(40rem_40rem_at_50%_110%,#eab30820_0%,transparent_60%),linear-gradient(180deg,#0f172a,#0f172a)] text-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Snowflake className="h-12 w-12 animate-spin text-sky-300 mx-auto mb-4" />
          <p className="text-slate-200">Loading festive dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(30rem_30rem_at_50%_0%,#22c55e20_0%,transparent_40%),radial-gradient(40rem_40rem_at_50%_110%,#eab30820_0%,transparent_60%),linear-gradient(180deg,#0f172a,#0f172a)] text-slate-50">
      {/* Floating snowflakes animation */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-20px) rotate(360deg); opacity: 0.2; }
        }
        .float-animate {
          animation: float 6s ease-in-out infinite;
        }
        .float-animate-delayed {
          animation: float 8s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>

      {/* Decorative floating snowflakes */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <Snowflake className="absolute top-20 left-[10%] h-4 w-4 text-blue-200/20 float-animate" />
        <Snowflake className="absolute top-40 right-[15%] h-3 w-3 text-blue-200/30 float-animate-delayed" />
        <Star className="absolute top-60 left-[20%] h-3 w-3 text-yellow-200/20 float-animate" />
        <Cookie className="absolute top-32 right-[25%] h-4 w-4 text-amber-200/20 float-animate-delayed" />
      </div>

      <header className="sticky top-0 z-20 backdrop-blur-md bg-white/10 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-3">
          {/* Logo or festive icons */}
          <div className="flex items-center gap-2">
            {/* If logo.png exists in public folder, it will show, otherwise show festive icons */}
            <img
              src="/logo.png"
              alt="SufgaVote"
              className="h-12 w-12 rounded-xl object-cover shadow-lg"
              onError={(e) => {
                // Fallback to festive icons if logo not found
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="hidden items-center gap-2">
              <Cookie className="h-5 w-5 text-amber-200" />
              <Star className="h-5 w-5 text-yellow-300" />
              <CandyCane className="h-5 w-5 text-rose-300" />
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-xl font-semibold tracking-tight">
              SufgaVote Admin
            </h1>
            <p className="text-xs text-slate-200">
              Festive dashboard - cozy, bright and cheerful ✨
            </p>
          </div>

          <div className="flex items-center gap-2 text-slate-200">
            <Gift className="h-4 w-4 text-pink-300" />
            <Snowflake className="h-4 w-4 text-blue-300" />
            <CandyCane className="h-4 w-4 text-rose-300" />
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-300/20 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 grid gap-6">
        {/* Control Panel */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,.6)]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-yellow-300" /> Control Panel
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3 text-slate-100">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-br from-green-400/10 to-emerald-300/10 px-4 py-4">
              <div>
                <p className="text-sm text-slate-200">Voting Status</p>
                <p className="font-medium flex items-center gap-2">
                  {settings?.votingOpen ? (
                    <span className="inline-flex items-center gap-1 text-emerald-200">
                      <Unlock className="h-4 w-4" /> Open
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-200">
                      <Lock className="h-4 w-4" /> Closed
                    </span>
                  )}
                </p>
              </div>
              <Toggle
                pressed={settings?.votingOpen}
                onPressedChange={(v) => {
                  handleToggleVoting(v);
                }}
                className="data-[state=on]:bg-emerald-500/30 data-[state=on]:text-emerald-100 bg-white/10 border border-white/10 rounded-xl px-4 py-2"
              >
                {settings?.votingOpen ? 'Close Voting' : 'Open Voting'}
              </Toggle>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-br from-sky-400/10 to-blue-200/10 px-4 py-4">
              <div>
                <p className="text-sm text-slate-200">Results</p>
                <p className="font-medium flex items-center gap-2">
                  {settings?.resultsPublished ? (
                    <span className="inline-flex items-center gap-1 text-sky-200">
                      <Unlock className="h-4 w-4" /> Public
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-200">
                      <Lock className="h-4 w-4" /> Hidden
                    </span>
                  )}
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={handleToggleResults}
                className="rounded-xl bg-white/10 border border-white/10 hover:bg-white/20"
              >
                {settings?.resultsPublished ? 'Hide Results' : 'Publish Results'}
              </Button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-400/10 to-indigo-300/10 px-4 py-4 text-slate-200">
              <p className="text-sm text-slate-300 mb-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Live Progress
              </p>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Participation</span>
                    <span className="font-semibold">
                      {couples.length > 0 ? Math.round((couples.filter(c => c.hasVoted).length / couples.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                      style={{
                        width: `${couples.length > 0 ? (couples.filter(c => c.hasVoted).length / couples.length) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/5 rounded-lg px-2 py-1.5 text-center">
                    <div className="font-bold text-green-300">{couples.filter(c => c.hasVoted).length}</div>
                    <div className="text-[10px] text-slate-400">Voted</div>
                  </div>
                  <div className="bg-white/5 rounded-lg px-2 py-1.5 text-center">
                    <div className="font-bold text-amber-300">{sufganiot.length}</div>
                    <div className="text-[10px] text-slate-400">Entries</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Features Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <LiveActivityFeed />
          <div className="space-y-6">
            <VotingCountdown votingEndsAt={settings?.votingEndsAt} votingOpen={settings?.votingOpen} />
            <ResultsValidator
              couples={couples}
              sufganiot={sufganiot}
              votingOpen={settings?.votingOpen}
              onPublish={handleToggleResults}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white/10 border border-white/10 rounded-2xl p-1 text-slate-200">
            <TabsTrigger
              value="couples"
              className="data-[state=active]:bg-green-400/20 rounded-xl"
            >
              Couples
            </TabsTrigger>
            <TabsTrigger
              value="sufganiot"
              className="data-[state=active]:bg-blue-400/20 rounded-xl"
            >
              Sufganiot
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="data-[state=active]:bg-amber-400/20 rounded-xl"
            >
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="couples" className="mt-4 grid gap-6">
            <Card className="bg-white/10 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-slate-100">Add New Couple</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 md:flex-row">
                <Input
                  placeholder="Couple name"
                  value={newCoupleName}
                  onChange={(e) => setNewCoupleName(e.target.value)}
                  className="bg-white/5 border-white/10 text-slate-100"
                />
                <Button
                  onClick={handleAddCouple}
                  className="rounded-xl bg-green-500/30 hover:bg-green-400/40"
                >
                  Add Couple
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-slate-100">Couples List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <table className="w-full text-left text-slate-100">
                    <thead className="bg-white/5 text-slate-200">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Login Code</th>
                        <th className="px-4 py-3">Has Voted</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {couples.map((c) => (
                        <tr
                          key={c._id || c.id}
                          className="odd:bg-white/[.04] even:bg-white/[.02] border-t border-white/5"
                        >
                          <td className="px-4 py-3 font-medium">{c.coupleName}</td>
                          <td className="px-4 py-3 tracking-wider text-sky-200">
                            {c.loginCode}
                          </td>
                          <td className="px-4 py-3">
                            {c.hasVoted ? (
                              <span className="text-green-300">Yes</span>
                            ) : (
                              <span className="text-slate-200">Pending</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="secondary"
                                className="rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-300/20"
                                onClick={() => handleDeleteCouple(c._id || c.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sufganiot" className="mt-4 grid gap-6">
            <Card className="bg-white/10 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-slate-100">Add New Sufgania</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-200">
                      Sufgania Name
                    </label>
                    <Input
                      placeholder="Enter sufgania name"
                      value={newSufganiaName}
                      onChange={(e) => setNewSufganiaName(e.target.value)}
                      className="bg-white/5 border-white/10 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-200">
                      Couple
                    </label>
                    <select
                      value={selectedCoupleId}
                      onChange={(e) => setSelectedCoupleId(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select couple...</option>
                      {couples.map((c) => (
                        <option key={c._id || c.id} value={c._id || c.id}>
                          {c.coupleName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button
                  onClick={handleAddSufgania}
                  className="rounded-xl bg-blue-500/30 hover:bg-blue-400/40"
                >
                  Add Sufgania
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-slate-100">Sufganiot List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {sufganiot.map((s) => (
                    <div
                      key={s._id || s.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-100 mb-1">
                            {s.name}
                          </h3>
                          <p className="text-sm text-slate-300">
                            by {s.couple?.coupleName || 'Unknown'}
                          </p>
                        </div>
                        <Cookie className="h-5 w-5 text-amber-300" />
                      </div>

                      {s.photoUrl ? (
                        <div className="mb-3 rounded-lg overflow-hidden bg-white/5 h-32">
                          <img
                            src={getImageUrl(s.photoUrl)}
                            alt={s.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error('Image failed to load:', s.photoUrl, 'Tried URL:', getImageUrl(s.photoUrl));
                            }}
                          />
                        </div>
                      ) : (
                        <div className="mb-3 rounded-lg bg-white/5 h-32 flex items-center justify-center border border-dashed border-white/20">
                          <p className="text-xs text-slate-400">No photo</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <label className="flex-1 cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handlePhotoUpload(s._id || s.id, e.target.files[0]);
                              }
                            }}
                            className="hidden"
                          />
                          <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-300/20 text-sm transition-colors">
                            <Upload className="h-4 w-4" />
                            Upload Photo
                          </div>
                        </label>
                      </div>
                    </div>
                  ))}
                  {sufganiot.length === 0 && (
                    <div className="col-span-full text-center py-8 text-slate-300">
                      No sufganiot added yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="mt-4 grid gap-6">
            {/* Voting Statistics */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-slate-100">
                  <Users className="h-5 w-5 text-blue-300" /> Voting Participation
                </CardTitle>
              </CardHeader>
              <CardContent>
                {results && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-slate-100">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-slate-300">Total Couples</p>
                        <p className="text-3xl font-bold text-blue-300">{results.statistics?.totalCouples || 0}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-slate-300">Voted</p>
                        <p className="text-3xl font-bold text-green-300">{results.statistics?.votedCouples || 0}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-slate-300">Completion</p>
                        <p className="text-3xl font-bold text-amber-300">{results.statistics?.votingPercentage || 0}%</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-slate-300">
                        <span>Progress</span>
                        <span>{results.statistics?.votedCouples || 0} / {results.statistics?.totalCouples || 0} couples</span>
                      </div>
                      <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                          style={{ width: `${results.statistics?.votingPercentage || 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Voted', value: results.statistics?.votedCouples || 0 },
                              { name: 'Pending', value: (results.statistics?.totalCouples || 0) - (results.statistics?.votedCouples || 0) }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell fill="#10b981" />
                            <Cell fill="#64748b" />
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Live Rankings */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-slate-100">
                  <TrendingUp className="h-5 w-5 text-amber-300" /> Live Rankings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {results?.rankings && results.rankings.length > 0 ? (
                  <div className="space-y-6">
                    {/* Top 3 Podium */}
                    <div className="grid grid-cols-3 gap-3">
                      {results.rankings.slice(0, 3).map((item, idx) => (
                        <div
                          key={item._id || item.id}
                          className={`rounded-2xl p-4 text-center ${
                            idx === 0
                              ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-2 border-yellow-300/40'
                              : idx === 1
                              ? 'bg-gradient-to-br from-slate-400/20 to-slate-500/20 border-2 border-slate-300/30'
                              : 'bg-gradient-to-br from-orange-600/20 to-orange-700/20 border-2 border-orange-400/30'
                          }`}
                        >
                          <div className="text-3xl mb-2">
                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                          </div>
                          <div className="font-bold text-slate-100 mb-1 truncate">{item.name}</div>
                          <div className="text-sm text-slate-300 mb-2 truncate">
                            {item.couple?.coupleName || 'Unknown'}
                          </div>
                          <div className="text-2xl font-bold text-blue-300">{item.scores?.total || 0}</div>
                          <div className="text-xs text-slate-400">points</div>
                        </div>
                      ))}
                    </div>

                    {/* Bar Chart */}
                    <div className="h-64 bg-white/5 rounded-xl p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={results.rankings.slice(0, 5)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                          <XAxis
                            dataKey="name"
                            stroke="#cbd5e1"
                            tick={{ fill: '#cbd5e1', fontSize: 12 }}
                          />
                          <YAxis stroke="#cbd5e1" tick={{ fill: '#cbd5e1' }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1e293b',
                              border: '1px solid #334155',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                          <Bar dataKey="scores.taste" fill="#3b82f6" name="Taste" />
                          <Bar dataKey="scores.creativity" fill="#ec4899" name="Creativity" />
                          <Bar dataKey="scores.presentation" fill="#f59e0b" name="Presentation" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Full Rankings Table */}
                    <div className="overflow-hidden rounded-2xl border border-white/10">
                      <table className="w-full text-left text-slate-100">
                        <thead className="bg-white/5 text-slate-200">
                          <tr>
                            <th className="px-4 py-3">Rank</th>
                            <th className="px-4 py-3">Sufgania</th>
                            <th className="px-4 py-3">Couple</th>
                            <th className="px-4 py-3 text-center">Taste</th>
                            <th className="px-4 py-3 text-center">Creativity</th>
                            <th className="px-4 py-3 text-center">Presentation</th>
                            <th className="px-4 py-3 text-center">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.rankings.map((item, idx) => (
                            <tr
                              key={item._id || item.id}
                              className="odd:bg-white/[.04] even:bg-white/[.02] border-t border-white/5"
                            >
                              <td className="px-4 py-3">
                                <span className="font-bold">
                                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${item.rank}`}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-medium">{item.name}</td>
                              <td className="px-4 py-3 text-slate-300">{item.couple?.coupleName || 'Unknown'}</td>
                              <td className="px-4 py-3 text-center text-blue-300">{item.scores?.taste || 0}</td>
                              <td className="px-4 py-3 text-center text-pink-300">{item.scores?.creativity || 0}</td>
                              <td className="px-4 py-3 text-center text-amber-300">{item.scores?.presentation || 0}</td>
                              <td className="px-4 py-3 text-center">
                                <span className="font-bold text-green-300">{item.scores?.total || 0}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-300">
                    <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No voting data yet. Rankings will appear here once voting begins.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="pt-6 pb-10 text-center text-xs text-slate-300 bg-gradient-to-t from-amber-500/10 via-transparent to-transparent rounded-t-2xl">
          <p className="inline-flex items-center gap-2 opacity-80">
            <CandyCane className="h-3 w-3" /> May your donuts be jelly and your
            nights be merry ✨
          </p>
        </footer>
      </main>
    </div>
  );
};

export default AdminDashboard;
