import { useState } from 'react';
import { api } from '../lib/api';
import { Shield, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function Login({ onLoginSuccess, isSecure = false, onBack }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = isSecure 
        ? await api.secureLogin(username, password)
        : await api.login(username, password);
      
      if (response.data.success) {
        setMessage('Login successful!');
        onLoginSuccess(response.data.user);
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
      <div className="max-w-md w-full relative">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/40 hover:text-white mb-6 transition-colors font-light text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        )}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-10 border border-slate-700/50">
          <div className="flex flex-col items-center mb-8">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
              isSecure ? 'bg-emerald-500/20' : 'bg-rose-500/20'
            }`}>
              {isSecure ? (
                <Shield className="w-8 h-8 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-8 h-8 text-rose-400" />
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-center mb-3 text-white">
              {isSecure ? 'Secure Login' : 'PentesCuy Login'}
            </h1>
            
            <div className={`px-4 py-2 rounded-full text-xs font-light ${
              isSecure ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {isSecure ? (
                <span>● Protected Mode</span>
              ) : (
                <span>● Vulnerable Mode</span>
              )}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-light text-white/60 mb-3">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-violet-500/50 text-white placeholder-white/30 font-light transition-all"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-light text-white/60 mb-3">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-800/50 border border-slate-600 rounded-2xl focus:outline-none focus:border-violet-500/50 text-white placeholder-slate-400 font-light transition-all"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-medium text-white transition-all duration-300 ${
                loading
                  ? 'bg-white/5 cursor-not-allowed opacity-50'
                  : isSecure
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:shadow-lg hover:shadow-violet-500/20'
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {message && (
            <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-sm font-light">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-sm font-light">
              {error}
            </div>
          )}

          {!isSecure && (
            <div className="mt-8 p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
              <p className="text-sm font-light text-amber-400/80 mb-2">💡 Hint for Testing</p>
              <p className="text-xs text-white/40 font-light">
                Try: <code className="px-2 py-1 bg-white/5 rounded-lg text-amber-400 font-mono">' OR '1'='1</code> in username field
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
