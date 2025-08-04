# 🚀 Deployment Guide for VN Price Compare

## ✅ Build Status

The project has been successfully built and is ready for deployment! 

## 📋 Quick Start Commands

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install chromium

# 3. Set up environment
cp .env.example .env
# Edit .env with your database credentials

# 4. Set up database
npm run db:generate
npm run db:migrate

# 5. Start development server
npm run dev
```

### Test Scraping
```bash
# Scrape some sample products
npm run scrape "iPhone 15"
npm run scrape "Samsung Galaxy S24"
npm run scrape "MacBook Air"
```

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)
```bash
# Start all services (app + PostgreSQL + Redis)
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Manual Docker Build
```bash
# Build the image
docker build -t vn-price-compare .

# Run with external database
docker run -p 3000:3000 \
  -e DATABASE_URL="your_database_url" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  -e NEXTAUTH_SECRET="your-secret-key" \
  vn-price-compare
```

## ☁️ Cloud Deployment Options

### 1. Vercel (Recommended for Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# - DATABASE_URL
# - NEXTAUTH_SECRET
# - USER_AGENT
```

### 2. Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### 3. DigitalOcean App Platform
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### 4. AWS/GCP/Azure
Use the provided Dockerfile for container deployment on any cloud platform.

## 🗄️ Database Setup

### Production Database Options

#### 1. Supabase (PostgreSQL)
```bash
# Create project at supabase.com
# Get connection string and add to .env
DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres"
```

#### 2. PlanetScale (MySQL)
```bash
# Note: You'll need to modify Prisma schema for MySQL
DATABASE_URL="mysql://username:password@host:3306/database"
```

#### 3. Railway PostgreSQL
```bash
# Add PostgreSQL plugin in Railway dashboard
# Use provided DATABASE_URL
```

## 🔧 Environment Variables

### Required Variables
```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"

# Next.js
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="random-secret-key-32-chars-min"

# Scraping
USER_AGENT="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
```

### Optional Variables
```env
# Redis (for caching)
REDIS_URL="redis://localhost:6379"

# Monitoring
SENTRY_DSN="your-sentry-dsn"

# Analytics
GOOGLE_ANALYTICS_ID="GA-XXXXXXXXX"
```

## 📊 Performance Optimization

### 1. Database Indexing
The schema includes optimized indexes for:
- Product name searches
- Price comparisons
- Shop lookups

### 2. Caching Strategy
```bash
# Add Redis for API response caching
npm install ioredis
```

### 3. Image Optimization
Images are automatically optimized using Next.js Image component.

### 4. Static Generation
Most pages are statically generated for better performance.

## 🔐 Security Checklist

### Production Security
- [ ] Change default database passwords
- [ ] Use strong NEXTAUTH_SECRET
- [ ] Enable HTTPS
- [ ] Set up CORS properly
- [ ] Add rate limiting
- [ ] Configure CSP headers
- [ ] Enable database SSL

### API Security
```javascript
// Add to next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ]
  },
}
```

## 📈 Monitoring & Analytics

### 1. Error Tracking
```bash
# Add Sentry
npm install @sentry/nextjs
```

### 2. Performance Monitoring
```bash
# Add Vercel Analytics
npm install @vercel/analytics
```

### 3. Database Monitoring
- Use Prisma Pulse for real-time database insights
- Set up database connection pooling
- Monitor query performance

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
```

## 🧪 Testing in Production

### 1. Health Check Endpoints
```bash
# Check API health
curl https://your-domain.com/api/stats

# Test scraping
curl -X POST https://your-domain.com/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"query": "iPhone", "maxPages": 1}'
```

### 2. Load Testing
```bash
# Install Artillery
npm install -g artillery

# Create load test
artillery quick --count 10 --num 5 https://your-domain.com
```

## 🚨 Troubleshooting

### Common Deployment Issues

#### 1. Build Failures
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 2. Database Connection Issues
```bash
# Test connection
npx prisma db pull

# Reset database
npx prisma migrate reset
```

#### 3. Playwright Issues
```bash
# Install system dependencies
npx playwright install-deps chromium
```

### Performance Issues
1. **Slow API responses**: Add database indexes
2. **High memory usage**: Optimize image processing
3. **Scraping timeouts**: Increase timeout values

## 📞 Support

For deployment issues:
1. Check the [SETUP.md](SETUP.md) guide
2. Review environment variables
3. Check database connectivity
4. Verify all dependencies are installed

## 🎯 Post-Deployment Tasks

1. **Set up monitoring** dashboards
2. **Configure backup** strategies
3. **Set up alerts** for errors
4. **Plan scaling** strategies
5. **Document** operational procedures

---

🎉 **Congratulations!** Your Vietnamese price comparison platform is ready for production!