import React from 'react';

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
      <p>Estimate popularity (0-100)    .</p>
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

      {error && <div className="status error" style={{ marginTop: '8px' }}>{error}</div>}

      {result && !error && (
        <div className="pop-card">
          <div className="pop-score">{result.value !== undefined ? `The chances to get popular is ${result.value.toFixed(1)}%` : 'N/A'}</div>
        </div>
      )}
    </div>
  );
}

export default PopularityPanel;
