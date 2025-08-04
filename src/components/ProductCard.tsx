import Image from 'next/image'
import Link from 'next/link'

interface Offer {
  id: string
  price: number
  url: string
  shop: {
    name: string
    domain: string
  }
}

interface Product {
  id: string
  name: string
  brand: string | null
  model: string | null
  storage: string | null
  image: string | null
  isOfficial: boolean
  offers: Offer[]
}

interface ProductCardProps {
  product: Product
  showOffers?: boolean
}

export function ProductCard({ product, showOffers = true }: ProductCardProps) {
  const cheapestOffer = product.offers[0]
  const offerCount = product.offers.length

  return (
    <div className="card p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ImageIcon />
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {product.name}
              </h3>
              
              <div className="flex items-center gap-2 mt-1">
                {product.brand && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {product.brand}
                  </span>
                )}
                {product.storage && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {product.storage}
                  </span>
                )}
                {product.isOfficial && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Chính hãng
                  </span>
                )}
              </div>
            </div>

            {/* Price Info */}
            {cheapestOffer && (
              <div className="text-right ml-4">
                <div className="text-2xl font-bold text-primary-600">
                  {formatPrice(cheapestOffer.price)}
                </div>
                {offerCount > 1 && (
                  <div className="text-sm text-gray-500">
                    từ {offerCount} cửa hàng
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Offers Section */}
          {showOffers && product.offers.length > 0 && (
            <div className="mt-4 border-t pt-3">
              <div className="space-y-2">
                {product.offers.slice(0, 3).map((offer) => (
                  <div key={offer.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {offer.shop.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {offer.shop.domain}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {formatPrice(offer.price)}
                      </span>
                      <Link
                        href={offer.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary px-3 py-1 text-xs"
                      >
                        Xem
                      </Link>
                    </div>
                  </div>
                ))}
                
                {product.offers.length > 3 && (
                  <div className="text-center pt-2">
                    <Link
                      href={`/product/${product.id}`}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Xem thêm {product.offers.length - 3} cửa hàng khác
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(price)
}

function ImageIcon() {
  return (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  )
}