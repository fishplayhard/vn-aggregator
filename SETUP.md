# 🚀 Setup Instructions for VN Price Compare

This guide will help you set up the Vietnamese price comparison platform locally.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **PostgreSQL 12+** - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/downloads)

## 🛠️ Local Development Setup

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/your-username/vn-price-compare.git
cd vn-price-compare
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Install Playwright Browsers

\`\`\`bash
npx playwright install chromium
\`\`\`

### 4. Database Setup

#### Option A: Local PostgreSQL

1. Create a new database:
\`\`\`sql
CREATE DATABASE vn_price_compare;
CREATE USER vnprice WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE vn_price_compare TO vnprice;
\`\`\`

2. Update your \`.env\` file:
\`\`\`env
DATABASE_URL="postgresql://vnprice:your_password@localhost:5432/vn_price_compare?schema=public"
\`\`\`

#### Option B: Docker PostgreSQL

\`\`\`bash
docker run --name vn-price-postgres \\
  -e POSTGRES_DB=vn_price_compare \\
  -e POSTGRES_USER=vnprice \\
  -e POSTGRES_PASSWORD=password123 \\
  -p 5432:5432 \\
  -d postgres:15-alpine
\`\`\`

### 5. Environment Configuration

Copy the environment template:
\`\`\`bash
cp .env.example .env
\`\`\`

Edit \`.env\` with your settings:
\`\`\`env
# Database
DATABASE_URL="postgresql://vnprice:password123@localhost:5432/vn_price_compare?schema=public"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"

# Scraping
USER_AGENT="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
\`\`\`

### 6. Database Migration

\`\`\`bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate
\`\`\`

### 7. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

The application will be available at [http://localhost:3000](http://localhost:3000)

## 🧪 Testing the Setup

### 1. Test the Web Interface

1. Open [http://localhost:3000](http://localhost:3000)
2. You should see the homepage with search functionality
3. Try searching for "iPhone" (will show empty results initially)

### 2. Test the Scraper

\`\`\`bash
# Scrape some iPhone products from Tiki
npm run scrape "iPhone 13"

# Check the results
npm run db:studio
\`\`\`

### 3. Test the API

\`\`\`bash
# Get stats
curl http://localhost:3000/api/stats

# Search products (after scraping)
curl "http://localhost:3000/api/products?q=iPhone"

# Trigger scraping via API
curl -X POST http://localhost:3000/api/scrape \\
  -H "Content-Type: application/json" \\
  -d '{"query": "Samsung Galaxy", "maxPages": 1}'
\`\`\`

## 🐳 Docker Setup (Alternative)

If you prefer using Docker:

### 1. Using Docker Compose (Recommended)

\`\`\`bash
# Start all services (app + database)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
\`\`\`

### 2. Manual Docker Build

\`\`\`bash
# Build the image
docker build -t vn-price-compare .

# Run with external database
docker run -p 3000:3000 \\
  -e DATABASE_URL="your_database_url" \\
  vn-price-compare
\`\`\`

## 🔧 Development Tools

### Prisma Studio (Database GUI)
\`\`\`bash
npm run db:studio
\`\`\`
Access at [http://localhost:5555](http://localhost:5555)

### ESLint (Code Quality)
\`\`\`bash
npm run lint
\`\`\`

### TypeScript Check
\`\`\`bash
npx tsc --noEmit
\`\`\`

## 📊 Sample Data

To get started quickly, scrape some sample products:

\`\`\`bash
# Popular Vietnamese products
npm run scrape "iPhone 15"
npm run scrape "Samsung Galaxy S24"
npm run scrape "Xiaomi 14"
npm run scrape "MacBook Air"
npm run scrape "AirPods Pro"
\`\`\`

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Error
- Ensure PostgreSQL is running
- Check your DATABASE_URL in .env
- Verify database credentials

#### 2. Playwright Browser Issues
\`\`\`bash
# Reinstall browsers
npx playwright install --with-deps chromium
\`\`\`

#### 3. Port Already in Use
\`\`\`bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
\`\`\`

#### 4. Scraping Blocked
- The scraper might be detected by anti-bot measures
- Try running with \`--headless false\` to see what's happening
- Consider adding delays between requests

### Performance Tips

1. **Database Indexing**: The schema includes indexes for common queries
2. **Scraping Rate Limiting**: Adjust delays in scraper options
3. **Image Optimization**: Images are served via Next.js Image component
4. **Caching**: Consider adding Redis for API response caching

## 🔐 Security Notes

- Change default passwords in production
- Use environment variables for all secrets
- Enable HTTPS in production
- Consider rate limiting for API endpoints
- Validate all user inputs

## 📝 Next Steps

After setup is complete:

1. **Add More Scrapers**: Implement Shopee, Lazada scrapers
2. **Improve UI**: Enhance the frontend design
3. **Add Features**: Price history, alerts, user accounts
4. **Deploy**: Set up production deployment
5. **Monitor**: Add logging and monitoring

## 🆘 Getting Help

If you encounter issues:

1. Check this troubleshooting guide
2. Review the main [README.md](README.md)
3. Search existing [GitHub Issues](https://github.com/your-username/vn-price-compare/issues)
4. Create a new issue with detailed information

---

Happy coding! 🚀