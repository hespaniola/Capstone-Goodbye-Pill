# GoodbyePills Frontend + Basic Node Backend

Capstone project scaffold for GoodbyePills.com with a Vite frontend and a small Node.js API that stores users, mood selections, and journal entries in a local JSON file.

## Run locally

```bash
npm install
npm run server
npm run dev
```

## Notes
- The backend runs on `http://localhost:3001`.
- Vite proxies `/api` requests to the backend during local development.
- Backend data is stored in `server/data/store.json`.
- Authentication is intentionally simple and file-backed for capstone/demo use.
