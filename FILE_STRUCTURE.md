# Complete File Structure

## Project Root
```
ai-interview-simulator/
├── README.md                   # Main documentation
├── PROJECT_OVERVIEW.md         # High-level project overview
├── SETUP.md                    # Setup instructions
├── DEPLOYMENT.md               # Deployment guide
├── CODE_EXAMPLES.md            # Code examples and patterns
├── package.json                # Root package.json
├── docker-compose.yml          # Docker compose for full stack
│
├── server/                     # Backend (Node.js + Express + MongoDB)
│   ├── models/                # Database schemas
│   │   ├── User.js            # User model with password hashing
│   │   └── InterviewSession.js # Interview session schema
│   │
│   ├── controllers/           # Business logic
│   │   ├── authController.js  # Auth handlers (register, login, profile)
│   │   └── interviewController.js # Interview handlers
│   │
│   ├── routes/               # API endpoints
│   │   ├── authRoutes.js     # Auth endpoints
│   │   └── interviewRoutes.js # Interview endpoints
│   │
│   ├── services/             # External services
│   │   └── aiService.js      # OpenAI integration
│   │
│   ├── middleware/           # Custom middleware
│   │   ├── auth.js           # JWT authentication
│   │   ├── errorHandler.js   # Global error handler
│   │   └── rateLimiter.js    # Rate limiting
│   │
│   ├── index.js              # Server entry point
│   ├── package.json          # Dependencies
│   ├── .env.example          # Environment template
│   ├── .gitignore            # Git ignore rules
│   └── Dockerfile            # Docker image for backend
│
└── client/                    # Frontend (React + Vite + TailwindCSS)
    ├── src/
    │   ├── pages/            # Page components
    │   │   ├── Login.jsx           # Login page
    │   │   ├── Register.jsx        # Registration page
    │   │   ├── Dashboard.jsx       # Main dashboard
    │   │   ├── InterviewSession.jsx # Interview Q&A
    │   │   ├── SessionHistory.jsx  # History & Analytics
    │   │   └── SessionDetail.jsx   # Detailed feedback
    │   │
    │   ├── components/       # Reusable components
    │   │   └── ProtectedRoute.jsx # Route protection
    │   │
    │   ├── services/         # API clients
    │   │   ├── authService.js    # Auth API calls
    │   │   └── interviewService.js # Interview API calls
    │   │
    │   ├── hooks/           # Custom React hooks
    │   │   ├── useAuth.js        # Auth context hook
    │   │   └── useAsync.js       # Async operations hook
    │   │
    │   ├── context/         # React context
    │   │   └── AuthContext.jsx   # Auth provider
    │   │
    │   ├── App.jsx          # Main app component & routing
    │   ├── main.jsx         # React entry point
    │   └── index.css        # Global styles
    │
    ├── index.html           # HTML template
    ├── vite.config.js       # Vite configuration
    ├── tailwind.config.js   # TailwindCSS config
    ├── postcss.config.js    # PostCSS config
    ├── package.json         # Dependencies
    ├── .env.example         # Environment template
    ├── .gitignore           # Git ignore rules
    └── Dockerfile           # Docker image for frontend
```

## Key Files Explained

### Backend Core Files

#### `/server/index.js`
- Server entry point
- Express app initialization
- MongoDB connection
- Middleware setup
- Route registration
- Error handling

#### `/server/models/User.js`
- User schema definition
- Password hashing (bcryptjs)
- Password comparison method
- Email validation

#### `/server/models/InterviewSession.js`
- Interview session schema
- Nested answers array
- Score calculation
- auto-averaging metrics

#### `/server/services/aiService.js`
- OpenAI API integration
- Question generation
- Answer evaluation
- Follow-up generation

#### `/server/controllers/authController.js`
- User registration
- Login logic
- JWT token generation
- Profile retrieval

#### `/server/controllers/interviewController.js`
- Interview start
- Answer submission
- History retrieval
- Analytics generation

