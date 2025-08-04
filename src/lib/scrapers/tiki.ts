import { chromium, Browser, Page } from 'playwright'
import { normalizePrice, normalizeUrl, normalizeProductTitle } from '../normalize'

export interface ScrapedProduct {
  title: string
  price: number
  imageUrl: string
  productUrl: string
  shopName: string
}

export interface TikiScraperOptions {
  headless?: boolean
  timeout?: number
  maxPages?: number
  delay?: number
}

export class TikiScraper {
  private browser: Browser | null = null
  private options: Required<TikiScraperOptions>

  constructor(options: TikiScraperOptions = {}) {
    this.options = {
      headless: options.headless ?? true,
      timeout: options.timeout ?? 30000,
      maxPages: options.maxPages ?? 5,
      delay: options.delay ?? 1000,
    }
  }

  async init(): Promise<void> {
    this.browser = await chromium.launch({
      headless: this.options.headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
      ],
    })
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }

  async scrapeSearchResults(searchUrl: string): Promise<ScrapedProduct[]> {
    if (!this.browser) {
      throw new Error('Browser not initialized. Call init() first.')
    }

    const page = await this.browser.newPage()
    
    try {
      // Set user agent to avoid detection
      await page.setExtraHTTPHeaders({
        'User-Agent': process.env.USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      })
      
      console.log(`Navigating to: ${searchUrl}`)
      await page.goto(searchUrl, { waitUntil: 'networkidle' })
      await page.waitForTimeout(this.options.delay)

      const products: ScrapedProduct[] = []
      let currentPage = 1

      while (currentPage <= this.options.maxPages) {
        console.log(`Scraping page ${currentPage}...`)
        
        // Extract product links from current page
        const productLinks = await this.extractProductLinks(page)
        console.log(`Found ${productLinks.length} products on page ${currentPage}`)

        // Scrape each product
        for (const productUrl of productLinks) {
          try {
            const product = await this.scrapeProductPage(productUrl)
            if (product) {
              products.push(product)
            }
          } catch (error) {
            console.error(`Error scraping product ${productUrl}:`, error)
          }
          
          // Small delay between products
          await page.waitForTimeout(500)
        }

        // Try to go to next page
        const hasNextPage = await this.goToNextPage(page)
        if (!hasNextPage) {
          console.log('No more pages available')
          break
        }
        
        currentPage++
        await page.waitForTimeout(this.options.delay)
      }

      return products

    } finally {
      await page.close()
    }
  }

  private async extractProductLinks(page: Page): Promise<string[]> {
    return await page.evaluate(() => {
      // Tiki product link selectors
      const selectors = [
        'a[data-view-id="pdp_main_image"]',
        'a[href*="/p/"]',
        '.product-item a',
        '[data-view-content="product"] a',
      ]

      const links: string[] = []
      
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector)
        elements.forEach((element) => {
          const href = element.getAttribute('href')
          if (href && href.includes('/p/')) {
            const fullUrl = href.startsWith('http') ? href : `https://tiki.vn${href}`
            if (!links.includes(fullUrl)) {
              links.push(fullUrl)
            }
          }
        })
      }

      return links
    })
  }

  private async scrapeProductPage(productUrl: string): Promise<ScrapedProduct | null> {
    if (!this.browser) return null

    const page = await this.browser.newPage()
    
    try {
      await page.setExtraHTTPHeaders({
        'User-Agent': process.env.USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      })
      
      console.log(`Scraping product: ${productUrl}`)
      await page.goto(productUrl, { waitUntil: 'networkidle', timeout: this.options.timeout })
      await page.waitForTimeout(1000)

      const productData = await page.evaluate(() => {
        // Extract title (H1)
        const titleSelectors = [
          'h1[data-view-id="pdp_details_view_name"]',
          'h1.title',
          '.header h1',
          'h1',
        ]
        
        let title = ''
        for (const selector of titleSelectors) {
          const element = document.querySelector(selector)
          if (element?.textContent?.trim()) {
            title = element.textContent.trim()
            break
          }
        }

        // Extract price
        const priceSelectors = [
          '.product-price__current-price',
          '[data-view-id="pdp_details_view_price"] .price-discount__price',
          '.price-discount__price',
          '.current-price',
          '[class*="price"]',
        ]
        
        let priceText = ''
        for (const selector of priceSelectors) {
          const element = document.querySelector(selector)
          if (element?.textContent?.trim()) {
            priceText = element.textContent.trim()
            break
          }
        }

        // Extract image URL
        const imageSelectors = [
          '.product-image img',
          '[data-view-id="pdp_main_image"] img',
          '.main-image img',
          '.product-images img',
        ]
        
        let imageUrl = ''
        for (const selector of imageSelectors) {
          const element = document.querySelector(selector) as HTMLImageElement
          if (element?.src) {
            imageUrl = element.src
            break
          }
        }

        // Extract shop/seller name
        const shopSelectors = [
          '[data-view-id="pdp_details_view_merchant"] a',
          '.seller-name',
          '.shop-name',
          '[class*="seller"] a',
          '[class*="store"] a',
        ]
        
        let shopName = 'Tiki'
        for (const selector of shopSelectors) {
          const element = document.querySelector(selector)
          if (element?.textContent?.trim()) {
            shopName = element.textContent.trim()
            break
          }
        }

        return {
          title,
          priceText,
          imageUrl,
          shopName,
        }
      })

      if (!productData.title) {
        console.log(`No title found for ${productUrl}`)
        return null
      }

      const price = normalizePrice(productData.priceText)
      if (price === 0) {
        console.log(`No valid price found for ${productUrl}`)
        return null
      }

      return {
        title: productData.title,
        price,
        imageUrl: normalizeUrl(productData.imageUrl, productUrl),
        productUrl,
        shopName: productData.shopName,
      }

    } catch (error) {
      console.error(`Error scraping product page ${productUrl}:`, error)
      return null
    } finally {
      await page.close()
    }
  }

  private async goToNextPage(page: Page): Promise<boolean> {
    try {
      // Look for next page button
      const nextButtonSelectors = [
        'a[aria-label="Next page"]',
        '.next-page',
        '.pagination-next',
        '[class*="next"]',
        'a:has-text("Tiếp")',
        'a:has-text(">")',
      ]

      for (const selector of nextButtonSelectors) {
        const nextButton = await page.$(selector)
        if (nextButton) {
          const isDisabled = await nextButton.evaluate((el) => {
            return el.hasAttribute('disabled') || 
                   el.classList.contains('disabled') ||
                   el.getAttribute('aria-disabled') === 'true'
          })
          
          if (!isDisabled) {
            await nextButton.click()
            await page.waitForLoadState('networkidle')
            return true
          }
        }
      }

      return false
    } catch (error) {
      console.error('Error navigating to next page:', error)
      return false
    }
  }
}

// Utility function to build Tiki search URL
export function buildTikiSearchUrl(query: string, page: number = 1): string {
  const encodedQuery = encodeURIComponent(query)
  return `https://tiki.vn/search?q=${encodedQuery}&page=${page}`
}

// Main scraping function
export async function scrapeTikiProducts(searchQuery: string, options?: TikiScraperOptions): Promise<ScrapedProduct[]> {
  const scraper = new TikiScraper(options)
  
  try {
    await scraper.init()
    const searchUrl = buildTikiSearchUrl(searchQuery)
    const products = await scraper.scrapeSearchResults(searchUrl)
    
    console.log(`Successfully scraped ${products.length} products from Tiki`)
    return products
    
  } finally {
    await scraper.close()
  }
}