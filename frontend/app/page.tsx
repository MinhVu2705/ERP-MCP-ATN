"use client"

import { DashboardShell } from '@/components/dashboard/dashboard-shell'

export const dynamic = 'force-dynamic'
import { KPICards } from '@/components/dashboard/kpi-cards'
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/dashboard')
}

