from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List
import io
import uuid

import pytesseract
from PIL import Image

from app.config import settings

router = APIRouter()


class IngestResponse(BaseModel):
    object_key: str
    filename: str
    extracted_chars: int
    indexed: bool


def _minio_client():
    try:
        import boto3
        from botocore.config import Config
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"MinIO support requires boto3/botocore: {e}")

    endpoint = settings.MINIO_ENDPOINT
    # boto3 wants hostname without scheme via endpoint_url
    return boto3.client(
        "s3",
        endpoint_url=endpoint,
        aws_access_key_id=settings.MINIO_ACCESS_KEY,
        aws_secret_access_key=settings.MINIO_SECRET_KEY,
        region_name=settings.MINIO_REGION,
        config=Config(s3={"addressing_style": "path"}),
        verify=settings.MINIO_SECURE,
    )


def _ensure_bucket(s3):
    bucket = settings.MINIO_BUCKET
    try:
        s3.head_bucket(Bucket=bucket)
    except Exception:
        s3.create_bucket(Bucket=bucket)


def _extract_text(filename: str, contents: bytes) -> str:
    name = (filename or "").lower()

    if name.endswith(".pdf"):
        try:
            from pypdf import PdfReader
        except Exception:
            return ""

        reader = PdfReader(io.BytesIO(contents))
        extracted = []
        for page in reader.pages:
            txt = (page.extract_text() or "").strip()
            if txt:
                extracted.append(txt)
        text = "\n\n".join(extracted).strip()

        if text:
            return text

        # Scanned PDF fallback: OCR first 5 pages
        try:
            from pdf2image import convert_from_bytes
        except Exception:
            return ""

        images = convert_from_bytes(contents, dpi=200, first_page=1, last_page=5)
        parts = [pytesseract.image_to_string(img, lang="vie+eng") for img in images]
        return "\n\n".join([p for p in parts if p]).strip()

    # Image OCR
    try:
        image = Image.open(io.BytesIO(contents))
        return pytesseract.image_to_string(image, lang="vie+eng").strip()
    except Exception:
        # Fallback: try plain text
        try:
            return contents.decode("utf-8", errors="ignore").strip()
        except Exception:
            return ""


def _get_vectorstore(embeddings):
    try:
        import chromadb
        from langchain_community.vectorstores import Chroma
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Vector search requires chromadb + langchain vectorstores: {e}")

    # Prefer Chroma server to match docker-compose
    try:
        chroma_client = chromadb.HttpClient(host=settings.CHROMA_HOST, port=settings.CHROMA_PORT)
        chroma_client.heartbeat()
        return Chroma(
            client=chroma_client,
            collection_name="erp_documents",
            embedding_function=embeddings,
        )
    except Exception:
        return Chroma(
            collection_name="erp_documents",
            embedding_function=embeddings,
            persist_directory="./chroma_db",
        )


@router.post("/ingest", response_model=IngestResponse)
async def ingest_document(file: UploadFile = File(...)):
    """Upload to MinIO, extract text (PDF/image), then index into Chroma."""
    try:
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Empty file")

        s3 = _minio_client()
        _ensure_bucket(s3)

        object_key = f"uploads/{uuid.uuid4().hex}_{file.filename or 'document'}"
        s3.put_object(
            Bucket=settings.MINIO_BUCKET,
            Key=object_key,
            Body=contents,
            ContentType=file.content_type or "application/octet-stream",
        )

        text = _extract_text(file.filename or "", contents)
        indexed = False
        if text and settings.GEMINI_API_KEY:
            try:
                from langchain_google_genai import GoogleGenerativeAIEmbeddings
            except Exception as e:
                raise HTTPException(status_code=503, detail=f"Gemini embeddings require langchain-google-genai: {e}")

            embeddings = GoogleGenerativeAIEmbeddings(
                model="models/embedding-001",
                google_api_key=settings.GEMINI_API_KEY,
            )
            vectorstore = _get_vectorstore(embeddings)
            vectorstore.add_texts(
                texts=[text],
                metadatas=[
                    {
                        "object_key": object_key,
                        "filename": file.filename,
                        "content_type": file.content_type,
                    }
                ],
            )
            indexed = True

        return IngestResponse(
            object_key=object_key,
            filename=file.filename or "",
            extracted_chars=len(text),
            indexed=indexed,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/download")
async def download(object_key: str):
    """Download a stored object by key (streams bytes)."""
    try:
        s3 = _minio_client()
        obj = s3.get_object(Bucket=settings.MINIO_BUCKET, Key=object_key)
        body = obj["Body"]
        content_type = obj.get("ContentType") or "application/octet-stream"
        return StreamingResponse(body, media_type=content_type)
    except Exception as e:
        # Avoid hard-coding botocore exceptions when botocore isn't installed
        raise HTTPException(status_code=500, detail=str(e))
