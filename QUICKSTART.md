# ERP-MCP Quick Start Guide

## 🚀 Khởi động nhanh với Docker Compose

### Bước 1: Cấu hình môi trường

```bash
# Sao chép file environment mẫu
cp .env.example .env

# Chỉnh sửa file .env và thêm các API keys
# - OPENAI_API_KEY: Key cho OpenAI GPT-4
# - GOOGLE_API_KEY: Key cho Google Custom Search (tùy chọn)
```

### Bước 2: Khởi động tất cả services

```bash
# Build và khởi động tất cả containers
docker-compose up -d

# Kiểm tra trạng thái
docker-compose ps
```

### Bước 3: Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **MCP Orchestrator API**: http://localhost:8000
- **AI Engine API**: http://localhost:8001
- **Document API**: http://localhost:8002
- **ERP Core API**: http://localhost:8080
- **Grafana Dashboard**: http://localhost:3001 (admin/admin123)
- **Prometheus**: http://localhost:9090

## 📊 Sử dụng các tính năng

### 1. Dashboard Điều Hành
Mở http://localhost:3000 để xem:
- KPI tổng quan (doanh thu, lợi nhuận, đơn hàng, tồn kho)
- Biểu đồ doanh thu 9 tháng
- AI Insights và dự báo
- Hoạt động gần đây

### 2. Hỏi đáp thông minh
API endpoint: `POST http://localhost:8000/api/chat`

Ví dụ câu hỏi:
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Doanh thu tháng 9 là bao nhiêu?"}'
```

### 3. Dự báo doanh thu
API endpoint: `POST http://localhost:8001/api/forecast`

```bash
curl -X POST http://localhost:8001/api/forecast \
  -H "Content-Type: application/json" \
  -d '{"period": "Q4"}'
```

### 4. Document Q&A
Upload và hỏi đáp tài liệu:

```bash
# Index document
curl -X POST http://localhost:8002/api/search/index \
  -H "Content-Type: application/json" \
  -d '{"content": "Sản phẩm A là cảm biến nhiệt...", "metadata": {"id": "doc1"}}'

# Query document
curl -X POST http://localhost:8002/api/qa/query \
  -H "Content-Type: application/json" \
  -d '{"question": "Sản phẩm A là gì?"}'
```

## 🔧 Development Mode

### Frontend Development
```bash
cd frontend
npm install
npm run dev
# Truy cập: http://localhost:3000
```

### MCP Orchestrator Development
```bash
cd services/mcp-orchestrator
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### AI Engine Development
```bash
cd services/ai-engine
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

### ERP Core Development
```bash
cd services/erp-core
./mvnw spring-boot:run
# Hoặc Windows: mvnw.cmd spring-boot:run
```

## 🐛 Troubleshooting

### Port đã được sử dụng
```bash
# Kiểm tra ports
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# Dừng container cũ
docker-compose down
```

### Database connection error
```bash
# Xóa volumes và khởi động lại
docker-compose down -v
docker-compose up -d
```

### OpenAI API errors
- Kiểm tra OPENAI_API_KEY trong .env
- Đảm bảo có credit trong tài khoản OpenAI
- Kiểm tra model name (gpt-4-turbo-preview)

## 📝 API Documentation

Truy cập Swagger/OpenAPI docs:
- MCP Orchestrator: http://localhost:8000/docs
- AI Engine: http://localhost:8001/docs
- Document API: http://localhost:8002/docs
- ERP Core: http://localhost:8080/swagger-ui.html

## 🎯 Use Cases Demo

### Use Case 1: Báo cáo doanh thu
```bash
curl http://localhost:8080/api/revenue/summary
```

### Use Case 2: Dự báo AI
```bash
curl -X POST http://localhost:8001/api/forecast \
  -H "Content-Type: application/json" \
  -d '{"period": "Q4", "historical_data": []}'
```

### Use Case 3: Chat với ERP
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tồn kho sản phẩm A?"}'
```

### Use Case 6: Dashboard KPI
```bash
curl http://localhost:8080/api/dashboard/kpi
```

## 📚 Tài liệu thêm

- [Architecture Documentation](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Contributing Guide](./docs/CONTRIBUTING.md)

## 💡 Tips

1. **Monitoring**: Sử dụng Grafana để theo dõi performance
2. **Logs**: `docker-compose logs -f [service-name]`
3. **Database**: Truy cập PostgreSQL qua pgAdmin hoặc CLI
4. **Redis**: Sử dụng redis-cli để debug cache

## 🔒 Security Notes

- Đổi tất cả passwords mặc định trong production
- Sử dụng HTTPS cho production deployment
- Bảo mật API keys và secrets
- Cấu hình firewall và network policies

## 📞 Support

- GitHub Issues: [Create an issue](https://github.com/your-org/ERP-MCP/issues)
- Email: support@erp-mcp.com
- Slack: [Join our channel](https://erp-mcp.slack.com)
