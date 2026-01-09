"use client"

import { DashboardShell } from '@/components/dashboard/dashboard-shell'

export const dynamic = 'force-dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Phân Tích Dữ Liệu</h1>
          <p className="text-muted-foreground">
            Báo cáo chi tiết về hiệu suất kinh doanh
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-2 hover:border-purple-500/50 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
                Doanh Thu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">145.2M</div>
              <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                <TrendingUp className="h-4 w-4" />
                <span>+12.5% từ tháng trước</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-blue-500/50 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                  <ShoppingCart className="h-4 w-4 text-white" />
                </div>
                Đơn Hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2,345</div>
              <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                <TrendingUp className="h-4 w-4" />
                <span>+8.2% từ tháng trước</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-orange-500/50 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                  <Users className="h-4 w-4 text-white" />
                </div>
                Khách Hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,289</div>
              <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                <TrendingUp className="h-4 w-4" />
                <span>+15.3% từ tháng trước</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-green-500/50 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                  <Package className="h-4 w-4 text-white" />
                </div>
                Sản Phẩm Bán
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8,456</div>
              <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
                <TrendingDown className="h-4 w-4" />
                <span>-3.1% từ tháng trước</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Doanh Thu Theo Tháng</CardTitle>
              <CardDescription>12 tháng gần nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-end justify-between gap-2">
                {[65, 70, 85, 90, 75, 95, 100, 85, 90, 95, 100, 105].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-gradient-to-t from-purple-600 to-blue-600 rounded-t-lg hover:from-purple-500 hover:to-blue-500 transition-all cursor-pointer"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-muted-foreground">T{i + 1}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Sản Phẩm Bán Chạy</CardTitle>
              <CardDescription>5 sản phẩm hàng đầu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Laptop Dell XPS 15', sales: 156, revenue: '468M', percent: 100 },
                { name: 'iPhone 15 Pro Max', sales: 142, revenue: '426M', percent: 91 },
                { name: 'MacBook Pro M3', sales: 128, revenue: '384M', percent: 82 },
                { name: 'iPad Air', sales: 98, revenue: '196M', percent: 63 },
                { name: 'AirPods Pro', sales: 87, revenue: '87M', percent: 56 }
              ].map((product, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} đơn • {product.revenue} VND</p>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                      style={{ width: `${product.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Regional Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Hiệu Suất Theo Khu Vực</CardTitle>
            <CardDescription>Doanh thu phân chia theo vùng miền</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { region: 'Miền Bắc', revenue: '58.2M', percent: 40, color: 'from-purple-500 to-pink-500' },
                { region: 'Miền Trung', revenue: '36.3M', percent: 25, color: 'from-blue-500 to-cyan-500' },
                { region: 'Miền Nam', revenue: '50.7M', percent: 35, color: 'from-orange-500 to-red-500' }
              ].map((region, i) => (
                <div key={i} className="p-6 rounded-xl border-2 hover:border-primary/50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">{region.region}</h3>
                    <span className="text-2xl font-bold">{region.percent}%</span>
                  </div>
                  <p className="text-muted-foreground mb-3">{region.revenue} VND</p>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${region.color} rounded-full`} style={{ width: `${region.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
