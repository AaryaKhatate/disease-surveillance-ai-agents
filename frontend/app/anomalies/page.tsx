'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Anomaly {
  anomaly_id: string;
  timestamp: string;
  region: string;
  anomaly_type: string;
  severity: string;
  confidence: number;
  data_source: string;
  baseline_value: number;
  current_value: number;
  deviation_percent: number;
  detection_method: string;
}

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnomalies();
  }, []);

  const fetchAnomalies = async () => {
    try {
      const response = await fetch('/api/anomalies?days=7');
      const data = await response.json();
      setAnomalies(data.anomalies || []);
    } catch (error) {
      console.error('Error fetching anomalies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Search className="h-8 w-8 text-primary" />
          Anomaly Detection
        </h1>
        <p className="text-muted-foreground">
          Multi-source health data anomalies and pattern analysis
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p>Loading anomalies...</p>
        ) : anomalies.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">No anomalies detected</p>
            </CardContent>
          </Card>
        ) : (
          anomalies.map((anomaly, index) => (
            <Card key={`${anomaly.anomaly_id}-${index}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{anomaly.anomaly_type}</CardTitle>
                  <Badge variant={anomaly.severity === 'high' || anomaly.severity === 'critical' ? 'destructive' : 'secondary'}>
                    {anomaly.severity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Region</p>
                  <p className="font-medium">{anomaly.region}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Data Source</p>
                  <p className="font-medium">{anomaly.data_source}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Deviation</p>
                  <p className="font-medium text-destructive">
                    +{typeof anomaly.deviation_percent === 'number' 
                      ? anomaly.deviation_percent.toFixed(1) 
                      : parseFloat(anomaly.deviation_percent as any)?.toFixed(1) || '0.0'}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Confidence</p>
                  <p className="font-medium">
                    {typeof anomaly.confidence === 'number' 
                      ? (anomaly.confidence * 100).toFixed(0) 
                      : (parseFloat(anomaly.confidence as any) * 100)?.toFixed(0) || '0'}%
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
