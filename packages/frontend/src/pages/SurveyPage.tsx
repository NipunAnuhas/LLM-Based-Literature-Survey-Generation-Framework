import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient, Survey } from '../api/client';

export default function SurveyPage() {
  const { surveyId } = useParams<{ surveyId: string }>();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!surveyId) return;

    const fetchSurvey = async () => {
      try {
        const data = await apiClient.getSurvey(surveyId);
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
      const blob = await apiClient.exportSurvey(surveyId, format);
      const downloadName =
        format === 'json' ? `survey-${surveyId}.json` : `survey-${surveyId}.txt`;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadName;
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
              Export as Text (PDF)
            </button>
            <button
              onClick={() => handleExport('docx')}
              disabled={exporting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
              </svg>
              Export as Text (DOCX)
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
            Note: PDF / DOCX buttons currently download a plain-text file. JSON export provides full structured data.
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
            {survey.metadata.paperCount} top-ranked papers · click any card to expand details
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {survey.content.references.map((paper, index) => {
              const expanded = expandedCards.has(index);
              const hasAuthors = paper.authors.length > 0 && paper.authors[0] !== 'Unknown';
              const toggleExpand = () =>
                setExpandedCards(prev => {
                  const next = new Set(prev);
                  next.has(index) ? next.delete(index) : next.add(index);
                  return next;
                });

              return (
                <div
                  key={index}
                  className={`bg-[rgb(var(--color-bg-primary))] border rounded-lg p-5 transition-all duration-300 cursor-pointer ${
                    expanded
                      ? 'border-[rgb(var(--color-primary))] shadow-lg shadow-[rgb(var(--color-primary))]/10'
                      : 'border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))]/60'
                  }`}
                  onClick={toggleExpand}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/10 px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                      <span className="text-xs text-gray-500">{paper.year}</span>
                    </div>
                    <span className="text-gray-500 text-xs select-none">{expanded ? '▲ less' : '▼ more'}</span>
                  </div>

                  {/* Title */}
                  <h3 className={`text-sm font-bold text-white mb-2 ${expanded ? '' : 'line-clamp-2'}`}>
                    {paper.title}
                  </h3>

                  {/* Authors + Venue */}
                  <div className="space-y-1 mb-3">
                    {hasAuthors && (
                      <p className="text-xs text-gray-400">
                        <span className="font-semibold text-gray-300">Authors:</span>{' '}
                        {paper.authors.slice(0, expanded ? undefined : 3).join(', ')}
                        {!expanded && paper.authors.length > 3 && ` +${paper.authors.length - 3} more`}
                      </p>
                    )}
                    {paper.venue && paper.venue !== 'Online' && (
                      <p className="text-xs text-gray-400">
                        <span className="font-semibold text-gray-300">Venue:</span>{' '}
                        <span className="text-[rgb(var(--color-primary))]/80">{paper.venue}</span>
                      </p>
                    )}
                  </div>

                  {/* Reason for selection — always visible */}
                  {paper.reasonForSelection && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-md p-3 mb-3">
                      <p className="text-xs text-green-300 font-semibold mb-1">Why selected</p>
                      <p className={`text-xs text-green-200/80 leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
                        {paper.reasonForSelection}
                      </p>
                    </div>
                  )}

                  {/* Abstract — only when expanded */}
                  {expanded && paper.abstract && (
                    <div className="bg-[rgb(var(--color-border))]/30 rounded-md p-3 mb-3">
                      <p className="text-xs text-gray-400 font-semibold mb-1">Abstract</p>
                      <p className="text-xs text-gray-300 leading-relaxed">{paper.abstract}</p>
                    </div>
                  )}

                  {/* URL */}
                  {paper.url && (
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-accent))] font-medium transition-colors mt-1"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                      View Paper
                    </a>
                  )}
                </div>
              );
            })}
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
          <ol className="list-decimal list-inside space-y-3">
            {survey.content.references.map((ref, index) => (
              <li key={index} className="text-gray-300 text-sm leading-relaxed">
                {ref.authors.filter(a => a !== 'Unknown').join(', ')}{ref.authors.filter(a => a !== 'Unknown').length > 0 ? ' ' : ''}
                ({ref.year}). <em>{ref.title}</em>.{ref.venue && ref.venue !== 'Online' ? ` ${ref.venue}.` : ''}
                {ref.url && (
                  <>
                    {' '}
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[rgb(var(--color-primary))] hover:underline break-all"
                    >
                      {ref.url}
                    </a>
                  </>
                )}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
