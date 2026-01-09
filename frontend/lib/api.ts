// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export const API_ENDPOINTS = {
  // Dashboard
  dashboard: {
    kpi: `${API_BASE_URL}/api/dashboard/kpi`,
  },

  // Projects
  projects: {
    list: `${API_BASE_URL}/api/projects`,
    stats: `${API_BASE_URL}/api/projects/stats`,
  },
  
  // Transactions
  transactions: {
    list: `${API_BASE_URL}/api/transactions`,
    analytics: `${API_BASE_URL}/api/transactions/analytics`,
  },
  
  // Products
  products: {
    list: `${API_BASE_URL}/api/products`,
    stats: `${API_BASE_URL}/api/products/stats`,
    topSelling: `${API_BASE_URL}/api/products/top-selling`,
    categories: `${API_BASE_URL}/api/products/categories`,
  },
  
  // Customers
  customers: {
    list: `${API_BASE_URL}/api/customers`,
    stats: `${API_BASE_URL}/api/customers/stats`,
    top: `${API_BASE_URL}/api/customers/top`,
    vip: `${API_BASE_URL}/api/customers/vip`,
    segments: `${API_BASE_URL}/api/customers/segments`,
  },
  
  // Reports
  reports: {
    list: `${API_BASE_URL}/api/reports`,
    recent: `${API_BASE_URL}/api/reports/recent`,
    types: `${API_BASE_URL}/api/reports/types`,
  },
  
  // Forecast
  forecast: {
    insights: `${API_BASE_URL}/api/forecast/insights`,
    revenue: `${API_BASE_URL}/api/forecast/revenue`,
    targets: `${API_BASE_URL}/api/forecast/targets`,
    recommendations: `${API_BASE_URL}/api/forecast/recommendations`,
  },
  
  // Data Import
  data: {
    upload: `${API_BASE_URL}/api/data/upload-csv`,
  },
  
  // Sales Orders
  salesOrders: {
    list: `${API_BASE_URL}/api/sales-orders`,
    stats: `${API_BASE_URL}/api/sales-orders/stats`,
    recent: `${API_BASE_URL}/api/sales-orders/recent`,
  },
  
  // Invoices
  invoices: {
    list: `${API_BASE_URL}/api/invoices`,
    stats: `${API_BASE_URL}/api/invoices/stats`,
    overdue: `${API_BASE_URL}/api/invoices/overdue`,
    recent: `${API_BASE_URL}/api/invoices/recent`,
  },
  
  // Suppliers
  suppliers: {
    list: `${API_BASE_URL}/api/suppliers`,
    stats: `${API_BASE_URL}/api/suppliers/stats`,
    top: `${API_BASE_URL}/api/suppliers/top`,
    preferred: `${API_BASE_URL}/api/suppliers/preferred`,
  },
  
  // Purchase Orders
  purchaseOrders: {
    list: `${API_BASE_URL}/api/purchase-orders`,
    stats: `${API_BASE_URL}/api/purchase-orders/stats`,
    pending: `${API_BASE_URL}/api/purchase-orders/pending`,
    recent: `${API_BASE_URL}/api/purchase-orders/recent`,
  },
  
  // Employees
  employees: {
    list: `${API_BASE_URL}/api/employees`,
    stats: `${API_BASE_URL}/api/employees/stats`,
    departments: `${API_BASE_URL}/api/employees/departments`,
    active: `${API_BASE_URL}/api/employees/active`,
  },
  
  // Warehouses
  warehouses: {
    list: `${API_BASE_URL}/api/warehouses`,
    stats: `${API_BASE_URL}/api/warehouses/stats`,
    active: `${API_BASE_URL}/api/warehouses/active`,
  },
  
  // MCP Chat
  chat: `${process.env.NEXT_PUBLIC_MCP_URL || 'http://localhost:8000'}/api/chat`,
}

// Generic fetch wrapper with error handling
export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API Fetch Error:', error)
    throw error
  }
}
