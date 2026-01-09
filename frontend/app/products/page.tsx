"use client"

import { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'

import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Plus, Search, Filter, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { API_ENDPOINTS, apiFetch } from '@/lib/api'
import { Label } from '@/components/ui/label'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsData, statsData, categoriesData] = await Promise.all([
        apiFetch<any>(API_ENDPOINTS.products.list),
        apiFetch<any>(API_ENDPOINTS.products.stats),
        apiFetch<any>(API_ENDPOINTS.products.categories),
      ])

      setProducts(productsData.products || [])
      setStats(statsData)
      setCategories(categoriesData.categories || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number | string | null | undefined) => {
    const value = typeof amount === 'string' ? Number(amount) : amount || 0
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  }

  const handleSaveProduct = async () => {
    if (!selectedProduct) return
    try {
      const payload = {
        name: selectedProduct.name,
        category: selectedProduct.category,
        price: selectedProduct.price,
        stock: selectedProduct.stock,
      }

      const updated = await apiFetch<any>(
        `${API_ENDPOINTS.products.list}/${selectedProduct.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(payload),
        }
      )

      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      // Cập nhật lại thống kê để thanh tóm tắt luôn chính xác
      const newStats = await apiFetch<any>(API_ENDPOINTS.products.stats)
      setStats(newStats)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản Lý Sản Phẩm</h1>
            <p className="text-muted-foreground">
              Danh sách và thông tin chi tiết sản phẩm
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Thêm Sản Phẩm
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tổng Sản Phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.total || 0}</div>
              <p className="text-xs text-muted-foreground">+45 sản phẩm mới tháng này</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Đang Kinh Doanh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats?.active || 0}</div>
              <p className="text-xs text-muted-foreground">{stats?.total ? Math.round((stats.active / stats.total) * 100) : 0}% tổng số sản phẩm</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Sắp Hết Hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats?.lowStock || 0}</div>
              <p className="text-xs text-muted-foreground">Cần nhập thêm hàng</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Hết Hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats?.outOfStock || 0}</div>
              <p className="text-xs text-muted-foreground">Ngừng bán tạm thời</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Tìm kiếm sản phẩm theo tên, SKU, mã..." className="pl-10" />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Bộ Lọc
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const stock = product.stock ?? 0
            const isOut = stock === 0
            const isLow = !isOut && stock < 10

            return (
              <Card
                key={product.id}
                className={`border-2 hover:border-primary/50 transition-all ${
                  isOut ? 'opacity-60' : ''
                }`}
              >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30">
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex gap-2">
                    {!isOut && !isLow && (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Đang Bán
                      </Badge>
                    )}
                    {isLow && (
                      <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Sắp Hết
                      </Badge>
                    )}
                    {isOut && (
                      <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        Hết Hàng
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="mt-4">{product.name}</CardTitle>
                <CardDescription>SKU: {product.sku}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Giá bán</span>
                  <span className="text-lg font-bold">{formatCurrency(product.price)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tồn kho</span>
                  <span
                    className={`font-semibold ${
                      isOut ? 'text-red-600' : isLow ? 'text-orange-600' : ''
                    }`}
                  >
                    {stock} sản phẩm
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Đã bán</span>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{product.soldCount ?? 0}</span>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="pt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedProduct(product)
                      setIsEditing(false)
                    }}
                  >
                    Chi Tiết
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedProduct(product)
                      setIsEditing(true)
                    }}
                  >
                    Chỉnh Sửa
                  </Button>
                </div>
              </CardContent>
            </Card>
            )
          })}
        </div>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Danh Mục Sản Phẩm</CardTitle>
            <CardDescription>Phân loại theo nhóm sản phẩm</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { name: 'Điện Thoại', count: 234, color: 'from-purple-500 to-pink-500' },
                { name: 'Laptop', count: 156, color: 'from-blue-500 to-cyan-500' },
                { name: 'Tablet', count: 189, color: 'from-orange-500 to-red-500' },
                { name: 'Phụ Kiện', count: 655, color: 'from-green-500 to-emerald-500' }
              ].map((category, i) => (
                <div key={i} className="p-4 rounded-xl border-2 hover:border-primary/50 transition-all cursor-pointer">
                  <div className={`p-2 w-fit rounded-lg bg-gradient-to-br ${category.color} mb-3`}>
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} sản phẩm</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedProduct && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>
                {isEditing ? 'Chỉnh Sửa Sản Phẩm' : 'Chi Tiết Sản Phẩm'}
              </CardTitle>
              <CardDescription>{selectedProduct.sku}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tên sản phẩm</Label>
                  <Input
                    value={selectedProduct.name}
                    readOnly={!isEditing}
                    onChange={(e) =>
                      isEditing &&
                      setSelectedProduct({ ...selectedProduct, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Giá bán</Label>
                  <Input
                    value={selectedProduct.price ?? ''}
                    readOnly={!isEditing}
                    onChange={(e) => {
                      if (!isEditing) return
                      const value = Number(e.target.value.replace(/[^0-9.-]/g, '')) || 0
                      setSelectedProduct({ ...selectedProduct, price: value })
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tồn kho</Label>
                  <Input
                    value={selectedProduct.stock ?? 0}
                    readOnly={!isEditing}
                    onChange={(e) => {
                      if (!isEditing) return
                      const value = Number(e.target.value.replace(/[^0-9.-]/g, '')) || 0
                      setSelectedProduct({ ...selectedProduct, stock: value })
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <Input value={selectedProduct.status} readOnly disabled />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedProduct(null)
                    setIsEditing(false)
                  }}
                >
                  Đóng
                </Button>
                <Button onClick={handleSaveProduct} disabled={!isEditing}>
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
