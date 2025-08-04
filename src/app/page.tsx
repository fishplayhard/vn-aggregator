import { Header } from '@/components/Header'
import { ProductCard } from '@/components/ProductCard'
import Link from 'next/link'

async function getRecentProducts() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/products?limit=6`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return []
    }
    
    const data = await response.json()
    return data.success ? data.data : []
  } catch (error) {
    console.error('Error fetching recent products:', error)
    return []
  }
}

async function getStats() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/stats`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return { products: 0, offers: 0, shops: 0 }
    }
    
    const data = await response.json()
    return data.success ? data.data : { products: 0, offers: 0, shops: 0 }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return { products: 0, offers: 0, shops: 0 }
  }
}

export default async function HomePage() {
  const [recentProducts, stats] = await Promise.all([
    getRecentProducts(),
    getStats()
  ])

  return (
    <div>
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              So sánh giá tốt nhất
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Tìm kiếm và so sánh giá từ các trang thương mại điện tử hàng đầu Việt Nam
            </p>
            
            {/* Popular Searches */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {['iPhone 15', 'Samsung Galaxy S24', 'Xiaomi 14', 'MacBook Air'].map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600">
                {stats.products.toLocaleString('vi-VN')}
              </div>
              <div className="text-gray-600 mt-1">Sản phẩm</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">
                {stats.offers.toLocaleString('vi-VN')}
              </div>
              <div className="text-gray-600 mt-1">Báo giá</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">
                {stats.shops.toLocaleString('vi-VN')}
              </div>
              <div className="text-gray-600 mt-1">Cửa hàng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Products */}
      {recentProducts.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Sản phẩm mới nhất
              </h2>
              <Link
                href="/search"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Xem tất cả →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cách thức hoạt động
            </h2>
            <p className="text-lg text-gray-600">
              Đơn giản và nhanh chóng để tìm giá tốt nhất
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Tìm kiếm</h3>
              <p className="text-gray-600">
                Nhập tên sản phẩm bạn muốn mua vào ô tìm kiếm
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CompareIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. So sánh</h3>
              <p className="text-gray-600">
                Xem giá từ nhiều cửa hàng khác nhau được sắp xếp theo thứ tự
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Mua sắm</h3>
              <p className="text-gray-600">
                Chọn cửa hàng có giá tốt nhất và tiến hành mua hàng
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function CompareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

function ShoppingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  )
}