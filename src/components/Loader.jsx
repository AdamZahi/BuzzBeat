import React from 'react';

function Loader({ label = 'Working on it...' }) {
  return (
    <div className="beat-loader" role="status" aria-live="polite">
      <div className="beat" />
      <div className="beat" />
      <div className="beat" />
      <div className="beat" />
      <div className="beat" />
      <span className="beat-label">{label}</span>
    </div>
  );
}

export default Loader;
