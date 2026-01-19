# API Key Rotation System - Usage Guide

## Tổng quan
Hệ thống đã được cấu hình với **5 API keys của Gemini** và tự động xoay vòng khi một key hết hạn quota.

## Các API Keys đã cấu hình
```
1. AIzaSyBwYKcOasLH0-7-6HJASyscAzoHpow-aYE
2. AIzaSyDIAiWGwdE7T7v9itOBK-QrUI9e3qnhY2U
3. AIzaSyBctf2xGdJ1Az6y7x1dVNPsRzlc0QX03i0
4. AIzaSyABNZ0Bn1Qr8m9bUJ2PkEM2o4bMf80zp0g
5. AIzaSyCd0AmkxZKnfX2nmPhLP0s6Op4HuwfCzmQ
```

## Cơ chế hoạt động

### 1. Khởi tạo
- Khi service khởi động, `APIKeyManager` được khởi tạo với tất cả 5 keys
- Key đầu tiên được sử dụng mặc định

### 2. Tự động rotation
- Khi một API key bị lỗi quota/rate limit, hệ thống:
  1. **Phát hiện** lỗi quota (429, resource exhausted, rate limit)
  2. **Đánh dấu** key đó là failed (cooldown 60 giây)
  3. **Chuyển** sang key tiếp theo trong danh sách
  4. **Retry** request với key mới

### 3. Cooldown period
- Key bị failed sẽ không được sử dụng trong 60 giây
- Sau 60 giây, key tự động được kích hoạt lại
- Nếu tất cả keys đều failed, sẽ sử dụng key hiện tại và báo warning

## Cách sử dụng

### Trong code hiện tại (MCP Orchestrator, AI Engine, Document API)

#### Cách 1: Sử dụng `create_llm` helper (Khuyến nghị)
```python
from app.utils.rotating_llm import create_llm
from app.config import settings

# Tạo LLM với auto-rotation
llm = create_llm(
    model=settings.GEMINI_MODEL,
    temperature=0
)

# Sử dụng bình thường, rotation tự động
response = await llm.ainvoke("Your prompt here")
```

#### Cách 2: Thay thế trực tiếp `ChatGoogleGenerativeAI`
```python
# BEFORE (cũ)
from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(
    model=settings.GEMINI_MODEL,
    google_api_key=settings.GEMINI_API_KEY
)

# AFTER (mới)
from app.utils.rotating_llm import create_llm

llm = create_llm(model=settings.GEMINI_MODEL)
# Không cần truyền google_api_key, tự động quản lý!
```

## Files đã được cập nhật

### Environment (.env)
```
GEMINI_API_KEYS=AIzaSyBwYKcOasLH0-7-6HJASyscAzoHpow-aYE,AIzaSyDIAiWGwdE7T7v9itOBK-QrUI9e3qnhY2U,...
```

### Config files
- `services/mcp-orchestrator/app/config.py`: `GEMINI_API_KEYS`
- `services/ai-engine/app/config.py`: `GEMINI_API_KEYS`
- `services/document-api/app/config.py`: `GEMINI_API_KEYS`

### Utility modules
- `services/*/app/utils/api_key_manager.py`: Quản lý pool API keys
- `services/*/app/utils/rotating_llm.py`: Wrapper cho ChatGoogleGenerativeAI

### Main files
- `services/mcp-orchestrator/main.py`: Auto-init key manager on startup
- `services/ai-engine/main.py`: Auto-init key manager on startup
- `services/document-api/main.py`: Auto-init key manager on startup

## Migration guide (Cập nhật code hiện tại)

### Step 1: Import mới
```python
# Thay đổi import
from langchain_google_genai import ChatGoogleGenerativeAI
# Thành
from app.utils.rotating_llm import create_llm
```

### Step 2: Thay đổi khởi tạo LLM
```python
# Cũ
llm = ChatGoogleGenerativeAI(
    model=settings.GEMINI_MODEL,
    temperature=0,
    google_api_key=settings.GEMINI_API_KEY  # Bỏ dòng này
)

# Mới
llm = create_llm(
    model=settings.GEMINI_MODEL,
    temperature=0
    # google_api_key tự động quản lý!
)
```

### Step 3: Sử dụng bình thường
```python
# Không cần thay đổi gì khác, dùng như cũ
result = llm.invoke("Your prompt")
result = await llm.ainvoke("Your prompt")
```

## Logs khi rotation xảy ra

```
WARNING - API key marked as failed: AIzaSyBwYKcOasLH0-7...
INFO - Rotated to next API key: AIzaSyDIAiWGwdE7T7v...
INFO - Retrying with new API key...
```

## Monitoring

### Kiểm tra trạng thái keys
```python
from app.utils.api_key_manager import get_key_manager

key_manager = get_key_manager()

# Current key
current = key_manager.get_current_key()
print(f"Current key: {current[:20]}...")

# Failed keys
print(f"Failed keys: {len(key_manager.failed_keys)}")
```

### Reset tất cả failures
```python
key_manager = get_key_manager()
key_manager.reset_failures()
```

## Best Practices

1. **Không hardcode API key** trong code
2. **Sử dụng `create_llm()`** thay vì `ChatGoogleGenerativeAI` trực tiếp
3. **Monitor logs** để phát hiện rotation events
4. **Kiểm tra quota** của từng key định kỳ
5. **Thêm keys** khi cần bằng cách cập nhật `.env`

## Troubleshooting

### Vấn đề: "Key manager not initialized"
**Giải pháp**: Đảm bảo `GEMINI_API_KEYS` đã được set trong `.env`

### Vấn đề: "All API keys are in cooldown"
**Giải pháp**: 
- Chờ 60 giây để keys được kích hoạt lại
- Hoặc thêm nhiều keys hơn vào pool
- Hoặc reset manually: `key_manager.reset_failures()`

### Vấn đề: Keys vẫn bị lỗi sau rotation
**Giải pháp**: Kiểm tra:
- Quota của tất cả keys trên Google Cloud Console
- Billing có được enable không
- API có được enable không (Generative Language API)

## Restart Services

Sau khi cấu hình, restart các services:

```bash
# Docker Compose
docker-compose restart mcp-orchestrator ai-engine document-api

# Hoặc manual
cd services/mcp-orchestrator && uvicorn main:app --reload
cd services/ai-engine && uvicorn main:app --reload --port 8001
cd services/document-api && uvicorn main:app --reload --port 8002
```

## Verification

Check logs khi service start:
```
INFO - 🚀 Starting MCP Orchestrator...
INFO - ✅ API key manager initialized with 5 keys
```

Nếu thấy message này → Thành công! ✅
