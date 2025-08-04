import { NextRequest, NextResponse } from 'next/server'
import { scrapeTikiProducts } from '@/lib/scrapers/tiki'
import { saveScrapedProducts } from '@/lib/services/productService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, maxPages = 2, shopDomain = 'tiki.vn' } = body

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: 'Search query is required',
        },
        { status: 400 }
      )
    }

    console.log(`Starting scrape for query: ${query}`)

    // Scrape products
    const scrapedProducts = await scrapeTikiProducts(query, {
      maxPages,
      headless: true,
    })

    if (scrapedProducts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No products found for the given query',
        data: {
          scraped: 0,
          saved: 0,
        },
      })
    }

    // Save to database
    const saveResult = await saveScrapedProducts(scrapedProducts, shopDomain)

    return NextResponse.json({
      success: true,
      message: `Successfully scraped and saved products`,
      data: {
        scraped: scrapedProducts.length,
        savedProducts: saveResult.savedProducts,
        savedOffers: saveResult.savedOffers,
        errors: saveResult.errors,
      },
    })

  } catch (error) {
    console.error('Scraping error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to scrape products',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}