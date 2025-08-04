import { prisma } from '../db'
import { normalizeProductTitle } from '../normalize'
import type { ScrapedProduct } from '../scrapers/tiki'

export interface SaveProductsResult {
  savedProducts: number
  savedOffers: number
  errors: string[]
}

export async function saveScrapedProducts(
  scrapedProducts: ScrapedProduct[],
  shopDomain: string = 'tiki.vn'
): Promise<SaveProductsResult> {
  const result: SaveProductsResult = {
    savedProducts: 0,
    savedOffers: 0,
    errors: [],
  }

  // Ensure shop exists
  const shop = await prisma.shop.upsert({
    where: { domain: shopDomain },
    update: {},
    create: {
      name: getShopNameFromDomain(shopDomain),
      domain: shopDomain,
    },
  })

  for (const scrapedProduct of scrapedProducts) {
    try {
      // Normalize the product title
      const normalized = normalizeProductTitle(scrapedProduct.title)
      
      // Find or create product based on normalized data
      const product = await prisma.product.upsert({
        where: {
          // Use a combination of normalized fields to find similar products
          name: normalized.name,
        },
        update: {
          // Update image if we have a better one
          image: scrapedProduct.imageUrl || undefined,
          updatedAt: new Date(),
        },
        create: {
          name: normalized.name,
          brand: normalized.brand,
          model: normalized.model,
          storage: normalized.storage,
          image: scrapedProduct.imageUrl,
          rawTitle: scrapedProduct.title,
          isOfficial: normalized.isOfficial,
        },
      })

      result.savedProducts++

      // Create or update offer
      await prisma.offer.upsert({
        where: {
          productId_shopId: {
            productId: product.id,
            shopId: shop.id,
          },
        },
        update: {
          price: scrapedProduct.price,
          url: scrapedProduct.productUrl,
          lastCheckedAt: new Date(),
          updatedAt: new Date(),
        },
        create: {
          productId: product.id,
          shopId: shop.id,
          price: scrapedProduct.price,
          url: scrapedProduct.productUrl,
          lastCheckedAt: new Date(),
        },
      })

      result.savedOffers++

    } catch (error) {
      const errorMessage = `Error saving product "${scrapedProduct.title}": ${error}`
      console.error(errorMessage)
      result.errors.push(errorMessage)
    }
  }

  return result
}

function getShopNameFromDomain(domain: string): string {
  const shopNames: Record<string, string> = {
    'tiki.vn': 'Tiki',
    'shopee.vn': 'Shopee',
    'lazada.vn': 'Lazada',
    'sendo.vn': 'Sendo',
    'thegioididong.com': 'Thế Giới Di Động',
    'cellphones.com.vn': 'CellphoneS',
  }

  return shopNames[domain] || domain
}

// Search products in database
export async function searchProducts(query: string, limit: number = 20) {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
        { model: { contains: query, mode: 'insensitive' } },
        { rawTitle: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: {
      offers: {
        include: {
          shop: true,
        },
        orderBy: {
          price: 'asc',
        },
      },
    },
    take: limit,
    orderBy: {
      updatedAt: 'desc',
    },
  })

  return products
}

// Get product by ID with offers
export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      offers: {
        include: {
          shop: true,
        },
        orderBy: {
          price: 'asc',
        },
      },
    },
  })
}

// Get all products with pagination
export async function getProducts(page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      include: {
        offers: {
          include: {
            shop: true,
          },
          orderBy: {
            price: 'asc',
          },
          take: 1, // Only get the cheapest offer for listing
        },
      },
      skip,
      take: limit,
      orderBy: {
        updatedAt: 'desc',
      },
    }),
    prisma.product.count(),
  ])

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

// Get statistics
export async function getStats() {
  const [productCount, offerCount, shopCount] = await Promise.all([
    prisma.product.count(),
    prisma.offer.count(),
    prisma.shop.count(),
  ])

  return {
    products: productCount,
    offers: offerCount,
    shops: shopCount,
  }
}