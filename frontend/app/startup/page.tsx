'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Bot, TrendingUp, Shield, Zap, BarChart3, Users, CheckCircle2, Star } from 'lucide-react'
import Link from 'next/link'

export default function StartupPage() {
  const features = [
    {
      icon: Bot,
      title: 'AI-Powered',
      description: 'Trợ lý AI thông minh tự động phân tích và đưa ra insights',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      title: 'Dự Báo Chính Xác',
      description: 'Dự đoán xu hướng kinh doanh với độ chính xác 98%',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Bảo Mật Tối Đa',
      description: 'Mã hóa end-to-end và tuân thủ GDPR, ISO 27001',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Zap,
      title: 'Tự Động Hóa',
      description: 'Tự động hóa 80% quy trình thủ công, tiết kiệm thời gian',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: BarChart3,
      title: 'Dashboard Trực Quan',
      description: 'Báo cáo real-time với biểu đồ đẹp và dễ hiểu',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Users,
      title: 'Cộng Tác Nhóm',
      description: 'Làm việc nhóm hiệu quả với workspace chia sẻ',
      gradient: 'from-pink-500 to-rose-500'
    }
  ]

  const pricing = [
    {
      name: 'Starter',
      price: '500K',
      period: '/tháng',
      description: 'Phù hợp cho doanh nghiệp nhỏ',
      features: [
        'Tối đa 10 users',
        '5,000 giao dịch/tháng',
        'Dashboard cơ bản',
        'Email support',
        '10GB lưu trữ'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '1.5M',
      period: '/tháng',
      description: 'Cho doanh nghiệp vừa và lớn',
      features: [
        'Không giới hạn users',
        'Không giới hạn giao dịch',
        'AI-powered analytics',
        'Priority support 24/7',
        '500GB lưu trữ',
        'Custom dashboard',
        'API access'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Giải pháp doanh nghiệp toàn diện',
      features: [
        'Tất cả tính năng Pro',
        'Dedicated account manager',
        'Custom integrations',
        'On-premise deployment',
        'SLA 99.99%',
        'Advanced security',
        'Training & onboarding'
      ],
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">ERP-MCP</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Tính Năng
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Bảng Giá
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Đánh Giá
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/login">Đăng Nhập</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Dùng Thử Miễn Phí</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-cyan-950/20"></div>
        <div className="absolute top-0 right-0 -mt-40 -mr-40 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-40 -ml-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <Badge className="px-4 py-2 text-sm">
              <Star className="h-4 w-4 mr-2 fill-current" />
              Được tin dùng bởi 1000+ doanh nghiệp
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Hệ Thống ERP
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Được Hỗ Trợ Bởi AI
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tối ưu hóa quy trình kinh doanh, tăng năng suất và tăng trưởng doanh thu với sức mạnh của trí tuệ nhân tạo
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-14 px-8 text-lg" asChild>
                <Link href="/signup">
                  Bắt Đầu Miễn Phí
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
                Xem Demo
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">98%</div>
                <div className="text-sm text-muted-foreground mt-1">Độ chính xác AI</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">50K+</div>
                <div className="text-sm text-muted-foreground mt-1">Giao dịch/ngày</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">24/7</div>
                <div className="text-sm text-muted-foreground mt-1">Hỗ trợ AI</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4">Tính Năng</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Tại Sao Chọn ERP-MCP?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Giải pháp ERP toàn diện với công nghệ AI tiên tiến
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className={`p-3 w-fit rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4">Bảng Giá</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Chọn Gói Phù Hợp</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Giá cả linh hoạt, phù hợp mọi quy mô doanh nghiệp
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricing.map((plan, index) => (
              <Card key={index} className={`relative border-2 ${plan.popular ? 'border-primary shadow-2xl scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1">
                      Phổ Biến Nhất
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <Button className="w-full h-12" variant={plan.popular ? 'default' : 'outline'} asChild>
                    <Link href="/signup">
                      {plan.name === 'Enterprise' ? 'Liên Hệ' : 'Bắt Đầu'}
                    </Link>
                  </Button>
                  <ul className="mt-8 space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Sẵn Sàng Chuyển Đổi Số?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Hơn 1000+ doanh nghiệp đã tin tưởng và sử dụng ERP-MCP. Hãy là người tiếp theo!
          </p>
          <Button size="lg" variant="secondary" className="h-14 px-8 text-lg" asChild>
            <Link href="/signup">
              Dùng Thử Miễn Phí 30 Ngày
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">ERP-MCP</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 ERP-MCP. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="hover:text-primary transition-colors">Điều khoản</Link>
              <Link href="#" className="hover:text-primary transition-colors">Bảo mật</Link>
              <Link href="#" className="hover:text-primary transition-colors">Liên hệ</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
