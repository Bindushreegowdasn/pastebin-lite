# Pastebin Lite

A simple pastebin application that allows users to create and share text snippets with optional expiry constraints.

## Features

- Create text pastes with shareable URLs
- Optional time-based expiry (TTL)
- Optional view-count limits
- Clean, simple UI

## Running Locally

1. Clone the repository:
```bash
git clone https://github.com/Bindushreegowdasn/pastebin-lite.git
cd pastebin-lite
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Persistence Layer

This application uses **in-memory storage** (JavaScript Map) for paste data. 

**Note:** Data is lost when the server restarts. For production use, this should be replaced with a persistent database like Redis, PostgreSQL, or Vercel KV.

## Design Decisions

- **Next.js 14+** with App Router for modern React patterns
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **In-memory storage** for simplicity (easily replaceable with Redis/KV)
- **Deterministic time testing** supported via TEST_MODE environment variable

## API Endpoints

- `GET /api/healthz` - Health check
- `POST /api/pastes` - Create a new paste
- `GET /api/pastes/:id` - Fetch paste data (API)
- `GET /p/:id` - View paste (HTML)

## Deployment

Deployed on Vercel: https://pastebin-lite-olive-six.vercel.app