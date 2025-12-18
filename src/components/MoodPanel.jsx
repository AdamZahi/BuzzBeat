import React from 'react';
import Loader from './Loader.jsx';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://Adam16.pythonanywhere.com/';

function MoodPanel() {
  const [track, setTrack] = React.useState('');
  const [artist, setArtist] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [result, setResult] = React.useState(null);
  const autoTriedRef = React.useRef(false);

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
      const res = await fetch(`${API_BASE}/predict_mood`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track_name: track, artist_name: artist }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        // Allow spotify_suggestions 404 to render as info, not error
        if (data.source === 'spotify_suggestions') {
          setResult({ source: 'spotify_suggestions', suggestions: data.spotify_results || [], message: data.message });
          // Auto-pick the first suggestion and retry once
          if (!autoTriedRef.current && (data.spotify_results || []).length > 0) {
            autoTriedRef.current = true;
            const first = data.spotify_results[0];
            setTrack(first.track_name || track);
            setArtist(first.artist_name || artist);
            await submit(new Event('submit'));
          }
          return;
        }
        setError(data.error || `Request failed (status ${res.status})`);
        return;
      }

      setResult({
        source: data.source,
        mood: data.mood,
        matchedTo: data.matched_to,
      });
      autoTriedRef.current = false;
    } catch (err) {
      setError('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel" id="mood">
      <h2>Predict mood label</h2>
      <p>Get the mood label (e.g., happy, calm) for a track from the dataset.</p>
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
            {loading ? 'Predicting...' : 'Predict mood'}
          </button>
        </div>
      </form>

      {loading && <Loader label="Feeling the mood..." />}
      {error && <div className="status error" style={{ marginTop: '8px' }}>{error}</div>}

      {result && result.source === 'spotify_suggestions' && (
        <div className="status" style={{ marginTop: '8px' }}>
          {result.message || 'Track not found in dataset. Try one of these Spotify matches:'}
          <div className="recs" style={{ marginTop: '10px' }}>
            {result.suggestions.map((s, idx) => (
              <div className="rec" key={`${s.spotify_id}-${idx}`}>
                <div>
                  <strong>{s.track_name}</strong>
                  <span className="status">{s.artist_name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {result && result.source === 'dataset' && (
        <div className="mood-card">
          <div className="mood-label">{result.mood || 'Unknown'}</div>
          {result.matchedTo && (
            <div className="status">Matched: {result.matchedTo.track_name} — {result.matchedTo.artist_name} (score {result.matchedTo.score})</div>
          )}
        </div>
      )}
    </div>
  );
}

export default MoodPanel;
