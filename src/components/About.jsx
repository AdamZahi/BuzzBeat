import React from 'react';

function About() {
  return (
    <div className="features" id="about">
      <div className="feature">
        <b>Human feel</b>
        Recommendations consider mood + pace, not just raw similarity.
      </div>
      <div className="feature">
        <b>Developer-friendly</b>
        Public API at <code>/recommend</code>—easy to wire into side projects.
      </div>
      <div className="feature">
        <b>Built for speed</b>
        Artifacts load once, so every query returns in milliseconds.
      </div>
    </div>
  );
}

export default About;
