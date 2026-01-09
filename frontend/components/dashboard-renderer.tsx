"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts"
import { TrendingUp, DollarSign, ShoppingCart, Users } from "lucide-react"

interface ChartConfig {
  type: "line" | "bar" | "pie" | "kpi" | "table"
  title: string
  dataSource?: string
  metrics?: string[]
  groupBy?: string
  filters?: Record<string, any>
  aggregation?: "sum" | "avg" | "count"
  limit?: number
  data?: any[]
  columns?: string[]
}

interface DashboardConfig {
  title: string
  period?: string
  charts: ChartConfig[]
}

interface DashboardRendererProps {
  config: DashboardConfig
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

// Sample data generator for demo
const generateSampleData = (chart: ChartConfig) => {
  if (chart.data) return chart.data

  const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
  
  if (chart.type === "line" || chart.type === "bar") {
    return months.map((month, i) => ({
      name: month,
      revenue: Math.floor(Math.random() * 500000000) + 300000000,
      profit: Math.floor(Math.random() * 200000000) + 100000000,
      cost: Math.floor(Math.random() * 300000000) + 150000000,
    }))
  }
  
  if (chart.type === "pie") {
    const departments = ['Sales', 'Marketing', 'Operations', 'IT', 'Finance']
    return departments.map(dept => ({
      name: dept,
      value: Math.floor(Math.random() * 300000000) + 100000000
    }))
  }
  
  if (chart.type === "table") {
    const products = ['Laptop Dell XPS', 'iPhone 15 Pro', 'Samsung Galaxy S24', 'MacBook Pro M3', 
                      'Sony WH-1000XM5', 'iPad Air', 'AirPods Pro', 'ThinkPad X1', 'Surface Pro 9', 'Magic Mouse']
    return products.map((product, i) => ({
      name: product,
      value: Math.floor(Math.random() * 100000000) + 50000000,
      change: ((Math.random() - 0.5) * 40).toFixed(1) + '%'
    }))
  }

  return []
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value)
}

const KPICard = ({ title, value, icon: Icon, trend }: any) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{formatCurrency(value)}</div>
      {trend && (
        <p className="text-xs text-muted-foreground mt-1">
          <span className={trend > 0 ? "text-green-600" : "text-red-600"}>
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span> so với kỳ trước
        </p>
      )}
    </CardContent>
  </Card>
)

const ChartRenderer = ({ chart }: { chart: ChartConfig }) => {
  const data = generateSampleData(chart)

  if (chart.type === "kpi") {
    const icons = [DollarSign, TrendingUp, ShoppingCart, Users]
    const Icon = icons[Math.floor(Math.random() * icons.length)]
    const value = Math.floor(Math.random() * 500000000) + 300000000
    const trend = ((Math.random() - 0.5) * 40)
    
    return <KPICard title={chart.title} value={value} icon={Icon} trend={trend} />
  }

  if (chart.type === "table") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{chart.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted">
                <tr>
                  <th className="px-6 py-3">Sản phẩm</th>
                  <th className="px-6 py-3">Doanh thu</th>
                  <th className="px-6 py-3">Thay đổi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row: any, i: number) => (
                  <tr key={i} className="border-b">
                    <td className="px-6 py-4 font-medium">{row.name}</td>
                    <td className="px-6 py-4">{formatCurrency(row.value)}</td>
                    <td className={`px-6 py-4 ${row.change.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>
                      {row.change}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{chart.title}</CardTitle>
        {chart.groupBy && (
          <CardDescription>Nhóm theo: {chart.groupBy}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {chart.type === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip 
                formatter={(value: any) => formatCurrency(value)}
                labelStyle={{ color: '#000' }}
              />
              <Legend />
              {chart.metrics?.includes('revenue') && <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Doanh thu" strokeWidth={2} />}
              {chart.metrics?.includes('profit') && <Line type="monotone" dataKey="profit" stroke="#10b981" name="Lợi nhuận" strokeWidth={2} />}
              {chart.metrics?.includes('cost') && <Line type="monotone" dataKey="cost" stroke="#f59e0b" name="Chi phí" strokeWidth={2} />}
            </LineChart>
          ) : chart.type === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip 
                formatter={(value: any) => formatCurrency(value)}
                labelStyle={{ color: '#000' }}
              />
              <Legend />
              {chart.metrics?.includes('revenue') && <Bar dataKey="revenue" fill="#3b82f6" name="Doanh thu" />}
              {chart.metrics?.includes('profit') && <Bar dataKey="profit" fill="#10b981" name="Lợi nhuận" />}
              {chart.metrics?.includes('cost') && <Bar dataKey="cost" fill="#f59e0b" name="Chi phí" />}
            </BarChart>
          ) : chart.type === "pie" ? (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => formatCurrency(value)} />
            </PieChart>
          ) : (
            <div>Unsupported chart type</div>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default function DashboardRenderer({ config }: DashboardRendererProps) {
  return (
    <div className="space-y-6 w-full">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{config.title}</h2>
          {config.period && (
            <p className="text-muted-foreground">Chu kỳ: {config.period}</p>
          )}
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {config.charts.map((chart, index) => (
          <div 
            key={index} 
            className={
              chart.type === "table" || chart.type === "line" || chart.type === "bar"
                ? "md:col-span-2 lg:col-span-3"
                : chart.type === "pie"
                ? "md:col-span-2 lg:col-span-2"
                : ""
            }
          >
            <ChartRenderer chart={chart} />
          </div>
        ))}
      </div>
    </div>
  )
}
