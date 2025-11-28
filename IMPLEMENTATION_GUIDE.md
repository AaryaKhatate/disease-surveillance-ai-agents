# Disease Surveillance AI - Implementation Guide

## Overview

This guide provides step-by-step instructions to complete the Disease Surveillance AI Agent system. The core architecture and agent definitions are complete. This guide focuses on implementing the remaining components.

---

## Phase 1: Core Backend Implementation

### Step 1: Create Plugin Files

Plugins are the bridge between AI agents and actual functionality. Reference: `azure-ai-agent-hackathon-2025/backend/plugins/`

#### 1.1 Create `backend/plugins/__init__.py`

```python
"""Plugins package for disease surveillance AI system."""
```

#### 1.2 Create `backend/plugins/logging_plugin.py`

```python
"""Logging plugin for agent thinking and events."""

from semantic_kernel.functions import kernel_function
from typing import Dict, Any
from datetime import datetime
import uuid

class LoggingPlugin:
    """Plugin for logging agent thinking processes."""
    
    def __init__(self):
        self.current_agent_id = None
        self.current_thread_id = None
    
    @kernel_function(
        name="log_agent_thinking",
        description="Log agent thinking process to database"
    )
    async def log_agent_thinking(
        self,
        agent_name: str,
        thinking_stage: str,
        thought_content: str,
        conversation_id: str,
        session_id: str,
        azure_agent_id: str = None,
        model_deployment_name: str = None,
        thread_id: str = None,
        thinking_stage_output: str = None,
        agent_output: str = None
    ) -> str:
        """Log agent thinking to database."""
        # Implementation: Save to database using database_utils
        # Return success message
        return "Thinking logged successfully"
    
    @kernel_function(
        name="log_agent_get_agent_id",
        description="Get current agent ID"
    )
    async def get_agent_id(self) -> str:
        """Return current agent ID."""
        if not self.current_agent_id:
            self.current_agent_id = str(uuid.uuid4())
        return self.current_agent_id
    
    @kernel_function(
        name="log_agent_get_thread_id",
        description="Get current thread ID"
    )
    async def get_thread_id(self) -> str:
        """Return current thread ID."""
        if not self.current_thread_id:
            self.current_thread_id = str(uuid.uuid4())
        return self.current_thread_id
```

#### 1.3 Create `backend/plugins/data_collection_plugin.py`

```python
"""Data collection plugin for gathering surveillance data."""

from semantic_kernel.functions import kernel_function
from utils.database_utils import get_surveillance_data
from utils.data_processing import (
    aggregate_hospital_data,
    analyze_social_media_sentiment,
    process_environmental_data,
    analyze_pharmacy_trends
)
import json
from datetime import datetime

class DataCollectionPlugin:
    """Plugin for collecting disease surveillance data."""
    
    @kernel_function(
        name="get_health_data_sources",
        description="Retrieve health surveillance data from all sources"
    )
    async def get_health_data_sources(
        self,
        region: str = None,
        days: int = 7
    ) -> str:
        """Collect data from all surveillance sources."""
        # Get data from database
        data = get_surveillance_data(region=region, days=days)
        
        # Process each source
        result = {
            'timestamp': datetime.now().isoformat(),
            'dataSources': [],
            'summary': {}
        }
        
        # Hospital data
        if not data['hospital'].empty:
            hospital_stats = aggregate_hospital_data(data['hospital'])
            result['dataSources'].append({
                'type': 'hospital_data',
                'dataPoints': hospital_stats['total_visits'],
                'location': region or 'all_regions',
                'metrics': hospital_stats
            })
        
        # Add other sources similarly...
        
        return json.dumps(result, indent=2)
```

Continue creating remaining plugins following this pattern.

### Step 2: Create Surveillance Manager

Create `backend/managers/surveillance_manager.py` based on the chatbot_manager.py from reference project:

