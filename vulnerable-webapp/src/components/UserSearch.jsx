import { useState } from 'react';
import { api } from '../lib/api';
import { Search, Users, Shield, ShieldAlert } from 'lucide-react';

export default function UserSearch({ isSecure = false }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const response = isSecure
        ? await api.secureSearch(searchQuery)
        : await api.searchUsers(searchQuery);
      
      if (response.data.success) {
        setResults(response.data.results || []);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-10 border border-slate-700/50">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">User Search</h2>
          </div>
          <div className={`px-4 py-2 rounded-full text-xs font-light ${
            isSecure ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {isSecure ? '● Secure' : '● Vulnerable'}
          </div>
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by username or email..."
              className="flex-1 px-5 py-4 bg-slate-800/50 border border-slate-600 rounded-2xl text-white placeholder-slate-400 font-light focus:outline-none focus:border-violet-500/50 transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-4 rounded-2xl font-medium text-white flex items-center gap-2 transition-all duration-300 ${
                loading
                  ? 'bg-white/5 cursor-not-allowed opacity-50'
                  : isSecure
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:shadow-lg hover:shadow-violet-500/20'
              }`}
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </form>

        {!isSecure && (
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-l-4 border-yellow-500 text-sm rounded">
            <p className="font-semibold text-yellow-400 mb-1">💡 SQL Injection Test:</p>
            <p className="text-yellow-300 mb-2">Try these payloads:</p>
            <ul className="list-disc list-inside space-y-1 text-yellow-300">
              <li><code className="bg-yellow-900/50 px-2 py-1 rounded text-yellow-200">' OR '1'='1</code></li>
              <li><code className="bg-yellow-900/50 px-2 py-1 rounded text-yellow-200">' UNION SELECT null,username,email,password FROM users--</code></li>
            </ul>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 text-red-400 rounded-lg border border-red-600">
            <p className="font-semibold">Error:</p>
            <pre className="mt-2 text-xs overflow-x-auto text-red-300">{error}</pre>
          </div>
        )}

        {results.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">
              Results ({results.length})
            </h3>
            <div className="space-y-3">
              {results.map((user, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-purple-500 hover:shadow-lg transition-all"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-400">ID</p>
                      <p className="font-semibold text-gray-200">{user.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Username</p>
                      <p className="font-semibold text-gray-200">{user.username}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="font-semibold text-gray-200">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Role</p>
                      <p className="font-semibold text-gray-200">{user.role}</p>
                    </div>
                    {user.password && (
                      <div className="col-span-2">
                        <p className="text-xs text-gray-400">Password (Exposed!)</p>
                        <p className="font-mono text-red-400">{user.password}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && results.length === 0 && searchQuery && (
          <div className="text-center py-8 text-gray-400">
            No results found
          </div>
        )}
      </div>
    </div>
  );
}
