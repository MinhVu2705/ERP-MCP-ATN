'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, TrendingUp } from 'lucide-react'

const insights = [
  {
    title: 'Dự Báo Doanh Thu Q4',
    description: 'Dự kiến tăng 12.5% so với Q3, khoảng 3.2 tỷ VND',
    type: 'forecast',
  },
  {
    title: 'Cảnh Báo Tồn Kho',
    description: 'Sản phẩm A sắp hết hàng, nên nhập thêm 500 đơn vị',
    type: 'warning',
  },
  {
    title: 'Xu Hướng Khách Hàng',
    description: 'Tỷ lệ khách hàng quay lại tăng 18% trong tháng 9',
    type: 'trend',
  },
]

export function AIInsights() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 rounded-lg border p-3">
              <div className="rounded-full bg-primary/10 p-2">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{insight.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