```python
"""Surveillance manager for orchestrating AI agents."""

from agents.agent_manager import create_or_reuse_agent
from agents.agent_definitions import *
from agents.agent_strategies import SurveillanceSelectionStrategy, SurveillanceTerminationStrategy
from plugins.logging_plugin import LoggingPlugin
from plugins.data_collection_plugin import DataCollectionPlugin
# Import other plugins...

class SurveillanceManager:
    """Manages disease surveillance agent interactions."""
    
    def __init__(self, client, model_deployment_name):
        self.client = client
        self.model_deployment_name = model_deployment_name
        self.agents = {}
        self.plugins = self._initialize_plugins()
    
    def _initialize_plugins(self):
        """Initialize all plugins."""
        return {
            'logging': LoggingPlugin(),
            'data_collection': DataCollectionPlugin(),
            # Add other plugins...
        }
    
    async def initialize_agents(self):
        """Create all surveillance agents."""
        # Create each agent with appropriate plugins
        self.agents['DATA_COLLECTION'] = await create_or_reuse_agent(
            self.client,
            DATA_COLLECTION_AGENT,
            self.model_deployment_name,
            DATA_COLLECTION_AGENT_INSTRUCTIONS,
            plugins=[self.plugins['logging'], self.plugins['data_collection']]
        )
        # Create other agents...
    
    async def process_message(self, message: str, session_id: str):
        """Process user message through agent workflow."""
        # Implementation similar to chatbot_manager
        pass
```

### Step 3: Create Database Schema

Create `backend/sql/create_surveillance_tables.sql`:

```sql
-- Hospital Surveillance Data
CREATE TABLE hospital_surveillance_data (
    id INT PRIMARY KEY IDENTITY(1,1),
    timestamp DATETIME NOT NULL,
    region VARCHAR(100),
    facility_name VARCHAR(200),
    patient_id VARCHAR(50),
    age_group VARCHAR(20),
    primary_symptom VARCHAR(100),
    severity VARCHAR(20),
    visit_type VARCHAR(50),
    created_at DATETIME DEFAULT GETDATE()
);

-- Social Media Surveillance
CREATE TABLE social_media_surveillance_data (
    id INT PRIMARY KEY IDENTITY(1,1),
    timestamp DATETIME NOT NULL,
    platform VARCHAR(50),
    location VARCHAR(100),
    symptom_keyword VARCHAR(100),
    sentiment_score FLOAT,
    mention_count INT,
    created_at DATETIME DEFAULT GETDATE()
);

-- Environmental Surveillance
CREATE TABLE environmental_surveillance_data (
    id INT PRIMARY KEY IDENTITY(1,1),
    timestamp DATETIME NOT NULL,
    region VARCHAR(100),
    air_quality_index FLOAT,
    water_quality_index FLOAT,
    temperature FLOAT,
    humidity FLOAT,
    created_at DATETIME DEFAULT GETDATE()
);

-- Pharmacy Surveillance
CREATE TABLE pharmacy_surveillance_data (
    id INT PRIMARY KEY IDENTITY(1,1),
    timestamp DATETIME NOT NULL,
    pharmacy_location VARCHAR(100),
    medication VARCHAR(200),
    category VARCHAR(100),
    quantity INT,
    prescription_required BIT,
    created_at DATETIME DEFAULT GETDATE()
);

-- Anomaly Detections
CREATE TABLE anomaly_detections (
    id INT PRIMARY KEY IDENTITY(1,1),
    timestamp DATETIME NOT NULL,
    location VARCHAR(100),
    anomaly_type VARCHAR(100),
    severity VARCHAR(20),
    confidence FLOAT,
    data_source VARCHAR(50),
    metrics TEXT,
    created_at DATETIME DEFAULT GETDATE()
);

-- Outbreak Predictions
CREATE TABLE outbreak_predictions (
    id INT PRIMARY KEY IDENTITY(1,1),
    timestamp DATETIME NOT NULL,
    location VARCHAR(100),
    outbreak_likelihood FLOAT,
    predicted_cases INT,
    prediction_horizon_weeks INT,
    confidence_interval TEXT,
    model_version VARCHAR(50),
    created_at DATETIME DEFAULT GETDATE()
);

-- Surveillance Alerts
CREATE TABLE surveillance_alerts (
    id INT PRIMARY KEY IDENTITY(1,1),
    timestamp DATETIME NOT NULL,
    alert_id VARCHAR(100) UNIQUE,
    priority VARCHAR(20),
    region VARCHAR(100),
    target_audience VARCHAR(100),
    message TEXT,
    actions_required TEXT,
    dissemination_channels TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at DATETIME DEFAULT GETDATE()
);

-- Agent Thinking Logs
CREATE TABLE agent_thinking_logs (
    id INT PRIMARY KEY IDENTITY(1,1),
    timestamp DATETIME DEFAULT GETDATE(),
    session_id VARCHAR(100),
    conversation_id VARCHAR(100),
    agent_name VARCHAR(100),
    azure_agent_id VARCHAR(100),
    thread_id VARCHAR(100),
    thinking_stage VARCHAR(100),
    thought_content TEXT,
    thinking_stage_output TEXT,
    agent_output TEXT,
    model_deployment_name VARCHAR(100)
);

-- Chat Sessions
CREATE TABLE chat_sessions (
    id INT PRIMARY KEY IDENTITY(1,1),
    session_id VARCHAR(100) UNIQUE,
    user_id VARCHAR(100),
    started_at DATETIME DEFAULT GETDATE(),
    last_activity DATETIME DEFAULT GETDATE(),
    status VARCHAR(20) DEFAULT 'active'
);
```

