import React from 'react';
import Landing from './components/Landing.jsx';
import About from './components/About.jsx';
import RecommendationPanel from './components/RecommendationPanel.jsx';

function App() {
  return (
    <div className="shell">
      <header>
        <div className="brand"><span className="dot" />BuzzBeat</div>
        <span className="pill">Smart music discovery</span>
      </header>
      <Landing />
      <About />
      <RecommendationPanel />
      <footer>Made with ♫ by BuzzBeat · Connect your backend at {import.meta.env.VITE_API_BASE || 'http://localhost:8000'}</footer>
    </div>
  );
}

export default App;
