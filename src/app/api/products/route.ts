import { NextRequest, NextResponse } from 'next/server'
import { getProducts, searchProducts } from '@/lib/services/productService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    if (query) {
      // Search products
      const products = await searchProducts(query, limit)
      return NextResponse.json({
        success: true,
        data: products,
        query,
      })
    } else {
      // Get all products with pagination
      const result = await getProducts(page, limit)
      return NextResponse.json({
        success: true,
        data: result.products,
        pagination: result.pagination,
      })
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
      },
      { status: 500 }
    )
  }
}