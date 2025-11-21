import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Shield } from 'lucide-react';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await adminLogin(password);
    setLoading(false);

    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(30rem_30rem_at_50%_0%,#22c55e20_0%,transparent_40%),radial-gradient(40rem_40rem_at_50%_110%,#eab30820_0%,transparent_60%),linear-gradient(180deg,#0f172a,#0f172a)] text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="mb-6">
              <img
                src="/logo.png"
                alt="SufgaVote Admin"
                className="h-24 w-24 mx-auto rounded-2xl object-cover shadow-2xl"
                onError={(e) => {
                  // Fallback to shield icon if logo not found
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div
                className="h-24 w-24 mx-auto bg-purple-500/20 rounded-2xl hidden items-center justify-center"
                style={{ display: 'none' }}
              >
                <Shield className="h-12 w-12 text-purple-300" />
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-purple-300" />
              Admin Login
            </h1>
            <p className="text-slate-300">
              SufgaVote Administration
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password">Admin Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-secondary btn-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <a
              href="/"
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              ← Back to Couple Login
            </a>
          </div>
        </div>

        <div className="text-center mt-6 text-slate-400 text-sm">
          <p>🔒 Authorized personnel only</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
