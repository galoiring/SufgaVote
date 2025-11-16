import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [loginType, setLoginType] = useState('couple'); // 'couple' or 'admin'
  const [loginCode, setLoginCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { coupleLogin, adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    if (loginType === 'admin') {
      result = await adminLogin(password);
    } else {
      result = await coupleLogin(loginCode);
    }

    setLoading(false);

    if (result.success) {
      navigate(loginType === 'admin' ? '/admin' : '/voting');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="container-narrow" style={{ marginTop: '4rem' }}>
      <div className="card">
        <div className="text-center mb-2">
          <h1 style={{ fontSize: '3rem', margin: 0 }}>🍩</h1>
          <h1 style={{ marginBottom: '0.5rem' }}>SufgaVote</h1>
          <p style={{ color: 'var(--text-gray)' }}>
            Sufganiot Contest Voting System
          </p>
        </div>

        <div className="flex gap-2 mb-2">
          <button
            className={`btn ${loginType === 'couple' ? 'btn-primary' : 'btn-outline'} btn-full`}
            onClick={() => {
              setLoginType('couple');
              setError('');
            }}
          >
            Couple Login
          </button>
          <button
            className={`btn ${loginType === 'admin' ? 'btn-secondary' : 'btn-outline'} btn-full`}
            onClick={() => {
              setLoginType('admin');
              setError('');
            }}
          >
            Admin Login
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {loginType === 'couple' ? (
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
              <small style={{ color: 'var(--text-gray)', fontSize: '0.875rem' }}>
                Enter the code provided by the organizer
              </small>
            </div>
          ) : (
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
          )}

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`btn ${loginType === 'admin' ? 'btn-secondary' : 'btn-primary'} btn-full`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>

      <div className="text-center mt-2" style={{ color: 'var(--text-gray)', fontSize: '0.875rem' }}>
        <p>Enjoy voting and may the best sufgania win!</p>
      </div>
    </div>
  );
};

export default Login;
