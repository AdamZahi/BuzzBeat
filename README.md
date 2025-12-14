# BuzzBeat Frontend

Full React + Vite build for the BuzzBeat music recommender.

## Prereqs
- Node.js 18+ recommended

## Setup
```sh
cd frontend
npm install
```

## Run dev
```sh
npm run dev
# open the shown URL, e.g. http://localhost:5173
```

## Build
```sh
npm run build
npm run preview  # optional to serve the build locally
```

## Config
- Backend base URL: set `VITE_API_BASE` in a `.env` file (defaults to `http://localhost:8000`).
- API used: `POST /recommend` with body `{ track_name, artist_name, k }`.

## Features
- Landing hero and value props for BuzzBeat
- Recommendation form with live error states and loading
- Up to 5 dataset-based recommendations, plus auto-Spotify fallback
- Click any recommendation to open a details modal with Spotify metadata and an audio preview button (when available)

## File map
- `src/App.jsx` main layout
- `src/components/*` UI sections
- `src/styles.css` theming
