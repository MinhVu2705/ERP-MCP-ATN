import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { KPICards } from '@/components/dashboard/kpi-cards'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { AIInsights } from '@/components/dashboard/ai-insights'

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Điều Hành</h1>
          <p className="text-muted-foreground">
            Tổng quan KPI và hiệu suất doanh nghiệp
          </p>
        </div>

        {/* KPI Cards */}
        <KPICards />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Revenue Chart */}
          <RevenueChart />

          {/* AI Insights */}
          <AIInsights />
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </DashboardShell>
  )
}
