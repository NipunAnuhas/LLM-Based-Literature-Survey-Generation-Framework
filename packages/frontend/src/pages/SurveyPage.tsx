import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Survey {
  id: string;
  topic: string;
  content: {
    introduction: string;
    sections: Array<{
      title: string;
      content: string;
    }>;
    conclusion: string;
    references: Array<{
      authors: string[];
      year: number;
      title: string;
      venue: string;
    }>;
  };
  metadata: {
    paperCount: number;
    wordCount: number;
    generatedAt: string;
  };
}

export default function SurveyPage() {
  const { surveyId } = useParams<{ surveyId: string }>();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!surveyId) return;

    const fetchSurvey = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/surveys/${surveyId}`);
        
        if (!response.ok) {
          throw new Error('Survey not found');
        }

        const data = await response.json();
        setSurvey(data.survey);
      } catch (err) {
        setError('Failed to load survey');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [surveyId]);

  const handleExport = async (format: 'pdf' | 'docx' | 'json') => {
    if (!surveyId) return;

    setExporting(true);
    try {
      const response = await fetch(`http://localhost:3000/api/surveys/${surveyId}/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ format }),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Download file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `survey-${surveyId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Export failed. Please try again.');
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[rgb(var(--color-primary))] mx-auto"></div>
        <p className="text-white mt-4">Loading survey...</p>
      </div>
    );
  }

  if (error || !survey) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-6 border-2 border-red-500/30 bg-red-500/10">
          <h2 className="text-xl font-semibold text-red-400 mb-2">Error</h2>
          <p className="text-red-300">{error || 'Survey not found'}</p>
          <Link
            to="/"
            className="mt-4 inline-block btn-primary"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Card */}
      <div className="card p-8 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{survey.topic}</h1>
            <div className="flex gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                {survey.metadata.paperCount} papers
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                {survey.metadata.wordCount} words
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {new Date(survey.metadata.generatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <button
              onClick={() => handleExport('pdf')}
              disabled={exporting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
              </svg>
              Export PDF
            </button>
            <button
              onClick={() => handleExport('docx')}
              disabled={exporting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
              </svg>
              Export DOCX
            </button>
            <button
              onClick={() => handleExport('json')}
              disabled={exporting}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2 transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Export JSON
            </button>
          </div>
          <p className="text-sm text-gray-400 italic">
            Note: PDF and DOCX exports download as text files in demo mode. JSON export provides full structured data.
          </p>
        </div>
      </div>

      {/* Research Papers Section */}
      <div className="mb-6">
        <div className="card p-6 border-2 border-[rgb(var(--color-primary))]/30">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <svg className="w-6 h-6 text-[rgb(var(--color-primary))]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            Research Papers
          </h2>
          <p className="text-gray-400 mb-6">
            {survey.metadata.paperCount} papers analyzed for this literature survey
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {survey.content.references.map((paper, index) => (
              <div
                key={index}
                className="bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border))] rounded-lg p-5 hover:border-[rgb(var(--color-primary))] hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-semibold text-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/10 px-2 py-1 rounded">
                    Paper {index + 1}
                  </span>
                  <span className="text-xs text-gray-400">{paper.year}</span>
                </div>
                
                <h3 className="text-sm font-bold text-white mb-2 line-clamp-2">
                  {paper.title}
                </h3>
                
                <div className="space-y-2 mb-3">
                  <p className="text-xs text-gray-400">
                    <span className="font-semibold text-gray-300">Authors:</span>{' '}
                    {paper.authors.slice(0, 2).join(', ')}
                    {paper.authors.length > 2 && ` +${paper.authors.length - 2} more`}
                  </p>
                  <p className="text-xs text-gray-400">
                    <span className="font-semibold text-gray-300">Venue:</span> {paper.venue}
                  </p>
                </div>
                
                {paper.url && (
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-accent))] font-medium transition-colors"
                  >
                    View Paper →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Survey Content */}
      <div className="card p-8 prose prose-lg max-w-none prose-invert">
        {/* Introduction */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{survey.content.introduction}</p>
        </section>

        {/* Sections */}
        {survey.content.sections.map((section, index) => (
          <section key={index} className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">{section.title}</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{section.content}</p>
          </section>
        ))}

        {/* Conclusion */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Conclusion</h2>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{survey.content.conclusion}</p>
        </section>

        {/* References */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">References</h2>
          <ol className="list-decimal list-inside space-y-2">
            {survey.content.references.map((ref, index) => (
              <li key={index} className="text-gray-300 text-sm">
                {ref.authors.join(', ')} ({ref.year}). <em>{ref.title}</em>. {ref.venue}.
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
