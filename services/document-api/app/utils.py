"""
Common utilities for Document API
"""
import hashlib
import logging
from typing import List, Dict
import re

logger = logging.getLogger(__name__)

def calculate_file_hash(content: bytes) -> str:
    """Calculate file hash for deduplication"""
    return hashlib.md5(content).hexdigest()

def clean_text(text: str) -> str:
    """Clean extracted text"""
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    
    # Remove special characters
    text = re.sub(r'[^\w\s\-.,;:!?áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ]', '', text, flags=re.UNICODE)
    
    return text.strip()

def split_into_chunks(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    """Split text into overlapping chunks for indexing"""
    words = text.split()
    chunks = []
    
    for i in range(0, len(words), chunk_size - overlap):
        chunk = ' '.join(words[i:i + chunk_size])
        chunks.append(chunk)
    
    return chunks

def extract_metadata(filename: str) -> Dict[str, str]:
    """Extract metadata from filename"""
    # Example: "contract_2024-03-15_v2.pdf"
    parts = filename.split('_')
    
    metadata = {
        'filename': filename,
        'type': parts[0] if len(parts) > 0 else 'unknown',
        'extension': filename.split('.')[-1] if '.' in filename else 'unknown'
    }
    
    # Try to extract date
    date_pattern = r'\d{4}-\d{2}-\d{2}'
    match = re.search(date_pattern, filename)
    if match:
        metadata['date'] = match.group()
    
    return metadata

def calculate_similarity_score(query_embedding: List[float], doc_embedding: List[float]) -> float:
    """Calculate cosine similarity between embeddings"""
    import numpy as np
    
    query = np.array(query_embedding)
    doc = np.array(doc_embedding)
    
    dot_product = np.dot(query, doc)
    norm_query = np.linalg.norm(query)
    norm_doc = np.linalg.norm(doc)
    
    if norm_query == 0 or norm_doc == 0:
        return 0.0
    
    return float(dot_product / (norm_query * norm_doc))
