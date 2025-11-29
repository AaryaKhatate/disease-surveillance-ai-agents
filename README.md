# Disease Surveillance AI Agent System

## Overview

The Disease Surveillance AI Agent System is a revolutionary proactive disease outbreak detection platform that transforms healthcare from reactive to predictive. Built on Azure AI Agent Service and inspired by PandemicLLM's predictive capabilities, this multi-agent system continuously monitors multiple data streams to identify disease outbreak signals before they become widespread health crises.

Instead of waiting for doctors and hospitals to manually report cases, our AI agents actively hunt for the earliest possible signs of health threats by analyzing:

- **Patient Data** - Hospital visit patterns and treatment trends
- **Social Media** - Health-related discussions and symptom mentions
- **Environmental Data** - Air quality, water quality, and weather patterns
- **Pharmacy Data** - Prescription trends and over-the-counter medication sales
- **School & Workplace** - Absence rates and sick leave patterns
- **Emergency Services** - ER activity and ambulance dispatch patterns

## System Architecture

![Alt text](./data/public/architecture.png)

This system uses a specialized multi-agent architecture powered by Azure AI:

### Agent Definitions

- **DATA_COLLECTION_AGENT**: Gathers intelligence from multiple data sources (hospitals, social media, environmental sensors, pharmacies)
- **ANOMALY_DETECTION_AGENT**: Identifies unusual patterns and statistical anomalies using machine learning
- **PREDICTION_AGENT**: Forecasts disease spread using PandemicLLM-inspired models and epidemiological data
- **ALERT_AGENT**: Generates targeted alerts for health officials and the public
- **REPORTING_AGENT**: Creates comprehensive outbreak assessment reports with actionable recommendations

### Semantic Kernel Multi-Agent Flow

The system uses intelligent agent orchestration to provide comprehensive disease surveillance:

#### 1. General Queries

**Example**: `"What's the current disease surveillance status?"`
**Flow**: User Query → ASSISTANT_AGENT → End Conversation

#### 2. Anomaly Detection Queries

**Example**: `"Are there any unusual health patterns?"`
**Flow**: User Query → DATA_COLLECTION_AGENT → ANOMALY_DETECTION_AGENT → REPORTING_AGENT → End

#### 3. Outbreak Prediction Queries

**Example**: `"Predict disease spread for the next 3 weeks"`
**Flow**: User Query → DATA_COLLECTION_AGENT → ANOMALY_DETECTION_AGENT → PREDICTION_AGENT → REPORTING_AGENT → End

#### 4. Comprehensive Surveillance

**Example**: `"Full outbreak risk assessment"`
**Flow**: User Query → DATA_COLLECTION_AGENT → ANOMALY_DETECTION_AGENT → PREDICTION_AGENT → ALERT_AGENT → REPORTING_AGENT → End

## Key Features

### 🔍 Multi-Source Intelligence Gathering

- Real-time monitoring of healthcare facilities
- Social media sentiment analysis for health concerns
- Environmental and weather data correlation
- Pharmacy prescription trend analysis
- School and workplace absence tracking

### 🤖 Advanced ML Anomaly Detection

- Statistical pattern recognition across multiple data sources
- Machine learning models for early outbreak signals
- Integration with PandemicLLM's prediction capabilities
- Continuous baseline learning for normal patterns

### 📊 Predictive Disease Modeling

- Epidemic forecasting using advanced LLM models
- Geographic spread prediction with population density analysis
- Healthcare capacity impact assessment
- Resource allocation optimization

### ⚠️ Intelligent Alert System

- Risk-based alert prioritization
- Targeted communications for different audiences
- Real-time notification delivery
- Actionable public health recommendations

### 📈 Interactive Dashboards

- Real-time disease surveillance maps
- Anomaly trend visualization
- Predictive model outputs
- Alert history and tracking

### 🔬 Transparent AI Reasoning

- Complete visibility into detection logic
- Source citation and data provenance
- Audit trail for all predictions
- Explainable AI decisions

## Backend Technologies

- **Azure AI Agent Service** - Multi-agent orchestration framework
- **Azure OpenAI Service** - LLM for natural language understanding and report generation
- **Semantic Kernel** - Agent orchestration and plugin management
- **PandemicLLM Integration** - Disease outbreak prediction models
- **Azure Bing Search** - Real-time news and information grounding
- **Azure Blob Storage** - Report and data storage
- **Azure SQL Database** - Surveillance data, alerts, and predictions
- **FastAPI** - High-performance REST API
- **Streamlit** - Developer dashboard for testing and monitoring
- **PyTorch** - ML model inference
- **Pandas & NumPy** - Data processing and analysis

## Frontend Technologies

- **React** - UI component framework
- **Next.js** - Full-stack React framework with SSR
- **Tailwind CSS** - Utility-first styling
- **Plotly** - Interactive data visualizations
- **React Simple Maps** - Geographic visualizations

## Business Impact

This system addresses critical public health challenges by:

