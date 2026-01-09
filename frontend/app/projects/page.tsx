"use client"

import { useEffect, useMemo, useState } from "react"

export const dynamic = 'force-dynamic'

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FolderKanban, Plus, Search } from "lucide-react"
import { API_ENDPOINTS } from "@/lib/api"

type Project = {
  id: string
  name: string
  customer: string
  status: "planning" | "in_progress" | "done" | "blocked"
}

const seedProjects: Project[] = [
  { id: "PRJ-0001", name: "Website ERP Dashboard", customer: "Customer_0001", status: "in_progress" },
  { id: "PRJ-0002", name: "Mobile App MVP", customer: "Customer_0008", status: "planning" },
  { id: "PRJ-0003", name: "Data Pipeline Setup", customer: "Customer_0016", status: "blocked" },
  { id: "PRJ-0004", name: "Invoice Automation", customer: "Customer_0024", status: "done" },
]

function statusLabel(status: Project["status"]) {
  switch (status) {
    case "planning":
      return { text: "Planning", variant: "secondary" as const }
    case "in_progress":
      return { text: "In Progress", variant: "default" as const }
    case "done":
      return { text: "Done", variant: "outline" as const }
    case "blocked":
      return { text: "Blocked", variant: "destructive" as const }
  }
}

export default function ProjectsPage() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState<"api" | "demo">("demo")
  const [apiProjects, setApiProjects] = useState<Project[]>([])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch(API_ENDPOINTS.projects.list, { method: "GET" })
        if (!res.ok) throw new Error("Failed to load projects")

        const data = (await res.json()) as Array<{
          id: number
          projectCode?: string | null
          name: string
          customerName?: string | null
          status?: string | null
        }>

        const mapped: Project[] = (data || []).map((p) => ({
          id: p.projectCode || `PRJ-${String(p.id).padStart(4, "0")}`,
          name: p.name,
          customer: p.customerName || "-",
          status:
            p.status === "planning" ||
            p.status === "in_progress" ||
            p.status === "done" ||
            p.status === "blocked"
              ? (p.status as Project["status"])
              : "planning",
        }))

        if (!cancelled) {
          setApiProjects(mapped)
          setSource("api")
        }
      } catch {
        if (!cancelled) {
          setApiProjects([])
          setSource("demo")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const projects = useMemo(() => {
    const base = source === "api" ? apiProjects : seedProjects
    const q = query.trim().toLowerCase()
    if (!q) return base
    return base.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.customer.toLowerCase().includes(q)
    )
  }, [apiProjects, query, source])

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản Lý Dự Án</h1>
            <p className="text-muted-foreground">Danh sách dự án và trạng thái thực hiện</p>
          </div>
          <Button className="gap-2" disabled>
            <Plus className="h-4 w-4" />
            Thêm Dự Án
          </Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm theo mã dự án, tên dự án, khách hàng..."
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {loading ? (
            <Card className="border-2">
              <CardContent className="p-6 text-sm text-muted-foreground">Đang tải danh sách dự án...</CardContent>
            </Card>
          ) : projects.length === 0 ? (
            <Card className="border-2">
              <CardContent className="p-6 text-sm text-muted-foreground">
                Không có dự án nào.
              </CardContent>
            </Card>
          ) : (
            projects.map((p) => {
              const s = statusLabel(p.status)
              return (
                <Card key={p.id} className="border-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-accent">
                        <FolderKanban className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{p.name}</CardTitle>
                        <div className="text-sm text-muted-foreground">
                          {p.id} • {p.customer}
                        </div>
                      </div>
                    </div>
                    <Badge variant={s.variant}>{s.text}</Badge>
                  </CardHeader>
                </Card>
              )
            })
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ghi chú</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Đang dùng nguồn dữ liệu: <span className="font-medium">{source === "api" ? "Backend API" : "Demo"}</span>.
            Backend có sẵn CRUD tại <span className="font-medium">/api/projects</span>.
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
