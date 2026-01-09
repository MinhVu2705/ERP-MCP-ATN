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

        filename = (file.filename or "").lower()

        # PDF: try text extraction first, then OCR pages if needed
        if filename.endswith(".pdf"):
            try:
                from pypdf import PdfReader
            except Exception as e:
                raise HTTPException(status_code=503, detail=f"PDF support requires pypdf: {e}")

            reader = PdfReader(io.BytesIO(contents))
            extracted = []
            for page in reader.pages:
                page_text = page.extract_text() or ""
                if page_text.strip():
                    extracted.append(page_text)

            text = "\n\n".join(extracted).strip()

            # If scanned PDF (no embedded text), OCR first few pages
            if not text:
                try:
                    from pdf2image import convert_from_bytes
                except Exception as e:
                    raise HTTPException(status_code=503, detail=f"Scanned-PDF OCR requires pdf2image/poppler: {e}")

                images = convert_from_bytes(contents, dpi=200, first_page=1, last_page=5)
                ocr_parts = []
                for img in images:
                    ocr_parts.append(pytesseract.image_to_string(img, lang='vie+eng'))
                text = "\n\n".join([t for t in ocr_parts if t]).strip()

        else:
            # Image: OCR
            image = Image.open(io.BytesIO(contents))
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