- **Early Detection** - Identify outbreaks days or weeks before traditional reporting
- **Predictive Intelligence** - Forecast disease spread to enable proactive response
- **Resource Optimization** - Deploy medical resources efficiently based on predictions
- **Public Safety** - Provide early warnings to communities at risk
- **Healthcare Capacity** - Prevent system overload through advance planning
- **Data-Driven Policy** - Support evidence-based public health decisions

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Azure AI Projects account with model deployment
- Azure SQL Database
- Azure Storage account
- Bing Search API key

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/disease-surveillance-ai.git
cd disease-surveillance-ai

# Backend setup
cd backend
python -m venv .venv
.venv\Scripts\activate  # On Windows
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install
```

### Environment Setup

Create `backend/.env` file:

```env
AZURE_AI_AGENT_PROJECT_CONNECTION_STRING=your_connection_string
AZURE_AI_AGENT_MODEL_DEPLOYMENT_NAME=your_model_deployment
DB_CONNECTION_STRING=your_db_connection_string
AZURE_STORAGE_CONNECTION_STRING=your_storage_connection_string
BING_SEARCH_API_KEY=your_bing_api_key
```

Create `frontend/.env` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Running the Application

```bash
# Start backend API
cd backend
python api/api_server.py

# Start frontend (in another terminal)
cd frontend
npm run dev
```

Access the application at `http://localhost:3000`

### Developer Mode

```bash
# Run Streamlit developer dashboard
cd backend
streamlit run streamlit_app.py
```

## Project Structure

```
disease-surveillance-ai-agents/
├── backend/
│   ├── .env.example               # Environment variables template
│   ├── agents/                    # Agent definitions and strategies
│   │   ├── agent_definitions.py   # Specialized agent instructions
│   │   ├── agent_manager.py       # Agent creation and management
│   │   ├── agent_strategies.py    # Selection and termination logic
│   │   └── langgraph_orchestrator.py # LangGraph agent orchestration
│   ├── api/                       # API components
│   │   ├── app.py                 # FastAPI application setup
│   │   ├── endpoints.py           # API route definitions
│   │   └── api_server.py          # API server
│   ├── config/                    # Configuration
│   │   └── settings.py            # Environment settings
│   ├── managers/                  # System managers
│   │   └── surveillance_manager.py # Disease surveillance orchestration
│   ├── models/                    # ML models
│   │   └── anomaly_detector.py    # Anomaly detection models
│   ├── plugins/                   # Semantic Kernel plugins
│   │   ├── data_collection_plugin.py
│   │   ├── anomaly_detection_plugin.py
│   │   ├── prediction_plugin.py
│   │   ├── alert_plugin.py
│   │   ├── reporting_plugin.py
│   │   └── logging_plugin.py
│   ├── utils/                     # Utility functions
│   │   ├── database_utils.py
│   │   ├── data_processing.py
│   │   ├── load_data_to_supabase.py
│   │   ├── load_pandemic_data.py
│   │   ├── query_helpers.py
│   │   ├── simple_data_loader.py
│   │   ├── supabase_data_loader.py
│   │   └── transform_pandemic_data.py
│   ├── sql/                       # Database schemas and scripts
│   │   ├── create_stored_procedures_postgresql.sql
│   │   ├── create_surveillance_tables_postgresql.sql
│   │   ├── insert_mock_data.sql
│   │   ├── insert_pandemic_llm_data.sql
│   │   └── sample_data.sql
│   ├── main.py                    # Main application entry point
│   ├── streamlit_app.py           # Streamlit developer dashboard
│   └── requirements.txt           # Python dependencies
├── data/                          # Data and documentation assets
│   ├── public/                    # Public assets
│   │   └── architecture.png       # System architecture diagram
│   ├── src/                       # Data processing notebooks
│   │   ├── generate_prompt.ipynb
│   │   ├── generate_target.ipynb
│   │   ├── genomic_data_preprocess.ipynb
│   │   ├── genomic_prompt.ipynb
│   │   ├── raw_data.zip           # Raw dataset archive
│   │   ├── raw_data_preprocessing.ipynb
│   │   └── trend_descrption_with_ChatGPT.ipynb
│   └── readme.md                  # Data documentation
├── frontend/
│   ├── app/                       # Next.js app directory
│   │   ├── dashboard/             # Main surveillance dashboard
│   │   ├── chat/                  # Chat interface
│   │   ├── alerts/                # Alert management
│   │   ├── anomalies/             # Anomaly detection views
│   │   ├── predictions/           # Prediction visualizations
│   │   ├── reports/               # Report management
│   │   ├── thinking-logs/         # Agent thinking logs
│   │   ├── api/                   # API routes
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Home page
│   │   └── globals.css            # Global styles
│   ├── components/                # React components
│   │   ├── ui/                    # UI components
│   │   ├── site-header.tsx        # Site header component
│   │   └── theme-provider.tsx    # Theme provider component
│   ├── lib/                       # Utility libraries
│   ├── next.config.ts             # Next.js configuration
│   ├── tailwind.config.js         # Tailwind CSS configuration
│   ├── postcss.config.mjs         # PostCSS configuration
│   ├── components.json            # shadcn/ui component configuration
│   ├── tsconfig.json              # TypeScript configuration
│   ├── package.json               # Node dependencies
│   └── bun.lock                   # Bun package lock file
├── .git/                          # Git repository
├── .gitignore                     # Git ignore rules
├── README.md                      # Project documentation
└── SETUP.txt                      # Setup instructions
```