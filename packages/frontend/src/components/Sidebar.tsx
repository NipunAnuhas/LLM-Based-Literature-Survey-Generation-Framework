import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      path: '/',
      icon: '🏠',
      label: 'Home',
      description: 'Create new survey',
    },
    {
      path: '/about',
      icon: '📚',
      label: 'About',
      description: 'Project info',
    },
    {
      path: '/docs',
      icon: '📖',
      label: 'Documentation',
      description: 'How to use',
    },
  ];

  return (
    <aside className="w-64 bg-white/10 backdrop-blur-md border-r border-white/20 min-h-screen p-6">
      {/* Logo Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">📚</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">LitSurvey</h2>
            <p className="text-xs text-white/70">AI Research Assistant</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-3 rounded-lg transition-all ${
              isActive(item.path)
                ? 'bg-white text-indigo-600 shadow-lg'
                : 'text-white hover:bg-white/20'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <div className="font-semibold">{item.label}</div>
                <div className={`text-xs ${isActive(item.path) ? 'text-indigo-400' : 'text-white/60'}`}>
                  {item.description}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </nav>

      {/* Stats Section */}
      <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
        <h3 className="text-white font-semibold mb-3 text-sm">System Status</h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-white/80">
            <span>Backend</span>
            <span className="text-green-400">● Online</span>
          </div>
          <div className="flex justify-between text-white/80">
            <span>Frontend</span>
            <span className="text-green-400">● Online</span>
          </div>
          <div className="flex justify-between text-white/80">
            <span>Mode</span>
            <span className="text-yellow-400">Demo</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-6 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
        <h3 className="text-white font-semibold mb-3 text-sm">Features</h3>
        <ul className="space-y-2 text-xs text-white/80">
          <li className="flex items-center space-x-2">
            <span className="text-green-400">✓</span>
            <span>Multi-LLM Pipeline</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-green-400">✓</span>
            <span>Real-time Tracking</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-green-400">✓</span>
            <span>Export (PDF/DOCX)</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-green-400">✓</span>
            <span>Quality Assessment</span>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-6">
        <div className="text-center text-xs text-white/50">
          <p>Final Year Project</p>
          <p className="mt-1">© 2024 LitSurvey</p>
        </div>
      </div>
    </aside>
  );
}
