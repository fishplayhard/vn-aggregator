'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SearchForm({ defaultValue = '' }: { defaultValue?: string }) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm sản phẩm... (VD: iPhone 13 Pro, Samsung Galaxy S24)"
          className="w-full px-4 py-2 pl-10 pr-12 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon className="w-5 h-5 text-gray-400" />
        </div>
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <div className="btn-primary px-4 py-1 text-sm">
            Tìm kiếm
          </div>
        </button>
      </div>
    </form>
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