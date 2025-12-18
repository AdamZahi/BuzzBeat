import React from 'react';

function Landing() {
  return (
    <div className="hero">
      <div className="hero-card">
        <div className="eyebrow">BuzzBeat</div>
        <h1>Find your next favorite song in a few taps.</h1>
        <p className="lead">Tell us a song and artist and we’ll hand you five fresh picks that carry the same vibe. No sign-up—just play.</p>
        <div className="cta-row">
          <a className="btn btn-primary" href="/recommend">Start recommending</a>
          <a className="btn btn-ghost" href="#about">Why BuzzBeat?</a>
        </div>
      </div>
      <div className="hero-card">
        <div className="eyebrow">Live Preview</div>
        <p className="lead">We listen for groove, mood, and spark to surface songs your ears will love.</p>
        <div className="feature" style={{ marginBottom: '8px' }}>
          <b>Quick picks</b>
          You get suggestions in a heartbeat, so you never lose the moment.
        </div>
        <div className="feature" style={{ marginBottom: '8px' }}>
          <b>Feels-right matches</b>
          We focus on the pulse, warmth, and energy—not just genre labels.
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
