import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X, ArrowRight, RotateCcw } from 'lucide-react';
import { useEco } from '../../context/EcoContext';

const NAV_LINKS = [
  { name: 'Dashboard',   path: '/dashboard'   },
  { name: 'Action Plan', path: '/action-plan'  },
  { name: 'Simulator',   path: '/simulator'    },
  { name: 'Report',      path: '/report'       },
];

export const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();
  const { hasCompletedAssessment, resetAll } = useEco();

  const isHome       = location.pathname === '/';
  const isAssessment = location.pathname === '/assessment';
  const showNav      = !isHome && !isAssessment;

  const handleReset = () => {
    if (window.confirm('Reset all data and start over?')) {
      resetAll();
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      {/* ── Header ─────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 glass-dark no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-900/40 group-hover:scale-105 transition-transform">
                <Leaf className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-[17px] text-white tracking-tight hidden sm:block">
                EcoPilot <span className="text-emerald-400">AI</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            {showNav && (
              <nav className="hidden md:flex items-center gap-1">
                {NAV_LINKS.map(link => {
                  const active = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        active
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {isHome && (
                <Link
                  to="/assessment"
                  className="btn-primary text-sm hidden sm:inline-flex"
                >
                  Start Assessment <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              {showNav && hasCompletedAssessment && (
                <button
                  onClick={handleReset}
                  aria-label="Reset assessment"
                  title="Reset assessment"
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 text-xs font-medium transition-all"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </button>
              )}
              {/* Mobile hamburger */}
              {showNav && (
                <button
                  onClick={() => setMenuOpen(v => !v)}
                  aria-label="Toggle mobile menu"
                  className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && showNav && (
          <div className="md:hidden border-t border-white/5 bg-slate-900/95 backdrop-blur-xl animate-fade-in">
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map(link => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <button
                onClick={() => { setMenuOpen(false); handleReset(); }}
                aria-label="Reset Profile"
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                Reset Profile
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Main Content ───────────────────────────────── */}
      <main className="flex-grow pt-[68px]">
        <Outlet />
      </main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="border-t border-white/5 bg-slate-950 py-10 no-print">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-emerald-600 flex items-center justify-center">
              <Leaf className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-sm text-white">EcoPilot AI</span>
            <span className="text-slate-600 text-sm">— Hackathon Prototype</span>
          </div>
          <p className="text-slate-600 text-xs">
            Emission factors sourced from IPCC AR6 &amp; EPA data. AI generates narrative only.
          </p>
        </div>
      </footer>
    </div>
  );
};
