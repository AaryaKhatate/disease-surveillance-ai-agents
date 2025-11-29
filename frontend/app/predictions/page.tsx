'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, MapPin, Users, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Prediction {
  prediction_id: string;
  disease_name: string;
  region: string;
  forecast_weeks: number;
  predicted_cases: number;
  confidence: number;
  risk_level: string;
  model_used: string;
  created_date: string;
}

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const response = await fetch('/api/predictions');
      const data = await response.json();
      setPredictions(data.predictions || []);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-primary" />
          Outbreak Predictions
        </h1>
        <p className="text-muted-foreground">
          AI-powered disease spread forecasting and risk analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading predictions...</p>
        ) : predictions.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">No predictions available</p>
            </CardContent>
          </Card>
        ) : (
          predictions.map((pred, index) => (
            <Card key={`${pred.prediction_id}-${index}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{pred.disease_name}</CardTitle>
                  <Badge variant={getRiskColor(pred.risk_level)}>
                    {pred.risk_level.toUpperCase()}
                  </Badge>
                </div>
                <CardDescription>
                  {pred.forecast_weeks}-week forecast
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-primary">
                    {pred.predicted_cases.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Predicted cases</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{pred.region}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{(pred.confidence * 100).toFixed(0)}% Confidence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(pred.created_date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    Model: {pred.model_used}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
