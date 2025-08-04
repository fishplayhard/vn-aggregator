# VN Price Compare 🇻🇳

A Vietnamese price comparison platform MVP - clone of Heureka.cz for the Vietnamese market. Compare prices across major e-commerce platforms like Tiki, Shopee, and Lazada.

## 🚀 Features

### Phase 1 (Current)
- **Web Scraping**: Automated scraping of product data from Tiki.vn using Playwright
- **Product Normalization**: Intelligent parsing of Vietnamese product titles to extract:
  - Brand (Apple, Samsung, Xiaomi, etc.)
  - Model (iPhone 13 Pro, Galaxy S24, etc.)
  - Storage capacity (128GB, 256GB, etc.)
  - Official status ("Chính Hãng" detection)
- **Price Comparison**: Clean interface to compare prices across multiple shops
- **Search Functionality**: Fast search with Vietnamese language support
- **Modern UI**: Responsive design inspired by Heureka.cz

### Planned Features
- Support for Shopee, Lazada, and other Vietnamese e-commerce sites
- Price history tracking
- Price alerts and notifications
- Mobile app
- Advanced filtering and sorting

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Scraping**: Playwright (headless browser automation)
- **Language**: TypeScript
- **Deployment**: Vercel/Docker ready

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Git

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

### 4. Environment Setup
Copy the environment template:
\`\`\`bash
cp .env.example .env
\`\`\`

Edit \`.env\` with your configuration:
\`\`\`env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/vn_price_compare?schema=public"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Scraping
USER_AGENT="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
\`\`\`

### 5. Database Setup
\`\`\`bash
# Generate Prisma client
npm run db:generate

# Create and run migrations
npm run db:migrate

# (Optional) Open Prisma Studio to view data
npm run db:studio
\`\`\`

### 6. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🕷️ Scraping Usage

### CLI Scraping
The project includes a powerful CLI tool for scraping products:

\`\`\`bash
# Basic usage
npm run scrape "iPhone 13 Pro"

# Advanced options
npm run scrape --query "Samsung Galaxy S24" --max-pages 3 --headless false

# Get help
npm run scrape --help
\`\`\`

### API Scraping
You can also trigger scraping via API:

\`\`\`bash
curl -X POST http://localhost:3000/api/scrape \\
  -H "Content-Type: application/json" \\
  -d '{"query": "iPhone 13 Pro", "maxPages": 2}'
\`\`\`

## 📚 API Documentation

### Products API
- \`GET /api/products\` - Get all products (with pagination)
- \`GET /api/products?q=query\` - Search products
- \`GET /api/products/[id]\` - Get specific product with offers

### Scraping API
- \`POST /api/scrape\` - Trigger scraping for a query

### Stats API
- \`GET /api/stats\` - Get platform statistics

## 🏗️ Project Structure

\`\`\`
vn-price-compare/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   ├── search/            # Search page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── Header.tsx
│   │   ├── ProductCard.tsx
│   │   └── SearchForm.tsx
│   └── lib/                   # Core libraries
│       ├── scrapers/          # Scraping modules
│       │   └── tiki.ts        # Tiki.vn scraper
│       ├── services/          # Business logic
│       │   └── productService.ts
│       ├── db.ts              # Database connection
│       └── normalize.ts       # Text normalization
├── scripts/
│   └── scrape.ts              # CLI scraping tool
├── prisma/
│   └── schema.prisma          # Database schema
├── .env.example               # Environment template
└── README.md
\`\`\`

## 🗄️ Database Schema

### Products
- Normalized product information (name, brand, model, storage)
- Original raw title from scraping
- Official status detection
- Product images

### Shops
- E-commerce platform information
- Domain and display names

### Offers
- Price information per shop
- Product URLs
- Last update timestamps

## 🔧 Development

### Available Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run scrape       # Run scraping CLI
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
\`\`\`

### Adding New Scrapers

1. Create a new scraper in \`src/lib/scrapers/\`
2. Implement the \`ScrapedProduct\` interface
3. Add normalization logic for the new platform
4. Update the CLI script to support the new scraper

### Vietnamese Language Support

The platform includes specific support for Vietnamese:
- Product title normalization for Vietnamese brands and terms
- Vietnamese currency formatting (VND)
- Detection of "Chính Hãng" (official products)
- Vietnamese UI text and placeholders

## 🚀 Deployment

### Docker Deployment
\`\`\`bash
# Build Docker image
docker build -t vn-price-compare .

# Run with environment variables
docker run -p 3000:3000 --env-file .env vn-price-compare
\`\`\`

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

### Short Term
- [ ] Add Shopee.vn scraper
- [ ] Add Lazada.vn scraper
- [ ] Implement price history tracking
- [ ] Add product categories

### Medium Term
- [ ] Price alert system
- [ ] Mobile app (React Native)
- [ ] Advanced search filters
- [ ] User accounts and favorites

### Long Term
- [ ] Machine learning for better product matching
- [ ] Real-time price monitoring
- [ ] API for third-party integrations
- [ ] Multi-language support

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/vn-price-compare/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

## 🙏 Acknowledgments

- Inspired by [Heureka.cz](https://www.heureka.cz/) - Czech price comparison platform
- Built for the Vietnamese e-commerce market
- Thanks to all contributors and the open-source community

---

Made with ❤️ for Vietnamese consumers