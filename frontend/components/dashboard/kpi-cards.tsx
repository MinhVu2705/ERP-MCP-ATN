'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Package } from 'lucide-react'

const kpiData = [
  {
    title: 'Doanh Thu Tháng',
    value: '2.1 tỷ VND',
    change: '+10%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    title: 'Lợi Nhuận',
    value: '450 triệu VND',
    change: '+15%',
    trend: 'up',
    icon: TrendingUp,
  },
  {
    title: 'Đơn Hàng',
    value: '1,234',
    change: '-5%',
    trend: 'down',
    icon: ShoppingCart,
  },
  {
    title: 'Tồn Kho',
    value: '5,678',
    change: '+2%',
    trend: 'up',
    icon: Package,
  },
]

export function KPICards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi) => {
        const Icon = kpi.icon
        const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown
        
        return (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendIcon
                  className={`mr-1 h-4 w-4 ${
                    kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}
                />
                <span className={kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {kpi.change}
                </span>
                <span className="ml-1">so với tháng trước</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
