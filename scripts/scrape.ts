#!/usr/bin/env tsx

import { scrapeTikiProducts } from '../src/lib/scrapers/tiki'
import { saveScrapedProducts } from '../src/lib/services/productService'

interface ScrapingOptions {
  query?: string
  url?: string
  maxPages?: number
  headless?: boolean
  shopDomain?: string
}

async function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    printUsage()
    process.exit(1)
  }

  const options: ScrapingOptions = {}
  
  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    
    switch (arg) {
      case '--query':
      case '-q':
        options.query = args[++i]
        break
      case '--url':
      case '-u':
        options.url = args[++i]
        break
      case '--max-pages':
      case '-p':
        options.maxPages = parseInt(args[++i], 10)
        break
      case '--shop':
      case '-s':
        options.shopDomain = args[++i]
        break
      case '--headless':
        options.headless = args[++i]?.toLowerCase() !== 'false'
        break
      case '--help':
      case '-h':
        printUsage()
        process.exit(0)
        break
      default:
        if (!options.query && !arg.startsWith('-')) {
          options.query = arg
        }
        break
    }
  }

  // Validate options
  if (!options.query && !options.url) {
    console.error('❌ Error: Either --query or --url must be provided')
    printUsage()
    process.exit(1)
  }

  // Set defaults
  options.maxPages = options.maxPages || 2
  options.headless = options.headless !== false
  options.shopDomain = options.shopDomain || 'tiki.vn'

  console.log('🚀 Starting scraping process...')
  console.log(`📊 Configuration:`)
  console.log(`   Query: ${options.query || 'N/A'}`)
  console.log(`   URL: ${options.url || 'N/A'}`)
  console.log(`   Max Pages: ${options.maxPages}`)
  console.log(`   Shop Domain: ${options.shopDomain}`)
  console.log(`   Headless: ${options.headless}`)
  console.log('')

  try {
    let scrapedProducts = []

    if (options.shopDomain === 'tiki.vn') {
      if (options.query) {
        console.log(`🔍 Scraping Tiki products for query: "${options.query}"`)
        scrapedProducts = await scrapeTikiProducts(options.query, {
          maxPages: options.maxPages,
          headless: options.headless,
        })
      } else {
        console.error('❌ URL scraping not yet implemented for Tiki')
        process.exit(1)
      }
    } else {
      console.error(`❌ Shop domain "${options.shopDomain}" not supported yet`)
      process.exit(1)
    }

    console.log(`✅ Scraped ${scrapedProducts.length} products`)

    if (scrapedProducts.length === 0) {
      console.log('ℹ️  No products found. Exiting.')
      process.exit(0)
    }

    // Save to database
    console.log('💾 Saving products to database...')
    const saveResult = await saveScrapedProducts(scrapedProducts, options.shopDomain)

    console.log('')
    console.log('📈 Results Summary:')
    console.log(`   Products scraped: ${scrapedProducts.length}`)
    console.log(`   Products saved: ${saveResult.savedProducts}`)
    console.log(`   Offers saved: ${saveResult.savedOffers}`)
    
    if (saveResult.errors.length > 0) {
      console.log(`   Errors: ${saveResult.errors.length}`)
      console.log('')
      console.log('❌ Errors encountered:')
      saveResult.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`)
      })
    }

    console.log('')
    console.log('✅ Scraping completed successfully!')

  } catch (error) {
    console.error('❌ Scraping failed:', error)
    process.exit(1)
  }
}

function printUsage() {
  console.log(`
🕷️  VN Price Compare - Product Scraper

Usage:
  npm run scrape [options] [query]
  tsx scripts/scrape.ts [options] [query]

Options:
  -q, --query <query>      Search query (e.g., "iPhone 13 Pro")
  -u, --url <url>          Direct search results URL to scrape
  -p, --max-pages <num>    Maximum pages to scrape (default: 2)
  -s, --shop <domain>      Shop domain (default: tiki.vn)
  --headless <bool>        Run browser in headless mode (default: true)
  -h, --help               Show this help message

Examples:
  npm run scrape "iPhone 13 Pro"
  npm run scrape --query "Samsung Galaxy S24" --max-pages 3
  npm run scrape -q "MacBook Air" -p 1 --headless false
  tsx scripts/scrape.ts "Xiaomi 14" --shop tiki.vn

Supported Shops:
  - tiki.vn (Tiki Vietnam)
  
Note: Make sure your database is running and properly configured in .env
`)
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️  Scraping interrupted by user')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n⏹️  Scraping terminated')
  process.exit(0)
})

// Run the script
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })
}