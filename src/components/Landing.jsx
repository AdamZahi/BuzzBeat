import React from 'react';

function Landing() {
  return (
    <div className="hero">
      <div className="hero-card">
        <div className="eyebrow">BuzzBeat</div>
        <h1>Discover music faster with AI-powered taste matching.</h1>
        <p className="lead">Drop a track + artist and get five curated songs that match the vibe. No sign-up, just instant inspiration.</p>
        <div className="cta-row">
          <a className="btn btn-primary" href="#discover">Start recommending</a>
          <a className="btn btn-ghost" href="#about">Why BuzzBeat?</a>
        </div>
      </div>
      <div className="hero-card">
        <div className="eyebrow">Live Preview</div>
        <p className="lead">We analyze tempo, mood, energy, and acoustic fingerprints to surface songs your ears will love.</p>
        <div className="feature" style={{ marginBottom: '8px' }}>
          <b>Fast responses</b>
          Powered by preloaded PCA + KNN models for instant recs.
        </div>
        <div className="feature" style={{ marginBottom: '8px' }}>
          <b>Pure signal</b>
          Uses audio features like danceability, valence, energy, and more.
        </div>
        <div className="feature">
          <b>Zero clutter</b>
          No ads, no logins—just music discovery.
        </div>
      </div>
    </div>
  );
}

export default Landing;
