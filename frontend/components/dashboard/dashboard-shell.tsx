"use client"

import { cn } from '@/lib/utils'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
// import { ProtectedRoute } from '@/components/auth/protected-route'
import { useState } from 'react'

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardShell({
  children,
  className,
  ...props
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  console.log('DashboardShell rendering, sidebarOpen:', sidebarOpen)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop - ALWAYS VISIBLE FOR TESTING */}
      <aside className="flex">
        <Sidebar />
      </aside>

      {/* Sidebar - Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <aside className="h-full w-64 bg-background" onClick={(e) => e.stopPropagation()}>
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1">
          <div className="container mx-auto p-6 lg:p-8">
            <div className={cn('space-y-8', className)} {...props}>
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
