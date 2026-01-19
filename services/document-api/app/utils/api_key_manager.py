"""
API Key Manager with rotation support
Handles multiple API keys and automatically rotates when quota is exceeded
"""
import os
import time
from typing import List, Optional
from threading import Lock
import logging

logger = logging.getLogger(__name__)

class APIKeyManager:
    """Manages multiple API keys with automatic rotation on quota errors"""
    
    def __init__(self, api_keys: List[str]):
        """
        Initialize with a list of API keys
        
        Args:
            api_keys: List of API keys to rotate through
        """
        self.api_keys = api_keys
        self.current_index = 0
        self.failed_keys = {}  # key -> timestamp when it failed
        self.lock = Lock()
        self.cooldown_period = 60  # seconds before retrying a failed key
        
    def get_current_key(self) -> str:
        """Get the current active API key"""
        with self.lock:
            # Clean up old failures
            current_time = time.time()
            self.failed_keys = {
                k: v for k, v in self.failed_keys.items() 
                if current_time - v < self.cooldown_period
            }
            
            # Find next available key
            attempts = 0
            while attempts < len(self.api_keys):
                key = self.api_keys[self.current_index]
                
                if key not in self.failed_keys:
                    return key
                
                # This key is in cooldown, try next
                self.current_index = (self.current_index + 1) % len(self.api_keys)
                attempts += 1
            
            # All keys are in cooldown, return current anyway
            logger.warning("All API keys are in cooldown, using current key anyway")
            return self.api_keys[self.current_index]
    
    def mark_key_failed(self, key: str):
        """Mark a key as failed (will be skipped for cooldown period)"""
        with self.lock:
            self.failed_keys[key] = time.time()
            logger.warning(f"API key marked as failed: {key[:20]}...")
            
            # Rotate to next key
            self.current_index = (self.current_index + 1) % len(self.api_keys)
            logger.info(f"Rotated to next API key: {self.get_current_key()[:20]}...")
    
    def reset_failures(self):
        """Reset all failure states"""
        with self.lock:
            self.failed_keys.clear()
            logger.info("All API key failures reset")

# Global instance
_key_manager: Optional[APIKeyManager] = None

def init_key_manager(api_keys_str: str) -> APIKeyManager:
    """
    Initialize the global key manager
    
    Args:
        api_keys_str: Comma-separated string of API keys
    """
    global _key_manager
    api_keys = [k.strip() for k in api_keys_str.split(',') if k.strip()]
    
    if not api_keys:
        raise ValueError("No API keys provided")
    
    _key_manager = APIKeyManager(api_keys)
    logger.info(f"Initialized API key manager with {len(api_keys)} keys")
    return _key_manager

def get_key_manager() -> APIKeyManager:
    """Get the global key manager instance"""
    if _key_manager is None:
        raise RuntimeError("Key manager not initialized. Call init_key_manager first.")
    return _key_manager
