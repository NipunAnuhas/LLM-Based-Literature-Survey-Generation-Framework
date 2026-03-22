import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    // Always enable dark mode for n8n style
    setDarkMode(true);
    document.documentElement.classList.add('dark');
  }, []);
  
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg-secondary))]">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Top Navigation */}
      <nav className="relative bg-[rgb(var(--color-bg-primary))]/95 backdrop-blur-xl border-b border-[rgb(var(--color-border))] sticky top-0 z-50">
        <div className="w-full px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-[rgb(var(--color-primary))] rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">LitSurvey AI</h1>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/') 
                    ? 'bg-[rgb(var(--color-primary))] text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-[rgb(var(--color-bg-secondary))]'
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/about') 
                    ? 'bg-[rgb(var(--color-primary))] text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-[rgb(var(--color-bg-secondary))]'
                }`}
              >
                About
              </Link>
              <Link
                to="/documentation"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/documentation') 
                    ? 'bg-[rgb(var(--color-primary))] text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-[rgb(var(--color-bg-secondary))]'
                }`}
              >
                Docs
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-[rgb(var(--color-bg-secondary))] transition-all duration-200"
                aria-label="Toggle dark mode"
              >
                <svg className="w-5 h-5 text-gray-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
              
              {/* CTA Button */}
              <Link to="/" className="btn-primary flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>New Survey</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative bg-[rgb(var(--color-bg-primary))]/95 backdrop-blur-xl border-t border-[rgb(var(--color-border))] mt-20">
        <div className="w-full px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © 2024 LitSurvey AI - Powered by Multiple LLMs
            </p>
            <div className="flex items-center space-x-6">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Demo Mode Active
              </span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
