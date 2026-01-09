"use client"

import { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'

import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Download, Calendar, Filter, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { API_ENDPOINTS } from '@/lib/api'

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.reports.recent + '?days=30')
      const data = await response.json()
      setReports(data.reports || [])
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Báo Cáo</h1>
            <p className="text-muted-foreground">
              Tạo và xuất các báo cáo kinh doanh
            </p>
          </div>
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            Tạo Báo Cáo Mới
          </Button>
        </div>

        {/* Quick Reports */}
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { title: 'Doanh Thu', type: 'Tài Chính', color: 'from-purple-500 to-pink-500' },
            { title: 'Tồn Kho', type: 'Kho Hàng', color: 'from-blue-500 to-cyan-500' },
            { title: 'Nhân Sự', type: 'HR', color: 'from-orange-500 to-red-500' },
            { title: 'Khách Hàng', type: 'CRM', color: 'from-green-500 to-emerald-500' }
          ].map((report, i) => (
            <Card key={i} className="border-2 hover:border-primary/50 transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className={`p-3 w-fit rounded-xl bg-gradient-to-br ${report.color} mb-4`}>
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-1">{report.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{report.type}</p>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="h-3 w-3 mr-2" />
                  Xuất
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Báo Cáo Gần Đây</CardTitle>
                <CardDescription>Các báo cáo đã tạo trong 30 ngày qua</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Lọc Ngày
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Bộ Lọc
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-semibold">Tên Báo Cáo</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Loại</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Ngày Tạo</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Người Tạo</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Trạng Thái</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Báo cáo doanh thu Q4 2024', type: 'Tài chính', date: '23/12/2024', user: 'Admin', status: 'completed' },
                    { name: 'Phân tích tồn kho tháng 12', type: 'Kho hàng', date: '22/12/2024', user: 'Quản lý kho', status: 'completed' },
                    { name: 'Top 50 khách hàng VIP', type: 'CRM', date: '21/12/2024', user: 'Sales Manager', status: 'completed' },
                    { name: 'Báo cáo nhân sự 2024', type: 'HR', date: '20/12/2024', user: 'HR Manager', status: 'processing' },
                    { name: 'Chi phí vận hành Q4', type: 'Tài chính', date: '19/12/2024', user: 'Kế toán', status: 'completed' },
                    { name: 'Hiệu suất bán hàng theo vùng', type: 'Sales', date: '18/12/2024', user: 'Admin', status: 'completed' }
                  ].map((report, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{report.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline">{report.type}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{report.date}</td>
                      <td className="px-4 py-3 text-sm">{report.user}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={report.status === 'completed' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }>
                          {report.status === 'completed' ? 'Hoàn Thành' : 'Đang Xử Lý'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Report Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Mẫu Báo Cáo</CardTitle>
            <CardDescription>Các template có sẵn để tạo báo cáo nhanh</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { title: 'Báo Cáo Tổng Quan', desc: 'Tổng hợp toàn bộ hoạt động kinh doanh', fields: '12 chỉ số' },
                { title: 'Phân Tích Sản Phẩm', desc: 'Chi tiết về từng sản phẩm và doanh số', fields: '8 chỉ số' },
                { title: 'KPI Dashboard', desc: 'Các chỉ số hiệu suất chính', fields: '15 chỉ số' },
                { title: 'So Sánh Theo Thời Gian', desc: 'Đối chiếu dữ liệu nhiều kỳ', fields: '10 chỉ số' },
                { title: 'Phân Tích Khách Hàng', desc: 'Hành vi và xu hướng khách hàng', fields: '9 chỉ số' },
                { title: 'Hiệu Quả Marketing', desc: 'ROI và conversion từng campaign', fields: '7 chỉ số' }
              ].map((template, i) => (
                <div key={i} className="p-4 rounded-xl border-2 hover:border-primary/50 transition-all">
                  <h3 className="font-bold mb-1">{template.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{template.desc}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{template.fields}</Badge>
                    <Button variant="outline" size="sm">Sử Dụng</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
