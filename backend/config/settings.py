"""Application settings and configuration management."""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    """Application configuration settings."""
    
    # OpenAI Configuration (Migrated from Azure OpenAI)
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4-turbo-preview")
    OPENAI_ORGANIZATION = os.getenv("OPENAI_ORGANIZATION", "")
    
    # Database Configuration (Migrated from Azure SQL to Supabase PostgreSQL)
    DB_CONNECTION_STRING = os.getenv("DB_CONNECTION_STRING", "")
    
    # Supabase Configuration
    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
    SUPABASE_STORAGE_BUCKET = os.getenv("SUPABASE_STORAGE_BUCKET", "surveillance-reports")
    
    # Storage Configuration (Migrated from Azure Blob to Local/Supabase)
    REPORT_STORAGE_TYPE = os.getenv("REPORT_STORAGE_TYPE", "local")  # Options: local, supabase
    REPORT_STORAGE_PATH = os.getenv("REPORT_STORAGE_PATH", "./reports")
    
    # Search Configuration (Migrated from Bing to DuckDuckGo)
    USE_DUCKDUCKGO = os.getenv("USE_DUCKDUCKGO", "true").lower() == "true"
    GOOGLE_SEARCH_API_KEY = os.getenv("GOOGLE_SEARCH_API_KEY", "")
    GOOGLE_SEARCH_CX = os.getenv("GOOGLE_SEARCH_CX", "")
    
    # API Configuration
    API_HOST = os.getenv("API_HOST", "0.0.0.0")
    API_PORT = int(os.getenv("API_PORT", 8000))
    
    # Logging Configuration
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    
    # Agent Configuration
    AGENT_TIMEOUT = 300  # seconds
    MAX_RETRIES = 3
    
    # Data Collection Settings
    DATA_COLLECTION_INTERVAL = 3600  # seconds (1 hour)
    ANOMALY_DETECTION_THRESHOLD = 0.75
    PREDICTION_HORIZON_WEEKS = 3
    
    # Alert Settings
    ALERT_HIGH_RISK_THRESHOLD = 0.8
    ALERT_MEDIUM_RISK_THRESHOLD = 0.5
    ALERT_LOW_RISK_THRESHOLD = 0.3
    
    @classmethod
    def validate(cls):
        """Validate that required settings are configured."""
        required_settings = [
            ("OPENAI_API_KEY", cls.OPENAI_API_KEY),
            ("DB_CONNECTION_STRING", cls.DB_CONNECTION_STRING),
        ]
        
        missing = [name for name, value in required_settings if not value]
        if missing:
            raise ValueError(f"Missing required settings: {', '.join(missing)}")
        
        return True
    
    @classmethod
    def is_supabase_configured(cls) -> bool:
        """Check if Supabase is configured."""
        return bool(cls.SUPABASE_URL and cls.SUPABASE_ANON_KEY)

# Create a singleton instance
settings = Settings()


class LLMSettings:
    """Settings for LLM initialization (migrated from Azure OpenAI to OpenAI)."""
    
    def __init__(self, api_key: str = None, model: str = None, organization: str = None):
        """Initialize LLM settings.
        
        Args:
            api_key: OpenAI API key
            model: Model name (e.g., gpt-4-turbo-preview)
            organization: Optional organization ID
        """
        self.api_key = api_key or settings.OPENAI_API_KEY
        self.model = model or settings.OPENAI_MODEL
        self.organization = organization or settings.OPENAI_ORGANIZATION
    
    def validate(self):
        """Validate settings."""
        if not self.api_key:
            raise ValueError("OpenAI API key is required. Set OPENAI_API_KEY environment variable.")
        if not self.model:
            raise ValueError("OpenAI model is required. Set OPENAI_MODEL environment variable.")
        return True


def initialize_llm_settings(api_key: str = None, model: str = None, organization: str = None) -> LLMSettings:
    """Initialize LLM settings.
    
    Args:
        api_key: Optional API key override
        model: Optional model override
        organization: Optional organization override
        
    Returns:
        LLMSettings instance
    """
    llm_settings = LLMSettings(
        api_key=api_key,
        model=model,
        organization=organization
    )
    llm_settings.validate()
    return llm_settings


def get_database_connection_string() -> str:
    """Get database connection string from settings.
    
    Returns:
        Database connection string (PostgreSQL format)
        
    Raises:
        ValueError: If connection string is not configured
    """
    connection_string = settings.DB_CONNECTION_STRING
    if not connection_string:
        raise ValueError("Database connection string is not configured. Set DB_CONNECTION_STRING environment variable.")
    return connection_string


def get_supabase_client():
    """Create and return a Supabase client.
    
    Returns:
        Supabase Client instance
    """
    if not settings.is_supabase_configured():
        raise ValueError("Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.")
    
    from supabase import create_client, Client
    
    supabase: Client = create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_ANON_KEY
    )
    
    return supabase
