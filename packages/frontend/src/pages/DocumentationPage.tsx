export default function DocumentationPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-6">Documentation</h1>
        
        <div className="space-y-8 text-white/90">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Getting Started</h2>
            <div className="bg-white/5 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">1. Enter Your Research Topic</h3>
                <p className="text-sm">
                  Navigate to the home page and enter your research topic or question in the input field. 
                  Be specific to get better results.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">2. Monitor Progress</h3>
                <p className="text-sm">
                  After submission, you'll be redirected to the progress page where you can track the 
                  survey generation through five stages: Query Expansion, Paper Retrieval, Validation, 
                  Evaluation, and Synthesis.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">3. View Results</h3>
                <p className="text-sm">
                  Once complete, view your generated literature survey with organized sections, 
                  paper summaries, and export options.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Pipeline Stages</h2>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">🔍 Query Expansion</h3>
                <p className="text-sm">
                  The system analyzes your topic and generates related search terms and queries 
                  to ensure comprehensive coverage of the research area.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">📄 Paper Retrieval</h3>
                <p className="text-sm">
                  Using scholarly APIs, the system retrieves relevant academic papers based on 
                  the expanded queries. Papers are collected from multiple sources.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">✓ Validation</h3>
                <p className="text-sm">
                  Retrieved papers are validated for relevance, quality, and credibility. 
                  Low-quality or irrelevant papers are filtered out.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">⭐ Evaluation</h3>
                <p className="text-sm">
                  Papers are evaluated and ranked based on citation count, publication venue, 
                  recency, and relevance to your research topic.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">📝 Synthesis</h3>
                <p className="text-sm">
                  The final stage synthesizes information from validated papers into a coherent 
                  literature survey with proper organization and citations.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">API Endpoints</h2>
            <div className="bg-white/5 rounded-lg p-6 space-y-3 font-mono text-sm">
              <div>
                <span className="text-green-300">POST</span> <span className="text-blue-300">/api/surveys</span>
                <p className="text-xs mt-1 ml-4">Create a new literature survey</p>
              </div>
              <div>
                <span className="text-yellow-300">GET</span> <span className="text-blue-300">/api/surveys/:id</span>
                <p className="text-xs mt-1 ml-4">Retrieve a specific survey by ID</p>
              </div>
              <div>
                <span className="text-yellow-300">GET</span> <span className="text-blue-300">/api/surveys/:id/status</span>
                <p className="text-xs mt-1 ml-4">Get the current status of a survey</p>
              </div>
              <div>
                <span className="text-green-300">POST</span> <span className="text-blue-300">/api/workflows/:executionId/complete</span>
                <p className="text-xs mt-1 ml-4">Mark a workflow as complete (webhook)</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">System Architecture</h2>
            <div className="bg-white/5 rounded-lg p-6">
              <p className="mb-4">
                The system follows a modern monorepo architecture with three main packages:
              </p>
              <ul className="space-y-2 text-sm">
                <li><strong className="text-white">Frontend:</strong> React-based user interface</li>
                <li><strong className="text-white">Backend:</strong> Express API server with PostgreSQL database</li>
                <li><strong className="text-white">Shared:</strong> Common types and validation schemas</li>
              </ul>
              <p className="mt-4 text-sm">
                The backend integrates with n8n for workflow automation, enabling complex 
                multi-step processes with LLM integration.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Demo Mode</h2>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
              <p className="text-sm">
                The system currently runs in demo mode, which simulates the workflow process 
                without requiring database or n8n setup. This is perfect for demonstrations 
                and testing the user interface.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Export Formats</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">📄</div>
                <h3 className="font-semibold text-white">PDF</h3>
                <p className="text-xs mt-1">Formatted document</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">📝</div>
                <h3 className="font-semibold text-white">DOCX</h3>
                <p className="text-xs mt-1">Editable document</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">💾</div>
                <h3 className="font-semibold text-white">JSON</h3>
                <p className="text-xs mt-1">Structured data</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
