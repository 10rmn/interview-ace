# AI Interview Simulator 🎯

A production-ready AI-powered interview simulator built with MERN stack. This application helps users practice technical interviews with AI-generated questions, real-time feedback, and comprehensive analytics.

## 🚀 Features

### Core Features
- **User Authentication**: Secure JWT-based registration and login with password hashing
- **Interview Sessions**: Select role (Frontend, Backend, DSA, HR) and difficulty level (Easy, Medium, Hard)
- **AI Question Generation**: OpenAI API integration to generate contextual interview questions
- **Adaptive Questioning**: AI analyzes responses and generates follow-up questions on weak areas
- **Real-time Evaluation**: Instant AI feedback with detailed scoring (clarity, accuracy, confidence)
- **Performance Dashboard**: Comprehensive analytics and progress tracking
- **Interview History**: View all past sessions with detailed feedback

### Bonus Features
- **Rate Limiting**: Protect API endpoints from abuse
- **Error Handling**: Comprehensive error handling and validation
- **Protected Routes**: Role-based authentication
- **Modular Architecture**: Clean separation of concerns
- **Production-Ready Code**: Best practices and modern patterns

## 📋 Tech Stack

### Backend
- **Node.js & Express**: REST API framework
- **MongoDB & Mongoose**: Document database
- **JWT**: Secure authentication
- **bcryptjs**: Password hashing
- **Google Gemini AI**: AI integration
- **express-rate-limit**: Rate limiting middleware

### Frontend
- **React 18**: UI library
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Recharts**: Data visualization
- **Axios**: HTTP client
- **React Router**: Navigation

## 📁 Project Structure

```
ai-interview-simulator/
├── server/                    # Backend
│   ├── models/               # MongoDB schemas
│   │   ├── User.js
│   │   └── InterviewSession.js
│   ├── controllers/          # Business logic
│   │   ├── authController.js
│   │   └── interviewController.js
│   ├── routes/              # API endpoints
│   │   ├── authRoutes.js
│   │   └── interviewRoutes.js
│   ├── services/            # External services
│   │   └── aiService.js
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── index.js            # Entry point
│   ├── package.json
│   └── .env.example
│
└── client/                   # Frontend
    ├── src/
    │   ├── pages/           # Page components
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── InterviewSession.jsx
    │   │   ├── SessionHistory.jsx
    │   │   └── SessionDetail.jsx
    │   ├── components/      # Reusable components
    │   │   └── ProtectedRoute.jsx
    │   ├── services/        # API clients
    │   │   ├── authService.js
    │   │   └── interviewService.js
    │   ├── hooks/          # Custom hooks
    │   │   ├── useAuth.js
    │   │   └── useAsync.js
    │   ├── context/        # React context
    │   │   └── AuthContext.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── public/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── .env.example
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB (local or Atlas)
- OpenAI API key
- npm or yarn

### Backend Setup

1. **Clone and navigate to server directory**
```bash
cd server
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file** (copy from `.env.example`)
```bash
cp .env.example .env
```

4. **Update `.env` with your credentials**
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/ai-interview-simulator

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Server
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

5. **Start MongoDB** (if running locally)
```bash
mongod
```

6. **Start the server**
```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**
```bash
cd client
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file** (copy from `.env.example`)
```bash
cp .env.example .env
```

4. **Update `.env` if needed**
```env
VITE_API_URL=http://localhost:5000/api
```

5. **Start development server**
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## 🔐 API Routes

### Authentication Endpoints
```
POST   /api/auth/register         - Register new user
POST   /api/auth/login            - Login user
GET    /api/auth/profile          - Get current user profile (Protected)
```

### Interview Endpoints
```
POST   /api/interview/start           - Start new interview session (Protected)
POST   /api/interview/answer          - Submit answer (Protected)
GET    /api/interview/history         - Get interview history (Protected)
GET    /api/interview/analytics/perf  - Get performance analytics (Protected)
GET    /api/interview/:id             - Get session details (Protected)
```

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

