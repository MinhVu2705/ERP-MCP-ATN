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
  const gradients = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-orange-500 to-red-500',
    'from-green-500 to-emerald-500',
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon
        const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown
        
        return (
          <Card key={kpi.title} className="group hover:scale-105 transition-all duration-300 border-2 hover:border-primary/50 hover:shadow-2xl overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-5 group-hover:opacity-10 transition-opacity`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative">
              <CardTitle className="text-sm font-semibold text-muted-foreground">{kpi.title}</CardTitle>
              <div className={`p-2 rounded-xl bg-gradient-to-br ${gradients[index]} shadow-lg`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-2">{kpi.value}</div>
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                  kpi.trend === 'up' 
                    ? 'bg-green-100 dark:bg-green-900/30' 
                    : 'bg-red-100 dark:bg-red-900/30'
                }`}>
                  <TrendIcon className={`h-4 w-4 ${
                    kpi.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`} />
                  <span className={`text-sm font-semibold ${
                    kpi.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {kpi.change}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">vs tháng trước</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
