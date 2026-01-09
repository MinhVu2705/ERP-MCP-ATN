'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const data = [
  { month: 'T1', revenue: 1.8 },
  { month: 'T2', revenue: 1.9 },
  { month: 'T3', revenue: 2.1 },
  { month: 'T4', revenue: 2.0 },
  { month: 'T5', revenue: 2.3 },
  { month: 'T6', revenue: 2.5 },
  { month: 'T7', revenue: 2.4 },
  { month: 'T8', revenue: 2.6 },
  { month: 'T9', revenue: 2.1 },
]

export function RevenueChart() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Doanh Thu 9 Tháng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p className="text-sm">Biểu đồ doanh thu</p>
            <p className="text-xs mt-2">Dữ liệu 9 tháng gần nhất</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
