"""Database utility functions for disease surveillance."""

import pyodbc
import pandas as pd
from typing import Optional, Dict, List, Any
from config.settings import settings


class DatabaseConnection:
    """Manages database connections for disease surveillance data."""
    
    def __init__(self, connection_string: Optional[str] = None):
        """Initialize database connection.
        
        Args:
            connection_string: Database connection string. Uses settings if not provided.
        """
        self.connection_string = connection_string or settings.DB_CONNECTION_STRING
        self.connection = None
    
    def connect(self):
        """Establish database connection."""
        try:
            self.connection = pyodbc.connect(self.connection_string)
            return self.connection
        except Exception as e:
            print(f"Error connecting to database: {e}")
            raise
    
    def disconnect(self):
        """Close database connection."""
        if self.connection:
            self.connection.close()
            self.connection = None
    
    def execute_query(self, query: str, params: tuple = None) -> pd.DataFrame:
        """Execute a SELECT query and return results as DataFrame.
        
        Args:
            query: SQL query to execute
            params: Query parameters
            
        Returns:
            DataFrame with query results
        """
        try:
            if not self.connection:
                self.connect()
            
            if params:
                df = pd.read_sql(query, self.connection, params=params)
            else:
                df = pd.read_sql(query, self.connection)
            
            return df
        except Exception as e:
            print(f"Error executing query: {e}")
            raise
    
    def execute_non_query(self, query: str, params: tuple = None) -> int:
        """Execute an INSERT, UPDATE, or DELETE query.
        
        Args:
            query: SQL query to execute
            params: Query parameters
            
        Returns:
            Number of rows affected
        """
        try:
            if not self.connection:
                self.connect()
            
            cursor = self.connection.cursor()
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            
            self.connection.commit()
            return cursor.rowcount
        except Exception as e:
            print(f"Error executing non-query: {e}")
            if self.connection:
                self.connection.rollback()
            raise
    
    def execute_stored_procedure(self, proc_name: str, params: tuple = None) -> pd.DataFrame:
        """Execute a stored procedure and return results.
        
        Args:
            proc_name: Name of stored procedure
            params: Procedure parameters
            
        Returns:
            DataFrame with procedure results
        """
        try:
            if not self.connection:
                self.connect()
            
            cursor = self.connection.cursor()
            if params:
                cursor.execute(f"EXEC {proc_name} {','.join(['?' for _ in params])}", params)
            else:
                cursor.execute(f"EXEC {proc_name}")
            
            # Fetch results if available
            try:
                columns = [column[0] for column in cursor.description]
                rows = cursor.fetchall()
                df = pd.DataFrame.from_records(rows, columns=columns)
                return df
            except:
                # No results to fetch
                return pd.DataFrame()
        except Exception as e:
            print(f"Error executing stored procedure: {e}")
            raise
    
    def __enter__(self):
        """Context manager entry."""
        self.connect()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.disconnect()


def get_surveillance_data(region: Optional[str] = None, 
                         days: int = 7) -> Dict[str, pd.DataFrame]:
    """Retrieve surveillance data from database.
    
    Args:
        region: Optional region filter
        days: Number of days of historical data to retrieve
        
    Returns:
        Dictionary of DataFrames with surveillance data by source type
    """
    with DatabaseConnection() as db:
        # Build WHERE clause
        where_clause = f"WHERE timestamp >= DATEADD(day, -{days}, GETDATE())"
        if region:
            where_clause += f" AND region = '{region}'"
        
        # Get hospital data
        hospital_query = f"""
            SELECT * FROM hospital_surveillance_data
            {where_clause}
            ORDER BY timestamp DESC
        """
        
        # Get social media data
        social_query = f"""
            SELECT * FROM social_media_surveillance_data
            {where_clause}
            ORDER BY timestamp DESC
        """
        
        # Get environmental data
        env_query = f"""
            SELECT * FROM environmental_surveillance_data
            {where_clause}
            ORDER BY timestamp DESC
        """
        
        # Get pharmacy data
        pharmacy_query = f"""
            SELECT * FROM pharmacy_surveillance_data
            {where_clause}
            ORDER BY timestamp DESC
        """
        
        return {
            'hospital': db.execute_query(hospital_query),
            'social_media': db.execute_query(social_query),
            'environmental': db.execute_query(env_query),
            'pharmacy': db.execute_query(pharmacy_query)
        }


def save_anomaly_detection(anomalies: List[Dict[str, Any]]) -> int:
    """Save detected anomalies to database.
    
    Args:
        anomalies: List of anomaly dictionaries
        
    Returns:
        Number of rows inserted
    """
    with DatabaseConnection() as db:
        insert_query = """
            INSERT INTO anomaly_detections 
            (timestamp, location, anomaly_type, severity, confidence, data_source, metrics)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """
        
        rows_affected = 0
        for anomaly in anomalies:
            params = (
                anomaly.get('timestamp'),
                anomaly.get('location'),
                anomaly.get('type'),
                anomaly.get('severity'),
                anomaly.get('confidence'),
                anomaly.get('data_source'),
                str(anomaly.get('metrics', {}))
            )
            rows_affected += db.execute_non_query(insert_query, params)
        
        return rows_affected


def save_prediction(prediction: Dict[str, Any]) -> int:
    """Save outbreak prediction to database.
    
    Args:
        prediction: Prediction dictionary
        
    Returns:
        Number of rows inserted
    """
    with DatabaseConnection() as db:
        insert_query = """
            INSERT INTO outbreak_predictions
            (timestamp, location, outbreak_likelihood, predicted_cases, 
             prediction_horizon_weeks, confidence_interval, model_version)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """
        
        params = (
            prediction.get('timestamp'),
            prediction.get('location'),
            prediction.get('outbreak_likelihood'),
            prediction.get('predicted_cases'),
            prediction.get('horizon_weeks'),
            str(prediction.get('confidence_interval', {})),
            prediction.get('model_version', '1.0')
        )
        
        return db.execute_non_query(insert_query, params)


def save_alert(alert: Dict[str, Any]) -> int:
    """Save alert to database.
    
    Args:
        alert: Alert dictionary
        
    Returns:
        Number of rows inserted
    """
    with DatabaseConnection() as db:
        insert_query = """
            INSERT INTO surveillance_alerts
            (timestamp, alert_id, priority, region, target_audience, 
             message, actions_required, dissemination_channels)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """
        
        params = (
            alert.get('timestamp'),
            alert.get('id'),
            alert.get('priority'),
            alert.get('region'),
            alert.get('audience'),
            alert.get('message'),
            str(alert.get('actions', [])),
            str(alert.get('channels', []))
        )
        
        return db.execute_non_query(insert_query, params)


def get_thinking_logs(session_id: str, conversation_id: Optional[str] = None) -> pd.DataFrame:
    """Retrieve thinking logs for a session.
    
    Args:
        session_id: Session ID
        conversation_id: Optional conversation ID filter
        
    Returns:
        DataFrame with thinking logs
    """
    with DatabaseConnection() as db:
        query = """
            SELECT * FROM agent_thinking_logs
            WHERE session_id = ?
        """
        params = [session_id]
        
        if conversation_id:
            query += " AND conversation_id = ?"
            params.append(conversation_id)
        
        query += " ORDER BY timestamp ASC"
        
        return db.execute_query(query, tuple(params))
