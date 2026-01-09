"use client"

import { useEffect, useState } from "react"
export const dynamic = 'force-dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, DollarSign, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { API_ENDPOINTS, apiFetch } from "@/lib/api"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoicesData, statsData] = await Promise.all([
          apiFetch<any[]>(API_ENDPOINTS.invoices.list),
          apiFetch<any>(API_ENDPOINTS.invoices.stats)
        ])
        setInvoices(invoicesData)
        setStats(statsData)
      } catch (error) {
        console.error('Error fetching invoices:', error)
      }
    }
    fetchData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      draft: "bg-gray-100 text-gray-800",
      sent: "bg-blue-100 text-blue-800",
      paid: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800"
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const handleSaveInvoice = async () => {
    if (!selectedInvoice) return
    try {
      const updated = await apiFetch<any>(
        `${API_ENDPOINTS.invoices.list}/${selectedInvoice.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(selectedInvoice),
        }
      )
      setInvoices((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
      const newStats = await apiFetch<any>(API_ENDPOINTS.invoices.stats)
      setStats(newStats)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating invoice:', error)
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hóa Đơn</h1>
          <p className="text-muted-foreground">Quản lý hóa đơn bán hàng</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Tạo Hóa Đơn</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Hóa Đơn</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã Thanh Toán</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.paid || 0}</div>
            <p className="text-xs text-muted-foreground">{formatCurrency(stats?.totalPaid || 0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quá Hạn</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.overdue || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Công Nợ</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.totalOutstanding || 0)}</div>
            <p className="text-xs text-muted-foreground">Còn phải thu</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Hóa Đơn</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Số HĐ</th>
                <th className="text-left p-4">Khách Hàng</th>
                <th className="text-left p-4">Ngày</th>
                <th className="text-left p-4">Hạn Thanh Toán</th>
                <th className="text-left p-4">Tổng Tiền</th>
                <th className="text-left p-4">Trạng Thái</th>
                <th className="text-right p-4">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length > 0 ? invoices.map(inv => (
                <tr key={inv.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{inv.invoiceNumber}</td>
                  <td className="p-4">{inv.customerName}</td>
                  <td className="p-4">{new Date(inv.invoiceDate).toLocaleDateString('vi-VN')}</td>
                  <td className="p-4">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('vi-VN') : '-'}</td>
                  <td className="p-4">{formatCurrency(inv.totalAmount)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(inv.status)}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedInvoice(inv)
                        setIsEditing(false)
                      }}>Chi tiết</Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedInvoice(inv)
                        setIsEditing(true)
                      }}>Sửa</Button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Chưa có hóa đơn</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {selectedInvoice && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>{isEditing ? 'Chỉnh Sửa Hóa Đơn' : 'Chi Tiết Hóa Đơn'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Số hóa đơn</Label>
                <Input value={selectedInvoice.invoiceNumber || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label>Khách hàng</Label>
                <Input value={selectedInvoice.customerName || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Input
                  value={selectedInvoice.status || ''}
                  onChange={(e) => {
                    setSelectedInvoice({ ...selectedInvoice, status: e.target.value })
                    setIsEditing(true)
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Số tiền đã thanh toán</Label>
                <Input
                  type="number"
                  value={selectedInvoice.paidAmount || 0}
                  onChange={(e) => {
                    setSelectedInvoice({ ...selectedInvoice, paidAmount: Number(e.target.value) })
                    setIsEditing(true)
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedInvoice(null)
                  setIsEditing(false)
                }}
              >
                Đóng
              </Button>
              <Button onClick={handleSaveInvoice} disabled={!isEditing}>
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
