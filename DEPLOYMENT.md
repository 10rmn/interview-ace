# Deployment Guide

## Local Development Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- Google Gemini API Key
- npm or yarn

### Quick Start (All in One Command)
```bash
# From root directory
npm install  # This will install root dependencies only

# In separate terminals
npm run server  # Terminal 1 - Backend on port 5000
npm run client  # Terminal 2 - Frontend on port 5173
```

## Docker Deployment

### Using Docker Compose (Recommended for Development)
```bash
# Make sure Docker is installed and running
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### Manual Docker Build

#### Backend
```bash
cd server
docker build -t ai-interview-backend .
docker run -p 5000:5000 \
  -e MONGODB_URI=mongodb://mongodb:27017/ai-interview \
  -e JWT_SECRET=your_secret \
  -e GEMINI_API_KEY=your_key \
  ai-interview-backend
```

#### Frontend
```bash
cd client
docker build -t ai-interview-frontend .
docker run -p 5173:5173 ai-interview-frontend
```

## Cloud Deployment

### Deploy to Heroku

#### Backend
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add MongoDB Atlas URI
heroku config:set MONGODB_URI=your_mongodb_atlas_uri

# Add environment variables
heroku config:set JWT_SECRET=your_super_secret_key
heroku config:set GEMINI_API_KEY=your_gemini_key
heroku config:set CORS_ORIGIN=https://your-frontend-domain.com

# Deploy
git push heroku main
```

#### Frontend
```bash
# Build
npm run build

# Deploy to Vercel
npm install -g vercel
vercel

# Configure environment variable in Vercel dashboard
VITE_API_URL=https://your-backend-url.herokuapp.com/api
```

### Deploy to AWS

#### EC2 Setup
```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Clone repository
git clone your-repo-url
cd ai-interview-simulator

# Install and start
npm install
cd server && npm install
pm2 start index.js --name "ai-interview-backend"

# View logs
pm2 logs ai-interview-backend
```

#### RDS for MongoDB
- Use MongoDB Atlas instead (easier to manage)

#### S3 for Frontend Static Files
```bash
# Build frontend
npm run build

# Upload to S3
aws s3 sync ./dist s3://your-bucket-name

# CloudFront distribution for CDN
```

### Deploy to Vercel (Easiest for Frontend)

1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select GitHub repository
5. Configure environment variables:
   ```
   VITE_API_URL=https://your-api-url.com/api
   ```
6. Deploy

### Deploy to Railway

1. Install Railway CLI
2. Connect GitHub account
3. Create project
4. Add environment variables
5. Railway auto-deploys on git push

## Environment Configuration for Deployment

### Production Backend .env
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-interview
JWT_SECRET=very_secure_random_key_here_minimum_32_characters
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Production Frontend .env
```env
VITE_API_URL=https://api.yourdomain.com/api
```

## Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Verify database backups are running
- [ ] Setup monitoring (New Relic, Datadog)
- [ ] Configure SSL/TLS certificates
- [ ] Setup domain DNS records
- [ ] Test authentication flow
- [ ] Verify rate limiting works
- [ ] Monitor error logs
- [ ] Setup alerts for failures
- [ ] Performance testing under load
- [ ] Security audit
- [ ] GDPR compliance check
- [ ] Database indexing verified

## Monitoring & Logging

### Backend Logging
```bash
# View logs
pm2 logs ai-interview-backend

# Save logs
pm2 save
```

### Error Tracking
Use services like:
- Sentry (error tracking)
- LogRocket (session replay)
- New Relic (monitoring)

### Database Monitoring
- MongoDB Atlas built-in monitoring
- Check connection pool usage
- Monitor query performance

## Scaling Strategies

### Database Scaling
- Use MongoDB sharding for large datasets
- Index frequently queried fields
- Archive old sessions

### API Scaling
- Load balancing (nginx, HAProxy)
- Horizontal scaling with multiple instances
- Redis caching for frequent queries
- Queue system for heavy operations

### Frontend Optimization
- CDN for static assets
- Code splitting and lazy loading
- Service workers for offline support
- Image optimization

## Backup & Recovery

### MongoDB Backup
```bash
# MongoDB Atlas automatic backups (enabled by default)

# Manual backup
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/db"

# Restore
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net/db" dump/
```

### Database Snapshots
- Daily backups on MongoDB Atlas
- Test restore procedures monthly
- Keep backups for 30 days minimum

## Maintenance

### Regular Tasks
- [ ] Review error logs weekly
- [ ] Monitor API usage and costs
- [ ] Update dependencies monthly
- [ ] Security patches immediately
- [ ] Database optimization quarterly
- [ ] Performance profiling quarterly

### Version Updates
```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Major version updates (test thoroughly)
npm install package@latest
```

## Troubleshooting Deployment

### Port Already in Use
```bash
# Kill process on port
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Issues
- Verify connection string
- Check IP whitelist in MongoDB Atlas
- Verify credentials
- Test with MongoDB Compass

### CORS Errors in Production
- Update CORS_ORIGIN to match frontend domain
- Verify headers in requests
- Check browser console for exact error

### OpenAI API Errors
- Verify API key is valid
- Check API key has credits
- Monitor rate limits
- Check request format

## Security in Production

- [ ] Use HTTPS/SSL certificates
- [ ] Set secure JWT secrets
- [ ] Enable CORS properly
- [ ] Add CSRF protection
- [ ] Implement rate limiting
- [ ] Use environment variables
- [ ] Never commit .env files
- [ ] Add API key rotation policy
- [ ] Enable database encryption
- [ ] Setup Web Application Firewall (WAF)

---

For detailed setup instructions, see [SETUP.md](SETUP.md)
