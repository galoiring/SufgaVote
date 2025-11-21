import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const CoupleLogin = () => {
  const [loginCode, setLoginCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { coupleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await coupleLogin(loginCode);
    setLoading(false);

    if (result.success) {
      navigate('/voting');
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
                alt="SufgaVote"
                className="h-32 w-32 mx-auto rounded-2xl object-cover shadow-2xl"
                onError={(e) => {
                  // Fallback to donut emoji if logo not found
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'block';
                }}
              />
              <h1
                className="text-8xl hidden"
                style={{ display: 'none' }}
              >
                🍩
              </h1>
            </div>

            <h1 className="text-3xl font-bold mb-2">SufgaVote</h1>
            <p className="text-slate-300">
              Sufganiot Contest Voting System
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="loginCode">Login Code</label>
              <input
                type="text"
                id="loginCode"
                value={loginCode}
                onChange={(e) => setLoginCode(e.target.value.toUpperCase())}
                placeholder="Enter your login code"
                required
                autoFocus
                style={{ textTransform: 'uppercase' }}
              />
              <small className="text-slate-400 text-sm">
                Enter the code provided by the organizer
              </small>
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        <div className="text-center mt-6 text-slate-400 text-sm">
          <p>Enjoy voting and may the best sufgania win! 🍩✨</p>
        </div>
      </div>
    </div>
  );
};

export default CoupleLogin;
