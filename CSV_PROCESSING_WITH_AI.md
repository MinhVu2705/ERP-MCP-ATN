# CSV Processing with Gemini AI - Integration Guide

## Tổng quan
Hệ thống đã được tích hợp Gemini AI để xử lý file CSV trước khi import vào database.

## Quy trình xử lý CSV

```
Frontend Upload CSV
        ↓
ERP Core (Java) receives file
        ↓
Call AI Engine (Python) /api/csv/process-csv
        ↓
Gemini AI validates & enriches data
        ↓
Return processed data to ERP Core
        ↓
Save to PostgreSQL
```

## Tính năng AI khi xử lý CSV

### 1. **Validation & Quality Check**
- Kiểm tra định dạng dữ liệu
- Phát hiện giá trị bất thường (outliers)
- Validate kiểu dữ liệu (số, ngày tháng, text)
- Phát hiện missing values

### 2. **Error Detection**
- Phát hiện giá trị âm không hợp lý
- Định dạng ngày tháng sai
- Dữ liệu trống hoặc không đầy đủ
- Giá trị ngoài khoảng cho phép

### 3. **AI Suggestions**
- Đề xuất cách xử lý lỗi
- Gợi ý clean data
- Đánh giá chất lượng dữ liệu (1-10)
- Recommendations để cải thiện

### 4. **Data Enrichment** (optional)
API endpoint `/api/csv/enrich-csv` cung cấp:
- Auto-categorize transactions (B2B, B2C, Wholesale)
- Risk level assessment (Low, Medium, High)
- AI-generated tags
- Smart recommendations

## API Endpoints

### 1. Process CSV with Validation
```http
POST http://localhost:8001/api/csv/process-csv
Content-Type: multipart/form-data

file: [CSV file]
```

**Response:**
```json
{
  "success": true,
  "total_rows": 1000,
  "valid_rows": 985,
  "invalid_rows": 15,
  "errors": [
    {
      "row": 5,
      "errors": ["Revenue is negative", "Invalid date format"]
    }
  ],
  "suggestions": "Dữ liệu tổng thể tốt, cần kiểm tra 15 dòng có lỗi...",
  "processed_data": [...]
}
```

### 2. Enrich CSV with AI
```http
POST http://localhost:8001/api/csv/enrich-csv
Content-Type: multipart/form-data

file: [CSV file]
```

**Response:**
```json
{
  "success": true,
  "total_enriched": 1000,
  "data": [
    {
      "Date": "2024-01-15",
      "Customer": "ABC Corp",
      "Revenue": "50000",
      "AI_Category": "B2B",
      "AI_Risk_Level": "Low",
      "AI_Tags": ["High-value", "Recurring"],
      "AI_Recommendation": "Priority customer, maintain relationship"
    }
  ]
}
```

## Flow Integration

### Java Service (ERP Core)
```java
// DataImportService.java
public int importCSV(MultipartFile file) {
    // 1. Call AI Engine to validate
    Map<String, Object> aiResult = processCSVWithAI(file);
    
    // 2. Get validated data
    List<Map<String, String>> processedData = 
        (List) aiResult.get("processed_data");
    
    // 3. Convert to entities and save
    for (Map<String, String> row : processedData) {
        Transaction transaction = createTransactionFromRow(row);
        transactions.add(transaction);
    }
    
    // 4. Batch save to database
    transactionRepository.saveAll(transactions);
}
```

### Python Service (AI Engine)
```python
# csv_processor.py
@router.post("/process-csv")
async def process_csv_with_ai(file: UploadFile):
    # 1. Read CSV
    rows = parse_csv(file)
    
    # 2. Analyze with Gemini AI
    llm = create_llm(model=settings.GEMINI_MODEL)
    ai_analysis = await llm.ainvoke(analysis_prompt)
    
    # 3. Validate each row
    valid_rows, errors = validate_all_rows(rows)
    
    # 4. Return results
    return {
        "valid_rows": valid_rows,
        "errors": errors,
        "suggestions": ai_analysis
    }
```

