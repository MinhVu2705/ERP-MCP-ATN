"use client"

import { DashboardShell } from '@/components/dashboard/dashboard-shell'

export const dynamic = 'force-dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, Bell, Shield, Database, Mail, Globe } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function SettingsPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cài Đặt Hệ Thống</h1>
          <p className="text-muted-foreground">
            Quản lý cấu hình và tùy chỉnh hệ thống ERP-MCP
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Cài Đặt Chung</CardTitle>
                  <CardDescription>Thông tin cơ bản của hệ thống</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tên Công Ty</Label>
                <Input placeholder="ABC Corporation" />
              </div>
              <div className="space-y-2">
                <Label>Múi Giờ</Label>
                <Input value="Asia/Ho_Chi_Minh" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Ngôn Ngữ</Label>
                <Input value="Tiếng Việt" readOnly />
              </div>
              <Button className="w-full">Lưu Thay Đổi</Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Thông Báo</CardTitle>
                  <CardDescription>Cấu hình thông báo hệ thống</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Nhận thông báo qua email</p>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5 rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Thông báo trên trình duyệt</p>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5 rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Alerts</p>
                  <p className="text-sm text-muted-foreground">Cảnh báo qua tin nhắn</p>
                </div>
                <input type="checkbox" className="h-5 w-5 rounded" />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Bảo Mật</CardTitle>
                  <CardDescription>Cài đặt bảo mật tài khoản</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Mật Khẩu Hiện Tại</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>Mật Khẩu Mới</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>Xác Nhận Mật Khẩu</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button className="w-full" variant="destructive">Đổi Mật Khẩu</Button>
            </CardContent>
          </Card>

          {/* Database */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                  <Database className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Cơ Sở Dữ Liệu</CardTitle>
                  <CardDescription>Quản lý và sao lưu dữ liệu</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-sm font-medium mb-1">Tổng Số Bản Ghi</p>
                <p className="text-2xl font-bold">12,547</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-sm font-medium mb-1">Lần Sao Lưu Cuối</p>
                <p className="text-2xl font-bold">23/12/2024</p>
              </div>
              <Button className="w-full" variant="outline">Sao Lưu Ngay</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
