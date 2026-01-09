"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, Building2, Star } from "lucide-react"
import { API_ENDPOINTS, apiFetch } from "@/lib/api"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export const dynamic = 'force-dynamic'

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<any | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersData, statsData] = await Promise.all([
          apiFetch<any[]>(API_ENDPOINTS.suppliers.list),
          apiFetch<any>(API_ENDPOINTS.suppliers.stats)
        ])
        setSuppliers(suppliersData)
        setStats(statsData)
      } catch (error) {
        console.error('Error fetching suppliers:', error)
      }
    }
    fetchData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  const getRatingStars = (rating: string) => {
    const stars: any = { excellent: 5, good: 4, average: 3, poor: 2 }
    return '⭐'.repeat(stars[rating] || 3)
  }

  const handleSaveSupplier = async () => {
    if (!selectedSupplier) return
    try {
      const updated = await apiFetch<any>(
        `${API_ENDPOINTS.suppliers.list}/${selectedSupplier.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(selectedSupplier),
        }
      )
      setSuppliers((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
      const newStats = await apiFetch<any>(API_ENDPOINTS.suppliers.stats)
      setStats(newStats)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating supplier:', error)
    }
  }

  return (
    <DashboardShell>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Nhà Cung Cấp</h1>
          <p className="text-muted-foreground">Quản lý danh sách nhà cung cấp</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Thêm NCC</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng NCC</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang Hoạt Động</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bị Khóa</CardTitle>
            <Star className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.blocked || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Nhà Cung Cấp</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Tên NCC</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Điện Thoại</th>
                <th className="text-left p-4">Địa Chỉ</th>
                <th className="text-left p-4">Tổng Mua</th>
                <th className="text-left p-4">Đánh Giá</th>
                <th className="text-left p-4">Trạng Thái</th>
                <th className="text-right p-4">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length > 0 ? suppliers.map(sup => (
                <tr key={sup.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{sup.name}</td>
                  <td className="p-4">{sup.email}</td>
                  <td className="p-4">{sup.phone}</td>
                  <td className="p-4">{sup.city}, {sup.country}</td>
                  <td className="p-4">{formatCurrency(sup.totalPurchased || 0)}</td>
                  <td className="p-4">{getRatingStars(sup.rating)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      sup.status === 'active' ? 'bg-green-100 text-green-800' :
                      sup.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {sup.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedSupplier(sup)
                        setIsEditing(false)
                      }}>Chi tiết</Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedSupplier(sup)
                        setIsEditing(true)
                      }}>Sửa</Button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">Chưa có nhà cung cấp</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {selectedSupplier && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>{isEditing ? 'Chỉnh Sửa Nhà Cung Cấp' : 'Chi Tiết Nhà Cung Cấp'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Tên NCC</Label>
                <Input
                  value={selectedSupplier.name || ''}
                  onChange={(e) => {
                    setSelectedSupplier({ ...selectedSupplier, name: e.target.value })
                    setIsEditing(true)
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={selectedSupplier.email || ''}
                  onChange={(e) => {
                    setSelectedSupplier({ ...selectedSupplier, email: e.target.value })
                    setIsEditing(true)
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Điện thoại</Label>
                <Input
                  value={selectedSupplier.phone || ''}
                  onChange={(e) => {
                    setSelectedSupplier({ ...selectedSupplier, phone: e.target.value })
                    setIsEditing(true)
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Địa chỉ</Label>
                <Input
                  value={selectedSupplier.address || ''}
                  onChange={(e) => {
                    setSelectedSupplier({ ...selectedSupplier, address: e.target.value })
                    setIsEditing(true)
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedSupplier(null)
                  setIsEditing(false)
                }}
              >
                Đóng
              </Button>
              <Button onClick={handleSaveSupplier} disabled={!isEditing}>
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
