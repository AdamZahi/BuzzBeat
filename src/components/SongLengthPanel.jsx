import React from 'react';
import Loader from './Loader.jsx';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://Adam16.pythonanywhere.com/';
const FIXED_POPULARITY = 70;

function SongLengthPanel() {
  const [form, setForm] = React.useState({
    danceability: 0.5,
    energy: 0.5,
    tempo: 0.5,
    speechiness: 0.1,
    acousticness: 0.3,
    valence: 0.5,
  });
  const [predicting, setPredicting] = React.useState(false);
  const [error, setError] = React.useState('');
  const [prediction, setPrediction] = React.useState(null);

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: parseFloat(e.target.value) }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setPrediction(null);
    setPredicting(true);
    try {
      const payload = {
        ...form,
        track_popularity: FIXED_POPULARITY,
      };
      const res = await fetch(`${API_BASE}/api/predict-length`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || `Prediction failed (status ${res.status}).`);
        return;
      }
      setPrediction(data);
    } catch (err) {
      setError('Network error while predicting duration.');
    } finally {
      setPredicting(false);
    }
  };

  return (
    <div className="panel" id="length">
      <h2>Predict song length</h2>
      <p>Set the vibe with sliders and estimate the expected duration.</p>
      <form onSubmit={submit}>
        <div className="slider-group">
          <label>Danceability: {form.danceability.toFixed(2)}</label>
          <input type="range" min="0" max="1" step="0.01" value={form.danceability} onChange={handleChange('danceability')} />
        </div>
        <div className="slider-group">
          <label>Energy: {form.energy.toFixed(2)}</label>
          <input type="range" min="0" max="1" step="0.01" value={form.energy} onChange={handleChange('energy')} />
        </div>
        <div className="slider-group">
          <label>Tempo: {form.tempo.toFixed(2)}</label>
          <input type="range" min="0" max="1" step="0.01" value={form.tempo} onChange={handleChange('tempo')} />
        </div>
        <div className="slider-group">
          <label>Speechiness: {form.speechiness.toFixed(2)}</label>
          <input type="range" min="0" max="1" step="0.01" value={form.speechiness} onChange={handleChange('speechiness')} />
        </div>
        <div className="slider-group">
          <label>Acousticness: {form.acousticness.toFixed(2)}</label>
          <input type="range" min="0" max="1" step="0.01" value={form.acousticness} onChange={handleChange('acousticness')} />
        </div>
        <div className="slider-group">
          <label>Valence: {form.valence.toFixed(2)}</label>
          <input type="range" min="0" max="1" step="0.01" value={form.valence} onChange={handleChange('valence')} />
        </div>
        
        <div className="cta-row">
          <button className="btn btn-primary" type="submit" disabled={predicting}>
            {predicting ? 'Predicting...' : 'Predict length'}
          </button>
        </div>
      </form>

      {predicting && <Loader label="Guessing the runtime..." />}
      {error && <div className="status error" style={{ marginTop: '8px' }}>{error}</div>}

      {prediction && (
        <div className="length-card">
          <div className="length-metric">{prediction.duration_formatted || `${prediction.duration_seconds?.toFixed(1)} sec`}</div>
          
        </div>
      )}
    </div>
  );
}

export default SongLengthPanel;
