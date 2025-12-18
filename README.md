# BuzzBeat Frontend

React + Vite single-page app for BuzzBeat’s music discovery tools.

## Requirements
- Node.js 18+

## Quick start
```sh
cd frontend
npm install
npm run dev   # starts Vite dev server (open printed URL, usually http://localhost:5173)
```

## Production build
```sh
npm run build
npm run preview   # optional: serve the build locally
```

## Configuration
- API base URL: set `VITE_API_BASE` in a `.env` file. Default: `http://localhost:8000`.
- Routes: Home, Recommendations, Popularity, Mood, Song length, Playlist.

## Capabilities
- Landing page with value props and CTA.
- Recommendations: enter track + artist, auto-selects best match, shows 5 similar songs, modal with Spotify details.
- Popularity + durability: predict buzz score and expected staying power in one view.
- Mood: predict track mood with automatic Spotify suggestion retry.
- Song length: search Spotify, auto-pick first hit, estimate duration with fallbacks.
- Playlist: build a similar-song playlist from one seed with Spotify links and cover art.
- Shared animated loader for all async actions.

## Source layout
- `src/App.jsx` – router, shell, footer.
- `src/components/` – feature panels and shared pieces (loader, hero, about, etc.).
- `src/styles.css` – theme, layout, animations.
