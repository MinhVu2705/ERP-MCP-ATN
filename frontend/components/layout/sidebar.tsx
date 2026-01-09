"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  FolderKanban,
  Package,
  Users,
  Settings,
  TrendingUp,
  Receipt,
  Database,
  Bot,
  Warehouse,
  Truck,
  ShoppingCart,
  Briefcase,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Dự Án", href: "/projects", icon: FolderKanban },
  { name: "Giao Dịch Kho", href: "/transactions", icon: Receipt },
  { name: "Phân Tích", href: "/analytics", icon: BarChart3 },
  { name: "Dự Báo", href: "/forecast", icon: TrendingUp },
  { name: "Báo Cáo", href: "/reports", icon: FileText },
  { name: "Sản Phẩm", href: "/products", icon: Package },
  { name: "Kho Hàng", href: "/warehouses", icon: Warehouse },
  { name: "Khách Hàng", href: "/customers", icon: Users },
  { name: "Nhà Cung Cấp", href: "/suppliers", icon: Truck },
  { name: "Đơn Bán Hàng", href: "/sales-orders", icon: ShoppingCart },
  { name: "Đơn Mua Hàng", href: "/purchase-orders", icon: Briefcase },
  { name: "Hóa Đơn", href: "/invoices", icon: FileText },
  { name: "Nhân Viên", href: "/employees", icon: Users },
  { name: "Dữ Liệu", href: "/data", icon: Database },
  { name: "AI Assistant", href: "/ai", icon: Bot },
  { name: "Cài Đặt", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  
  console.log('Sidebar rendering, pathname:', pathname)

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ERP-MCP
            </h1>
            <p className="text-xs text-muted-foreground">AI-Powered ERP</p>
          </div>
        </div>
      </div>

      {/* Test indicator */}
      <div className="p-4 bg-green-100 dark:bg-green-900">
        <p className="text-xs font-bold">✓ Sidebar đã render</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto scrollbar-thin">{navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => console.log('Clicked:', item.name, 'href:', item.href)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-4">
          <p className="text-xs font-semibold mb-1">🚀 Pro Tip</p>
          <p className="text-xs text-muted-foreground">
            Dùng AI Assistant để tạo dashboard và phân tích dữ liệu tự động
          </p>
        </div>
      </div>
    </div>
  )
}
