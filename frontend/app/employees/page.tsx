"use client"

import { useEffect, useState } from "react"

export const dynamic = 'force-dynamic'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, Briefcase, UserCheck } from "lucide-react"
import { API_ENDPOINTS, apiFetch } from "@/lib/api"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [departments, setDepartments] = useState<string[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesData, statsData, departmentsData] = await Promise.all([
          apiFetch<any[]>(API_ENDPOINTS.employees.list),
          apiFetch<any>(API_ENDPOINTS.employees.stats),
          apiFetch<string[]>(API_ENDPOINTS.employees.departments),
        ])

        setEmployees(employeesData)
        setStats(statsData)
        setDepartments(departmentsData)
      } catch (error) {
        console.error("Error fetching employees:", error)
      }
    }

    fetchData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  const handleSaveEmployee = async () => {
    if (!selectedEmployee) return
    try {
      const updated = await apiFetch<any>(
        `${API_ENDPOINTS.employees.list}/${selectedEmployee.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(selectedEmployee),
        }
      )

      setEmployees((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
      const newStats = await apiFetch<any>(API_ENDPOINTS.employees.stats)
      setStats(newStats)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating employee:', error)
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Nhân Viên</h1>
          <p className="text-muted-foreground">Quản lý nhân sự trong công ty</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Thêm Nhân Viên</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng NV</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang Làm Việc</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang Nghỉ</CardTitle>
            <Briefcase className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.onLeave || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số Phòng Ban</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Nhân Viên</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Mã NV</th>
                <th className="text-left p-4">Họ Tên</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Phòng Ban</th>
                <th className="text-left p-4">Chức Vụ</th>
                <th className="text-left p-4">Lương</th>
                <th className="text-left p-4">Trạng Thái</th>
                <th className="text-right p-4">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? employees.map(emp => (
                <tr key={emp.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{emp.employeeId}</td>
                  <td className="p-4">{emp.firstName} {emp.lastName}</td>
                  <td className="p-4">{emp.email}</td>
                  <td className="p-4">{emp.department}</td>
                  <td className="p-4">{emp.position}</td>
                  <td className="p-4">{formatCurrency(emp.salary || 0)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      emp.status === 'active' ? 'bg-green-100 text-green-800' :
                      emp.status === 'on-leave' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEmployee(emp)
                          setIsEditing(false)
                        }}
                      >
                        Chi tiết
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEmployee(emp)
                          setIsEditing(true)
                        }}
                      >
                        Chỉnh sửa
                      </Button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">Chưa có nhân viên</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
      {selectedEmployee && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>{isEditing ? 'Chỉnh Sửa Nhân Viên' : 'Chi Tiết Nhân Viên'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Họ tên</Label>
                <Input
                  value={`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}
                  onChange={(e) => {
                    const [firstName, ...rest] = e.target.value.split(" ")
                    const lastName = rest.join(" ")
                    setSelectedEmployee({ ...selectedEmployee, firstName, lastName })
                    setIsEditing(true)
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={selectedEmployee.email}
                  onChange={(e) => {
                    setSelectedEmployee({ ...selectedEmployee, email: e.target.value })
                    setIsEditing(true)
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Phòng ban</Label>
                <Input
                  value={selectedEmployee.department}
                  onChange={(e) => {
                    setSelectedEmployee({ ...selectedEmployee, department: e.target.value })
                    setIsEditing(true)
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Chức vụ</Label>
                <Input
                  value={selectedEmployee.position}
                  onChange={(e) => {
                    setSelectedEmployee({ ...selectedEmployee, position: e.target.value })
                    setIsEditing(true)
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedEmployee(null)
                  setIsEditing(false)
                }}
              >
                Đóng
              </Button>
              <Button onClick={handleSaveEmployee} disabled={!isEditing}>
                Lưu
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Thay đổi sẽ được gửi lên API và lưu vào cơ sở dữ liệu.
            </p>
          </CardContent>
        </Card>
      )}
      </div>
    </DashboardShell>
  )
}
