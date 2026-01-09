"use client"

import { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'

import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Plus, Search, Mail, Phone, MapPin, Star, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { API_ENDPOINTS, apiFetch } from '@/lib/api'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [segments, setSegments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [vipRes, statsRes, segmentsRes] = await Promise.all([
        fetch(API_ENDPOINTS.customers.vip),
        fetch(API_ENDPOINTS.customers.stats),
        fetch(API_ENDPOINTS.customers.segments)
      ])
      
      const vipData = await vipRes.json()
      const statsData = await statsRes.json()
      const segmentsData = await segmentsRes.json()
      
      setCustomers(vipData.customers?.slice(0, 5) || [])
      setStats(statsData)
      setSegments(segmentsData.segments || [])
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCustomer = async () => {
    if (!selectedCustomer) return
    try {
      const payload = {
        name: selectedCustomer.name,
        email: selectedCustomer.email,
        phone: selectedCustomer.phone,
        location: selectedCustomer.location,
      }

      const updated = await apiFetch<any>(
        `${API_ENDPOINTS.customers.list}/${selectedCustomer.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(payload),
        }
      )

      setCustomers((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      )
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating customer:', error)
    }
  }
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản Lý Khách Hàng</h1>
            <p className="text-muted-foreground">
              Danh sách và thông tin khách hàng
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Thêm Khách Hàng
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tổng Khách Hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2,547</div>
              <p className="text-xs text-muted-foreground">+128 khách mới tháng này</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Khách VIP</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">234</div>
              <p className="text-xs text-muted-foreground">Top 10% khách hàng</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Khách Thân Thiết</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats?.gold || 0}</div>
              <p className="text-xs text-muted-foreground">Mua {'>'} 3 lần</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Khách Mới</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">1,421</div>
              <p className="text-xs text-muted-foreground">Chưa mua lần 2</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm theo tên, email, số điện thoại..." className="pl-10" />
            </div>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Khách Hàng VIP</CardTitle>
            <CardDescription>Top 10 khách hàng có giá trị cao nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center gap-4 p-4 rounded-xl border-2 hover:border-primary/50 transition-all"
                >
                  <div className={`h-16 w-16 rounded-xl flex items-center justify-center text-white text-xl font-bold ${
                    customer.level === 'diamond' 
                      ? 'bg-gradient-to-br from-purple-600 to-blue-600' 
                      : 'bg-gradient-to-br from-orange-500 to-yellow-500'
                  }`}>
                    {customer.name.charAt(0)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{customer.name}</h3>
                      {customer.level === 'diamond' ? (
                        <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Diamond
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Gold
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{customer.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {customer.totalSpent
                        ? `${Number(customer.totalSpent).toLocaleString('vi-VN')} đ`
                        : '-'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {customer.orderCount ?? 0} đơn hàng
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCustomer(customer)
                      setIsEditing(false)
                    }}
                  >
                    Chi Tiết
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Segments */}
        <Card>
          <CardHeader>
            <CardTitle>Phân Khúc Khách Hàng</CardTitle>
            <CardDescription>Nhóm khách hàng theo hành vi mua sắm</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { 
                  segment: 'Khách Hàng Trung Thành', 
                  count: 892, 
                  percent: 35, 
                  avgSpent: '45M',
                  color: 'from-purple-500 to-blue-500',
                  desc: 'Mua hàng thường xuyên, giá trị cao'
                },
                { 
                  segment: 'Khách Hàng Tiềm Năng', 
                  count: 645, 
                  percent: 25, 
                  avgSpent: '28M',
                  color: 'from-blue-500 to-cyan-500',
                  desc: 'Đã mua 1-2 lần, có khả năng quay lại'
                },
                { 
                  segment: 'Khách Hàng Mới', 
                  count: 1010, 
                  percent: 40, 
                  avgSpent: '12M',
                  color: 'from-green-500 to-emerald-500',
                  desc: 'Lần đầu mua hàng, cần chăm sóc'
                }
              ].map((seg, i) => (
                <div key={i} className="p-6 rounded-xl border-2 hover:border-primary/50 transition-all">
                  <div className={`p-3 w-fit rounded-xl bg-gradient-to-br ${seg.color} mb-4`}>
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{seg.segment}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{seg.desc}</p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Số lượng</span>
                      <span className="font-bold">{seg.count} KH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tỷ lệ</span>
                      <span className="font-bold">{seg.percent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">TB chi tiêu</span>
                      <span className="font-bold">{seg.avgSpent} VND</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted mt-4 overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${seg.color}`} style={{ width: `${seg.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedCustomer && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>
                {isEditing ? 'Chỉnh Sửa Khách Hàng' : 'Chi Tiết Khách Hàng'}
              </CardTitle>
              <CardDescription>
                {selectedCustomer.name} - {selectedCustomer.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Họ tên</Label>
                  <Input
                    value={selectedCustomer.name || ''}
                    onChange={(e) => {
                      setSelectedCustomer({ ...selectedCustomer, name: e.target.value })
                      setIsEditing(true)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={selectedCustomer.email || ''}
                    onChange={(e) => {
                      setSelectedCustomer({ ...selectedCustomer, email: e.target.value })
                      setIsEditing(true)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Số điện thoại</Label>
                  <Input
                    value={selectedCustomer.phone || ''}
                    onChange={(e) => {
                      setSelectedCustomer({ ...selectedCustomer, phone: e.target.value })
                      setIsEditing(true)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Khu vực</Label>
                  <Input
                    value={selectedCustomer.location || ''}
                    onChange={(e) => {
                      setSelectedCustomer({ ...selectedCustomer, location: e.target.value })
                      setIsEditing(true)
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCustomer(null)
                    setIsEditing(false)
                  }}
                >
                  Đóng
                </Button>
                <Button onClick={handleSaveCustomer} disabled={!isEditing}>
                  Lưu
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Thay đổi sẽ được gửi lên API và lưu vào cơ sở dữ liệu.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  )
}
