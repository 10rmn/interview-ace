# AI Interview Simulator - Full Stack Application

## 🎯 Project Overview

This is a complete, production-ready MERN stack application for conducting AI-powered mock interviews. The application leverages OpenAI to generate dynamic questions, evaluate user responses, and provide detailed feedback.

## ✨ Key Features

### 1. **User Authentication**
- Secure registration and login
- JWT token-based authentication
- Password encryption with bcryptjs
- Protected routes and API endpoints

### 2. **Interview Sessions**
- Create custom interview sessions
- Select from 4 roles: Frontend, Backend, DSA, HR
- 3 difficulty levels: Easy, Medium, Hard
- AI-generated relevant questions

### 3. **Smart Evaluation**
- Real-time answer evaluation using Google Gemini AI
- Multi-metric scoring:
  - **Clarity**: How well the answer was communicated
  - **Technical Accuracy**: Correctness of knowledge
  - **Confidence**: Assessed from response quality
- Detailed constructive feedback
- Adaptive question generation based on performance

### 4. **Performance Analytics**
- Interview history with detailed results
- Topic-wise performance breakdown
- Progress tracking with line charts
- Topic distribution with pie charts
- Improvement trends over time

### 5. **Professional UI**
- Responsive design (desktop, tablet, mobile)
- Modern TailwindCSS styling
- Interactive data visualizations (Recharts)
- Real-time feedback display
- Progress indicators

## 🏗️ Architecture

### Backend Architecture
```
API Request → Route Handler → Controller → Service/Model → Database
                                 ↓
                          Middleware Pipeline
                          (Auth, Validation, Error)
```

### Frontend Architecture
```
User Action → React Component → Service Layer → API Call → State Update → Render
                                 ↓
                          Context/Hooks (State Management)
```

## 📦 Key Dependencies

### Backend
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **openai**: AI integration
- **jsonwebtoken**: Authentication
- **bcryptjs**: Password hashing
- **express-rate-limit**: Rate limiting

### Frontend
- **react-router-dom**: Navigation
- **axios**: HTTP client
- **recharts**: Data visualization
- **tailwindcss**: Styling

## 🔄 Data Flow

### Interview Session Flow
1. User selects role and difficulty
2. Backend generates 5-10 questions via OpenAI API
3. Session created in MongoDB
4. User answers each question
5. Each answer evaluated by AI
6. Feedback provided to user
7. Performance metrics calculated and stored
8. User can view detailed analytics

### Authentication Flow
1. User registers with email/password
2. Password hashed with bcryptjs
3. User stored in MongoDB
4. Login generates JWT token
5. Token sent with each API request
6. Middleware verifies token
7. Request continues or rejects

## 💾 Database Models

### User
- name, email, password (hashed)
- role (default: 'user')
- timestamps

### InterviewSession
- userId (reference to User)
- role (Frontend/Backend/DSA/HR)
- difficulty (Easy/Medium/Hard)
- questions array with answers and feedback
- totalScore and metric averages
- status tracking

## 🚀 Getting Started

### Minimal Setup
```bash
# Install root dependencies
npm install

# Setup backend
cd server
npm install
cp .env.example .env
# Edit .env with your credentials

# In another terminal, setup frontend
cd client
npm install
cp .env.example .env

# Start both servers
npm run dev  # from root
```

### Full Setup with All Details
See [SETUP.md](SETUP.md)

## 📚 API Documentation

### Authentication
```
POST   /api/auth/register      → Register user
POST   /api/auth/login         → Login user
GET    /api/auth/profile       → Get profile (Protected)
```

### Interviews
```
POST   /api/interview/start                → Start session
POST   /api/interview/answer               → Submit answer
GET    /api/interview/history              → Get all sessions
GET    /api/interview/analytics/performance → Get analytics
GET    /api/interview/:id                  → Get session details
```

## 🛡️ Security Features

- ✅ JWT-based authentication
- ✅ Password hashing (bcryptjs)
- ✅ Rate limiting on auth endpoints
- ✅ CORS protection
- ✅ Input validation
- ✅ Protected API routes
- ✅ Secure error handling

## 🎨 Frontend Pages

1. **Login/Register** - Authentication
2. **Dashboard** - Start interview sessions
3. **Interview Session** - Interactive Q&A with AI feedback
4. **Session History** - View past sessions
5. **Session Details** - Detailed feedback and metrics
6. **Analytics** - Performance charts and trends

## 🔌 AI Integration Details

### Question Generation
- Context-aware prompts based on role using Gemini AI
- Difficulty-appropriate questions
- Variety of topics per role

### Answer Evaluation
- Multiple metric scoring
- Contextual feedback
- Improvement suggestions
- Strength identification

### Adaptive Learning
- Weak area detection
- Follow-up question generation
- Progressive difficulty

## 📊 Metrics & Analytics

### Performance Metrics
- Overall Score (0-100)
- Clarity Score (0-100)
- Technical Accuracy (0-100)
- Confidence Score (0-100)

### Analytics Views
- Timeline: Score progression over time
- Topic Distribution: Pie chart of topic performance
- Session Statistics: Total sessions, completion rate
- Improvement Tracking: Progress visualization

## 🧪 Testing

### Test a Complete Flow
1. Register at `/register`
2. Login at `/login`
3. Go to Dashboard
4. Select role and difficulty
5. Answer interview questions
6. View feedback
7. Check analytics in history

## 🐛 Debugging

### Enable Debug Logs
Set `NODE_ENV=development` in backend `.env`

### Check API Connectivity
```bash
curl http://localhost:5000/api/health
```

### Monitor Requests
Check browser DevTools Network tab for API calls

## 📈 Performance Optimization

- ✅ Lazy loading components
- ✅ Optimized database queries
- ✅ Efficient state management
- ✅ Rate limiting to prevent abuse
- ✅ Caching strategies

## 🔐 Best Practices Implemented

### Code Quality
- Clean architecture (MVC pattern)
- Modular components
- Reusable hooks
- Separation of concerns
- Comprehensive comments

### Performance
- Efficient API calls
- Optimized rendering
- Lazy loading
- Rate limiting

### Security
- Never expose secrets
- Input validation everywhere
- SQL injection prevention (Mongoose)
- XSS protection (React)
- CSRF token (optional upgrade)

## 📋 Checklist Before Production

- [ ] Update JWT_SECRET in .env
- [ ] Configure CORS_ORIGIN for domain
- [ ] Add HTTPS/SSL
- [ ] Setup MongoDB backup
- [ ] Configure email verification
- [ ] Add logging service
- [ ] Setup monitoring
- [ ] Database indexing
- [ ] Load testing
- [ ] Security audit

## 🚢 Deployment

### Backend (Node.js)
**Heroku, Railway, Render, or AWS**
```bash
Set environment variables
Deploy from git
Configure MongoDB Atlas connection
```

### Frontend (React)
**Vercel, Netlify, or AWS S3**
```bash
npm run build
Deploy dist folder
Configure API_URL for production
```

## 📞 Support & Issues

For bugs or features, open an issue in the repository.

## 📄 License

MIT License - Feel free to use this project!

---

**Built with ❤️ using React, Node.js, MongoDB, and OpenAI**
