"""Agent selection and termination strategies for disease surveillance."""

from semantic_kernel.agents import Agent, TerminationStrategy
from typing import Optional
import re


class SurveillanceSelectionStrategy:
    """Strategy for selecting which agent should respond next in disease surveillance conversations."""
    
    def __init__(self):
        """Initialize the selection strategy."""
        self.agent_sequence = []
    
    async def next(self, agents: list[Agent], history: list) -> Optional[Agent]:
        """Determine which agent should respond next.
        
        Args:
            agents: List of available agents
            history: Conversation history
            
        Returns:
            The next agent to respond, or None if no agent should respond
        """
        # Get the last message
        if not history:
            return None
            
        last_message = history[-1]
        message_content = last_message.content if hasattr(last_message, 'content') else str(last_message)
        
        # Extract agent names from the agents list
        agent_map = {agent.name: agent for agent in agents}
        
        # Check if this is a user message (no agent prefix)
        is_user_message = not any(
            message_content.startswith(f"{name} >") 
            for name in agent_map.keys()
        )
        
        if is_user_message:
            # This is a new user query - analyze and route to appropriate agent
            return self._route_initial_query(message_content, agent_map)
        
        # This is an agent response - determine next agent in sequence
        return self._route_agent_response(message_content, agent_map, history)
    
    def _route_initial_query(self, query: str, agent_map: dict) -> Optional[Agent]:
        """Route initial user query to appropriate agent.
        
        Args:
            query: User query text
            agent_map: Map of agent names to agent objects
            
        Returns:
            The agent to handle the query
        """
        query_lower = query.lower()
        
        # Keywords for different types of queries
        anomaly_keywords = ['anomaly', 'anomalies', 'unusual', 'pattern', 'detect', 'abnormal', 'spike']
        prediction_keywords = ['predict', 'forecast', 'spread', 'outbreak', 'projection', 'future', 'weeks']
        alert_keywords = ['alert', 'warning', 'notify', 'notification', 'urgent', 'emergency']
        data_keywords = ['data', 'collect', 'sources', 'monitor', 'track', 'gather']
        report_keywords = ['report', 'summary', 'comprehensive', 'analysis', 'assessment']
        
        # Full surveillance analysis (most comprehensive)
        if any(word in query_lower for word in ['full', 'complete', 'comprehensive', 'all']):
            if any(word in query_lower for word in prediction_keywords + report_keywords):
                # Start with data collection for comprehensive analysis
                self.agent_sequence = [
                    'DATA_COLLECTION_AGENT',
                    'ANOMALY_DETECTION_AGENT',
                    'PREDICTION_AGENT',
                    'ALERT_AGENT',
                    'REPORTING_AGENT'
                ]
                return agent_map.get('DATA_COLLECTION_AGENT')
        
        # Prediction-focused queries
        if any(word in query_lower for word in prediction_keywords):
            self.agent_sequence = [
                'DATA_COLLECTION_AGENT',
                'ANOMALY_DETECTION_AGENT',
                'PREDICTION_AGENT',
                'REPORTING_AGENT'
            ]
            return agent_map.get('DATA_COLLECTION_AGENT')
        
        # Anomaly detection queries
        if any(word in query_lower for word in anomaly_keywords):
            self.agent_sequence = [
                'DATA_COLLECTION_AGENT',
                'ANOMALY_DETECTION_AGENT',
                'REPORTING_AGENT'
            ]
            return agent_map.get('DATA_COLLECTION_AGENT')
        
        # Data collection queries
        if any(word in query_lower for word in data_keywords):
            self.agent_sequence = [
                'DATA_COLLECTION_AGENT',
                'REPORTING_AGENT'
            ]
            return agent_map.get('DATA_COLLECTION_AGENT')
        
        # Alert-specific queries
        if any(word in query_lower for word in alert_keywords):
            self.agent_sequence = [
                'DATA_COLLECTION_AGENT',
                'ANOMALY_DETECTION_AGENT',
                'PREDICTION_AGENT',
                'ALERT_AGENT',
                'REPORTING_AGENT'
            ]
            return agent_map.get('DATA_COLLECTION_AGENT')
        
        # Default to assistant for general queries
        return agent_map.get('ASSISTANT_AGENT')
    
    def _route_agent_response(self, response: str, agent_map: dict, history: list) -> Optional[Agent]:
        """Route to next agent based on current agent's response.
        
        Args:
            response: Current agent's response
            agent_map: Map of agent names to agent objects
            history: Conversation history
            
        Returns:
            The next agent in sequence, or None if sequence is complete
        """
        # Extract the agent name from the response
        current_agent = None
        for name in agent_map.keys():
            if response.startswith(f"{name} >"):
                current_agent = name
                break
        
        if not current_agent or not self.agent_sequence:
            return None
        
        # Find current agent's position in sequence
        try:
            current_index = self.agent_sequence.index(current_agent)
            # Move to next agent in sequence
            if current_index + 1 < len(self.agent_sequence):
                next_agent_name = self.agent_sequence[current_index + 1]
                return agent_map.get(next_agent_name)
        except ValueError:
            # Current agent not in sequence
            pass
        
        return None


class SurveillanceTerminationStrategy(TerminationStrategy):
    """Strategy for determining when the agent conversation should terminate."""
    
    def __init__(self, max_iterations: int = 10):
        """Initialize the termination strategy.
        
        Args:
            max_iterations: Maximum number of agent responses before forcing termination
        """
        self.max_iterations = max_iterations
        self.iteration_count = 0
        self.terminal_agents = ['REPORTING_AGENT', 'ASSISTANT_AGENT']
    
    async def should_terminate(self, agent: Agent, history: list) -> bool:
        """Determine if the conversation should terminate.
        
        Args:
            agent: The agent that just responded
            history: Conversation history
            
        Returns:
            True if conversation should end, False otherwise
        """
        # Increment iteration count
        self.iteration_count += 1
        
        # Terminate if max iterations reached
        if self.iteration_count >= self.max_iterations:
            print(f"Terminating: Max iterations ({self.max_iterations}) reached")
            return True
        
        # Terminate if a terminal agent has responded
        if agent.name in self.terminal_agents:
            print(f"Terminating: Terminal agent {agent.name} has responded")
            return True
        
        # Check if the last message indicates completion
        if history:
            last_message = history[-1]
            message_content = last_message.content if hasattr(last_message, 'content') else str(last_message)
            
            # Look for completion indicators
            completion_indicators = [
                'report generated successfully',
                'analysis complete',
                'assessment complete',
                '📄',  # Report emoji
                'download url',
                'report id'
            ]
            
            if any(indicator in message_content.lower() for indicator in completion_indicators):
                print("Terminating: Completion indicator found in response")
                return True
        
        return False
    
    def reset(self):
        """Reset the iteration count for a new conversation."""
        self.iteration_count = 0
