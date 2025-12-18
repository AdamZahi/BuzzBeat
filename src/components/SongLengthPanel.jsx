import React from 'react';
import Loader from './Loader.jsx';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://Adam16.pythonanywhere.com/';

function SongLengthPanel() {
  const [track, setTrack] = React.useState('');
  const [artist, setArtist] = React.useState('');
  const [searching, setSearching] = React.useState(false);
  const [predicting, setPredicting] = React.useState(false);
  const [error, setError] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);
  const [prediction, setPrediction] = React.useState(null);
  const [selectedId, setSelectedId] = React.useState('');

  const tryPredictByIndex = async (idx) => {
    if (!suggestions[idx]) {
      setError('Failed to predict from Spotify results.');
      return;
    }
    await predictLength(suggestions[idx], idx);
  };

  const runSearch = async (e) => {
    e.preventDefault();
    setError('');
    setPrediction(null);
    setSuggestions([]);
    setSelectedId('');

    const q = `${track} ${artist}`.trim();
    if (!q) {
      setError('Track name is required.');
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}&limit=5`);
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || `Search failed (status ${res.status}).`);
        return;
      }
      setSuggestions(data.spotify_results || []);
      if ((data.spotify_results || []).length === 0) {
        setError('No Spotify matches found for that query.');
      } else {
        // Auto-pick the first suggestion and predict length
        tryPredictByIndex(0);
      }
    } catch (err) {
      setError('Network error while searching. Is the backend reachable?');
    } finally {
      setSearching(false);
    }
  };

  const predictLength = async (item, indexHint = 0) => {
    setError('');
    setPrediction(null);
    setSelectedId(item.spotify_id);
    setPredicting(true);
    try {
      const res = await fetch(`${API_BASE}/api/predict-length/by-track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track_id: item.spotify_id }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        // Try next suggestion automatically if available
        const nextIndex = indexHint + 1;
        if (suggestions[nextIndex]) {
          await predictLength(suggestions[nextIndex], nextIndex);
          return;
        }
        setError(data.error || `Prediction failed (status ${res.status}).`);
        return;
      }
      setPrediction({ ...data, track: item });
    } catch (err) {
      setError('Network error while predicting duration.');
    } finally {
      setPredicting(false);
      setSelectedId('');
    }
  };

  return (
    <div className="panel" id="length">
      <h2>Predict song length</h2>
      <p>Search a Spotify track, then estimate its expected duration using audio features.</p>
      <form onSubmit={runSearch}>
        <div>
          <label>Track name</label>
          <input value={track} onChange={(e) => setTrack(e.target.value)} placeholder="e.g., Blinding Lights" />
        </div>
        <div>
          <label>Artist name (optional)</label>
          <input value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="e.g., The Weeknd" />
        </div>
        <div className="cta-row">
          <button className="btn btn-primary" type="submit" disabled={searching}>
            {searching ? 'Searching...' : 'Search on Spotify'}
          </button>
        </div>
      </form>

      {(searching || predicting) && (
        <Loader label={searching ? 'Looking up the track...' : 'Guessing the runtime...'} />
      )}
      {error && <div className="status error" style={{ marginTop: '8px' }}>{error}</div>}

      {prediction && (
        <div className="length-card">
          <div className="length-metric">{prediction.duration_formatted}</div>
          <div className="status">
            Estimated from: {prediction.track.track_name} — {prediction.track.artist_name}
          </div>
        </div>
      )}
    </div>
  );
}

export default SongLengthPanel;