## API Key Rotation

CSV processing cũng sử dụng hệ thống rotation API keys:
- Tự động chuyển key khi hết quota
- Xử lý được lượng lớn CSV files
- Không bị gián đoạn khi 1 key fail

## Configuration

### ERP Core (application.properties)
```properties
# AI Engine URL
ai.engine.url=http://localhost:8001

# Fallback behavior
ai.processing.fallback.enabled=true
```

### AI Engine (.env)
```env
# Gemini API Keys (rotation)
GEMINI_API_KEYS=key1,key2,key3,key4,key5

# Model
GEMINI_MODEL=gemini-2.5-flash-latest
```

## Frontend Integration

### Current Flow
```typescript
// data-uploader.tsx
const response = await fetch("http://localhost:8080/api/data/upload-csv", {
  method: "POST",
  body: formData
});
```

### Enhanced Flow (with AI feedback)
```typescript
const response = await fetch("http://localhost:8080/api/data/upload-csv");
const result = await response.json();

if (result.ai_validation) {
  // Show AI validation results
  console.log("Quality Score:", result.ai_validation.quality_score);
  console.log("Issues:", result.ai_validation.issues);
  console.log("Suggestions:", result.ai_validation.suggestions);
}
```

## CSV Format Expected

```csv
Date,Customer,TransactionType,Revenue,Cost,Product,OrderStatus,Department,Profit,ForecastedRevenue
2024-01-15,ABC Corp,Sale,50000,30000,Product A,Completed,Sales,20000,55000
2024-01-16,XYZ Ltd,Sale,35000,20000,Product B,Pending,Marketing,15000,40000
```

## Validation Rules

### Required Fields
- Date (YYYY-MM-DD format)
- Customer
- Revenue
- Cost

### Numeric Validation
- Revenue ≥ 0
- Cost ≥ 0
- Profit = Revenue - Cost

### Date Validation
- Must be valid date
- Format: YYYY-MM-DD (ISO 8601)

### Business Logic
- Revenue should not be negative
- Cost should not exceed Revenue significantly
- Profit consistency check

## Error Handling

### AI Engine Unavailable
- Fallback to direct CSV parsing
- Log warning but don't fail
- Return partial results

### Invalid CSV Format
- Return detailed error messages
- Specify row and column of errors
- Suggest corrections

### Quota Exceeded
- Automatic key rotation
- Transparent to user
- Logged for monitoring

## Testing

### Test CSV Processing
```bash
curl -X POST http://localhost:8001/api/csv/process-csv \
  -F "file=@demo-data/transactions/transactions_1000.csv"
```

### Test with Java Service
```bash
curl -X POST http://localhost:8080/api/data/upload-csv \
  -F "file=@demo-data/transactions/transactions_1000.csv"
```

## Monitoring

### Logs to Check
```
INFO - Processing CSV with 1000 rows
INFO - AI validation completed: 985 valid, 15 invalid
INFO - Saved 985 transactions to database
WARNING - API key rotated due to quota
```

### Metrics
- CSV processing time
- AI validation accuracy
- Error rate per file
- API key rotation frequency

## Best Practices

1. **Always validate before import**
   - Use AI processing endpoint first
   - Review validation results
   - Fix errors before final import

2. **Handle large files**
   - Process in batches
   - Show progress to user
   - Use async processing for > 10k rows

3. **Preserve original data**
   - Keep original CSV for audit
   - Log all transformations
   - Enable rollback if needed

4. **Monitor AI quality**
   - Track validation accuracy
   - Review AI suggestions
   - Adjust prompts based on feedback

## Restart Services

```bash
# Restart AI Engine
cd services/ai-engine
docker-compose restart ai-engine

# Restart ERP Core
cd services/erp-core
docker-compose restart erp-core
```

## Verify Integration

1. Start services
2. Upload a CSV via frontend
3. Check logs for AI processing
4. Verify data in database
5. Review validation results

✅ Integration complete!
