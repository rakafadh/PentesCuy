import { useState } from 'react';
import { Shield, ShieldAlert, Home, Users, Terminal, LogOut, ArrowLeft } from 'lucide-react';
import UserSearch from './components/UserSearch';
import SystemTools from './components/SystemTools';
import Login from './components/Login';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLogin(false);
    setCurrentView('home');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
  };

  if (showLogin) {
    return <Login onLoginSuccess={handleLoginSuccess} isSecure={isSecureMode} onBack={() => setShowLogin(false)} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50 flex flex-col">
        {/* Logo & Title */}
        <div className="p-8 border-b border-slate-700/50">
          <div className="mb-6">
            <div className="w-12 h-12 mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              {isSecureMode ? (
                <Shield className="w-6 h-6 text-white" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">
              PentesCuy
            </h1>
            <p className="text-xs text-white/40 font-light">by Raka & Farhan</p>
          </div>
          
          {/* Security Mode Toggle */}
          <button
            onClick={() => setIsSecureMode(!isSecureMode)}
            className={`w-full px-4 py-3 rounded-xl text-xs font-medium transition-all duration-300 ${
              isSecureMode
                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30'
            }`}
          >
            {isSecureMode ? '● Secure Mode' : '● Vulnerable Mode'}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-6 space-y-1">
          <button
            onClick={() => setCurrentView('home')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-light text-sm transition-all duration-300 ${
              currentView === 'home'
                ? 'bg-slate-800/70 text-white backdrop-blur-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>
          
          <button
            onClick={() => setShowLogin(true)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-light text-sm transition-all duration-300 ${
              showLogin
                ? 'bg-slate-800/70 text-white backdrop-blur-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Login Test</span>
          </button>
          
          <button
            onClick={() => setCurrentView('search')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-light text-sm transition-all duration-300 ${
              currentView === 'search'
                ? 'bg-slate-800/70 text-white backdrop-blur-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Search</span>
          </button>
          
          <button
            onClick={() => setCurrentView('tools')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-light text-sm transition-all duration-300 ${
              currentView === 'tools'
                ? 'bg-slate-800/70 text-white backdrop-blur-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>System Tools</span>
          </button>
        </nav>

        {/* User Info & Logout */}
        {user && (
          <div className="p-6 border-t border-slate-700/50">
            <div className="mb-4 px-3">
              <p className="text-sm font-medium text-white">{user.username}</p>
              <p className="text-xs text-white/40 font-light">{user.role || 'User'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-light text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 border-t border-slate-700/50">
          <p className="text-xs text-white/30 text-center font-light">
            Educational Project
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto px-12 py-16">
          {currentView === 'home' && (
            <div className="space-y-12">
            {/* Hero Section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-6xl font-bold text-white mb-4 tracking-tight">
                  Welcome to
                  <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                    PentesCuy
                  </span>
                </h2>
                <p className="text-white/50 text-lg font-light max-w-xl">
                  Platform simulasi penetration testing dengan vulnerability SQL Injection & Command Injection.
                </p>
              </div>

              {/* Mode Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className={`relative p-8 rounded-3xl transition-all duration-500 overflow-hidden group ${
                  !isSecureMode ? 'bg-slate-800/50 border border-rose-500/40' : 'bg-slate-800/20 border border-slate-700/50 opacity-40'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center mb-4">
                      <ShieldAlert className="w-5 h-5 text-rose-400" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">Vulnerable Mode</h3>
                    <p className="text-sm text-white/40 font-light leading-relaxed">
                      Sistem dengan celah keamanan yang dapat dieksploitasi untuk pembelajaran.
                    </p>
                  </div>
                </div>

                <div className={`relative p-8 rounded-3xl transition-all duration-500 overflow-hidden group ${
                  isSecureMode ? 'bg-slate-800/50 border border-emerald-500/40' : 'bg-slate-800/20 border border-slate-700/50 opacity-40'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                      <Shield className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">Secure Mode</h3>
                    <p className="text-sm text-white/40 font-light leading-relaxed">
                      Sistem yang telah diamankan dengan validasi input dan parameterized queries.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-medium text-white">Features</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="group relative p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 hover:border-violet-500/40 transition-all duration-500">
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 rounded-full bg-violet-400"></div>
                  </div>
                  <Shield className="w-6 h-6 text-violet-400 mb-4" />
                  <h4 className="font-medium text-white mb-2 text-lg">Login System</h4>
                  <p className="text-sm text-white/40 font-light">Test SQL Injection dalam proses autentikasi</p>
                </div>
                <div className="group relative p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 hover:border-blue-500/40 transition-all duration-500">
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  </div>
                  <Users className="w-6 h-6 text-blue-400 mb-4" />
                  <h4 className="font-medium text-white mb-2 text-lg">User Search</h4>
                  <p className="text-sm text-white/40 font-light">Praktik SQL Injection pada query database</p>
                </div>
                <div className="group relative p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 hover:border-fuchsia-500/40 transition-all duration-500">
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-fuchsia-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 rounded-full bg-fuchsia-400"></div>
                  </div>
                  <Terminal className="w-6 h-6 text-fuchsia-400 mb-4" />
                  <h4 className="font-medium text-white mb-2 text-lg">System Tools</h4>
                  <p className="text-sm text-white/40 font-light">Eksploitasi Command Injection vulnerability</p>
                </div>
              </div>
            </div>

            {/* Quick Start Guide */}
            <div className="relative p-10 rounded-3xl bg-slate-800/30 border border-slate-700/50 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-500/20 to-transparent rounded-full blur-3xl"></div>
              <div className="relative">
                <h3 className="text-2xl font-medium text-white mb-6">Cara Pakenya Gampang</h3>
                <ol className="space-y-4">
                  <li className="flex gap-4 group">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/40 group-hover:bg-violet-500/20 group-hover:border-violet-500/30 group-hover:text-violet-400 transition-all">1</span>
                    <span className="text-white/60 font-light group-hover:text-white/80 transition-colors">Pilih mode Vulnerable atau Secure di sidebar</span>
                  </li>
                  <li className="flex gap-4 group">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/40 group-hover:bg-violet-500/20 group-hover:border-violet-500/30 group-hover:text-violet-400 transition-all">2</span>
                    <span className="text-white/60 font-light group-hover:text-white/80 transition-colors">Coba Login Test dengan payload SQL injection</span>
                  </li>
                  <li className="flex gap-4 group">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/40 group-hover:bg-violet-500/20 group-hover:border-violet-500/30 group-hover:text-violet-400 transition-all">3</span>
                    <span className="text-white/60 font-light group-hover:text-white/80 transition-colors">Buka User Search untuk ekstraksi data database</span>
                  </li>
                  <li className="flex gap-4 group">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/40 group-hover:bg-violet-500/20 group-hover:border-violet-500/30 group-hover:text-violet-400 transition-all">4</span>
                    <span className="text-white/60 font-light group-hover:text-white/80 transition-colors">Test Command Injection di System Tools</span>
                  </li>
                  <li className="flex gap-4 group">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/40 group-hover:bg-violet-500/20 group-hover:border-violet-500/30 group-hover:text-violet-400 transition-all">5</span>
                    <span className="text-white/60 font-light group-hover:text-white/80 transition-colors">Bandingkan hasil dengan Secure Mode</span>
                  </li>
                </ol>
              </div>
            </div>
            </div>
          )}

          {currentView === 'search' && (
            <UserSearch isSecure={isSecureMode} />
          )}
          
          {currentView === 'tools' && (
            <SystemTools isSecure={isSecureMode} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
