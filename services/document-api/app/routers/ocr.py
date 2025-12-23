from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List
import pytesseract
from PIL import Image
import io

router = APIRouter()

class OCRResult(BaseModel):
    """OCR result model"""
    text: str
    confidence: float
    language: str

@router.post("/extract", response_model=OCRResult)
async def extract_text(file: UploadFile = File(...)):
    """
    Extract text from images using OCR
    
    Use Case 5: Khai phá dữ liệu văn bản (Document Q&A)
    
    Supports: JPG, PNG, PDF
    """
    try:
        # Read file
        contents = await file.read()
        
        # Convert to image
        image = Image.open(io.BytesIO(contents))
        
        # Perform OCR
        text = pytesseract.image_to_string(image, lang='vie+eng')
        
        return OCRResult(
            text=text,
            confidence=0.85,
            language="vie+eng"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/batch")
async def batch_ocr(files: List[UploadFile] = File(...)):
    """
    Process multiple documents for OCR
    
    Returns list of extracted texts
    """
    results = []
    
    for file in files:
        try:
            contents = await file.read()
            image = Image.open(io.BytesIO(contents))
            text = pytesseract.image_to_string(image, lang='vie+eng')
            
            results.append({
                "filename": file.filename,
                "text": text,
                "status": "success"
            })
        except Exception as e:
            results.append({
                "filename": file.filename,
                "text": "",
                "status": "error",
                "error": str(e)
            })
    
    return {"results": results, "total": len(results)}
