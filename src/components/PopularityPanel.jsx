import React from 'react';
import Loader from './Loader.jsx';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://adam16.pythonanywhere.com';

function PopularityPanel() {
  const [track, setTrack] = React.useState('');
  const [artist, setArtist] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [result, setResult] = React.useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!track.trim()) {
      setError('Track name is required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/predict_popularity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track_name: track, artist_name: artist }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || `Request failed (status ${res.status})`);
        return;
      }

      const value = data.track_popularity ?? data.predicted_track_popularity;
      setResult({
        value,
        source: data.source,
        matchedTo: data.matched_to,
        spotifyArtist: data.spotify_artist,
        durability: data.durability,
      });
    } catch (err) {
      setError('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel" id="popularity">
      <h2>Will this track be popular?</h2>
      <p>Check how hot a song could get and how long it might stay buzzing.</p>
      <form onSubmit={submit}>
        <div>
          <label>Track name</label>
          <input value={track} onChange={(e) => setTrack(e.target.value)} placeholder="e.g., Blinding Lights" />
        </div>
        <div>
          <label>Artist name</label>
          <input value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="e.g., The Weeknd" />
        </div>
        <div className="cta-row">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Predicting...' : 'Predict popularity'}
          </button>
        </div>
      </form>

      {loading && <Loader label="Checking how it might chart..." />}
      {error && <div className="status error" style={{ marginTop: '8px' }}>{error}</div>}
      {result && !error && (
        <div className="pop-card">
          <div className="pop-grid">
            <div className="pop-tile">
              <div className="pop-label">Popularity chance</div>
              <div className="pop-score">
                {Number.isFinite(result.value) ? `Chance to buzz: ${result.value.toFixed(1)}%` : 'Popularity score missing.'}
              </div>
              {result.matchedTo && (
                <div className="status">Matched: {result.matchedTo.track_name} — {result.matchedTo.artist_name}</div>
              )}
            </div>
            <div className="pop-tile">
              <div className="pop-label">Staying power</div>
              {!result.durability && <div className="status">No duration forecast available.</div>}
              {result.durability && result.durability.error && (
                <div className="status">Could not estimate staying power: {result.durability.error}</div>
              )}
              {result.durability && !result.durability.error && (
                <div className="status">
                  Likely to stay hot ~{Number.isFinite(result.durability.weeks) ? result.durability.weeks.toFixed(1) : 'N/A'} weeks
                  {Number.isFinite(result.durability.lower) && Number.isFinite(result.durability.upper) && (
                    <>
                      <br />Comfort band: {result.durability.lower.toFixed(1)} to {result.durability.upper.toFixed(1)} weeks
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PopularityPanel;
