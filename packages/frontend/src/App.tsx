import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProgressPage from './pages/ProgressPage';
import SurveyPage from './pages/SurveyPage';
import AboutPage from './pages/AboutPage';
import DocumentationPage from './pages/DocumentationPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/progress/:executionId" element={<ProgressPage />} />
          <Route path="/survey/:surveyId" element={<SurveyPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
