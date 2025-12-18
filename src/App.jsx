import React from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Landing from './components/Landing.jsx';
import About from './components/About.jsx';
import RecommendationPanel from './components/RecommendationPanel.jsx';
import PopularityPanel from './components/PopularityPanel.jsx';
import MoodPanel from './components/MoodPanel.jsx';
import SongLengthPanel from './components/SongLengthPanel.jsx';
import PlaylistPanel from './components/PlaylistPanel.jsx';
import logo from '../assets/lg02.png';

const Home = () => (
  <>
    <Landing />
    <About />
  </>
);

const Page = ({ children }) => <div style={{ marginTop: '12px' }}>{children}</div>;

function NavBar() {
  const { pathname } = useLocation();
  const navItems = [
    { to: '/recommend', label: 'Recommendations' },
    { to: '/popularity', label: 'Popularity' },
    { to: '/mood', label: 'Mood' },
    { to: '/length', label: 'Song length' },
    { to: '/playlist', label: 'Playlist' },
  ];

  return (
    <header className="nav-header fancy">
      <Link to="/" className="brand marquee">
        <img src={logo} alt="BuzzBeat logo" className="logo-spin" />
        <span className="pill glow">Smart music discovery</span>
      </Link>
      <nav className="top-nav slide-in">
        {navItems.map((item) => (
          <Link key={item.to} className={pathname === item.to ? 'nav-link active' : 'nav-link'} to={item.to}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function App() {
  return (
    <div className="shell">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recommend" element={<Page><RecommendationPanel /></Page>} />
        <Route path="/popularity" element={<Page><PopularityPanel /></Page>} />
        <Route path="/mood" element={<Page><MoodPanel /></Page>} />
        <Route path="/length" element={<Page><SongLengthPanel /></Page>} />
        <Route path="/playlist" element={<Page><PlaylistPanel /></Page>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer>Powered by Adam Zahi, Farah Hammami, Hamza Rkik, Mohamed Ali Chaabani, Ghofrane Benhassen and Hazem Mtir</footer>
    </div>
  );
}

export default App;
