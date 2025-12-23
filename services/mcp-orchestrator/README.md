# MCP Orchestrator Service

Intent understanding, workflow execution, and API orchestration service.

## Features

- **Intent Detection**: Understand user queries and route to appropriate services
- **Workflow Orchestration**: Coordinate multi-step processes across services
- **API Gateway**: Single entry point for frontend applications
- **Real-time Chat**: WebSocket support for interactive conversations

## API Endpoints

### Chat
- `POST /api/chat` - Process user chat messages

### Analytics
- `GET /api/analytics/revenue` - Get revenue data
- `GET /api/analytics/kpi` - Get KPI metrics
- `GET /api/analytics/forecast` - Get revenue forecast

### Workflow
- `POST /api/workflow/execute` - Execute workflow
- `GET /api/workflow/{id}` - Get workflow status

## Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload --port 8000
```

## Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/erp_mcp
REDIS_URL=redis://localhost:6379
ERP_CORE_URL=http://erp-core:8080
AI_ENGINE_URL=http://ai-engine:8001
DOCUMENT_API_URL=http://document-api:8002
OPENAI_API_KEY=your_key
```
