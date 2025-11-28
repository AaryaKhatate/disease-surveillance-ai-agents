"""Data processing utilities for disease surveillance."""

import pandas as pd
import numpy as np
from typing import Dict, List, Tuple, Optional
from datetime import datetime, timedelta
import json


def aggregate_hospital_data(df: pd.DataFrame) -> Dict:
    """Aggregate hospital surveillance data.
    
    Args:
        df: Hospital data DataFrame
        
    Returns:
        Aggregated statistics
    """
    if df.empty:
        return {
            'total_visits': 0,
            'symptom_distribution': {},
            'visit_trend': [],
            'avg_daily_visits': 0
        }
    
    return {
        'total_visits': len(df),
        'symptom_distribution': df['primary_symptom'].value_counts().to_dict() if 'primary_symptom' in df.columns else {},
        'visit_trend': df.groupby(df['timestamp'].dt.date).size().to_dict() if 'timestamp' in df.columns else {},
        'avg_daily_visits': len(df) / max(1, df['timestamp'].nunique()) if 'timestamp' in df.columns else 0,
        'age_distribution': df['age_group'].value_counts().to_dict() if 'age_group' in df.columns else {},
        'severity_distribution': df['severity'].value_counts().to_dict() if 'severity' in df.columns else {}
    }


def analyze_social_media_sentiment(df: pd.DataFrame) -> Dict:
    """Analyze social media data for health mentions.
    
    Args:
        df: Social media data DataFrame
        
    Returns:
        Sentiment analysis results
    """
    if df.empty:
        return {
            'total_mentions': 0,
            'symptom_keywords': {},
            'sentiment_score': 0.0,
            'trending_symptoms': []
        }
    
    return {
        'total_mentions': len(df),
        'symptom_keywords': df['symptom_keyword'].value_counts().head(10).to_dict() if 'symptom_keyword' in df.columns else {},
        'sentiment_score': df['sentiment_score'].mean() if 'sentiment_score' in df.columns else 0.0,
        'trending_symptoms': df['symptom_keyword'].value_counts().head(5).index.tolist() if 'symptom_keyword' in df.columns else [],
        'geographic_distribution': df['location'].value_counts().to_dict() if 'location' in df.columns else {}
    }


def process_environmental_data(df: pd.DataFrame) -> Dict:
    """Process environmental monitoring data.
    
    Args:
        df: Environmental data DataFrame
        
    Returns:
        Environmental statistics
    """
    if df.empty:
        return {
            'air_quality_index': 0.0,
            'water_quality_index': 0.0,
            'temperature_avg': 0.0,
            'humidity_avg': 0.0
        }
    
    return {
        'air_quality_index': df['air_quality_index'].mean() if 'air_quality_index' in df.columns else 0.0,
        'water_quality_index': df['water_quality_index'].mean() if 'water_quality_index' in df.columns else 0.0,
        'temperature_avg': df['temperature'].mean() if 'temperature' in df.columns else 0.0,
        'humidity_avg': df['humidity'].mean() if 'humidity' in df.columns else 0.0,
        'pollution_alerts': len(df[df['air_quality_index'] > 150]) if 'air_quality_index' in df.columns else 0
    }


def analyze_pharmacy_trends(df: pd.DataFrame) -> Dict:
    """Analyze pharmacy prescription trends.
    
    Args:
        df: Pharmacy data DataFrame
        
    Returns:
        Pharmacy trend analysis
    """
    if df.empty:
        return {
            'total_prescriptions': 0,
            'top_medications': {},
            'otc_sales_trend': {},
            'prescription_growth': 0.0
        }
    
    return {
        'total_prescriptions': len(df),
        'top_medications': df['medication'].value_counts().head(10).to_dict() if 'medication' in df.columns else {},
        'medication_category_distribution': df['category'].value_counts().to_dict() if 'category' in df.columns else {},
        'otc_sales_trend': df[df['prescription_required'] == False].groupby(df['timestamp'].dt.date).size().to_dict() if 'prescription_required' in df.columns and 'timestamp' in df.columns else {},
        'prescription_growth': calculate_growth_rate(df) if not df.empty else 0.0
    }


def calculate_growth_rate(df: pd.DataFrame, window_days: int = 7) -> float:
    """Calculate growth rate of data points.
    
    Args:
        df: DataFrame with timestamp column
        window_days: Window size for comparison
        
    Returns:
        Growth rate as percentage
    """
    if df.empty or 'timestamp' not in df.columns:
        return 0.0
    
    try:
        df = df.sort_values('timestamp')
        recent_data = df[df['timestamp'] >= datetime.now() - timedelta(days=window_days)]
        previous_data = df[(df['timestamp'] >= datetime.now() - timedelta(days=window_days*2)) & 
                          (df['timestamp'] < datetime.now() - timedelta(days=window_days))]
        
        recent_count = len(recent_data)
        previous_count = len(previous_data)
        
        if previous_count == 0:
            return 0.0
        
        return ((recent_count - previous_count) / previous_count) * 100
    except Exception as e:
        print(f"Error calculating growth rate: {e}")
        return 0.0


