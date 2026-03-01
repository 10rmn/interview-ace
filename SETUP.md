# Setup Instructions

## Quick Start Guide

### Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)
- Google Gemini API Key
- npm or yarn

## Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your credentials
# - MONGODB_URI: MongoDB connection string
# - JWT_SECRET: Your secret key
# - GEMINI_API_KEY: Your Google Gemini API key
# - CORS_ORIGIN: Frontend origin (http://localhost:5173)

# Start development server
npm run dev
```

## Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/ai-interview-simulator
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=your_gemini_key
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Development Commands

### Backend
```bash
npm run dev      # Start with nodemon
npm start        # Start production server
npm test         # Run tests (when available)
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## API Testing

### Test Health Endpoint
```bash
curl http://localhost:5000/api/health
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Start Interview (with token)
```bash
curl -X POST http://localhost:5000/api/interview/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "role": "Frontend",
    "difficulty": "Medium"
  }'
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or connection string is correct
- Check MongoDB URI format in .env

### OpenAI API Error
- Verify API key is valid
- Check OpenAI account has credits
- Ensure rate limiting is not exceeded

### CORS Error
- Verify CORS_ORIGIN matches frontend URL
- Check backend is configured with correct origin

### Port Already in Use
```bash
# Find and kill process using port 5000
lsof -ti:5000 | xargs kill -9
```

## File Structure Overview

```
ai-interview-simulator/
├── server/
│   ├── models/              (Database schemas)
│   ├── controllers/         (Business logic)
│   ├── routes/             (API endpoints)
│   ├── services/           (External services)
│   ├── middleware/         (Auth, errors, rate limit)
│   ├── index.js           (Server entry)
│   └── package.json
│
└── client/
    ├── src/
    │   ├── pages/         (Page components)
    │   ├── components/    (Reusable components)
    │   ├── services/      (API clients)
    │   ├── hooks/        (Custom hooks)
    │   ├── context/      (React context)
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## Next Steps

1. Complete the setup process
2. Create a test account
3. Start an interview session
4. Try different roles and difficulties
5. View analytics and performance

## Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [OpenAI API Docs](https://platform.openai.com/docs/api-reference)
