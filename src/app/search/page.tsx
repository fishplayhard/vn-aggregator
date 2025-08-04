'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/Header'
import { ProductCard } from '@/components/ProductCard'

interface Product {
  id: string
  name: string
  brand: string | null
  model: string | null
  storage: string | null
  image: string | null
  isOfficial: boolean
  offers: Array<{
    id: string
    price: number
    url: string
    shop: {
      name: string
      domain: string
    }
  }>
}

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (query) {
      searchProducts(query)
    }
  }, [query])

  const searchProducts = async (searchQuery: string) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/products?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.data)
      } else {
        setError('Có lỗi xảy ra khi tìm kiếm')
      }
    } catch (err) {
      setError('Không thể kết nối đến server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Results Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Kết quả tìm kiếm
        </h1>
        {query && (
          <p className="text-gray-600">
            Tìm kiếm cho: <span className="font-semibold">&quot;{query}&quot;</span>
            {!loading && products.length > 0 && (
              <span className="ml-2">({products.length} sản phẩm)</span>
            )}
          </p>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Đang tìm kiếm...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* No Results */}
      {!loading && !error && products.length === 0 && query && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SearchIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Không tìm thấy sản phẩm nào
          </h3>
          <p className="text-gray-600 mb-6">
            Thử tìm kiếm với từ khóa khác hoặc kiểm tra chính tả
          </p>
          
          {/* Suggestions */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold mb-3">Gợi ý tìm kiếm:</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {['iPhone', 'Samsung Galaxy', 'Xiaomi', 'MacBook', 'AirPods'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => searchProducts(suggestion)}
                  className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {!loading && products.length > 0 && (
        <div className="space-y-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Empty State - No Query */}
      {!query && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SearchIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Tìm kiếm sản phẩm
          </h3>
          <p className="text-gray-600 mb-6">
            Nhập tên sản phẩm vào ô tìm kiếm để bắt đầu
          </p>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <div>
      <Header />
      <Suspense fallback={
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Đang tải...</span>
        </div>
      }>
        <SearchContent />
      </Suspense>
    </div>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  )
}