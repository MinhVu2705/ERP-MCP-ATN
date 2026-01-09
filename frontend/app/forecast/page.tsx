"use client"

import { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'

import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Calendar, Target, AlertCircle, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { API_ENDPOINTS } from '@/lib/api'

export default function ForecastPage() {
  const [insights, setInsights] = useState<any>(null)
  const [forecastData, setForecastData] = useState<any[]>([])
  const [targets, setTargets] = useState<any[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [insightsRes, revenueRes, targetsRes, recsRes] = await Promise.all([
        fetch(API_ENDPOINTS.forecast.insights),
        fetch(API_ENDPOINTS.forecast.revenue),
        fetch(API_ENDPOINTS.forecast.targets),
        fetch(API_ENDPOINTS.forecast.recommendations)
      ])
      
      const insightsData = await insightsRes.json()
      const revenueData = await revenueRes.json()
      const targetsData = await targetsRes.json()
      const recsData = await recsRes.json()
      
      setInsights(insightsData)
      setForecastData(revenueData.data || [])
      setTargets(targetsData.targets || [])
      setRecommendations(recsData.recommendations || [])
    } catch (error) {
      console.error('Error fetching forecast:', error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dự Báo AI</h1>
          <p className="text-muted-foreground">
            Dự đoán xu hướng kinh doanh với trí tuệ nhân tạo
          </p>
        </div>

        {/* AI Insights */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-2 border-green-500">
            <CardHeader>
              <Badge className="w-fit bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Tích Cực
              </Badge>
              <CardTitle className="mt-2">Dự Báo Q1 2025</CardTitle>
              <CardDescription>Doanh thu kỳ vọng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">+18.5%</div>
              <p className="text-sm text-muted-foreground mt-2">
                Tăng trưởng mạnh dự kiến trong quý tới
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-500">
            <CardHeader>
              <Badge className="w-fit bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                Xu Hướng
              </Badge>
              <CardTitle className="mt-2">Mùa Cao Điểm</CardTitle>
              <CardDescription>Tháng 1-2 năm 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600">Tết 2025</div>
              <p className="text-sm text-muted-foreground mt-2">
                Doanh số dự kiến tăng 35% trong giai đoạn này
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-500">
            <CardHeader>
              <Badge className="w-fit bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                Cảnh Báo
              </Badge>
              <CardTitle className="mt-2">Tồn Kho</CardTitle>
              <CardDescription>Cần chú ý</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-orange-600">-12%</div>
              <p className="text-sm text-muted-foreground mt-2">
                Nguy cơ thiếu hàng cho 3 sản phẩm chủ lực
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Forecast Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Dự Báo Doanh Thu 6 Tháng Tới</CardTitle>
            <CardDescription>Dựa trên dữ liệu lịch sử và AI ML models</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-600" />
                  <span>Doanh thu thực tế</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-600 border-2 border-purple-300" />
                  <span>Dự báo AI</span>
                </div>
              </div>
              
              <div className="h-96 flex items-end justify-between gap-3">
                {[
                  { label: 'T7/24', actual: 85, forecast: null },
                  { label: 'T8/24', actual: 90, forecast: null },
                  { label: 'T9/24', actual: 88, forecast: null },
                  { label: 'T10/24', actual: 95, forecast: null },
                  { label: 'T11/24', actual: 92, forecast: null },
                  { label: 'T12/24', actual: 100, forecast: null },
                  { label: 'T1/25', actual: null, forecast: 105 },
                  { label: 'T2/25', actual: null, forecast: 115 },
                  { label: 'T3/25', actual: null, forecast: 110 },
                  { label: 'T4/25', actual: null, forecast: 108 },
                  { label: 'T5/25', actual: null, forecast: 112 },
                  { label: 'T6/25', actual: null, forecast: 118 }
                ].map((data, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    {data.actual && (
                      <div 
                        className="w-full bg-gradient-to-t from-blue-600 to-cyan-600 rounded-t-lg hover:from-blue-500 hover:to-cyan-500 transition-all cursor-pointer"
                        style={{ height: `${data.actual}%` }}
                      />
                    )}
                    {data.forecast && (
                      <div 
                        className="w-full bg-gradient-to-t from-purple-600/60 to-pink-600/60 rounded-t-lg border-2 border-purple-400 hover:from-purple-500/70 hover:to-pink-500/70 transition-all cursor-pointer"
                        style={{ height: `${data.forecast}%` }}
                      />
                    )}
                    <span className="text-xs text-muted-foreground">{data.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Predictions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Mục Tiêu & Kỳ Vọng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { target: 'Doanh thu Q1 2025', expected: '180M VND', probability: 85, status: 'high' },
                { target: 'Khách hàng mới', expected: '450 KH', probability: 78, status: 'high' },
                { target: 'Tỷ lệ giữ chân', expected: '92%', probability: 65, status: 'medium' },
                { target: 'Mở rộng khu vực', expected: '2 chi nhánh', probability: 45, status: 'low' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border-2 hover:border-primary/50 transition-all">
                  <div className="flex-1">
                    <p className="font-semibold">{item.target}</p>
                    <p className="text-sm text-muted-foreground">{item.expected}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{item.probability}%</p>
                    <Badge variant={item.status === 'high' ? 'default' : item.status === 'medium' ? 'secondary' : 'outline'}>
                      {item.status === 'high' ? 'Cao' : item.status === 'medium' ? 'Trung Bình' : 'Thấp'}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Khuyến Nghị Từ AI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: 'Tăng tồn kho', desc: 'Nhập thêm 200 đơn vị iPhone 15 Pro trước Tết', priority: 'high' },
                { title: 'Khuyến mãi', desc: 'Chạy campaign giảm giá 15% cho Laptop trong T1', priority: 'medium' },
                { title: 'Nhân sự', desc: 'Tuyển thêm 5 nhân viên bán hàng part-time', priority: 'high' },
                { title: 'Marketing', desc: 'Tăng ngân sách Facebook Ads lên 30M/tháng', priority: 'medium' },
                { title: 'Đối tác', desc: 'Mở rộng hợp tác với 3 nhà cung cấp mới', priority: 'low' }
              ].map((rec, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl border hover:border-primary/50 transition-all">
                  <div className={`h-2 w-2 rounded-full mt-2 shrink-0 ${
                    rec.priority === 'high' ? 'bg-red-500' : rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{rec.title}</p>
                    <p className="text-sm text-muted-foreground">{rec.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
