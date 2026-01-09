# ERP-MCP: AI-Powered Enterprise Resource Planning

Hệ thống ERP tích hợp AI sử dụng Model Context Protocol (MCP) để quản lý doanh nghiệp thông minh.

## 🚀 Quick Start

### Yêu cầu
- Docker & Docker Compose
- Node.js 18+ (cho frontend development)
- Java 21+ (cho backend development)
- Python 3.11+ (cho AI services)

### Khởi động hệ thống

```bash
# 1. Clone repository
git clone <repository-url>
cd ERP-MCP

# 2. Tạo file .env từ template
cp .env.example .env

# 3. Cấu hình Google OAuth (nếu cần)
# Thêm GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET vào .env

# 4. Khởi động tất cả services
docker-compose up -d

# 5. Truy cập ứng dụng
# Frontend: http://localhost:3000
# ERP Core API: http://localhost:8080
# MCP Orchestrator: http://localhost:8000
# AI Engine: http://localhost:8001
# Document API: http://localhost:8002
```

### Kiểm tra trạng thái

```bash
docker-compose ps
docker-compose logs -f [service-name]
```

## 🏗️ Kiến trúc

```
┌──────────────────────────────────────────────┐
│         Frontend (Next.js + React)           │
│     Dashboard | Chat | Reports | Analytics   │
└────────────────┬─────────────────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼───────┐ ┌─▼────────┐ ┌─▼──────────┐
│  MCP      │ │ AI       │ │ Document   │
│  Orch.    │ │ Engine   │ │ API        │
│ (Python)  │ │(Python)  │ │ (Python)   │
└───┬───────┘ └──────────┘ └────────────┘
    │
┌───▼──────────┐
│  ERP Core    │
│ (Spring Boot)│
│   + PostgreSQL│
└──────────────┘
```

## 📦 Services

| Service | Port | Mô tả |
|---------|------|-------|
| **Frontend** | 3000 | Giao diện web Next.js với TailwindCSS |
| **ERP Core** | 8080 | API backend Spring Boot (Finance, HR, Inventory, Sales) |
| **MCP Orchestrator** | 8000 | Điều phối workflow và intent understanding |
| **AI Engine** | 8001 | NLP, forecasting, báo cáo tự động |
| **Document API** | 8002 | OCR, semantic search, Q&A documents |
| **PostgreSQL** | 5432 | Database chính |
| **Redis** | 6379 | Cache và session |
| **MinIO** | 9000 | Object storage (S3-compatible) |
| **ChromaDB** | 8003 | Vector database cho semantic search |

## 🎯 Tính năng chính

### 1. **Dashboard Thông minh**
- Tổng quan tài chính, doanh thu, chi phí realtime
- Biểu đồ trực quan với Recharts
- KPI cards và recent activities

### 2. **AI Chatbot**
- Trò chuyện tự nhiên bằng tiếng Việt/Anh
- Truy vấn dữ liệu ERP qua câu hỏi
- Tích hợp Google Gemini AI

### 3. **Document Management**
- Upload và OCR tự động
- Semantic search qua vector database
- Q&A trên documents (hợp đồng, báo cáo)

### 4. **Forecasting**
- Dự báo doanh thu sử dụng Prophet
- Phân tích xu hướng
- Recommendations tự động

### 5. **Reporting**
- Tạo báo cáo tự động bằng AI
- Export PDF/Excel
- Scheduled reports

## 🔧 Development

### Frontend
```bash
cd frontend
npm install
npm run dev
# http://localhost:3000
```

### Backend Services
```bash
# Python services
cd services/[service-name]
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port [PORT]

# Java service
cd services/erp-core
mvn spring-boot:run
```

### Database
```bash
# Init database
docker-compose up -d postgres
psql -h localhost -U erp_user -d erp_db -f infrastructure/database/init.sql
```

## 🧪 Testing

```bash
# Run all tests
docker-compose -f docker-compose.yml -f docker-compose.test.yml up --abort-on-container-exit

# Specific service
cd services/[service-name]
pytest tests/ -v
```

## 🔐 Authentication

Hệ thống sử dụng NextAuth.js với Google OAuth:

1. Tạo Google OAuth credentials tại [Google Cloud Console](https://console.cloud.google.com)
2. Thêm Redirect URI: `http://localhost:3000/api/auth/callback/google`
3. Cập nhật `.env`:
```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## 📊 Demo Data

```bash
# Load demo data
docker exec -it erp-core java -jar app.jar --spring.profiles.active=demo
```

Demo data bao gồm: 1000 customers, products, transactions, employees, suppliers, warehouses.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Spring Boot 3.5, Java 21
- **AI/ML**: FastAPI, LangChain, Google Gemini, Prophet, TensorFlow
- **Database**: PostgreSQL 15, Redis 7, ChromaDB
- **Infrastructure**: Docker, Docker Compose, Nginx
- **Storage**: MinIO (S3-compatible)

## 📝 Environment Variables

```env
# Database
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=erp_db
POSTGRES_USER=erp_user
POSTGRES_PASSWORD=erp_password

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# AI
GOOGLE_API_KEY=your-gemini-api-key

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# MinIO
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
```

## 🐛 Troubleshooting

### Services không healthy
```bash
docker-compose ps
docker logs [service-name]
```

### Port conflicts
```bash
# Kiểm tra ports đang dùng
netstat -ano | findstr :[PORT]
# Hoặc thay đổi port trong docker-compose.yml
```

### Database connection errors
```bash
docker-compose restart postgres
docker exec -it erp-postgres psql -U erp_user -d erp_db
```

### Frontend build errors
```bash
cd frontend
rm -rf node_modules .next
npm install
npm run build
```

## 📄 License

MIT License

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Phát triển bởi**: ERP-MCP Team  
**Version**: 1.0.0  
**Last Updated**: January 2026
