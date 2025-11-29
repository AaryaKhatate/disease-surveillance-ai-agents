"""
Fixed database query helper for endpoints
"""
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

def fetch_results_as_dicts(cursor) -> List[Dict[str, Any]]:
    """
    Fetch all results from cursor and convert to list of dictionaries
    Handles datetime conversion and proper row mapping
    """
    if not cursor.description:
        return []
    
    # Get column names
    columns = [desc[0] for desc in cursor.description]
    
    # Fetch all rows
    rows = cursor.fetchall()
    
    results = []
    for row in rows:
        row_dict = {}
        for i, col in enumerate(columns):
            value = row[i]
            # Convert datetime objects to ISO format strings
            if hasattr(value, 'isoformat'):
                value = value.isoformat()
            row_dict[col] = value
        results.append(row_dict)
    
    return results
