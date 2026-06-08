# Game Trail — Game In My Style

A full-stack coding game platform where players learn HTML, CSS, JavaScript, Python, and Java by completing AI-validated coding challenges. Includes a real-time multiplayer Computer Mode powered by WebSockets.

## Tech Stack

- **Frontend** — React 19, Vite, Tailwind CSS, Framer Motion, Socket.IO Client
- **Backend** — Node.js, Express, MongoDB (Atlas), Socket.IO, Groq AI API
- **Auth** — JWT + bcrypt, email-based password reset via Gmail

## Project Structure

```
game-trail/
├── frontend/        # React app (deploy to Vercel)
└── backend/         # Express API + WebSocket server (deploy to Render)
```

## Local Development

**Backend**
```bash
cd backend
cp .env.example .env   # fill in your values
npm install
npm run dev            # runs on http://localhost:3000
```

**Frontend**
```bash
cd frontend
cp .env.example .env   # set VITE_API_URL=http://localhost:3000/api
npm install
npm run dev            # runs on http://localhost:5173
```

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `PORT` | Server port (default 3000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `GMAIL_USER` | Gmail address for sending emails |
| `GMAIL_PASS` | Gmail app password |
| `EMAIL_FROM` | From address for emails |
| `FRONTEND_URL` | Your frontend URL (for CORS) |
| `GROQ_API_KEYS` | Comma-separated Groq API keys — `gsk_key1,gsk_key2,...` |

### Frontend (`frontend/.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL — `https://your-backend.onrender.com/api` |

## Deployment

- **Backend** → [Render](https://render.com) (Web Service, root dir: `backend`)
- **Frontend** → [Vercel](https://vercel.com) (root dir: `frontend`, framework: Vite)
