# Kalaकार AI

AI catalog and listing generator for artisans. It turns craft photos and spoken voice notes into market-ready listings.

## Run locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set `GEMINI_API_KEY` in `.env.local` to your Gemini API key.
3. Start the app:
   `npm run dev`


## Authentication (Prototype)

This version includes local demo authentication with Sign In, Sign Up, and Sign Out.

### Demo account
- Email: `demo@kalaakar.ai`
- Password: `Kalaakar@123`

User sessions and user-specific product data are stored in browser `localStorage`. Passwords are stored as SHA-256 hashes for this prototype. This is suitable for a hackathon/demo, but production authentication should use a real backend/auth provider such as Supabase, Firebase Auth, or a server-side session system.
