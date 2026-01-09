"use client"

import { DashboardShell } from '@/components/dashboard/dashboard-shell'

export const dynamic = 'force-dynamic'
import ChatBot from '@/components/chatbot'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bot, Sparkles, Zap } from 'lucide-react'

export default function AIPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 p-8 text-white shadow-2xl">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur">
                <Bot className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold">AI Assistant</h1>
            </div>
            <p className="text-lg text-white/90 max-w-2xl">
              Trợ lý AI thông minh giúp bạn phân tích dữ liệu, tạo dashboard, dự báo xu hướng và trả lời mọi câu hỏi về hệ thống ERP
            </p>
          </div>
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
        </div>

        {/* Features */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="p-2 w-fit rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 mb-2">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <CardTitle>Phân Tích Thông Minh</CardTitle>
              <CardDescription>
                AI tự động phân tích dữ liệu và đưa ra insights có giá trị
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="p-2 w-fit rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-2">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <CardTitle>Dashboard Tự Động</CardTitle>
              <CardDescription>
                Tạo dashboard trực quan chỉ bằng câu lệnh đơn giản
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="p-2 w-fit rounded-xl bg-gradient-to-br from-orange-500 to-red-500 mb-2">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <CardTitle>Dự Báo Xu Hướng</CardTitle>
              <CardDescription>
                Dự đoán doanh thu và xu hướng kinh doanh với AI
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Main ChatBot */}
        <ChatBot />

        {/* Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Ví Dụ Câu Hỏi</CardTitle>
            <CardDescription>Thử hỏi AI những câu sau để trải nghiệm</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="p-4 rounded-xl border-2 hover:border-primary transition-colors cursor-pointer">
                <p className="font-medium mb-1">📊 Tạo Dashboard</p>
                <p className="text-sm text-muted-foreground">"Tạo dashboard top 10 sản phẩm bán chạy nhất"</p>
              </div>
              <div className="p-4 rounded-xl border-2 hover:border-primary transition-colors cursor-pointer">
                <p className="font-medium mb-1">💰 Phân Tích Doanh Thu</p>
                <p className="text-sm text-muted-foreground">"Phân tích doanh thu theo phòng ban tháng này"</p>
              </div>
              <div className="p-4 rounded-xl border-2 hover:border-primary transition-colors cursor-pointer">
                <p className="font-medium mb-1">📈 Dự Báo</p>
                <p className="text-sm text-muted-foreground">"Dự báo doanh thu quý 4 năm nay"</p>
              </div>
              <div className="p-4 rounded-xl border-2 hover:border-primary transition-colors cursor-pointer">
                <p className="font-medium mb-1">🔍 Tìm Kiếm</p>
                <p className="text-sm text-muted-foreground">"Tìm các giao dịch có giá trị trên 10 triệu"</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
