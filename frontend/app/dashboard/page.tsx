"use client"

export const dynamic = 'force-dynamic'

import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { KPICards } from '@/components/dashboard/kpi-cards'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { AIInsights } from '@/components/dashboard/ai-insights'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import Link from 'next/link'
import { Users, ShoppingCart, Package, Warehouse, FileText, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  console.log('Dashboard rendering...')
  
  return (
    <DashboardShell>
      <div className="space-y-8">
        {/* Hero */}
        <section className="rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Dashboard điều hành</h1>
          <p className="text-sm text-white/80 max-w-xl">
            Tổng quan nhanh các chỉ số doanh thu, đơn hàng, khách hàng và kho hàng.
          </p>
        </section>

        <div className="p-8 bg-green-100 rounded-xl">
          <h2 className="text-2xl font-bold text-green-800">✓ Dashboard đã load thành công!</h2>
          <p className="mt-2 text-green-700">Nếu bạn thấy dòng này, dashboard đang hoạt động OK.</p>
        </div>

        {/* KPI */}
        <KPICards />

        {/* Charts & AI */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RevenueChart />
          <AIInsights />
        </div>

        {/* Recent activity */}
        <RecentActivity />

        {/* Quick links */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/customers" className="group">
            <div className="p-4 rounded-xl border bg-card hover:border-blue-500 hover:shadow-md transition-all">
              <Users className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold mb-1">Khách hàng</h3>
              <p className="text-xs text-muted-foreground">Xem danh sách và phân khúc khách hàng.</p>
            </div>
          </Link>

          <Link href="/products" className="group">
            <div className="p-4 rounded-xl border bg-card hover:border-green-500 hover:shadow-md transition-all">
              <Package className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="font-semibold mb-1">Sản phẩm</h3>
              <p className="text-xs text-muted-foreground">Quản lý danh mục và tồn kho sản phẩm.</p>
            </div>
          </Link>

          <Link href="/sales-orders" className="group">
            <div className="p-4 rounded-xl border bg-card hover:border-purple-500 hover:shadow-md transition-all">
              <ShoppingCart className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="font-semibold mb-1">Đơn bán hàng</h3>
              <p className="text-xs text-muted-foreground">Theo dõi trạng thái đơn và doanh thu.</p>
            </div>
          </Link>

          <Link href="/warehouses" className="group">
            <div className="p-4 rounded-xl border bg-card hover:border-orange-500 hover:shadow-md transition-all">
              <Warehouse className="h-8 w-8 text-orange-600 mb-3" />
              <h3 className="font-semibold mb-1">Kho hàng</h3>
              <p className="text-xs text-muted-foreground">Kiểm soát tồn kho theo từng kho.</p>
            </div>
          </Link>

          <Link href="/reports" className="group">
            <div className="p-4 rounded-xl border bg-card hover:border-red-500 hover:shadow-md transition-all">
              <FileText className="h-8 w-8 text-red-600 mb-3" />
              <h3 className="font-semibold mb-1">Báo cáo</h3>
              <p className="text-xs text-muted-foreground">Tổng hợp báo cáo doanh thu và chi phí.</p>
            </div>
          </Link>

          <Link href="/analytics" className="group">
            <div className="p-4 rounded-xl border bg-card hover:border-indigo-500 hover:shadow-md transition-all">
              <TrendingUp className="h-8 w-8 text-indigo-600 mb-3" />
              <h3 className="font-semibold mb-1">Phân tích</h3>
              <p className="text-xs text-muted-foreground">Xem biểu đồ và xu hướng kinh doanh.</p>
            </div>
          </Link>
        </section>
      </div>
    </DashboardShell>
  )
}
