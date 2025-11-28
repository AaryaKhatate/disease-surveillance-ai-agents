"""
Disease Surveillance AI Agent System - Streamlit Developer Dashboard
Real-time monitoring and testing interface for developers
"""

import streamlit as st
import requests
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import json

# Page configuration
st.set_page_config(
    page_title="Disease Surveillance AI - Developer Dashboard",
    page_icon="🏥",
    layout="wide",
    initial_sidebar_state="expanded"
)

# API Base URL
API_BASE_URL = "http://localhost:8000/api"

# Sidebar
st.sidebar.title("🏥 Surveillance AI Dashboard")
st.sidebar.markdown("---")

# Navigation
page = st.sidebar.radio(
    "Navigation",
    ["Overview", "Chat Interface", "Anomalies", "Predictions", "Alerts", "Thinking Logs", "Data Sources"]
)

st.sidebar.markdown("---")
st.sidebar.info(
    "**Developer Dashboard**\n\n"
    "Monitor and test the Disease Surveillance AI Agent System.\n\n"
    "API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)"
)


# Helper functions
def get_api_data(endpoint: str, params: dict = None):
    """Fetch data from API endpoint"""
    try:
        response = requests.get(f"{API_BASE_URL}/{endpoint}", params=params, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        st.error(f"API Error: {str(e)}")
        return None


def post_api_data(endpoint: str, data: dict):
    """Post data to API endpoint"""
    try:
        response = requests.post(f"{API_BASE_URL}/{endpoint}", json=data, timeout=60)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        st.error(f"API Error: {str(e)}")
        return None


# ==================== OVERVIEW PAGE ====================
if page == "Overview":
    st.title("📊 System Overview")
    st.markdown("Real-time surveillance system status and metrics")
    
    # Refresh button
    if st.button("🔄 Refresh Data"):
        st.rerun()
    
    # Get surveillance status
    status_data = get_api_data("surveillance/status")
    
    if status_data:
        # Key Metrics
        st.markdown("### 📈 Key Metrics (Last 24 Hours)")
        
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric(
                "Active Sessions",
                status_data.get("active_sessions", 0),
                delta=None
            )
        
        with col2:
            anomalies = status_data.get("total_anomalies", 0)
            st.metric(
                "Anomalies Detected",
                anomalies,
                delta=f"+{anomalies}" if anomalies > 0 else None,
                delta_color="inverse"
            )
        
        with col3:
            alerts = status_data.get("active_alerts", 0)
            st.metric(
                "Active Alerts",
                alerts,
                delta=f"+{alerts}" if alerts > 0 else None,
                delta_color="inverse"
            )
        
        with col4:
            predictions = status_data.get("recent_predictions", 0)
            st.metric(
                "Predictions Generated",
                predictions,
                delta=None
            )
        
        st.markdown("---")
        
        # Data Sources Status
        st.markdown("### 🔌 Data Sources Status")
        
        sources = status_data.get("data_sources", {})
        col1, col2, col3, col4 = st.columns(4)
        
        for idx, (source, status) in enumerate(sources.items()):
            col = [col1, col2, col3, col4][idx]
            with col:
                status_emoji = "🟢" if status == "connected" else "🔴"
                st.markdown(f"{status_emoji} **{source.replace('_', ' ').title()}**")
                st.caption(status)
        
        st.markdown("---")
        
        # Recent Activity
        st.markdown("### 📋 Recent Activity")
        
        # Get recent anomalies
        anomalies_data = get_api_data("anomalies", {"days": 1})
        if anomalies_data and anomalies_data.get("anomalies"):
            st.markdown("#### Recent Anomalies")
            anomalies_df = pd.DataFrame(anomalies_data["anomalies"][:5])
            st.dataframe(
                anomalies_df[["timestamp", "region", "anomaly_type", "severity", "confidence"]],
                use_container_width=True,
                hide_index=True
            )
        
        # Get recent alerts
        alerts_data = get_api_data("alerts")
        if alerts_data and alerts_data.get("alerts"):
            st.markdown("#### Active Alerts")
            alerts_df = pd.DataFrame(alerts_data["alerts"][:5])
            st.dataframe(
                alerts_df[["alert_type", "severity", "region", "disease_name", "message"]],
                use_container_width=True,
                hide_index=True
            )


# ==================== CHAT INTERFACE PAGE ====================
elif page == "Chat Interface":
    st.title("💬 Chat Interface")
    st.markdown("Test the AI agent system with natural language queries")
    
    # Session state for chat history
    if "messages" not in st.session_state:
        st.session_state.messages = []
    if "session_id" not in st.session_state:
        st.session_state.session_id = None
    
    # Display chat history
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
            if "agents" in message:
                st.caption(f"Agents: {', '.join(message['agents'])}")
    
    # Chat input
    if prompt := st.chat_input("Ask about disease surveillance..."):
        # Add user message
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # Get AI response
        with st.chat_message("assistant"):
            with st.spinner("Agents are analyzing..."):
                response_data = post_api_data(
                    "chat",
                    {
                        "session_id": st.session_state.session_id,
                        "message": prompt,
                        "user_id": "dashboard_user"
                    }
                )
                
                if response_data:
                    st.session_state.session_id = response_data.get("session_id")
                    response_text = response_data.get("response", "No response received")
                    agents_involved = response_data.get("agents_involved", [])
                    
                    st.markdown(response_text)
                    st.caption(f"Agents: {', '.join(agents_involved)}")
                    
                    # Add to history
                    st.session_state.messages.append({
                        "role": "assistant",
                        "content": response_text,
                        "agents": agents_involved
                    })
    
    # Clear chat button
    st.sidebar.markdown("---")
    if st.sidebar.button("🗑️ Clear Chat History"):
        st.session_state.messages = []
        st.session_state.session_id = None
        st.rerun()
    
    # Show session ID
    if st.session_state.session_id:
        st.sidebar.info(f"Session ID: `{st.session_state.session_id}`")


# ==================== ANOMALIES PAGE ====================
elif page == "Anomalies":
    st.title("🔍 Anomaly Detection")
    st.markdown("View detected anomalies across all surveillance data sources")
    
    # Filters
    col1, col2, col3 = st.columns(3)
    with col1:
        region_filter = st.selectbox("Region", ["All", "Mumbai", "Delhi", "Bangalore"])
    with col2:
        severity_filter = st.selectbox("Severity", ["All", "critical", "high", "medium", "low"])
    with col3:
        days_filter = st.slider("Days to look back", 1, 30, 7)
    
    # Get anomalies data
    params = {"days": days_filter}
    if region_filter != "All":
        params["region"] = region_filter
    if severity_filter != "All":
        params["severity"] = severity_filter
    
    anomalies_data = get_api_data("anomalies", params)
    
    if anomalies_data and anomalies_data.get("anomalies"):
        anomalies = anomalies_data["anomalies"]
        st.success(f"Found {len(anomalies)} anomalies")
        
        # Severity distribution
        df = pd.DataFrame(anomalies)
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("### Severity Distribution")
            severity_counts = df["severity"].value_counts()
            fig = px.pie(
                values=severity_counts.values,
                names=severity_counts.index,
                title="Anomalies by Severity",
                color_discrete_sequence=px.colors.sequential.RdBu
            )
            st.plotly_chart(fig, use_container_width=True)
        
        with col2:
            st.markdown("### Data Source Distribution")
            source_counts = df["data_source"].value_counts()
            fig = px.bar(
                x=source_counts.index,
                y=source_counts.values,
                title="Anomalies by Data Source",
                labels={"x": "Data Source", "y": "Count"}
            )
            st.plotly_chart(fig, use_container_width=True)
        
        # Timeline
        st.markdown("### Anomaly Timeline")
        df["timestamp"] = pd.to_datetime(df["timestamp"])
        fig = px.scatter(
            df,
            x="timestamp",
            y="deviation_percent",
            color="severity",
            size="confidence",
            hover_data=["region", "anomaly_type", "data_source"],
            title="Anomaly Detection Timeline"
        )
        st.plotly_chart(fig, use_container_width=True)
        
        # Detailed table
        st.markdown("### Detailed Anomalies")
        st.dataframe(df, use_container_width=True, hide_index=True)
    else:
        st.info("No anomalies found with current filters")


# ==================== PREDICTIONS PAGE ====================
elif page == "Predictions":
    st.title("📈 Outbreak Predictions")
    st.markdown("AI-generated disease outbreak forecasts and risk assessments")
    
    # Filters
    col1, col2, col3 = st.columns(3)
    with col1:
        disease_filter = st.selectbox("Disease", ["All", "Influenza A", "Dengue Fever", "Seasonal Flu"])
    with col2:
        region_filter = st.selectbox("Region", ["All", "Mumbai", "Delhi", "Bangalore"])
    with col3:
        days_filter = st.slider("Days to look back", 1, 90, 30)
    
    # Get predictions data
    params = {"days": days_filter}
    if disease_filter != "All":
        params["disease"] = disease_filter
    if region_filter != "All":
        params["region"] = region_filter
    
    predictions_data = get_api_data("predictions", params)
    
    if predictions_data and predictions_data.get("predictions"):
        predictions = predictions_data["predictions"]
        st.success(f"Found {len(predictions)} predictions")
        
        df = pd.DataFrame(predictions)
        
        # Risk level distribution
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("### Risk Level Distribution")
            risk_counts = df["risk_level"].value_counts()
            fig = px.pie(
                values=risk_counts.values,
                names=risk_counts.index,
                title="Predictions by Risk Level",
                color_discrete_map={
                    "critical": "red",
                    "high": "orange",
                    "medium": "yellow",
                    "low": "green"
                }
            )
            st.plotly_chart(fig, use_container_width=True)
        
        with col2:
            st.markdown("### Predicted Cases by Disease")
            disease_cases = df.groupby("disease_name")["predicted_cases"].sum()
            fig = px.bar(
                x=disease_cases.index,
                y=disease_cases.values,
                title="Total Predicted Cases",
                labels={"x": "Disease", "y": "Predicted Cases"}
            )
            st.plotly_chart(fig, use_container_width=True)
        
        # Detailed predictions
        st.markdown("### Prediction Details")
        st.dataframe(df, use_container_width=True, hide_index=True)
    else:
        st.info("No predictions found with current filters")


# ==================== ALERTS PAGE ====================
elif page == "Alerts":
    st.title("🚨 Surveillance Alerts")
    st.markdown("Active alerts for health officials and healthcare providers")
    
    # Filters
    col1, col2, col3 = st.columns(3)
    with col1:
        region_filter = st.selectbox("Region", ["All", "Mumbai", "Delhi", "Bangalore"])
    with col2:
        severity_filter = st.selectbox("Severity", ["All", "critical", "high", "medium", "low"])
    with col3:
        status_filter = st.selectbox("Status", ["active", "resolved", "archived"])
    
    # Get alerts data
    params = {"status": status_filter}
    if region_filter != "All":
        params["region"] = region_filter
    if severity_filter != "All":
        params["severity"] = severity_filter
    
    alerts_data = get_api_data("alerts", params)
    
    if alerts_data and alerts_data.get("alerts"):
        alerts = alerts_data["alerts"]
        st.success(f"Found {len(alerts)} alerts")
        
        # Display alerts as cards
        for alert in alerts:
            severity = alert["severity"]
            color = {
                "critical": "🔴",
                "high": "🟠",
                "medium": "🟡",
                "low": "🟢"
            }.get(severity, "⚪")
            
            with st.expander(f"{color} {alert['disease_name']} - {alert['region']} ({severity.upper()})"):
                st.markdown(f"**Type:** {alert['alert_type']}")
                st.markdown(f"**Audience:** {alert['audience']}")
                st.markdown(f"**Status:** {alert['status']}")
                st.markdown(f"**Created:** {alert['created_date']}")
                st.markdown("---")
                st.markdown(f"**Message:**\n\n{alert['message']}")
    else:
        st.info("No alerts found with current filters")


# ==================== THINKING LOGS PAGE ====================
elif page == "Thinking Logs":
    st.title("🧠 Agent Thinking Logs")
    st.markdown("Transparent view of agent reasoning and decision-making")
    
    # Session ID input
    session_id = st.text_input("Enter Session ID", placeholder="SESSION-20250101-001")
    
    if session_id and st.button("Load Thinking Logs"):
        logs_data = get_api_data(f"thinking-logs/{session_id}")
        
        if logs_data and logs_data.get("thinking_logs"):
            logs = logs_data["thinking_logs"]
            st.success(f"Found {len(logs)} thinking log entries")
            
            # Display logs as timeline
            for log in logs:
                agent_emoji = {
                    "DATA_COLLECTION_AGENT": "📊",
                    "ANOMALY_DETECTION_AGENT": "🔍",
                    "PREDICTION_AGENT": "📈",
                    "ALERT_AGENT": "🚨",
                    "REPORTING_AGENT": "📄",
                    "SURVEILLANCE_ASSISTANT": "🤖"
                }.get(log["agent_name"], "🤖")
                
                with st.expander(f"{agent_emoji} {log['agent_name']} - {log['thinking_stage']}"):
                    st.markdown(f"**Timestamp:** {log['created_date']}")
                    st.markdown(f"**Status:** {log['status']}")
                    if log.get("user_query"):
                        st.markdown(f"**User Query:** {log['user_query']}")
                    st.markdown("---")
                    st.markdown(f"**Thought:**\n\n{log['thought_content']}")
                    if log.get("thinking_stage_output"):
                        st.markdown(f"**Output:**\n\n{log['thinking_stage_output']}")
        else:
            st.warning("No thinking logs found for this session ID")
    
    st.markdown("---")
    st.info(
        "💡 **Tip:** Get a session ID from the Chat Interface page after sending a message, "
        "or from the surveillance_reports table in the database."
    )


# ==================== DATA SOURCES PAGE ====================
elif page == "Data Sources":
    st.title("🔌 Data Sources Status")
    st.markdown("Monitor connectivity and data flow from all surveillance sources")
    
    # Refresh button
    if st.button("🔄 Refresh Status"):
        st.rerun()
    
    # Get data sources status
    sources_data = get_api_data("data-sources")
    
    if sources_data:
        sources = sources_data.get("data_sources", {})
        
        for source_name, source_info in sources.items():
            status = source_info["status"]
            status_emoji = "🟢" if status == "connected" else "🔴"
            
            with st.expander(f"{status_emoji} {source_name.replace('_', ' ').title()} - {status}"):
                col1, col2 = st.columns(2)
                
                with col1:
                    st.metric("Records (24h)", source_info["records_24h"])
                
                with col2:
                    last_update = source_info.get("last_update")
                    if last_update:
                        st.markdown(f"**Last Update:**")
                        st.code(last_update)
                    else:
                        st.warning("No recent updates")
        
        st.markdown("---")
        st.info(f"Overall Status: {sources_data.get('overall_status', 'Unknown')}")


# Footer
st.sidebar.markdown("---")
st.sidebar.caption(f"Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
st.sidebar.caption("Disease Surveillance AI Agent System v1.0.0")