def calculate_baseline_statistics(data: Dict[str, pd.DataFrame], 
                                  lookback_weeks: int = 4) -> Dict:
    """Calculate baseline statistics for anomaly detection.
    
    Args:
        data: Dictionary of DataFrames by source type
        lookback_weeks: Number of weeks for baseline calculation
        
    Returns:
        Baseline statistics
    """
    baseline = {}
    
    for source_type, df in data.items():
        if df.empty:
            baseline[source_type] = {
                'mean': 0.0,
                'std': 0.0,
                'median': 0.0,
                'percentile_95': 0.0
            }
            continue
        
        # Calculate daily counts
        if 'timestamp' in df.columns:
            daily_counts = df.groupby(df['timestamp'].dt.date).size()
            
            baseline[source_type] = {
                'mean': daily_counts.mean(),
                'std': daily_counts.std(),
                'median': daily_counts.median(),
                'percentile_95': daily_counts.quantile(0.95),
                'percentile_5': daily_counts.quantile(0.05)
            }
        else:
            baseline[source_type] = {
                'mean': 0.0,
                'std': 0.0,
                'median': 0.0,
                'percentile_95': 0.0
            }
    
    return baseline


def normalize_data_for_ml(data: Dict[str, pd.DataFrame]) -> np.ndarray:
    """Normalize surveillance data for ML model input.
    
    Args:
        data: Dictionary of DataFrames by source type
        
    Returns:
        Normalized feature matrix
    """
    features = []
    
    for source_type in ['hospital', 'social_media', 'environmental', 'pharmacy']:
        df = data.get(source_type, pd.DataFrame())
        
        if df.empty:
            features.extend([0.0] * 10)  # Placeholder features
            continue
        
        # Extract time-series features
        if 'timestamp' in df.columns:
            daily_counts = df.groupby(df['timestamp'].dt.date).size()
            
            # Calculate features
            features.extend([
                daily_counts.mean(),
                daily_counts.std(),
                daily_counts.max(),
                daily_counts.min(),
                daily_counts.median(),
                len(daily_counts),
                daily_counts.iloc[-1] if len(daily_counts) > 0 else 0,  # Most recent
                daily_counts.iloc[-7:].mean() if len(daily_counts) >= 7 else 0,  # Week average
                daily_counts.pct_change().mean() if len(daily_counts) > 1 else 0,  # Growth rate
                calculate_growth_rate(df)
            ])
        else:
            features.extend([0.0] * 10)
    
    return np.array(features).reshape(1, -1)


def format_for_llm_input(data: Dict[str, pd.DataFrame], 
                        anomalies: List[Dict] = None) -> str:
    """Format surveillance data for LLM input.
    
    Args:
        data: Dictionary of DataFrames by source type
        anomalies: Optional list of detected anomalies
        
    Returns:
        Formatted text for LLM
    """
    sections = []
    
    # Hospital data summary
    if 'hospital' in data and not data['hospital'].empty:
        hospital_stats = aggregate_hospital_data(data['hospital'])
        sections.append(f"""
**Hospital Surveillance Data:**
- Total visits: {hospital_stats['total_visits']}
- Average daily visits: {hospital_stats['avg_daily_visits']:.1f}
- Top symptoms: {', '.join(list(hospital_stats['symptom_distribution'].keys())[:5])}
""")
    
    # Social media data summary
    if 'social_media' in data and not data['social_media'].empty:
        social_stats = analyze_social_media_sentiment(data['social_media'])
        sections.append(f"""
**Social Media Surveillance:**
- Health-related mentions: {social_stats['total_mentions']}
- Trending symptoms: {', '.join(social_stats['trending_symptoms'])}
- Average sentiment: {social_stats['sentiment_score']:.2f}
""")
    
    # Environmental data summary
    if 'environmental' in data and not data['environmental'].empty:
        env_stats = process_environmental_data(data['environmental'])
        sections.append(f"""
**Environmental Monitoring:**
- Air Quality Index: {env_stats['air_quality_index']:.1f}
- Average Temperature: {env_stats['temperature_avg']:.1f}°C
- Average Humidity: {env_stats['humidity_avg']:.1f}%
""")
    
    # Pharmacy data summary
    if 'pharmacy' in data and not data['pharmacy'].empty:
        pharmacy_stats = analyze_pharmacy_trends(data['pharmacy'])
        sections.append(f"""
**Pharmacy Surveillance:**
- Total prescriptions: {pharmacy_stats['total_prescriptions']}
- Growth rate: {pharmacy_stats['prescription_growth']:.1f}%
- Top medications: {', '.join(list(pharmacy_stats['top_medications'].keys())[:5])}
""")
    
    # Anomalies summary
    if anomalies:
        sections.append(f"""
**Detected Anomalies:**
{len(anomalies)} anomalies detected across data sources
""")
    
    return '\n'.join(sections)
