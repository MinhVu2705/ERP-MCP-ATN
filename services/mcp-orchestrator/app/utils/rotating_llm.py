"""
Wrapper for ChatGoogleGenerativeAI with automatic API key rotation
"""
from langchain_google_genai import ChatGoogleGenerativeAI
from app.utils.api_key_manager import get_key_manager
import logging
from typing import Any

logger = logging.getLogger(__name__)

class RotatingChatGoogleGenerativeAI(ChatGoogleGenerativeAI):
    """ChatGoogleGenerativeAI wrapper with automatic key rotation on quota errors"""
    
    def __init__(self, **kwargs):
        # Remove google_api_key if present, we'll manage it
        kwargs.pop('google_api_key', None)
        
        # Get current key from manager
        key_manager = get_key_manager()
        current_key = key_manager.get_current_key()
        
        # Initialize with current key
        super().__init__(google_api_key=current_key, **kwargs)
        self._current_key = current_key
    
    def _generate(self, *args, **kwargs):
        """Override generate to handle quota errors"""
        try:
            return super()._generate(*args, **kwargs)
        except Exception as e:
            error_msg = str(e).lower()
            
            # Check if it's a quota/rate limit error
            if any(keyword in error_msg for keyword in ['quota', 'rate limit', '429', 'resource exhausted']):
                logger.warning(f"Quota error detected: {e}")
                
                # Mark current key as failed
                key_manager = get_key_manager()
                key_manager.mark_key_failed(self._current_key)
                
                # Get new key and retry
                new_key = key_manager.get_current_key()
                self.google_api_key = new_key
                self._current_key = new_key
                
                logger.info("Retrying with new API key...")
                return super()._generate(*args, **kwargs)
            else:
                # Not a quota error, re-raise
                raise
    
    async def _agenerate(self, *args, **kwargs):
        """Override async generate to handle quota errors"""
        try:
            return await super()._agenerate(*args, **kwargs)
        except Exception as e:
            error_msg = str(e).lower()
            
            # Check if it's a quota/rate limit error
            if any(keyword in error_msg for keyword in ['quota', 'rate limit', '429', 'resource exhausted']):
                logger.warning(f"Quota error detected: {e}")
                
                # Mark current key as failed
                key_manager = get_key_manager()
                key_manager.mark_key_failed(self._current_key)
                
                # Get new key and retry
                new_key = key_manager.get_current_key()
                self.google_api_key = new_key
                self._current_key = new_key
                
                logger.info("Retrying with new API key...")
                return await super()._agenerate(*args, **kwargs)
            else:
                # Not a quota error, re-raise
                raise

def create_llm(**kwargs) -> RotatingChatGoogleGenerativeAI:
    """
    Factory function to create LLM with key rotation support
    
    Usage:
        llm = create_llm(model=settings.GEMINI_MODEL, temperature=0)
    """
    return RotatingChatGoogleGenerativeAI(**kwargs)
