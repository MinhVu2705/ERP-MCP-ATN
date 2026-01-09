"use client"

import { useEffect, useState } from "react"

export const dynamic = 'force-dynamic'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Warehouse, Package, TrendingUp, AlertTriangle } from "lucide-react"
import { API_ENDPOINTS, apiFetch } from "@/lib/api"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [selectedWarehouse, setSelectedWarehouse] = useState<any | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [warehousesData, statsData] = await Promise.all([
          apiFetch<any[]>(API_ENDPOINTS.warehouses.list),
          apiFetch<any>(API_ENDPOINTS.warehouses.stats)
        ])
        setWarehouses(warehousesData)
        setStats(statsData)
      } catch (error) {
        console.error('Error fetching warehouses:', error)
      }
    }
    fetchData()
  }, [])

  const handleSaveWarehouse = async () => {
    if (!selectedWarehouse) return
    try {
      const updated = await apiFetch<any>(
        `${API_ENDPOINTS.warehouses.list}/${selectedWarehouse.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(selectedWarehouse),
        }
      )
      setWarehouses((prev) => prev.map((w) => (w.id === updated.id ? updated : w)))
      const newStats = await apiFetch<any>(API_ENDPOINTS.warehouses.stats)
      setStats(newStats)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating warehouse:', error)
    }
  }

  return (
    <DashboardShell>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Kho Hàng</h1>
          <p className="text-muted-foreground">Quản lý các kho hàng và tồn kho</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Thêm Kho</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Kho</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang Hoạt Động</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Tồn Kho</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStock?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">Đơn vị hàng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ Lệ Sử Dụng</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.utilizationPercent?.toFixed(1) || 0}%</div>
            <p className="text-xs text-muted-foreground">Công suất</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Kho</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Mã Kho</th>
                <th className="text-left p-4">Tên Kho</th>
                <th className="text-left p-4">Địa Điểm</th>
                <th className="text-left p-4">Quản Lý</th>
                <th className="text-left p-4">Tồn Kho</th>
                <th className="text-left p-4">Sức Chứa</th>
                <th className="text-left p-4">Loại</th>
                <th className="text-left p-4">Trạng Thái</th>
                <th className="text-right p-4">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.length > 0 ? warehouses.map(wh => (
                <tr key={wh.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{wh.warehouseCode}</td>
                  <td className="p-4">{wh.name}</td>
                  <td className="p-4">{wh.city}</td>
                  <td className="p-4">{wh.manager}</td>
                  <td className="p-4">{wh.currentStock?.toLocaleString() || 0}</td>
                  <td className="p-4">{wh.capacity?.toLocaleString() || 0}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {wh.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      wh.status === 'active' ? 'bg-green-100 text-green-800' :
                      wh.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {wh.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedWarehouse(wh)
                        setIsEditing(false)
                      }}>Chi tiết</Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedWarehouse(wh)
                        setIsEditing(true)
                      }}>Sửa</Button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={9} className="p-8 text-center text-muted-foreground">Chưa có kho hàng</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {selectedWarehouse && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>{isEditing ? 'Chỉnh Sửa Kho Hàng' : 'Chi Tiết Kho Hàng'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Tên kho</Label>
                <Input
                  value={selectedWarehouse.name || ''}
                  onChange={(e) => {
                    setSelectedWarehouse({ ...selectedWarehouse, name: e.target.value })
                    setIsEditing(true)
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Địa điểm</Label>
                <Input
                  value={selectedWarehouse.location || ''}
                  onChange={(e) => {
                    setSelectedWarehouse({ ...selectedWarehouse, location: e.target.value })
                    setIsEditing(true)
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Thành phố</Label>
                <Input
                  value={selectedWarehouse.city || ''}
                  onChange={(e) => {
                    setSelectedWarehouse({ ...selectedWarehouse, city: e.target.value })
                    setIsEditing(true)
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Quản lý</Label>
                <Input
                  value={selectedWarehouse.manager || ''}
                  onChange={(e) => {
                    setSelectedWarehouse({ ...selectedWarehouse, manager: e.target.value })
                    setIsEditing(true)
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedWarehouse(null)
                  setIsEditing(false)
                }}
              >
                Đóng
              </Button>
              <Button onClick={handleSaveWarehouse} disabled={!isEditing}>
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