### Frontend Core Files

#### `/client/src/App.jsx`
- Main app component
- Route definitions
- Protected route wrapper
- Provider wrapper

#### `/client/src/context/AuthContext.jsx`
- Auth state management
- Login/Logout handlers
- User persistence
- Token management

#### `/client/src/services/authService.js`
- Register API call
- Login API call
- Token storage
- Auth validation

#### `/client/src/pages/Dashboard.jsx`
- Interview session start form
- Role and difficulty selection
- Quick start interface

#### `/client/src/pages/InterviewSession.jsx`
- Question display
- Answer submission
- Feedback display
- Progress tracking

#### `/client/src/pages/SessionHistory.jsx`
- Session list
- Statistics display
- Recharts visualizations
- Analytics tabs

## File Purpose Summary

| File | Purpose | Type |
|------|---------|------|
| User.js | User schema | Model |
| InterviewSession.js | Interview data | Model |
| authController.js | Auth logic | Controller |
| interviewController.js | Interview logic | Controller |
| aiService.js | AI integration | Service |
| authRoutes.js | Auth endpoints | Route |
| interviewRoutes.js | Interview endpoints | Route |
| auth.js (middleware) | JWT verification | Middleware |
| errorHandler.js | Error handling | Middleware |
| rateLimiter.js | Rate limiting | Middleware |
| App.jsx | Main component | Component |
| AuthContext.jsx | Auth state | Context |
| Dashboard.jsx | Start page | Page |
| InterviewSession.jsx | Q&A page | Page |
| SessionHistory.jsx | Analytics | Page |
| authService.js | Auth API | Service |
| interviewService.js | Interview API | Service |
| useAuth.js | Auth hook | Hook |
| useAsync.js | Async hook | Hook |

## Total Files Created

- **Backend**: 13 files
- **Frontend**: 16 files
- **Configuration**: 9 files
- **Documentation**: 5 files
- **Docker**: 3 files

**Total: 46 production-ready files**

## Dependencies Overview

### Backend Dependencies (
```json
{
  "express": "4.18.2",
  "mongoose": "8.0.0",
  "jsonwebtoken": "9.1.2",
  "bcryptjs": "2.4.3",
  "openai": "4.24.0",
  "axios": "1.6.0",
  "cors": "2.8.5",
  "dotenv": "16.3.1",
  "express-rate-limit": "7.1.5"
}
```

### Frontend Dependencies
```json
{
  "react": "18.2.0",
  "react-dom": "18.2.0",
  "react-router-dom": "6.20.0",
  "axios": "1.6.0",
  "recharts": "2.10.0",
  "tailwindcss": "3.3.0"
}
```

## Development Commands

### Root Level
```bash
npm install-all     # Install all dependencies
npm dev             # Start both backend and frontend
npm server          # Start backend only
npm client          # Start frontend only
npm build           # Build frontend
```

### Backend (server/)
```bash
npm install         # Install dependencies
npm run dev         # Start with nodemon
npm start           # Start for production
```

### Frontend (client/)
```bash
npm install         # Install dependencies
npm run dev         # Start dev server
npm run build       # Build for production
npm run preview     # Preview production build
```

## Configuration Files

1. `/server/.env` - Backend environment
2. `/client/.env` - Frontend environment
3. `/vite.config.js` - Vite build config
4. `/tailwind.config.js` - TailwindCSS theme
5. `/postcss.config.js` - PostCSS plugins
6. `docker-compose.yml` - Full stack Docker
7. `/server/Dockerfile` - Backend Docker
8. `/client/Dockerfile` - Frontend Docker

## Git Files

1. `/server/.gitignore` - Backend ignore rules
2. `/client/.gitignore` - Frontend ignore rules

---

**All files follow production-ready standards with:**
- ✅ Proper error handling
- ✅ Input validation
- ✅ Security best practices
- ✅ Code documentation
- ✅ Modular architecture
- ✅ Performance optimization
