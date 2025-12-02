import { useState } from 'react';
import { api } from '../lib/api';
import { Terminal, Activity, Shield, ShieldAlert } from 'lucide-react';

export default function SystemTools({ isSecure = false }) {
  const [pingHost, setPingHost] = useState('');
  const [pingResult, setPingResult] = useState('');
  const [systemCommand, setSystemCommand] = useState('');
  const [systemResult, setSystemResult] = useState('');
  const [loading, setLoading] = useState({ ping: false, system: false });

  const handlePing = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, ping: true });
    setPingResult('');

    try {
      const response = isSecure
        ? await api.securePing(pingHost)
        : await api.ping(pingHost);
      
      setPingResult(response.data.output || response.data.message);
    } catch (err) {
      setPingResult(err.response?.data?.output || err.message);
    } finally {
      setLoading({ ...loading, ping: false });
    }
  };

  const handleSystemInfo = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, system: true });
    setSystemResult('');

    try {
      const response = isSecure
        ? await api.secureSystemInfo(systemCommand)
        : await api.systemInfo(systemCommand);
      
      setSystemResult(response.data.output || response.data.message);
    } catch (err) {
      setSystemResult(err.response?.data?.output || err.message);
    } finally {
      setLoading({ ...loading, system: false });
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
      {/* Ping Tool */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-10 border border-slate-700/50">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Ping Tool</h3>
          </div>
          <div className={`px-4 py-2 rounded-full text-xs font-light ${
            isSecure ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {isSecure ? '● Secure' : '● Vulnerable'}
          </div>
        </div>

        <form onSubmit={handlePing} className="space-y-6">
          <div>
            <label className="block text-sm font-light text-white/60 mb-3">
              {isSecure ? 'Host (IP or Domain)' : 'Host to Ping'}
            </label>
            <input
              type="text"
              value={pingHost}
              onChange={(e) => setPingHost(e.target.value)}
              placeholder={isSecure ? "e.g., 8.8.8.8 or google.com" : "e.g., google.com"}
              className="w-full px-5 py-3.5 bg-slate-800/50 border border-slate-600 rounded-2xl focus:outline-none focus:border-blue-500/50 text-white placeholder-slate-400 font-light transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading.ping}
            className={`w-full py-2 rounded-lg font-semibold text-white ${
              loading.ping
                ? 'bg-gray-400 cursor-not-allowed'
                : isSecure
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
            }`}
          >
            {loading.ping ? 'Pinging...' : 'Execute Ping'}
          </button>
        </form>

        {!isSecure && (
          <div className="mt-4 p-3 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-l-4 border-yellow-500 text-xs rounded">
            <p className="font-semibold text-yellow-400 mb-1">💡 Command Injection:</p>
            <p className="text-yellow-300">Try: <code className="bg-yellow-900/50 px-1 rounded">google.com & dir</code></p>
            <p className="text-yellow-300">Or: <code className="bg-yellow-900/50 px-1 rounded">google.com && whoami</code></p>
          </div>
        )}

        {pingResult && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-300 mb-2">Output:</p>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
              {pingResult}
            </pre>
          </div>
        )}
      </div>

      {/* System Info Tool */}
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-10 border border-slate-700/50">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center">
              <Terminal className="w-6 h-6 text-fuchsia-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">System Info</h3>
          </div>
          <div className={`px-4 py-2 rounded-full text-xs font-light ${
            isSecure ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {isSecure ? '● Secure' : '● Vulnerable'}
          </div>
        </div>

        <form onSubmit={handleSystemInfo} className="space-y-6">
          <div>
            <label className="block text-sm font-light text-white/60 mb-3">
              {isSecure ? 'Select Info Type' : 'Search Term'}
            </label>
            {isSecure ? (
              <select
                value={systemCommand}
                onChange={(e) => setSystemCommand(e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-800/50 border border-slate-600 rounded-2xl focus:outline-none focus:border-fuchsia-500/50 text-white font-light transition-all"
                required
              >
                <option value="">Select an option</option>
                <option value="os">Operating System</option>
                <option value="processor">Processor</option>
                <option value="memory">Memory</option>
                <option value="hostname">Hostname</option>
              </select>
            ) : (
              <input
                type="text"
                value={systemCommand}
                onChange={(e) => setSystemCommand(e.target.value)}
                placeholder="e.g., OS Name"
                className="w-full px-5 py-3.5 bg-slate-800/50 border border-slate-600 rounded-2xl focus:outline-none focus:border-fuchsia-500/50 text-white placeholder-slate-400 font-light transition-all"
                required
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading.system}
            className={`w-full py-2 rounded-lg font-semibold text-white ${
              loading.system
                ? 'bg-gray-400 cursor-not-allowed'
                : isSecure
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
            }`}
          >
            {loading.system ? 'Executing...' : 'Get System Info'}
          </button>
        </form>

        {!isSecure && (
          <div className="mt-4 p-3 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-l-4 border-yellow-500 text-xs rounded">
            <p className="font-semibold text-yellow-400 mb-1">💡 Command Injection:</p>
            <p className="text-yellow-300">Try: <code className="bg-yellow-900/50 px-1 rounded">" & whoami & echo "</code></p>
            <p className="text-yellow-300">Or: <code className="bg-yellow-900/50 px-1 rounded">" & ipconfig & echo "</code></p>
          </div>
        )}

        {systemResult && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-300 mb-2">Output:</p>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto max-h-64">
              {systemResult}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
