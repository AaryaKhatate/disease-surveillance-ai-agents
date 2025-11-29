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
        <h1 className="text-3xl font-bold flex items-center gap-2 text-white">
          <TrendingUp className="h-8 w-8 text-green-400" />
          Outbreak Predictions
        </h1>
        <p className="text-gray-400">
          AI-powered disease spread forecasting and risk analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-400">Loading predictions...</p>
        ) : predictions.length === 0 ? (
          <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10">
            <CardContent className="pt-6">
              <p className="text-gray-400 text-center">No predictions available</p>
            </CardContent>
          </Card>
        ) : (
          predictions.map((pred, index) => (
            <Card key={`${pred.prediction_id}-${index}`} className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-200 card-hover">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg text-white">{pred.disease_name}</CardTitle>
                  <Badge className={`${
                    pred.risk_level.toLowerCase() === 'critical' ? 'bg-gradient-to-r from-red-500/20 to-red-600/10 text-red-400 border-red-500/20' :
                    pred.risk_level.toLowerCase() === 'high' ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/10 text-orange-400 border-orange-500/20' :
                    pred.risk_level.toLowerCase() === 'medium' ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 text-yellow-400 border-yellow-500/20' :
                    'bg-gradient-to-r from-green-500/20 to-green-600/10 text-green-400 border-green-500/20'
                  }`}>
                    {pred.risk_level.toUpperCase()}
                  </Badge>
                </div>
                <CardDescription className="text-gray-400">
                  {pred.forecast_weeks}-week forecast
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-green-400">
                    {pred.predicted_cases.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-400">Predicted cases</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>{pred.region}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>{(pred.confidence * 100).toFixed(0)}% Confidence</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(pred.created_date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-400">
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
