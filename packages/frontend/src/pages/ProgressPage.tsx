import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface WorkflowStatus {
  executionId: string;
  status: string;
  currentStage?: string;
  progress: number;
  message: string;
  error?: {
    stage: string;
    message: string;
    retryable: boolean;
  };
}

export default function ProgressPage() {
  const { executionId } = useParams<{ executionId: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<WorkflowStatus | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!executionId) return;

    const fetchStatus = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/surveys/${executionId}/status`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch status');
        }

        const data = await response.json();
        setStatus(data);

        // Navigate to survey page when complete
        if (data.status === 'complete') {
          setTimeout(() => {
            navigate(`/survey/${executionId}`);
          }, 2000);
        }
      } catch (err) {
        setError('Failed to fetch workflow status');
        console.error(err);
      }
    };

    // Initial fetch
    fetchStatus();

    // Poll every 2 seconds
    const interval = setInterval(fetchStatus, 2000);

    return () => clearInterval(interval);
  }, [executionId, navigate]);

  const getStageLabel = (stage?: string) => {
    const stages: Record<string, string> = {
      query_expansion: 'Query Expansion',
      retrieval: 'Retrieving Papers',
      validation: 'Quality Validation',
      evaluation: 'Relevance Evaluation',
      synthesis: 'Survey Synthesis',
    };
    return stage ? stages[stage] || stage : 'Initializing...';
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-6 border-2 border-red-500/30 bg-red-500/10">
          <h2 className="text-xl font-semibold text-red-400 mb-2">Error</h2>
          <p className="text-red-300">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[rgb(var(--color-primary))] mx-auto"></div>
        <p className="text-white mt-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-8">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Generating Your Literature Survey
        </h1>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-[rgb(var(--color-primary))]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {getStageLabel(status.currentStage)}
            </span>
            <span className="font-bold text-[rgb(var(--color-primary))]">{status.progress}%</span>
          </div>
          <div className="w-full bg-[rgb(var(--color-border))] rounded-full h-3 overflow-hidden">
            <div
              className="bg-[rgb(var(--color-primary))] h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${status.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Status Message */}
        <div className="bg-[rgb(var(--color-primary))]/10 border border-[rgb(var(--color-primary))]/30 rounded-lg p-4 mb-6">
          <p className="text-gray-300 text-center">{status.message}</p>
        </div>

        {/* Pipeline Stages */}
        <div className="space-y-3">
          {[
            { key: 'query_expansion', label: 'Query Expansion' },
            { key: 'retrieval', label: 'Paper Retrieval' },
            { key: 'validation', label: 'Quality Validation' },
            { key: 'evaluation', label: 'Relevance Evaluation' },
            { key: 'synthesis', label: 'Survey Synthesis' },
          ].map((stage) => {
            const isActive = status.currentStage === stage.key;
            const isPast = status.progress > getStageProgress(stage.key);
            
            return (
              <div
                key={stage.key}
                className={`flex items-center p-4 rounded-lg transition-all border-2 ${
                  isActive
                    ? 'bg-[rgb(var(--color-primary))]/20 border-[rgb(var(--color-primary))]'
                    : isPast
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-[rgb(var(--color-bg-primary))] border-[rgb(var(--color-border))]'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                  isActive
                    ? 'bg-[rgb(var(--color-primary))]'
                    : isPast
                    ? 'bg-green-500'
                    : 'bg-gray-600'
                }`}>
                  {isPast ? (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : isActive ? (
                    <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className={`font-medium ${
                  isActive ? 'text-white' : isPast ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Error Display */}
        {status.error && (
          <div className="mt-6 card border-2 border-red-500/30 bg-red-500/10 p-4">
            <h3 className="text-red-400 font-semibold mb-2">Error Occurred</h3>
            <p className="text-red-300 text-sm">{status.error.message}</p>
            {status.error.retryable && (
              <button className="mt-3 btn-primary">
                Retry
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getStageProgress(stage: string): number {
  const progressMap: Record<string, number> = {
    query_expansion: 20,
    retrieval: 40,
    validation: 60,
    evaluation: 80,
    synthesis: 100,
  };
  return progressMap[stage] || 0;
}
