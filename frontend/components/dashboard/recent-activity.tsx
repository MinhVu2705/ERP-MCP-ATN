'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

const activities = [
  {
    id: 1,
    action: 'Đơn hàng mới #1234',
    user: 'Nguyễn Văn A',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: 2,
    action: 'Cập nhật báo giá sản phẩm B',
    user: 'Trần Thị B',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: 3,
    action: 'Phê duyệt yêu cầu mua hàng',
    user: 'Lê Văn C',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: 4,
    action: 'Xuất kho 100 đơn vị sản phẩm A',
    user: 'Phạm Thị D',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hoạt Động Gần Đây</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.user}</p>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: vi })}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