---

## Phase 2: API Implementation

### Step 4: Create FastAPI Application

Create `backend/api/app.py`:

```python
"""FastAPI application setup."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.settings import settings

app = FastAPI(
    title="Disease Surveillance AI API",
    description="API for proactive disease outbreak detection",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Disease Surveillance AI API",
        "status": "operational",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

Create `backend/api/endpoints.py`:

```python
"""API endpoints for disease surveillance."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()

class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    agent: str

@router.post("/api/chat", response_model=ChatResponse)
async def chat(message: ChatMessage):
    """Chat with surveillance agents."""
    # Implementation: Use SurveillanceManager
    pass

@router.get("/api/surveillance/status")
async def get_surveillance_status():
    """Get current surveillance status."""
    pass

@router.get("/api/anomalies")
async def get_anomalies(
    region: Optional[str] = None,
    severity: Optional[str] = None,
    days: int = 7
):
    """Get detected anomalies."""
    pass

# Add more endpoints...
```

---

## Phase 3: Frontend Implementation

### Step 5: Set up Next.js

Copy package.json from reference project and modify:

```json
{
  "name": "disease-surveillance-ai-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "15.3.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@radix-ui/react-*": "...",
    "plotly.js": "^2.27.0",
    "react-plotly.js": "^2.6.0"
  }
}
```

### Step 6: Create Dashboard Page

Create `frontend/app/dashboard/page.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import SurveillanceMap from '@/components/surveillance-map';
import AnomalyChart from '@/components/anomaly-chart';
import AlertPanel from '@/components/alert-panel';

export default function Dashboard() {
  const [surveillanceData, setSurveillanceData] = useState(null);
  
  useEffect(() => {
    fetchSurveillanceStatus();
  }, []);
  
  const fetchSurveillanceStatus = async () => {
    const response = await fetch('http://localhost:8000/api/surveillance/status');
    const data = await response.json();
    setSurveillanceData(data);
  };
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Disease Surveillance Dashboard
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SurveillanceMap data={surveillanceData} />
        <AlertPanel />
        <AnomalyChart data={surveillanceData} />
      </div>
    </div>
  );
}
```

---

## Testing

### Step 7: Create Sample Data

Create `backend/sql/sample_data.sql`:

```sql
-- Insert sample hospital data
INSERT INTO hospital_surveillance_data 
(timestamp, region, facility_name, primary_symptom, severity)
VALUES
    (GETDATE(), 'North Region', 'City Hospital', 'Fever', 'Medium'),
    (GETDATE(), 'North Region', 'City Hospital', 'Cough', 'Low'),
    -- Add more samples...
```

### Step 8: Test Workflow

1. Start backend: `cd backend && python api/api_server.py`
2. Start frontend: `cd frontend && npm run dev`
3. Test chat: Navigate to `http://localhost:3000/chat`
4. Ask: "What is the current surveillance status?"
5. Verify agent workflow in Streamlit dashboard

---

## Deployment

See `DEPLOYMENT.md` for Azure deployment instructions.

---

## Resources

- Reference Project: `azure-ai-agent-hackathon-2025/`
- PandemicLLM: `PandemicLLM/`
- Azure AI Documentation: https://learn.microsoft.com/azure/ai-services/
- Semantic Kernel Docs: https://learn.microsoft.com/semantic-kernel/

---

**Note:** This is a quick-start guide. Refer to PROJECT_SUMMARY.md for complete component list.
