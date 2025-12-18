import React from 'react';
import Loader from './Loader.jsx';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://Adam16.pythonanywhere.com/';

function PlaylistPanel() {
  const [track, setTrack] = React.useState('');
  const [artist, setArtist] = React.useState('');
  const [k, setK] = React.useState(12);
  const [searching, setSearching] = React.useState(false);
  const [building, setBuilding] = React.useState(false);
  const [error, setError] = React.useState('');
  const [playlist, setPlaylist] = React.useState([]);
  const [seed, setSeed] = React.useState(null);

  const searchSpotify = async (e) => {
    e.preventDefault();
    setError('');
    setPlaylist([]);
    setSeed(null);
    const q = `${track} ${artist}`.trim();
    if (!q) {
      setError('Track name is required.');
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}&limit=6`);
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || `Search failed (status ${res.status}).`);
        return;
      }
      const picks = data.spotify_results || [];
      if (picks.length === 0) {
        setError('No Spotify matches found for that query.');
      } else {
        // Auto-pick the first suggestion and build playlist
        buildPlaylist(picks[0]);
      }
    } catch (err) {
      setError('Network error while searching.');
    } finally {
      setSearching(false);
    }
  };

  const buildPlaylist = async (item) => {
    setError('');
    setBuilding(true);
    setPlaylist([]);
    setSeed(item);
    try {
      const res = await fetch(`${API_BASE}/api/recommend/similar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spotify_id: item.spotify_id, k: Number(k) || 12 }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || `Playlist build failed (status ${res.status}).`);
        return;
      }
      setPlaylist(data.recommendations || []);
    } catch (err) {
      setError('Network error while building playlist.');
    } finally {
      setBuilding(false);
    }
  };

  return (
    <div className="panel" id="playlist">
      <h2>Build a playlist from one song</h2>
      <p>Pick a Spotify track and we’ll generate a similar-song playlist from the similarity index.</p>
      <form onSubmit={searchSpotify}>
        <div>
          <label>Track name</label>
          <input value={track} onChange={(e) => setTrack(e.target.value)} placeholder="e.g., Blinding Lights" />
        </div>
        <div>
          <label>Artist name (optional)</label>
          <input value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="e.g., The Weeknd" />
        </div>
        <div>
          <label>How many songs? (5-30)</label>
          <input type="number" min="5" max="30" value={k} onChange={(e) => setK(e.target.value)} />
        </div>
        <div className="cta-row">
          <button className="btn btn-primary" type="submit" disabled={searching}>
            {searching ? 'Searching...' : 'Search on Spotify'}
          </button>
        </div>
      </form>

      {(searching || building) && (
        <Loader label={searching ? 'Finding your seed song...' : 'Cooking up a playlist...'} />
      )}
      {error && <div className="status error" style={{ marginTop: '8px' }}>{error}</div>}

      {playlist.length > 0 && (
        <div className="playlist-grid">
          {playlist.map((item, idx) => (
            <div className="playlist-item" key={`${item.spotify_match?.spotify_id || idx}-${idx}`}>
              {item.spotify_match?.image_url && (
                <img className="playlist-cover" src={item.spotify_match.image_url} alt={`${item.spotify_match.track_name} cover`} />
              )}
              <div className="playlist-meta">
                <div className="playlist-rank">#{idx + 1}</div>
                <div className="playlist-title">{item.spotify_match?.track_name || item.source_row?.track_name}</div>
                <div className="status">{item.spotify_match?.artist_name || item.source_row?.artist_name}</div>
                {item.spotify_match?.spotify_url && (
                  <a className="btn btn-primary" href={item.spotify_match.spotify_url} target="_blank" rel="noreferrer">
                    Open in Spotify
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlaylistPanel;
