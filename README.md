# ERP-MCP: AI-Powered Enterprise Resource Planning System

## 🌟 Overview

An intelligent ERP system combining traditional business management with cutting-edge AI capabilities through the Model Context Protocol (MCP).

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
│              Dashboard │ Chatbot │ Reports │ Q&A             │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌───────▼────────┐   ┌───────▼────────┐
│  MCP           │   │  AI Engine     │   │  Document API  │
│  Orchestrator  │   │  (FastAPI)     │   │  (Python)      │
│  (Python)      │   │                │   │                │
│  - Intent      │   │  - NLP/LLM     │   │  - OCR         │
│  - Workflow    │   │  - Forecasting │   │  - Semantic    │
│  - API Gateway │   │  - Reporting   │   │  - Contract Q&A│
└────────────────┘   └────────────────┘   └────────────────┘
        │
┌───────▼────────┐
│  ERP Core      │
│  (Spring Boot) │
│  - Finance     │
│  - Inventory   │
│  - HR          │
│  - Sales       │
└────────────────┘
```

## 📦 Components

| Component | Technology | Role |
|-----------|-----------|------|
| **Frontend** | Next.js + Tailwind + shadcn/ui | Dashboard, Chatbot, Reports, Q&A |
| **ERP Core** | Java (Spring Boot) | Traditional business operations |
| **AI Engine** | Python (FastAPI) | NLP, LLM, Forecasting, Reporting |
| **MCP Orchestrator** | Python | Intent understanding, workflow execution, API orchestration |
| **Document API** | Python | OCR, Semantic Search, Contract Q&A |
| **Infrastructure** | Docker + Kubernetes + CI/CD | DevOps, scaling, monitoring |

## 🎯 Use Cases

### 1. Revenue Management & Financial Reporting
- **Goal**: Automatically aggregate revenue, expenses, profit and display visual reports
- **Users**: Accountants, Executives
- **Features**: Real-time KPI dashboards, automated report generation
- **Example**: "Show me September revenue" → "September revenue reached 2.1 billion, up 10% from August"

### 2. AI Revenue Forecasting
- **Goal**: Predict revenue trends using machine learning for strategic decisions
- **Users**: Managers, Executives
- **Features**: LSTM/Prophet models, trend analysis
- **Example**: "What's Q4 revenue forecast?" → "Expected to increase 12.5% from Q3, approximately 3.2 billion VND"

### 3. Intelligent Q&A on ERP Data
- **Goal**: Query ERP data using natural language
- **Users**: All staff
- **Features**: NLQ (Natural Language Query), RAG engine
- **Example**: "Product A revenue in September?" → "Product A revenue in September was 850 million VND, up 12%"

### 4. Executive Dashboard
- **Goal**: Overview KPIs for enterprise management (finance, HR, inventory, production)
- **Users**: Executive Board
- **Features**: Real-time KPI monitoring, alerts, interactive chatbot
- **Example**: "Marketing costs this quarter?" → "Q3 marketing costs 420 million, 92% of budget"

### 5. Document Q&A
- **Goal**: Enable Q&A on internal documents (contracts, processes, reports)
- **Users**: All staff
- **Features**: RAG + Google Search fallback, document indexing
- **Example**: "What is Product A?" → Returns info from internal docs or searches online

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- Java 17+
- Docker & Docker Compose
- PostgreSQL 15+

### Quick Start

```bash
# Clone repository
git clone https://github.com/your-org/ERP-MCP.git
cd ERP-MCP

# Start all services with Docker Compose
docker-compose up -d

# Access services
# Frontend: http://localhost:3000
# MCP Orchestrator: http://localhost:8000
# AI Engine: http://localhost:8001
# Document API: http://localhost:8002
# ERP Core: http://localhost:8080
```

### Development Setup

#### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

#### MCP Orchestrator
```bash
cd services/mcp-orchestrator
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### AI Engine
```bash
cd services/ai-engine
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

#### Document API
```bash
cd services/document-api
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8002
```

#### ERP Core
```bash
cd services/erp-core
./mvnw spring-boot:run
```

## 🗂️ Project Structure

```
ERP-MCP/
├── frontend/                    # Next.js application
│   ├── app/                    # Next.js 13+ app directory
│   ├── components/             # React components
│   ├── lib/                    # Utilities
│   └── public/                 # Static assets
├── services/
│   ├── mcp-orchestrator/       # MCP service
│   ├── ai-engine/              # AI/ML service
│   ├── document-api/           # Document processing
│   └── erp-core/               # Java Spring Boot
├── infrastructure/
│   ├── kubernetes/             # K8s manifests
│   ├── terraform/              # Infrastructure as Code
│   └── monitoring/             # Prometheus, Grafana configs
├── docker-compose.yml
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create `.env` files in each service directory:

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MCP_WS=ws://localhost:8000/ws
```

**MCP Orchestrator (.env)**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/erp_mcp
ERP_CORE_URL=http://erp-core:8080
AI_ENGINE_URL=http://ai-engine:8001
DOCUMENT_API_URL=http://document-api:8002
OPENAI_API_KEY=your_key_here
```

**AI Engine (.env)**
```env
MODEL_NAME=gpt-4
DATABASE_URL=postgresql://user:password@localhost:5432/erp_mcp
```

**ERP Core (application.properties)**
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/erp_core
spring.datasource.username=user
spring.datasource.password=password
```

## 📊 Tech Stack Details

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: High-quality component library
- **React Query**: Data fetching & caching
- **Zustand**: State management

### Backend Services
- **FastAPI**: High-performance Python API framework
- **LangChain**: LLM orchestration
- **OpenAI GPT-4**: Natural language processing
- **Prophet/LSTM**: Time series forecasting
- **ChromaDB**: Vector database for RAG
- **Spring Boot**: Enterprise Java framework

### Infrastructure
- **PostgreSQL**: Primary database
- **Redis**: Caching layer
- **Docker**: Containerization
- **Kubernetes**: Orchestration
- **Nginx**: Reverse proxy
- **Prometheus + Grafana**: Monitoring

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Python services tests
cd services/mcp-orchestrator
pytest

# Java tests
cd services/erp-core
./mvnw test
```

## 📈 Monitoring & Observability

- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboards
- **ELK Stack**: Log aggregation
- **Jaeger**: Distributed tracing

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Product Owner**: [Name]
- **Tech Lead**: [Name]
- **Frontend Team**: [Names]
- **Backend Team**: [Names]
- **AI/ML Team**: [Names]

## 📞 Support

For support, email support@erp-mcp.com or join our Slack channel.
