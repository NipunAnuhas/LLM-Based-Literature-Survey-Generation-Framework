import { useState, FormEvent } from 'react';

interface TopicInputFormProps {
  onSubmit: (topic: string) => Promise<void>;
  isLoading: boolean;
}

export default function TopicInputForm({ onSubmit, isLoading }: TopicInputFormProps) {
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!topic.trim()) {
      setError('Please enter a research topic');
      return;
    }

    if (topic.trim().length < 5) {
      setError('Topic must be at least 5 characters long');
      return;
    }

    setError('');
    await onSubmit(topic.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
          Research Topic
        </label>
        <textarea
          id="topic"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          placeholder="Enter your research topic (e.g., 'Machine Learning in Healthcare', 'Blockchain Security', 'Climate Change Mitigation')"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={isLoading}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Survey...
          </span>
        ) : (
          '🚀 Generate Literature Survey'
        )}
      </button>

      <p className="text-sm text-gray-600 text-center">
        This will retrieve papers from scholarly databases, validate quality, and generate a comprehensive survey
      </p>
    </form>
  );
}
