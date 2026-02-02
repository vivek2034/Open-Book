
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavItem: React.FC<{ to: string, icon: string, label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
        isActive ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-slate-200'
      }`}
    >
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    </Link>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 p-6 sticky top-0 h-screen">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-10">
          Open Book
        </h1>
        <nav className="flex-1 space-y-4">
          <Link to="/" className="flex items-center gap-3 text-slate-300 hover:text-white p-3 rounded-lg hover:bg-slate-800 transition-colors">
            <span>🏠</span> Home
          </Link>
          <Link to="/discovery" className="flex items-center gap-3 text-slate-300 hover:text-white p-3 rounded-lg hover:bg-slate-800 transition-colors">
            <span>🧭</span> Discovery
          </Link>
          <Link to="/library" className="flex items-center gap-3 text-slate-300 hover:text-white p-3 rounded-lg hover:bg-slate-800 transition-colors">
            <span>📚</span> Library
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-24 md:pb-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 px-6 py-3 flex justify-between items-center z-50">
        <NavItem to="/" icon="🏠" label="Home" />
        <NavItem to="/discovery" icon="🧭" label="Discovery" />
        <NavItem to="/library" icon="📚" label="Library" />
      </nav>
    </div>
  );
};
