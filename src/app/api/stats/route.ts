import { NextResponse } from 'next/server'
import { getStats } from '@/lib/services/productService'

export async function GET() {
  try {
    const stats = await getStats()

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch statistics',
      },
      { status: 500 }
    )
  }
}