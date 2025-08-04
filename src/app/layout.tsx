import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VN Price Compare - So sánh giá tốt nhất Việt Nam',
  description: 'Nền tảng so sánh giá hàng đầu Việt Nam. Tìm kiếm và so sánh giá sản phẩm từ các trang thương mại điện tử lớn.',
  keywords: 'so sánh giá, mua sắm, việt nam, tiki, shopee, lazada',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}