# Common Code Examples

## Authentication Examples

### Register User
```javascript
// Frontend - src/pages/Register.jsx
const handleRegister = async () => {
  const response = await authService.register(
    name, 
    email, 
    password, 
    confirmPassword
  );
  if (response.success) {
    navigate('/dashboard');
  }
};
```

### Protected API Call
```javascript
// Frontend - src/services/interviewService.js
const response = await axios.post(
  `${API_BASE_URL}/interview/start`,
  { role, difficulty },
  { headers: { Authorization: `Bearer ${token}` } }
);
```

## Backend Examples

### Create Protected Route
```javascript
// server/routes/interviewRoutes.js
router.post('/start', authMiddleware, interviewLimiter, interviewController.startInterview);
```

### Query Database with Mongoose
```javascript
// server/controllers/authController.js
const user = await User.findOne({ email }).select('+password');
const isMatch = await user.matchPassword(password);
```

### Call Gemini API
```javascript
// server/services/aiService.js
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
const result = await model.generateContent(prompt);
const response = await result.response;
const content = response.text();
```

## Frontend Component Examples

### Using Custom Hook
```javascript
// Usage in any component
const { user, login, logout } = useAuth();
const { execute, loading, error, data } = useAsync(asyncFunction);
```

### Protected Route
```javascript
// App.jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### Handling Async Operations
```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

try {
  setLoading(true);
  const response = await interviewService.submitAnswer(...);
  setData(response);
} catch (err) {
  setError(err.message);
} finally {
  setLoading(false);
}
```

## Error Handling Examples

### Backend Error Handler
```javascript
// server/middleware/errorHandler.js
if (err.code === 11000) {
  error.message = `${field} already exists`;
}
if (err.name === 'ValidationError') {
  error.message = Object.values(err.errors).map(v => v.message).join(', ');
}
```

### Frontend Error Display
```javascript
{error && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
    {error}
  </div>
)}
```

## Database Query Examples

### Find User with Password
```javascript
const user = await User.findOne({ email }).select('+password');
```

### Create Interview Session
```javascript
const session = await InterviewSession.create({
  userId,
  role,
  difficulty,
  questions,
  status: 'in-progress'
});
```

### Update Interview with Answer
```javascript
session.questions[index].userAnswer = answer;
session.questions[index].aiFeedback = feedback;
session.questions[index].score = score;
await session.save();
```

## Rate Limiting Examples

### Apply to Routes
```javascript
router.post('/login', authLimiter, authController.login);
router.post('/start', interviewLimiter, interviewController.startInterview);
```

## Recharts Examples

### Line Chart
```javascript
<LineChart data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="score" stroke="#3B82F6" />
</LineChart>
```

### Pie Chart
```javascript
<PieChart>
  <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={150}>
    {data.map((entry, index) => (
      <Cell key={index} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip />
</PieChart>
```

## Environment-Based Configuration

### Backend
```javascript
// Use environment variables
const mongoUri = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;
const corsOrigin = process.env.CORS_ORIGIN;
```

### Frontend
```javascript
// Use Vite environment variables
const apiUrl = import.meta.env.VITE_API_URL;
```

## Common Patterns

### API Service Pattern
```javascript
// services/api.js
const apiCall = async (endpoint, method = 'GET', data = null) => {
  const config = {
    headers: { Authorization: `Bearer ${getToken()}` }
  };
  
  if (method === 'GET') {
    return await axios.get(endpoint, config);
  }
  return await axios[method.toLowerCase()](endpoint, data, config);
};
```

### Custom Hook Pattern
```javascript
const useMyHook = () => {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const action = useCallback(async (params) => {
    setLoading(true);
    try {
      const result = await myService.call(params);
      setState(result);
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { state, loading, action };
};
```

### Context Pattern
```javascript
const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const value = { /* provider value */ };
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

const useMyContext = () => useContext(MyContext);
```

## Testing Endpoints with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"123456","confirmPassword":"123456"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"123456"}'
```

### Start Interview
```bash
curl -X POST http://localhost:5000/api/interview/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"role":"Frontend","difficulty":"Medium"}'
```

### Submit Answer
```bash
curl -X POST http://localhost:5000/api/interview/answer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"sessionId":"SESSION_ID","questionIndex":0,"userAnswer":"My answer text"}'
```

## Debugging Tips

### Enable Request Logging
```javascript
// server/index.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### Debug API Response
```javascript
// Frontend
const response = await interviewService.getHistory();
console.log('API Response:', response);
```

### Check MongoDB Connection
```javascript
// server/index.js
mongoose.events.on('connected', () => console.log('MongoDB connected'));
mongoose.events.on('error', (err) => console.log('MongoDB error:', err));
```

---

Use these examples as templates for extending the application!
