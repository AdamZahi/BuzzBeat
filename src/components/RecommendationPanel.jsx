import React from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://Adam16.pythonanywhere.com/';

function useRecommendation() {
  const [track, setTrack] = React.useState('');
  const [artist, setArtist] = React.useState('');
  const [k, setK] = React.useState(5);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [result, setResult] = React.useState(null);
  const [modal, setModal] = React.useState({ open: false, loading: false, error: '', data: null });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setModal({ open: false, loading: false, error: '', data: null });

    if (!track.trim() || !artist.trim()) {
      setError('Please enter both track name and artist name.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track_name: track, artist_name: artist, k: Number(k) || 5 }),
      });
      const data = await res.json();

      if (data?.source) {
        setResult({
          source: data.source,
          recommendations: data.recommendations || [],
          matchedTo: data.matched_to,
          query: data.query,
          message: data.message,
          spotifyChosen: data.spotify_chosen,
          spotifyResults: data.spotify_results,
          input: data.input,
        });
        if (!res.ok && !data.error) {
          // Allow informative non-200 payloads to render (e.g., spotify_auto_no_match)
          return;
        }
      }

      if (!res.ok || data.error) {
        setError(data.error || `Request failed (status ${res.status})`);
        return;
      }

      if (!data?.source) {
        setResult({
          source: 'dataset_exact',
          recommendations: data.recommendations || [],
          matchedTo: data.matched_to,
          query: data.query,
        });
      }
    } catch (err) {
      setError('Network error. Is the API running on port 8000?');
    } finally {
      setLoading(false);
    }
  };

  const openDetails = async (trackName, artistName) => {
    setModal({ open: true, loading: true, error: '', data: null });
    try {
      const q = encodeURIComponent(`${trackName} ${artistName}`.trim());
      const res = await fetch(`${API_BASE}/search?q=${q}&limit=1`);
      const data = await res.json();
      if (!res.ok || data.error) {
        setModal({ open: true, loading: false, error: data.error || 'Could not load details.', data: null });
        return;
      }
      const item = (data.spotify_results || [])[0];
      if (!item) {
        setModal({ open: true, loading: false, error: 'No Spotify details found for this track.', data: null });
        return;
      }
      setModal({ open: true, loading: false, error: '', data: item });
    } catch (err) {
      setModal({ open: true, loading: false, error: 'Network error while fetching details.', data: null });
    }
  };

  const closeDetails = () => setModal({ open: false, loading: false, error: '', data: null });

  return { track, artist, k, setTrack, setArtist, setK, loading, error, result, submit, openDetails, closeDetails, modal };
}

function RecommendationPanel() {
  const { track, artist, k, setTrack, setArtist, setK, loading, error, result, submit, openDetails, closeDetails, modal } = useRecommendation();

  return (
    <div className="panel" id="discover">
      <h2>Find Similar Songs</h2>
      <p>Enter a track and artist to get 5 smart recommendations from BuzzBeat.</p>
      <form onSubmit={submit}>
        <div>
          <label>Track name</label>
          <input value={track} onChange={(e) => setTrack(e.target.value)} placeholder="e.g., Blinding Lights" />
        </div>
        <div>
          <label>Artist name</label>
          <input value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="e.g., The Weeknd" />
        </div>
        <div>
          <label>How many recs? (1-10)</label>
          <input type="number" min="1" max="10" value={k} onChange={(e) => setK(e.target.value)} />
        </div>
        <div className="cta-row">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Crunching...' : 'Recommend'}
          </button>
        </div>
      </form>
      {error && <div className="status error">{error}</div>}

      {result && result.source === 'spotify_auto_no_match' && (
        <div className="status">
          {result.message || 'No dataset match even after Spotify lookup.'}
          <div style={{ marginTop: '8px' }}>
            Tried Spotify: {result.spotifyChosen?.track_name} — {result.spotifyChosen?.artist_name}
          </div>
        </div>
      )}

      {result && result.source === 'spotify_auto_match' && (
        <div className="status" style={{ marginBottom: '8px' }}>
          Auto-picked from Spotify: {result.spotifyChosen?.track_name} — {result.spotifyChosen?.artist_name}
        </div>
      )}

      {result && result.recommendations && result.recommendations.length === 0 && !error && (
        <div className="status">No recommendations found.</div>
      )}

      {result && result.recommendations && result.recommendations.length > 0 && (
        <div className="recs">
          {result.recommendations.map((item, i) => (
            <div className="rec" key={`${item.track_name}-${i}`} onClick={() => openDetails(item.track_name, item.artist_name)} role="button" tabIndex={0}>
              <div>
                <strong>{item.track_name}</strong>
                <span className="status">{item.artist_name}</span>
              </div>
              <span className="pill-small">#{i + 1}</span>
            </div>
          ))}
        </div>
      )}

      {modal.open && (
        <div className="modal-backdrop" onClick={closeDetails}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Song details</h3>
              <button className="btn btn-ghost" type="button" onClick={closeDetails}>Close</button>
            </div>
            {modal.loading && <div className="status">Loading...</div>}
            {modal.error && <div className="status error">{modal.error}</div>}
            {!modal.loading && !modal.error && modal.data && (
              <div className="modal-body">
                {modal.data.image_url && (
                  <img className="modal-cover" src={modal.data.image_url} alt={`${modal.data.track_name} cover`} />
                )}
                <div className="modal-meta">
                  <h4>{modal.data.track_name}</h4>
                  <div className="status">{modal.data.artist_name}</div>
                  {modal.data.album_name && <div className="status">Album: {modal.data.album_name}</div>}
                  {modal.data.spotify_url && (
                    <a className="btn btn-primary" href={modal.data.spotify_url} target="_blank" rel="noreferrer">Open in Spotify</a>
                  )}
                  {modal.data.preview_url ? (
                    <audio controls src={modal.data.preview_url} style={{ width: '100%', marginTop: '10px' }}>
                      Your browser does not support the audio element.
                    </audio>
                  ) : (
                    <div className="status" style={{ marginTop: '10px' }}>Preview not available for this track.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RecommendationPanel;
