import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      if (!response.ok) throw new Error('Failed to create survey');

      const data = await response.json();
      navigate(`/progress/${data.executionId}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create survey. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Mouse Follower Animation */}
      <div 
        className="pointer-events-none fixed z-50 transition-all duration-300 ease-out"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Outer glow */}
        <div className="absolute w-32 h-32 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
        {/* Inner glow */}
        <div className="absolute w-16 h-16 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full blur-xl"></div>
        {/* Center dot */}
        <div className="absolute w-2 h-2 bg-white rounded-full shadow-lg"></div>
      </div>

      {/* Hero Section - n8n Style */}
      <div className="text-center mb-16 pt-20">
        <div className="inline-flex items-center px-4 py-2 bg-[rgb(var(--color-bg-primary))] rounded-full mb-8 border border-[rgb(var(--color-border))] animate-fade-in">
          <span className="w-2 h-2 bg-[rgb(var(--color-primary))] rounded-full mr-2 animate-pulse"></span>
          <span className="text-sm font-semibold text-[rgb(var(--color-text-secondary))]">AI-Powered Research Tool</span>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight leading-tight animate-slide-up">
          <span className="text-white">Automated Literature Survey</span>
          <br />
          <span className="gradient-text">for research teams</span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in" style={{animationDelay: '0.2s', opacity: 0}}>
          Generate comprehensive literature reviews in minutes. LitSurvey AI automatically retrieves, 
          validates, and synthesizes academic papers using multiple AI models.
        </p>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4 mb-20 animate-scale-in" style={{animationDelay: '0.3s', opacity: 0}}>
          <button className="btn-primary px-8 py-4 text-lg">
            Get started for free
          </button>
          <button className="btn-secondary px-8 py-4 text-lg">
            Talk to sales
          </button>
        </div>
      </div>

      {/* Search Form - Centered */}
      <div className="max-w-4xl mx-auto mb-20 animate-scale-in" style={{animationDelay: '0.4s', opacity: 0}}>
        <form onSubmit={handleSubmit} className="card p-9">
          <label htmlFor="topic" className="block text-base font-semibold text-[rgb(var(--color-text-primary))] mb-4">
            Research Topic or Question
          </label>
          <div className="flex gap-3">
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Machine learning applications in healthcare"
              className="input-field flex-1"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                'Generate Survey'
              )}
            </button>
          </div>
          <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-3">
            Tip: Be specific for better results. Include key concepts and research areas.
          </p>
        </form>
      </div>

      {/* Feature Cards - Smaller Squares with Popup */}
      <div className="grid md:grid-cols-4 gap-5 mb-20 max-w-5xl mx-auto">
        {[
          {
            title: 'Researchers',
            subtitle: 'can',
            description: 'Generate comprehensive literature reviews automatically',
            details: [
              'Multi-LLM pipeline (GPT-4, GPT-3.5, Claude)',
              'Thematic analysis and trend identification',
              'Citation count and venue reputation scoring',
              'Comprehensive survey generation in minutes'
            ],
            gradient: 'from-purple-600/20 to-purple-800/20',
            border: 'border-purple-600/30'
          },
          {
            title: 'Students',
            subtitle: 'can',
            description: 'Create academic surveys for thesis and dissertations',
            details: [
              'Automated paper retrieval from Semantic Scholar',
              'Quality validation and relevance scoring',
              'Proper citations in academic format',
              'Export to PDF, DOCX, or JSON'
            ],
            gradient: 'from-blue-600/20 to-blue-800/20',
            border: 'border-blue-600/30'
          },
          {
            title: 'Scientists',
            subtitle: 'can',
            description: 'Retrieve and validate 15+ relevant research papers',
            details: [
              'Real-time paper retrieval and validation',
              'Quality filtering based on citations',
              'Relevance scoring for your specific topic',
              'Structured output with introduction and conclusion'
            ],
            gradient: 'from-orange-600/20 to-orange-800/20',
            border: 'border-orange-600/30'
          },
          {
            title: 'Academics',
            subtitle: 'can',
            description: 'Export surveys in PDF, DOCX, and JSON formats',
            details: [
              'Comprehensive thematic sections',
              'Gap identification and future directions',
              'Professional formatting and structure',
              'Multiple export formats for flexibility'
            ],
            gradient: 'from-pink-600/20 to-pink-800/20',
            border: 'border-pink-600/30'
          }
        ].map((feature, index) => (
          <div key={index} className="relative">
            <div 
              onClick={() => setSelectedCard(selectedCard === index ? null : index)}
              className={`card p-6 bg-gradient-to-br ${feature.gradient} border-2 ${feature.border} hover:scale-105 transition-all duration-300 cursor-pointer animate-bounce-in h-48 flex flex-col justify-center relative overflow-hidden group`}
              style={{animationDelay: `${0.5 + index * 0.1}s`, opacity: 0}}
            >
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title} <span className="text-gray-400 font-normal text-sm">{feature.subtitle}</span>
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {feature.description}
              </p>
              <div className="absolute bottom-2 right-2 text-gray-500 text-xs">
                {selectedCard === index ? '✕' : 'Click'}
              </div>
            </div>

            {/* Popup Modal */}
            {selectedCard === index && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
                  onClick={() => setSelectedCard(null)}
                ></div>
                
                {/* Popup Content */}
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg animate-scale-in">
                  <div className={`card p-8 bg-gradient-to-br ${feature.gradient} border-2 ${feature.border} shadow-2xl`}>
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-3xl font-black text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-300 text-lg">{feature.description}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedCard(null)}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Key Features:</h4>
                      <ul className="space-y-3">
                        {feature.details.map((detail, dIndex) => (
                          <li key={dIndex} className="flex items-start text-gray-300">
                            <span className="text-green-400 mr-3 mt-1">✓</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/10">
                      <button 
                        onClick={() => {
                          setSelectedCard(null);
                          document.getElementById('topic')?.focus();
                        }}
                        className="btn-primary w-full"
                      >
                        Start Creating Survey
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="card p-10 bg-gradient-to-br from-[rgb(var(--color-bg-primary))] to-gray-900/50 border-[rgb(var(--color-border))] animate-scale-in mb-20" style={{animationDelay: '0.9s', opacity: 0}}>
        <div className="grid grid-cols-3 gap-8 text-center">
          {[
            { value: '15+', label: 'Papers Analyzed' },
            { value: '5', label: 'Pipeline Stages' },
            { value: '3', label: 'Export Formats' }
          ].map((stat, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="text-5xl font-black text-[rgb(var(--color-primary))] mb-2 group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
              <div className="text-sm font-semibold text-gray-400 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