### InterviewSession Model
```javascript
{
  userId: ObjectId (ref: User),
  role: String ('Frontend' | 'Backend' | 'DSA' | 'HR'),
  difficulty: String ('Easy' | 'Medium' | 'Hard'),
  status: String ('in-progress' | 'completed'),
  questions: [{
    questionText: String,
    topic: String,
    userAnswer: String,
    aiFeedback: String,
    score: Number (0-100),
    clarity: Number (0-100),
    technicalAccuracy: Number (0-100),
    confidence: Number (0-100)
  }],
  totalScore: Number,
  averageClarity: Number,
  averageTechnicalAccuracy: Number,
  averageConfidence: Number,
  createdAt: Date,
  completedAt: Date
}
```

## 🤖 AI Integration

The application uses OpenAI API for:

1. **Question Generation**: CReates role-specific, difficulty-appropriate questions
2. **Answer Evaluation**: Analyzes user responses and provides scores
3. **Feedback Generation**: Creates actionable improvement suggestions
4. **Follow-up Questions**: Generates adaptive questions based on performance

### AI Service Methods

```javascript
// Generate interview questions using Gemini
aiService.generateQuestions(role, difficulty, resumeText?)

// Evaluate answer using Gemini
aiService.evaluateAnswer(question, userAnswer, role)

// Generate follow-up question using Gemini
aiService.generateFollowUp(previousQuestions, role, difficulty)

// Extract resume text
aiService.extractResumeText(resumeBuffer)
```

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **TailwindCSS**: Modern utility-first styling
- **Charts & Analytics**: Recharts for performance visualization
- **Real-time Feedback**: Immediate evaluation of answers
- **Progress Tracking**: Visual progress bars and statistics
- **Error Handling**: User-friendly error messages

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs with 10-round salt
- **Rate Limiting**: Prevent brute force attacks
- **CORS**: Configured for origin validation
- **Input Validation**: Server-side validation on all inputs
- **Error Handlers**: Comprehensive error handling

## 📈 Performance Metrics Tracked

1. **Overall Score**: 0-100 based on combined metrics
2. **Clarity**: How well the answer was communicated
3. **Technical Accuracy**: Correctness of technical knowledge
4. **Confidence**: Assessed from response quality
5. **Topic Performance**: Individual scores per topic

## 🚀 Deployment

### Backend (Heroku)
```bash
cd server
heroku create your-app-name
heroku config:set JWT_SECRET=your_secret
heroku config:set OPENAI_API_KEY=your_key
heroku config:set MONGODB_URI=your_mongodb_uri
git push heroku main
```

### Frontend (Vercel)
```bash
cd client
npm run build
vercel deploy
```

## 📝 Usage Examples

### Register and Login
1. Navigate to `/register`
2. Enter email, password, and confirm password
3. Click "Register"
4. After registration, you'll be redirected to dashboard

### Start an Interview
1. Go to Dashboard
2. Select a role (Frontend, Backend, DSA, HR)
3. Choose difficulty (Easy, Medium, Hard)
4. Click "Start Interview"
5. Answer questions and get instant AI feedback

### View Analytics
1. Click "View History & Analytics"
2. See all past sessions
3. View performance charts
4. Identify weak areas for improvement

## 🎯 Best Practices

### Code Quality
- ✅ Modular architecture
- ✅ Clean separation of concerns
- ✅ Comprehensive error handling
- ✅ Input validation on server and client
- ✅ Responsive design patterns
- ✅ Accessible UI components

### Performance
- ✅ Lazy loading components
- ✅ Optimized database queries
- ✅ Rate limiting for API protection
- ✅ Environment-based configuration

### Security
- ✅ Secure password hashing
- ✅ JWT token expiration
- ✅ CORS enabled
- ✅ Validation on all inputs
- ✅ Protected routes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙋 Support

For issues, questions, or suggestions, please open an issue in the repository.

---

**Made with ❤️ using MERN Stack**
