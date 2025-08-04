// Vietnamese brand mappings and patterns
const BRAND_PATTERNS = {
  'Apple': ['apple', 'iphone', 'ipad', 'macbook', 'airpods', 'imac'],
  'Samsung': ['samsung', 'galaxy'],
  'Xiaomi': ['xiaomi', 'redmi', 'poco', 'mi '],
  'Oppo': ['oppo', 'reno', 'find'],
  'Vivo': ['vivo', 'y series', 'v series'],
  'Huawei': ['huawei', 'mate', 'p series'],
  'OnePlus': ['oneplus', 'nord'],
  'Realme': ['realme'],
  'Nokia': ['nokia'],
  'LG': ['lg'],
  'Sony': ['sony', 'xperia'],
  'Google': ['google', 'pixel'],
}

const STORAGE_PATTERNS = [
  /(\d+)\s*(gb|GB|tb|TB)/g,
  /(\d+)\s*(gb|GB|tb|TB)\s*(ssd|SSD|hdd|HDD)?/g,
]

const OFFICIAL_KEYWORDS = [
  'chính hãng',
  'chinh hang',
  'official',
  'hàng chính hãng',
  'hang chinh hang',
  'authorized',
  'bảo hành chính hãng',
  'bao hanh chinh hang',
]

export interface NormalizedProduct {
  name: string
  brand: string | null
  model: string | null
  storage: string | null
  isOfficial: boolean
}

export function normalizeBrand(title: string): string | null {
  const lowerTitle = title.toLowerCase()
  
  for (const [brand, patterns] of Object.entries(BRAND_PATTERNS)) {
    for (const pattern of patterns) {
      if (lowerTitle.includes(pattern.toLowerCase())) {
        return brand
      }
    }
  }
  
  return null
}

export function extractStorage(title: string): string | null {
  for (const pattern of STORAGE_PATTERNS) {
    const matches = Array.from(title.matchAll(pattern))
    if (matches.length > 0) {
      // Return the first storage match found
      const match = matches[0]
      return `${match[1]}${match[2].toUpperCase()}`
    }
  }
  
  return null
}

export function extractModel(title: string, brand: string | null): string | null {
  if (!brand) return null
  
  const lowerTitle = title.toLowerCase()
  const lowerBrand = brand.toLowerCase()
  
  // iPhone specific patterns
  if (lowerBrand === 'apple' && lowerTitle.includes('iphone')) {
    const iphoneMatch = lowerTitle.match(/iphone\s*(\d+\s*(pro|plus|mini|max)?(\s*max)?)/i)
    if (iphoneMatch) {
      return `iPhone ${iphoneMatch[1].trim()}`
    }
  }
  
  // Samsung Galaxy patterns
  if (lowerBrand === 'samsung' && lowerTitle.includes('galaxy')) {
    const galaxyMatch = lowerTitle.match(/galaxy\s*([a-z]\d+|note\s*\d+|s\d+)/i)
    if (galaxyMatch) {
      return `Galaxy ${galaxyMatch[1].trim()}`
    }
  }
  
  // Xiaomi patterns
  if (lowerBrand === 'xiaomi') {
    const xiaomiMatch = lowerTitle.match(/(redmi|poco|mi)\s*([a-z0-9\s]+)/i)
    if (xiaomiMatch) {
      return `${xiaomiMatch[1]} ${xiaomiMatch[2].trim()}`
    }
  }
  
  // Generic model extraction - look for numbers after brand
  const brandIndex = lowerTitle.indexOf(lowerBrand)
  if (brandIndex !== -1) {
    const afterBrand = title.substring(brandIndex + brand.length).trim()
    const modelMatch = afterBrand.match(/^[\w\s\-]+/i)
    if (modelMatch) {
      return modelMatch[0].trim().substring(0, 50) // Limit length
    }
  }
  
  return null
}

export function isOfficialProduct(title: string): boolean {
  const lowerTitle = title.toLowerCase()
  return OFFICIAL_KEYWORDS.some(keyword => lowerTitle.includes(keyword))
}

export function generateNormalizedName(brand: string | null, model: string | null, storage: string | null): string {
  const parts = [brand, model, storage].filter(Boolean)
  return parts.join(' ') || 'Unknown Product'
}

export function normalizeProductTitle(rawTitle: string): NormalizedProduct {
  const brand = normalizeBrand(rawTitle)
  const model = extractModel(rawTitle, brand)
  const storage = extractStorage(rawTitle)
  const isOfficial = isOfficialProduct(rawTitle)
  const name = generateNormalizedName(brand, model, storage)
  
  return {
    name,
    brand,
    model,
    storage,
    isOfficial,
  }
}

// Helper function to clean price strings (remove currency, commas, etc.)
export function normalizePrice(priceText: string): number {
  // Remove Vietnamese currency symbols and formatting
  const cleaned = priceText
    .replace(/[₫đ]/g, '')
    .replace(/[.,]/g, '')
    .replace(/\s+/g, '')
    .trim()
  
  const price = parseInt(cleaned, 10)
  return isNaN(price) ? 0 : price
}

// Helper function to clean and validate URLs
export function normalizeUrl(url: string, baseUrl?: string): string {
  try {
    if (url.startsWith('http')) {
      return url
    }
    if (url.startsWith('//')) {
      return `https:${url}`
    }
    if (url.startsWith('/') && baseUrl) {
      const base = new URL(baseUrl)
      return `${base.protocol}//${base.host}${url}`
    }
    return url
  } catch {
    return url
  }
}