import Link from 'next/link'
import { SearchForm } from './SearchForm'

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">VN</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                Price Compare
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <SearchForm />
          </div>

          {/* Stats */}
          <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
            <span>So sánh giá tốt nhất</span>
          </div>
        </div>
      </div>
    </header>
  )
}