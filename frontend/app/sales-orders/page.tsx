"use client"

import { useEffect, useState } from "react"
export const dynamic = 'force-dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, DollarSign, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { API_ENDPOINTS, apiFetch } from "@/lib/api"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function SalesOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, statsData] = await Promise.all([
          apiFetch<any[]>(API_ENDPOINTS.salesOrders.list),
          apiFetch<any>(API_ENDPOINTS.salesOrders.stats)
        ])
        
        setOrders(ordersData)
        setStats(statsData)
      } catch (error) {
        console.error("Error fetching sales orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSaveOrder = async () => {
    if (!selectedOrder) return
    try {
      const updated = await apiFetch<any>(
        `${API_ENDPOINTS.salesOrders.list}/${selectedOrder.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(selectedOrder),
        }
      )
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
      const newStats = await apiFetch<any>(API_ENDPOINTS.salesOrders.stats)
      setStats(newStats)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Đơn Bán Hàng</h1>
          <p className="text-muted-foreground">Quản lý tất cả đơn hàng bán ra</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tạo Đơn Hàng
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Đơn</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">Tất cả đơn hàng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ Xác Nhận</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pending || 0}</div>
            <p className="text-xs text-muted-foreground">Đơn đang chờ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã Giao</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.delivered || 0}</div>
            <p className="text-xs text-muted-foreground">Hoàn thành</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh Thu</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.totalRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Tổng doanh thu</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Đơn Hàng</CardTitle>
          <CardDescription>Tất cả đơn bán hàng trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Mã Đơn</th>
                  <th className="text-left p-4 font-medium">Khách Hàng</th>
                  <th className="text-left p-4 font-medium">Ngày Đặt</th>
                  <th className="text-left p-4 font-medium">Tổng Tiền</th>
                  <th className="text-left p-4 font-medium">Trạng Thái</th>
                  <th className="text-left p-4 font-medium">Thanh Toán</th>
                  <th className="text-right p-4 font-medium">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{order.orderNumber}</td>
                      <td className="p-4">{order.customerName}</td>
                      <td className="p-4">
                        {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="p-4">{formatCurrency(order.grandTotal)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 
                          order.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => {
                            setSelectedOrder(order)
                            setIsEditing(false)
                          }}>Chi tiết</Button>
                          <Button variant="ghost" size="sm" onClick={() => {
                            setSelectedOrder(order)
                            setIsEditing(true)
                          }}>Sửa</Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      Chưa có đơn hàng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedOrder && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>{isEditing ? 'Chỉnh Sửa Đơn Hàng' : 'Chi Tiết Đơn Hàng'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Mã đơn</Label>
                <Input value={selectedOrder.orderNumber || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label>Khách hàng</Label>
                <Input value={selectedOrder.customerName || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Input
                  value={selectedOrder.status || ''}
                  onChange={(e) => {
                    setSelectedOrder({ ...selectedOrder, status: e.target.value })
                    setIsEditing(true)
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Trạng thái thanh toán</Label>
                <Input
                  value={selectedOrder.paymentStatus || ''}
                  onChange={(e) => {
                    setSelectedOrder({ ...selectedOrder, paymentStatus: e.target.value })
                    setIsEditing(true)
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedOrder(null)
                  setIsEditing(false)
                }}
              >
                Đóng
              </Button>
              <Button onClick={handleSaveOrder} disabled={!isEditing}>
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
