export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-6">About This Project</h1>
        
        <div className="space-y-6 text-white/90">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Overview</h2>
            <p className="leading-relaxed">
              The Literature Survey System is an AI-powered research assistant designed to automate 
              the process of conducting comprehensive literature reviews. This system leverages multiple 
              Large Language Models (LLMs) to retrieve, validate, evaluate, and synthesize academic papers 
              into coherent literature surveys.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Key Features</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Multi-LLM pipeline for enhanced accuracy and reliability</li>
              <li>Automated paper retrieval from scholarly databases</li>
              <li>Intelligent validation and quality assessment</li>
              <li>Real-time progress tracking with detailed status updates</li>
              <li>Export capabilities (PDF, DOCX, JSON formats)</li>
              <li>n8n workflow automation integration</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Technology Stack</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">Frontend</h3>
                <ul className="text-sm space-y-1">
                  <li>React + TypeScript</li>
                  <li>Vite</li>
                  <li>Tailwind CSS</li>
                  <li>React Router</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">Backend</h3>
                <ul className="text-sm space-y-1">
                  <li>Node.js + Express</li>
                  <li>TypeScript</li>
                  <li>PostgreSQL</li>
                  <li>n8n Automation</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Project Objectives</h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Design and implement a web-based interface for user interaction</li>
              <li>Create automated workflows for paper retrieval and validation</li>
              <li>Utilize multi-LLM pipeline for different processing tasks</li>
              <li>Ensure generated surveys are consistent and well-organized</li>
              <li>Provide export capabilities in multiple formats</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">Academic Context</h2>
            <p className="leading-relaxed">
              This project is developed as a Final Year Project, demonstrating the practical application 
              of modern AI technologies in academic research. The system focuses on English-language 
              scholarly articles and aims to streamline the literature review process for researchers 
              and students.
            </p>
          </section>

          <section className="bg-white/5 rounded-lg p-6 mt-8">
            <h2 className="text-2xl font-semibold text-white mb-3">Scope and Limitations</h2>
            <p className="leading-relaxed mb-3">
              The system is designed as a prototype to demonstrate automated literature survey generation. 
              Current limitations include:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
              <li>English-language articles only</li>
              <li>Focus on literature surveys (not full research papers)</li>
              <li>No plagiarism detection or citation formatting</li>
              <li>Academic demonstration scope (not commercial scale)</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
