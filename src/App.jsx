import React from 'react';
import Landing from './components/Landing.jsx';
import About from './components/About.jsx';
import RecommendationPanel from './components/RecommendationPanel.jsx';
import PopularityPanel from './components/PopularityPanel.jsx';
import logo from '../assets/lg02.png';

function App() {
  return (
    <div className="shell">
      <header>
        <div className="brand">
          <img src={logo} alt="BuzzBeat logo" style={{ height: '166px', width: 'auto' }} />
        </div>
        <span className="pill">Smart music discovery</span>
      </header>
      <Landing />
      <About />
      <RecommendationPanel />
      <PopularityPanel />
      <footer>Made with ♫ by BuzzBeat · Connect your backend at {import.meta.env.VITE_API_BASE || 'http://localhost:8000'}</footer>
    </div>
  );
}

export default App;
