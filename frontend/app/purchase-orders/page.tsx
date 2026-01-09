"use client"

import { useEffect, useState } from "react"

export const dynamic = 'force-dynamic'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ShoppingCart, Clock, CheckCircle } from "lucide-react"
import { API_ENDPOINTS, apiFetch } from "@/lib/api"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, statsData] = await Promise.all([
          apiFetch<any[]>(API_ENDPOINTS.purchaseOrders.list),
          apiFetch<any>(API_ENDPOINTS.purchaseOrders.stats)
        ])
        setOrders(ordersData)
        setStats(statsData)
      } catch (error) {
        console.error('Error fetching purchase orders:', error)
      }
    }
    fetchData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  const handleSaveOrder = async () => {
    if (!selectedOrder) return
    try {
      const updated = await apiFetch<any>(
        `${API_ENDPOINTS.purchaseOrders.list}/${selectedOrder.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(selectedOrder),
        }
      )
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
      const newStats = await apiFetch<any>(API_ENDPOINTS.purchaseOrders.stats)
      setStats(newStats)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating purchase order:', error)
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Đơn Mua Hàng</h1>
          <p className="text-muted-foreground">Quản lý đơn mua hàng từ nhà cung cấp</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Tạo Đơn Mua</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Đơn</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ Xác Nhận</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.sent || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã Nhận</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.received || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Mua</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.totalPurchased || 0)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Đơn Mua Hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Mã PO</th>
                <th className="text-left p-4">Nhà CC</th>
                <th className="text-left p-4">Ngày Đặt</th>
                <th className="text-left p-4">Ngày Nhận Dự Kiến</th>
                <th className="text-left p-4">Tổng Tiền</th>
                <th className="text-left p-4">Trạng Thái</th>
                <th className="text-right p-4">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? orders.map(po => (
                <tr key={po.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{po.poNumber}</td>
                  <td className="p-4">{po.supplierName}</td>
                  <td className="p-4">{new Date(po.orderDate).toLocaleDateString('vi-VN')}</td>
                  <td className="p-4">{po.expectedDate ? new Date(po.expectedDate).toLocaleDateString('vi-VN') : '-'}</td>
                  <td className="p-4">{formatCurrency(po.grandTotal)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      po.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      po.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      po.status === 'confirmed' ? 'bg-purple-100 text-purple-800' :
                      po.status === 'received' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedOrder(po)
                        setIsEditing(false)
                      }}>Chi tiết</Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedOrder(po)
                        setIsEditing(true)
                      }}>Sửa</Button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Chưa có đơn mua hàng</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {selectedOrder && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>{isEditing ? 'Chỉnh Sửa Đơn Mua Hàng' : 'Chi Tiết Đơn Mua Hàng'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Mã PO</Label>
                <Input value={selectedOrder.poNumber || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label>Nhà cung cấp</Label>
                <Input value={selectedOrder.supplierName || ''} disabled />
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
